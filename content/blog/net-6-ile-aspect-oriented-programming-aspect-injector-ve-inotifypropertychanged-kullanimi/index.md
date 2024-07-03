---
title: "Sonarqube Kurulumu ve SonarScanner.MSBuild.exe"
draft: false
date: 2023-09-14
description: "Aspect Injector açık kaynak bir compile-time AOP framework içinde bir çok özellik bulunuyor. Bu yazıda Aspect Injector kullanarak bir sınıfın(class) içindeki property’ lere bir set işlemi olduğunda bir event"
categories:
  - Csharp
tags:
  - Csharp
---

{{< img src="AspectInjector.png" alt="AspectInjector" caption="AspectInjector resim" >}}

[Aspect Injector](https://github.com/pamidur/aspect-injector) açık kaynak bir compile-time AOP framework içinde bir çok özellik bulunuyor. Bu yazıda Aspect Injector kullanarak bir sınıfın(class) içindeki property’ lere bir set işlemi olduğunda bir event oluşturacağım ve yapmak istediklerimi orada yapacağım burada bir örnek üzerinden ilerleyeceğiz ihiyaca göre değiştirilebilir oldukça faydalı bir attribute olacak bir çok farklı sorunu çözebilir.

Bu Attribute ile kullanarak hangi sorunu çözdüm
**Entity Framework DB First** yaklaşımındaki .edmx entity’ lerine bir navigation property ataması olduğunda foreign key property otomatik olarak doluyordu yani örnek vermek gerekirse aşağıdaki gibi bir kullanımda user.Company’ ye bir company set ettiğimizde user.CompanyRef alanı doluyor.

Fakat **Entity Framework Core Code First** yaklaşımında user.CompanyRef alanı dolmuyor default olarak 0 atanıyor bu sorunu context.Attach(user) gibi ChangeTracker’ a ekleyerek de çözülebilir fakat farklı ihtiyaçlardan dolayı bu yolu tercih etmedim.

```csharp
var user = new YcUser();
user.Company = company;
int ycCompanyId = user.CompanyRef;
```

Bu sebepten aşağıdaki gibi attribute kullanarak bu sorunu çözdüm navigation property’ ye set işlemi olduğunda foreign property artık otomatik doluyor.

```csharp
public class YcUser: IBaseEntity
{
   public string Name { get; set; }
   
   public int CompanyRef { get; set; }
   
   [ForeignKeyAspectAttribute]
   public virtual Company Company { get; set; } = null!;
}
```

ForeignKeyAspectAttribute

```csharp
using System.ComponentModel;
using System.Reflection;
using AspectInjector.Broker;

namespace Attribute;

[AttributeUsage(AttributeTargets.Property | AttributeTargets.Class)]
[Injection(typeof(NotifyAspect))]
public class ForeignKeyAspectAttribute : Attribute
{
}

//[AttributeUsage(AttributeTargets.Property)]
//[Injection(typeof(NotifyAspect))]
//public class NotifyAlsoAttribute : Attribute
//{
//    public NotifyAlsoAttribute(params string[] notifyAlso) => NotifyAlso = notifyAlso;
//    public string[] NotifyAlso { get; }
//}


[Mixin(typeof(INotifyPropertyChanged))]
[Aspect(Scope.Global)]
public class NotifyAspect : INotifyPropertyChanged
{
    public event PropertyChangedEventHandler PropertyChanged = (s, e) => { };

    [Advice(Kind.After, Targets = Target.Public | Target.Setter)]
    public void AfterSetter(
        [Argument(Source.Instance)] object source,
        [Argument(Source.Name)] string propName,
        [Argument(Source.Triggers)] Attribute[] triggers
        )
    {
        if (triggers.OfType<ForeignKeyAspectAttribute>().Any())
        {
            PropertyInfo entityNavigationProp = source.GetType().GetProperty(propName);
            if (entityNavigationProp != null)
            {
                object navigationProp = entityNavigationProp.GetValue(source, null);
                if (navigationProp != null)
                {
                    PropertyInfo id = navigationProp.GetType().GetProperty("Id");
                    if (id != null)
                    {
                        int idValue = (int)id.GetValue(navigationProp);
                        if (id != default)
                        {
                            string refrancePropName = $"{propName}Ref";
                            if (source.GetType().GetProperty(refrancePropName) != null)
                                source.GetType().GetProperty(refrancePropName).SetValue(source, idValue, null);
                            else
                                throw new MissingMemberException($"{source.GetType().FullName} entity içinde {refrancePropName} property bulunamadı");
                        }
                    }
                }
            }
            PropertyChanged(source, new PropertyChangedEventArgs(propName));
        }

        //foreach (var attr in triggers.OfType<NotifyAlsoAttribute>())
        //    foreach (var additional in attr.NotifyAlso ?? new string[] { })
        //        PropertyChanged(source, new PropertyChangedEventArgs(additional));
    }
}
```