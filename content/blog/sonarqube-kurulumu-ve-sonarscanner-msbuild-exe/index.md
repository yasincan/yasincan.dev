---
title: "Sonarqube Kurulumu ve SonarScanner.MSBuild.exe"
draft: false
date: 2023-06-23
description: "İlk olarak şunu söylemekte fayda var bu yazıda sonarqube community edition kullanacağız community edition versiyon’ da farklı branch’ leri analiz edemiyoruz bunu yapmak için"
categories:
  - Csharp
  - Docker
tags:
  - Csharp
  - Docker
---

{{< img src="sonarcube.png" alt="Sonarcube" caption="Sonarcube resim" >}}

İlk olarak şunu söylemekte fayda var bu yazıda sonarqube community edition kullanacağız community edition versiyon’ da farklı branch’ leri analiz edemiyoruz bunu yapmak için sonarqube developer edition versiyonu kullanmanız gerekir fakat developer edition ücretli bir versiyon şuandaki ücreti yıllık 150$.

Sonarqube community edition kullanarak projelerde de main veya master branch’ i belli aralıklar ile analiz edebilirsiniz bu sizin kod kalitenizi arttıracaktır

# Kurulum
Ben sonarqube docker üzerine kurmayı tercih ettim bunu için bir docker compose dosyası hazırladım sonarqube db olarak postgresql kullanıyor bu neden 2 adet container oluşacak container grubuna uygun bir isim vermek için .env dosyası ekliyorum ve grubunun adını sonarqube olarak ayarlıyorum

{{< img src="sonarcube-compose.png" alt="Sonarcube & Docker" caption="Sonarcube docker-compose resim" >}}

docker-compose.yml dosyasının bulunduğu dizinde powershell üzerinden docker-compose up -d komutu ile compose dosyasını çalıştırabilirsiniz

```yaml
version: '3'

services:
  sonarqube:
    image: sonarqube:lts-community
    container_name: YCsonarqube
    ports:
      - 9000:9000
    environment:
      - SONARQUBE_JDBC_URL=jdbc:postgresql://sonarqube-db:5432/sonar
      - SONARQUBE_JDBC_USERNAME=sonar
      - SONARQUBE_JDBC_PASSWORD=sonar
    volumes:
      - sonarqube_data:/opt/sonarqube/data
      - sonarqube_extensions:/opt/sonarqube/extensions
      - sonarqube_logs:/opt/sonarqube/logs

  sonarqube-db:
    image: postgres
    container_name: YCpostgres
    environment:
      - POSTGRES_USER=sonar
      - POSTGRES_PASSWORD=sonar
      - POSTGRES_DB=sonar
    volumes:
      - sonarqube_db:/var/lib/postgresql/data

volumes:
  sonarqube_data:
  sonarqube_extensions:
  sonarqube_logs:
  sonarqube_db:
```

Sonarqube Analiz
sonarqube erişmek için browser’ a localhost:9000 adresine gidelim sonarqube login ekranı açılıyor de default olarak username: **admin** password: **admin** yazıp giriş yapabilirsiniz ilk girişte şifreyi değiştirmek gerekiyor.

{{< img src="sonarcube-ornek-1.png" alt="Sonarcube örnek resim 1" caption="Sonarcube örnek resim 1" >}}

Create project ile yeni bir proje ekleyelim.

{{< img src="sonarcube-ornek-2.png" alt="Sonarcube örnek resim 2" caption="Sonarcube örnek resim 2" >}}

Burada Jenkins, Azure, Bitbucket gibi farklı seçenekler mevcut fakat ben Locally deyip devam ediyorum ve yeni bir token oluşturuyorum Expires in token son kullanma tarihi siz uygun bir süre seçebilirsiniz oluşan token’ ı kopyalıyorum

{{< img src="sonarcube-ornek-3.png" alt="Sonarcube örnek resim 3" caption="Sonarcube örnek resim 3" >}}

{{< img src="sonarcube-ornek-4.png" alt="Sonarcube örnek resim 4" caption="Sonarcube örnek resim 4" >}}

Şimdide talimatlara uygun şekilde SonarScanner for .NET indirelim SonarScanner uygun bir klasöre taşıdıktan sonra SonarQube.Analysis.xml dosyasındaki **sonar.host.url** ve **sonar.token** alanları uygun şekilde düzenlememiz gerekiyor.

```xml
<SonarQubeAnalysisProperties xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xmlns:xsd="http://www.w3.org/2001/XMLSchema"
  xmlns="http://www.sonarsource.com/msbuild/integration/2015/1">
  <Property Name="sonar.host.url">http://localhost:9000</Property>
  <Property Name="sonar.token">sqp_5dc1def1511cb77e76aea07b6c43e9315ee0c71c</Property>
</SonarQubeAnalysisProperties>
```

Projeyi analiz etmeye başlamadan önce **SonarScanner.MSBuild.exe** ve **MsBuild.exe** windows environment variables eklememiz gerekir bu işlemi yapmak için sırasıyla
**System Properties => Environment Variables => System veriables => PATH** alanına aşağıdaki dizinleri ekliyorum.

C:\Users\<User>\Documents\sonarqube\sonar-scanner-4.8.0.2856\bin
C:\Program Files\Microsoft Visual Studio\2022\Community\MSBuild\Current\Bin

{{< img src="sonarcube-env-win.png" alt="Sonarcube env windows" caption="" >}}

Son olarak projenin bulunduğu dizinde powershell ile aşağıdaki komutları sıra ile çalıştırarak analizi başlatıyoruz

```Powershell
SonarScanner.MSBuild.exe begin /k:"yasincan" /d:sonar.host.url="http://localhost:9000" /d:sonar.login="sqp_5dc1def1511cb77e76aea07b6c43e9315ee0c71c"
MsBuild.exe /t:Rebuild
SonarScanner.MSBuild.exe end /d:sonar.login="sqp_5dc1def1511cb77e76aea07b6c43e9315ee0c71c"
```