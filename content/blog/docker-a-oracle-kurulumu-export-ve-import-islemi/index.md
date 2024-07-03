---
title: "Docker’ a Oracle Xe 21c Kurulumu Export ve İmport İşlemi"
draft: false
date: 2023-02-21
description: "Docker’a Oracle kurulumu için ilk olarak aşağıdaki komutu çalıştırıyoruz bu komut docker üzerinde bir oracle express container’ ı inşa edecek"
categories:
  - Docker
tags:
  - Docker
  - Oracle
---

{{< img src="oracle-and-docker.jpg" alt="Docker & Oracle" caption="Docker & Oracle" >}}

Docker’a Oracle kurulumu için ilk olarak aşağıdaki komutu çalıştırıyoruz bu komut docker üzerinde bir oracle express container’ ı inşa edecek

```Powershell
docker run -d-it --name MxOracle -p 1521:1521 -p 5500:5500 container-registry.oracle.com/database/express:21.3.0-xe
```

{{< img src="oracle-start.png" alt="Dokcer run oracle" caption="Powershell örnek resim." >}}

Şimdi yapmamız gereken komut satırı üzerinden Oracle container' a erişerek SYSTEM şifresini değiştirmek.
Komut satırına Docker üzerindeki terminalden erişebilirsiniz

{{< img src="oracle-terminal.png" alt="oracle terminal" caption="Oracle terminal örnek resim" >}}

Ya da Powershell veya Cmd üzerinden işleme devam edip komut satırına erişmek istiyorsanız

```Powershell
docker exec -it TrOracle bash
```

yazıp devam edebilirsiniz.

{{< img src="oracle-bash.png" alt="oracle bash" caption="Oracle bash örnek resim" >}}

  bash' e erişim sağladıktan sonra

```Powershell
./setPassword.sh 1234567
  ```

komutu çalıştırıp şifreyi 1234567 olarak değiştiriyoruz burada 1234567 yerine istediğiniz şifreyi yazabilirsiniz SYSTEM şifresi değişti test etmek içinOracle' ın resmi IDE 'si Sql Developer üzerinden bir connection oluşturuyorum test butonuna bastıktan sonra sol köşede success mesajını görüyorum oraclekurulum işlemini bu şekilde tamamladık.

{{< img src="oracle-connect.png" alt="oracle sql developer" caption="Oracle Sql Developer örnek resim" >}}

# Docker Oracle Container Export ve İmport İşlemi

## Export

Exprot işleminde oracle container içindeki DB, View, Store Procedure vs. tüm datalar export edecektir <containerid> docker ps yazarak öğrenebilirsiniz

```Powershell
docker export --output="tr-oracle.tar" <containerid>
  ```

komut çalıştığı path 'de çıktı olarak tr-oracle.tar dosyasını oluşturacak.

## İmport

İmport işlemi için tr-oracle.tar dosyasını bulunduğu dizine cd komutu ile gidiyoruz ilk olarak image 'ı docker 'a import ediyoruz.

```Powershell
docker import tr-oracle.tar tr-oracle-image
  ```

İmage' ı docker a import ettikten sonra docker üzerinde bu image kullanarak bir container oluşturuyoruz.

```Powershell
docker run -it -d --name MxOracle -p 1521:1521 mx-oracle-image02 /bin/bash -c './etc/init.d/oracle-xe-21c start | tail -f /dev/null'
  ```

Burada bir açıklama yapmada fayda var container' ı başlatıldığında, `./etc/init.d/oracle-xe-21c start` komutu Oracle veritabanını otomatik olarak başlatır daha sonra `tail -f /dev/null` komutu container' ını sonsuz döngüde çalışır hale getirir, böylece container çalışmaya devam eder.

Oracle import işlemi tamamlandı sql developer üzerinden test edilebilir