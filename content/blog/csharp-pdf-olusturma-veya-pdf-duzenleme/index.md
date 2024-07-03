---
title: "C# PDF Oluşturma veya PDF Düzenleme"
draft: false
date: 2023-02-28
description: "C# PDF oluşturma oldukça karmaşık bir iş olabiliyor bunu yapmanın bir kaç yöntemi var genelde basit PDF dosyalarını oluşturmak için HTML bir"
categories:
  - Csharp
tags:
  - Csharp
---

C# PDF oluşturma oldukça karmaşık bir iş olabiliyor bunu yapmanın bir kaç yöntemi var genelde basit PDF dosyalarını oluşturmak için HTML bir template oluşturup gerekli alanları değiştirip bunu PDF çevirerek kullanırlar ya da PDF’ i kodlarla çizerek bu işi yaparlar bugün bu yöntemin dışında hazır bir PDF dosyasında nasıl gerekli alanları doldurup yeni bir PDF oluşturabiliriz bu anlamaya çalışacağım.

Bu iş için **Adobe Acrobat Pro** programında ihtiyacınız var farklı programlarda kullanılabilir diye tahmin ediyorum eğer yeni bir PDF çizmek istiyorsanız yada mevcut bir PDF üzerinden gitmek isteyebilirsiniz ikisini de yapmak mümkün PDF dosyamızı program üzerinde açıyoruz daha sonra menüden Prepare Form‘ u seçiyoruz

{{< img src="prepare-form.png" alt="prepare form" caption="Acrobat Pro örnek resim 1" >}}

Şimdi yapmamız gereken gerekli alanlara filde’ları eklemek, field ları düzgün isimlendirmek önemli kod tarafında bu isimleri kullanacağız.

{{< img src="pdf-add-field.png" alt="pdf add field" caption="Acrobat Pro örnek resim 2" >}}

Projeye ilk olarak iTextSharp paketini kurmanız gerekli ben burada örnek bir api metot’ u yazdım eğer model valid ise PDF browser’ a download ediliyor.
**Ek Bilgi:** Eğer pdf deki field isimlerini bilmiyorsanız iTextSharp ile pdf okuyup fields üzerinde foreach ile dönüp field isimlerini de görebilirsiniz.

```csharp
using iTextSharp.text.pdf;
using Microsoft.AspNetCore.Mvc;

namespace Project1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PdfController : ControllerBase
    {
        private readonly IWebHostEnvironment _webHostEnvironment;
        
        public PdfController(IWebHostEnvironment webHostEnvironment)
        {
            _webHostEnvironment = webHostEnvironment;
        }

        [HttpPost]
        public object CreateForm(Simple model)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                string webRootPath = _webHostEnvironment.WebRootPath;
                string filePath = Path.Combine(webRootPath, "PdfTemplate/Simple.pdf");

                using (var existingFileStream = new FileStream(filePath, FileMode.Open))
                {
                    var pdfReader = new PdfReader(existingFileStream);
                    string font = Path.Combine(webRootPath, "/fonts/arial.ttf");
                    BaseFont baseFont = BaseFont.CreateFont(font, BaseFont.IDENTITY_H, BaseFont.EMBEDDED);
                    using (MemoryStream ms = new MemoryStream())
                    {
                        var stamper = new PdfStamper(pdfReader, ms);

                        var form = stamper.AcroFields;
                        form.AddSubstitutionFont(baseFont);
                        var fieldKeys = form.Fields.Keys;

                        form.SetField("Name", model.CustomerName);
                        form.SetField("Address", model.Address);
                        form.SetField("City", model.City);
                        form.SetField("IBAN", model.IBAN);
                        form.SetField("Contact", model.ck1 == true ? "Yes" : "No");

                        stamper.FormFlattening = true;
                        stamper.Close();
                        stamper.Writer.CloseStream = true;
                        pdfReader.Close();

                        return File(ms.ToArray(), "application/pdf", Path.GetFileName(filePath));
                    }
                }
            }
            catch
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Error");
            }
        }
    }
}
```
