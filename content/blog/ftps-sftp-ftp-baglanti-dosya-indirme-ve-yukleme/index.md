---
title: "C# FTPS, SFTP, FTP Bağlantı Dosya İndirme ve Yükleme"
draft: false
date: 2023-02-22
description: "FTP (File Transfer Protocol) tıpkı HTTP protokolü gibi bir protokoldür dosya transferi için kullanılır default olarak 21 portu üzerinden iletişim sağlar"
categories:
  - Csharp
tags:
  - Csharp
  - FTP
---

{{< img src="WinSCP-FTP-FTPS-SFTP-720x340.jpg" alt="WinSCP" caption="WinSCP" >}}

**FTP** (File Transfer Protocol) tıpkı HTTP protokolü gibi bir protokoldür dosya transferi için kullanılır default olarak 21 portu üzerinden iletişim sağlar,

**FTPS** (Secure FTP) açık (explicit) bağlantılarda 21 portunu kullanır üstü kapalı(implicit) bağlantılarda 990 portunu kullanır TLS (Transport Layer Security) veya SSL (Secure Sockets Layer) kullanarak güvenli bir dosya aktarımı sağlar

**SFTP** (Secure File Transfer Protocol) ise güvenli dosya transfer protokolüdür 22 portunu kullanır SSH FTP olarak da görebilirsiniz iletişim sırasında hem verileri hem de komutları şifreler SSH (Secure Shell) protokolünün bir uzantısı olarak ortaya çıkmış bir protokoldür

C# kullanarak FTP üzerinden bağlantı sağlanabilir fakat FTPS ve SFTP kullanmak istediğimizde .NET ve .NET Core içinde böyle bir sınıf yok diye biliyorum. Bu nedenle WinSCP programının paketlerini C# da kullanarak bu protokollerin tümüne bağlanabiliriz WinSCP açık kaynak bir program internet üzerinden indirip ücretsiz bir şekilde kullanabilirsiniz. ben bu örnekte FTP’ ye bağlanacağım

# FTP Bağlantı Örneği

Nuget üzerimdemn **WinSCP** paketini kurup kodu yazmaya başlayabiliriz FTP dosya gönderme ve dosya silmek için iki farklı metot yazdım burada dikkat edilmesi gerekenler kodun çalıştığı dizine \bin\ klasörü altında **WinSCP.exe** programının da bulunması gereklidir.

```csharp
using System;
using WinSCP;

namespace Ftp.Test
{
    public interface IFTPManager
    {
        void FileSendFTP(string fileFullPath, string fileUploadFullPath);
        void FileDelete(string fileFullDeletePath);
    }

    public class FTPManager : IFTPManager
    {
        string ftpHost = "";
        string ftpUser = "";
        string ftpPassword = "";
        bool ftpSSL = false;

        public void FileSendFTP(string fileFullPath, string fileUploadFullPath)
        {
            try
            {
                if (ftpHost != null)
                {
                    var newHostName = ftpHost.Replace("ftp://", string.Empty);
                    SessionOptions sessionOptions = new SessionOptions
                    {
                        Protocol = Protocol.Ftp,
                        HostName = newHostName.Split('/')[0],
                        UserName = ftpUser,
                        Password = ftpPassword,
                    };

                    sessionOptions.AddRawSettings("ProxyPort", "0");

                    if (ftpSSL == true)
                    {
                        sessionOptions.AddRawSettings("MinTlsVersion", "12");
                        sessionOptions.AddRawSettings("MaxTlsVersion", "13");
                    }

                    using (Session session = new Session())
                    {
                        session.Open(sessionOptions);

                        TransferOptions transferOptions = new TransferOptions();
                        transferOptions.TransferMode = TransferMode.Binary;
                        transferOptions.OverwriteMode = OverwriteMode.Overwrite;
                        var realDirectoryName = System.IO.Path.GetDirectoryName(fileUploadFullPath);
                        var transferResult = session.PutFileToDirectory($@"{fileFullPath}", $@"{System.IO.Path.Combine("my-files", realDirectoryName)}", false, transferOptions);
                    }
                }
            }
            catch (Exception e)
            {
                throw e;
            }
        }

        public void FileDelete(string fileFullDeletePath)
        {
            try
            {
                if (ftpHost != null)
                {
                    var newHostName = ftpHost.Replace("ftp://", string.Empty);
                    SessionOptions sessionOptions = new SessionOptions
                    {
                        Protocol = Protocol.Ftp,
                        HostName = newHostName.Split('/')[0],
                        UserName = ftpUser,
                        Password = ftpPassword,
                    };

                    if (ftpSSL == true)
                    {
                        sessionOptions.AddRawSettings("MinTlsVersion", "12");
                        sessionOptions.AddRawSettings("MaxTlsVersion", "13");
                    }
                    using (Session session = new Session())
                    {
                        session.Open(sessionOptions);

                        RemovalOperationResult removalResult = null;
                        removalResult = session.RemoveFiles($@"{System.IO.Path.Combine("my-files", fileFullDeletePath)}");
                        removalResult.Check();

                    }
                }
            }
            catch (Exception e)
            {
                throw e;
            }
        }
    }
}

```

# Ek ve Yardımcı Bilgiler
WinSCP programı ile bağlandığınız herhangi bir connection’ da program üzerinden desteklenen diller için code generate edebiliriz
Session > Generate Session URL/Code diyerek bu işlemi yapabiliriz [burdan](https://winscp.net/eng/docs/ui_generateurl) daha detaylı bilgiye ulaşabilirsiniz