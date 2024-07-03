---
title: "Windows’ a Kali Linux Kurulumu ve WSL"
draft: false
date: 2023-02-27
description: "Microsoft’ un WSL (Windows Subsystem for Linux) oraya çıkarmasıyla birlikte artık Windows işletim sitemi üzerinde Linux kernel da çalıştırabiliyor yani"
categories:
  - WSL
tags:
  - WSL
---
{{< img src="win-kex.png" alt="Kali Linux" caption="WSL Kali Linux" >}}

# WSL
Microsoft’ un WSL (Windows Subsystem for Linux) oraya çıkarmasıyla birlikte artık Windows işletim sitemi üzerinde Linux kernel da çalıştırabiliyor yani Linux programları veya işletim sitemleri artık Windows bir bilgisayar üzerinde de çalıştırılabilir.

# WSL vs Virtual Box – VMware Workstation
Sanal işletim sitemi kurma işini Virtual Box, VMware Workstation gibi programlarla da yapılabilir fakat bu programlar kullanılarak yapılan sanallaştırma işleminde sistem için 4 gb ram ayrıldıysa sitemde sadece ayrılan kadar ram kullanabilirsiniz birde şöyle bir durum var sitem 4 gb ram’ i kullanmasa bile ana bilgisayarda kullanılıyor olarak gösterir WSL’ de ise durum çok daha farklı eğer ana bilgisayarınızda 8 gb ram varsa ve WSL üzerine yeni bir işletim sistemi kurduğunuzda o işletim siteminde de 8 gb ram’ in tümünü görebilir ve kullanabilirsiniz bu durum CPU ve diğer donanılar içinde geçerlidir.

# Windows’a Kali Linux Kurulumu

[Buradaki](https://www.kali.org/docs/wsl/win-kex/) doküman üzerindeki kurulum adımları takip ederek Kali Linux kurulumunu tamamlayabilirsiniz.

Kurulum tamamlandıktan sonra aşağıdaki Top 10 Tool’ u kurmak için komutu kullanabilirsiniz

```Powershell
sudo apt install kali-tools-top10
```

- Burp Suite
- Nmap
- Wireshark
- Metasploit Framework
- aircrack-ng
- Netcat
- John the Ripper
- sqlmap
- Autopsy
- Social Engineering Toolkit