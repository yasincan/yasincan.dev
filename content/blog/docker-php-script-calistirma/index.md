---
title: "Docker PHP Script Çalıştırma"
draft: false
date: 2023-02-22
description: "Bu yazıda docker üzerinde php kodlarını ve scriptlerini nasıl çalıştırabiliriz bunu açıklamaya çalışacağım"
categories:
  - Docker
tags:
  - Docker
---

{{< img src="docker-apache-php.png" alt="Php & Docker" caption="Php & Docker" >}}

Bu yazıda docker üzerinde php kodlarını ve scriptlerini nasıl çalıştırabiliriz bunu açıklamaya çalışacağım ilk olarak `C:\` diski üzerinde DockerData isminde bir klasör oluşturuyorum daha sonra bu klasörün içine `www` isminde bir klasör daha oluşturuyorum ve aşağıdaki komutu çalıştırıyorum

```Powershell
docker run -tid -p 8000:80 --name apache_server -v C:\DockerData\www:/var/www/html php:7.4-apache
```

`C:\DockerData\www` klasörü içine `index.php` adında bir php dosyası ekliyorum dosyanın içinde aşağıdaki php kodunu yazıyorum

```php
<?php
phpinfo();
?>
```
apache server 80 portunu bilgisayarımın 8000 portuna eşleştirdim browser üzerinden http://localhost:8000/index.php adresini çağırıyorum php kodu çalışıyor.


{{< img src="php-version.png" alt="php version" caption="Php örnek resim" >}}