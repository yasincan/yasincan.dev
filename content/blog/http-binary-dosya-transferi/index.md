---
title: "C# HTTP Binary Dosya Transferi"
draft: false
date: 2023-02-28
description: "Bu yazımda C# ile HTTP protokolü üzerinden Binary olarak dosya transferi nasıl yapabiliriz basit bir şekilde anlatmaya çalışacağım HTTP protokolü üzerinden büyük dosyaları transfer etmek mümkün ama"
categories:
  - Csharp
tags:
  - Csharp
---

{{< img src="Http-Binary-File.png" alt="Http Binary File" caption="Http binary file resim" >}}

Bu yazımda C# ile HTTP protokolü üzerinden Binary olarak dosya transferi nasıl yapabiliriz basit bir şekilde anlatmaya çalışacağım HTTP protokolü üzerinden büyük dosyaları transfer etmek mümkün ama doğru bir yöntem değil dosya boyutu arttıkça ağ üzerinde ve uygulamalar üzerinde birçok yerde ek izinler vermek zorunda kalabilirsiniz.

Aşağıdaki yazdığım **UploadFile** metodunda iki adet parametre alıyor **file** (dosya) ve **destination** (hedef), destination parametresine gönderilen **path** (klasör yolu) yoksa oluşturuyoruz.

```csharp
using System;
using System.IO;
using System.Web;

namespace HttpFile.Services
{
    public class FileTransferFromHTTP
    {
        public bool UploadFile(byte[] file, string destination)
        {
            try
            {
                string serverRootPath = HttpContext.Current.Server.MapPath("~");
                MemoryStream ms = new MemoryStream(file);
                var destinationDirectory = new DirectoryInfo(Path.GetDirectoryName(Path.Combine(serverRootPath, destination)));
                if (!destinationDirectory.Exists)
                    destinationDirectory.Create();

                string name = Path.GetFileName(destination);
                string fullPath = Path.Combine(serverRootPath, destinationDirectory.FullName);

                FileStream fs = new FileStream($@"{fullPath}\{name}", FileMode.Create);
                ms.WriteTo(fs);
                ms.Close();
                fs.Close();
                fs.Dispose();
                return true;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}
```
# Bonus Bilgiler
Web projenizde bu yazdığımız servisi kullanmak isterseniz request limits kısıtına takıla bilirsiniz o nedenle Web.config dosyanıza aşağıdaki iki alanı ekleyerek dosya limitini 10 MB çıkarta bilirsiniz

maxAllowedContentLength  IIS (Web Server) tarafından işlenen HTTP paketlerinin content uzunluğunu ayarlayabilirsiniz
maxAllowedContentLength alanı **byte** tipindedir default olarak 28.6 MB, Max olarak da 4 GB değer alabilir.

```xml
  <system.webServer>
    <security>
      <requestFiltering>
        <requestLimits maxAllowedContentLength="10485760"/>
      </requestFiltering>
    </security>
  </system.webServer>
```

maxRequestLength alanı kilobyte tipindedir default olarak 4 MB, Max olarak 2 TB değer alabilir.
maxRequestLength ASP.NET tarafında desteklenen maksimum dosya yükleme boyutunu belirler (Çok büyük bir değer girilmesi güvenlik sorunlarına neden olabilir).

```xml
 <system.web>
    <httpRuntime targetFramework="4.6" maxRequestLength="10240"/>
  </system.web>
```