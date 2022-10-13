---
title: ㄟ黑我又開新server囉-容器container tech
tags:
  - 鐵人賽
  - Backend
  - Container
  - VM
  - Docker
  - Podman
date: 2022-10-13 19:33:10
---
## 前言
Container是什麼?

雖然他依舊是一個很大的主題，但我們可以從技術是為了解決什麼問題開始瞭解起，並且介紹一下他的核心概念。
<!-- more -->

## 為什麼出現container

有一張圖(引用自[容器技术的介绍](https://dockertips.readthedocs.io/en/latest/docker-install/docker-intro.html))我蠻喜歡的XD
![](https://dockertips.readthedocs.io/en/latest/_images/why_container_1.png)

透過圖片可以看到像是煉蠱一樣，每個program其實都會有自己需要的依賴，甚至有可能有program需要同時運行不同版本，而他們各自都有對依賴的版本有所要求，那該怎麼辦才好?

於是我們出現了container!!

## 什麼是container?

中文稱作容器，你可以說他是一種打包應用程式的技術，也可以說他是一個虛擬的空間，這些都大致描述container技術的輪廓。

透過一個比喻可能會更容易了解這個部分: container就像是貨輪上的一個個貨櫃。

從這裡可以描述container的一些特性
- 標準化
- 輕量
- 易複製移植

簡單來說，容器話技術就是透過各項資源的隔離，來達成資源的最大化利用。

有些人可能會開始覺得有點熟悉...

## container vs VM
不是有個技術叫做virtual machine也可以多開嗎?

再來一張來自微軟描述Docker的圖~
![圖 20](https://i.imgur.com/gVc8LeE.png)  

從這裡可以看到差異，Container能在共用OS的狀況下，運作多個Process，並使用OS在做process scheduling。

也因為是共用OS，所以他足夠輕量、開啟速度又足夠快。

但這樣我們就能夠說container比vm好嗎?

也不是的，事實上沒有孰好孰壞的問題，因為兩個技術想解決的問題是不太相同的，引用我自己的話XD
> 虛擬機希望解決的問題是在機器層面上隔離，共用的部分是主機的硬體；而container則是在在應用程式層面上隔離，共用的部分是作業系統環境。


## container 三本柱
基本上container的技術由三個重要的概念支持: container、image、registry

他們三個的關係環環相扣
- image: 一個運行容器(也就是process)時所需要的環境。
- container: 容器就是一個正在運行的鏡像，更準確地說，每個容器就是一段在運行中的process。
- registry: 可以下載(pull)images的網站

## docker
之前曾經想過一篇跟docker有關的介紹，[在這裡](https://medium.com/coding-book-club/docker-basic-fb3347b3ec4c)，就不再多寫了XD

因為是讀書會的題目，所以也有完整的系列文，歡迎來看~~

## podman
根據官方文件: 
> What is Podman? Podman is a daemonless container engine for developing, managing, and running OCI Containers on your Linux System. Containers can either be run as root or in rootless mode. Simply put: alias docker=podman. More details here.

他甚至還在介紹裡面直接跟你說你可以直接把podman alias成docker XDD

雖然有點好笑，但大概也可以從中看到他的特色，及與docker的差異，甚至你可以說他認為自己docker的某種改進: 
- 無背景的daemonless:
  docker有個問題在於他是使用daemon來管理全部的process(container)的，如果daemon掛掉了，所有的process也就掰了，不過podman就並非如此

- 非root權限:
  docker的操作都必須用root或是具有相同權限的帳號操作，這會造成安全問題。([話說現在也支援rootless了](https://docs.docker.com/engine/security/rootless/))

- 易從docker移植
  他提供docker相容的指令，用戶可以輕鬆地從docker移植過去

不過也有一些[吐槽](https://www.v2ex.com/t/801421): 包括速度慢、bug多等。

不過因為我沒實際用過就不多說什麼了，不過看起來大家會使用他的原因多半都是rootless而去的。

## 小結
恩...雖然不像，但今天是最後一天的Road Map之旅XD

但其實還有大概好幾天的內容可以寫，等我好好地給他休息好一陣子再來看看要不要接續寫完XD

---

也是最後一次自我推銷部落格了，我覺得文章寫出來還是希望被別人看到的，最好有些幫助，有些批評，這樣可以開心、也可以有所調整!!

所以~~~

**此文章同步發表於[部落格](https://tim80411.github.io/code-blog/)，歡迎來逛逛～**

## 參考資料
[Docker系列讀書會I-初步介紹Docker](https://medium.com/coding-book-club/docker-basic-fb3347b3ec4c)
[容器和 Docker 簡介](https://learn.microsoft.com/zh-tw/dotnet/architecture/microservices/container-docker-introduction/)
[容器技术的介绍](https://dockertips.readthedocs.io/en/latest/docker-install/docker-intro.html)