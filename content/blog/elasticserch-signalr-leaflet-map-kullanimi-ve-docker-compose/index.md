---
title: "Elasticserch SignalR Leaflet Map Kullanımı ve Docker-Compose"
draft: false
date: 2023-09-15
description: "Satış yapılan ürünleri anlık olarak harita üzerinde gösterecek bir projeyi uzun zamandır yapmak istiyordum fakat uygun bir zaman bulamıyordum sonunda ufak da olsa bir proje yaptım bu yazıda bu projeyi anlatacağım."
categories:
  - Csharp
  - Docker
  - Elasticsearch
tags:
  - Csharp
  - Docker
  - Elasticsearch
---

Satış yapılan ürünleri anlık olarak harita üzerinde gösterecek bir projeyi uzun zamandır yapmak istiyordum fakat uygun bir zaman bulamıyordum sonunda ufak da olsa bir proje yaptım bu yazıda bu projeyi anlatacağım.

[Github](https://github.com/yasincan/Elasticsearch-SignaIR) üzerinden projeyi inceleyebilirsiniz

# Proje Hakkında
Elasticsearch, SignalR kullanarak Leaflet map’ da satış verilerindeki enlem ve boylam bilgilerine göre son 30 veriyi dünya haritası üzerinde göstereceğim burada bir BackgroundService çalışacak anlık olarak random Sale nesneleri üretecek Sale verilerini ilk olarak Elasticsearch oradan SignalR ile websoket üzerinden sayfaya gönderecek projede Elasticsearch tercih etme nedenim satış verileri üzerinde ileride yapılacak diğer hesaplamaları hızlı ve esnek bir şekilde yapabilmek.

Projeyi Visual Studio’ da docker-compose kullanarak çalıştırdım büyük kolaylık sağlıyor elasticsearch, kibana vs.. gibi araçlar tek seferde proje ile birlikte sırasıyla ayağa kalkıyor Visual Studio container’ lar rahat bir şekilde yönetilebiliyor.

{{< img src="map.jpg" alt="Leaflet Map & Elasitsearch" caption="Uygulamanın ekran görüntüsü" >}}