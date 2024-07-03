---
title: "Entity Framework Core Raw SQL Kullanımı"
draft: false
date: 2023-09-27
description: "ORM olarak Entity Framework Core arık birçok projede kullanıyoruz ve karşılaşıyoruz DB de ihtiyacımız olan birçok şeyi entiti’ ler üzerinden halledebiliyoruz fakat"
categories:
  - Csharp
tags:
  - Csharp
---

{{< img src="Entity-Framework-Core.jpg" alt="Entity Framework Core" caption="Entity Framework Core" >}}

ORM olarak Entity Framework Core arık birçok projede kullanıyoruz ve karşılaşıyoruz DB de ihtiyacımız olan birçok şeyi entiti’ ler üzerinden halledebiliyoruz fakat bazı durumlarda halen raw sql çalıştırmamız gerekiyor bu yazıda nasıl raw sql nasıl çalıştırabiliriz bunu açıklayacağım örnekler için kullanacağım DB Northwind olacak github üzerindeki Readme.md dosayasın da sql script adresini ve diğer detayları görebilirsiniz

Projeye [Github](https://github.com/yasincan/Sql.Samples) üzerinden erişebilirsiniz.

Raw SQL çalıştırmamız gereken durumlarda çoğuz zaman yine entity üzerinden bulunan FromSqlRaw metodu kullanılır amam bu yöntem raw sql çalıştırmak istediğimizde bir entity veya view modele ihtiyaç duyabiliyoruz basit örnek vermek gerekirse MyOrder isminde DB de olmayan bir view model oluşturuyorum ve `[Keyless]` attribute kullanarak işaretliyorum bunu anlamı primary key olmayan yani id’ si bulunmayan bir class’ dır demek oluyor

Keyless gördüğünüzde DB’ den veri almak yada hesaplamak için oluşturulmuş bir class olduğunu düşünebilirsiniz.

```csharp
 [Keyless]
 public class MyOrder
 {
     public int OrderID { get; set; }
     public DateTime OrderDate { get; set; }
 }
```
NorthwindDbContext’ de MyOrders DbSet ile ekliyorum

```csharp
public virtual DbSet<MyOrder> MyOrders { get; set; }
```
FromSqlRaw metodu kullanarak MyOrder listesini çekiyorum

```csharp
NorthwindDbContext northwindDbContext = new NorthwindDbContext(); 
List<MyOrder> myOrders = northwindDbContext.MyOrders.FromSqlRaw("SELECT OrderID, OrderDate FROM Orders").ToList(); //OrderID OrderDate alanlarını çekiyorum
```
Bu örnekdeki gibi farklı amaçlar için FromSqlRaw kullanılabilir.

# EF Core Tek Değer Almak İçin Raw SQL Kullanımı
Yukarıda yazdığımın aksine bazı durumlarda ise sadece bir adet değer alamız gerekiyor örneğin Count(), Sum() … gibi fucntion’ lar kullanılarak yapılan hesaplamalar bu durumda ise Entity Framework tarafında kullanacağımız metot ExecuteSqlRaw olacak bu metot içine yazdığımız sql cümlesi db üzerinde çalışır geriye int bir değer döner bu dönen değer bu sql cümlesinden etkilenen satır sayısını verir fakat aşağıdaki göstereceğim yöntem ile “Output SqlParameter” kullanarak DB üzerinden hesapladığımız değerin çıktısını alacağız

```csharp
DateTime startDate = new DateTime(1997, 05, 06);
DateTime endDate = new DateTime(1998, 05, 06);
string sql = @"(SELECT SUM(od.UnitPrice * od.Quantity) 
AS TotalPrice FROM Orders o JOIN [Order Details] od ON o.OrderID = od.OrderID 
WHERE @startDate<= o.OrderDate AND o.OrderDate <= @endDate)";


SqlParameter totalPrice = new("@totalPrice", SqlDbType.Decimal) //Dönüş için SqlParameter
{
    Direction = ParameterDirection.Output
};

object[] currentTotalParamlist = new object[]
{
    new SqlParameter { ParameterName = "@startDate", Value = startDate },
    new SqlParameter { ParameterName = "@endDate", Value = endDate },
    totalPrice
};

northwindDbContext.Database.ExecuteSqlRaw($"SET @totalPrice = {sql}", currentTotalParamlist);
decimal totalResult = (decimal)totalPrice.Value; //Sonuç

Console.WriteLine($"Tarihleri {startDate:dd.MM.yyyy} - {endDate:dd.MM.yyyy} arası siparişlerin toplam fiyatı {totalResult}");
```

Sql de olduğu gibi **SqlParameter** ile **@totalPrice** adında bir değişken oluşturuyorum ve SET ile sorgu sonucunu **@totalPrice** değişkenine atıyorum **(decimal)totalPrice.Value** ile sonuca ulaşabiliyoruz.