---
title: 就是快取啦-Cache
tags:
  - 鐵人賽
  - Backend
  - Cache
  - CDN
  - Redis
  - Storage
date: 2022-10-05 20:22:45
---
## 前言
現代Web最影響使用者是否使用服務的其中一項重大因素來自於服務響應使用者互動的速度。

白話的意思就是說點開網站內的內容有多快，就有多影響使用者體驗。

影響服務響應的原因可能很多，但大檔案或是常用的資料不斷重複的在服務之間流通絕對是影響速度的其中一大原因，因此為了解決這樣的服務瓶頸，出現了一個概念: Cache(緩存/快取)。

這也是今天要介紹的部分，那就開始吧~

<!-- more -->

## 定義
將常用的資料儲存在本地memory(較快的元件(註1))中一段時間以取代從較慢元件取得資料的相關技術。

這樣，當其他人需要請求相同的資料時，就不需要額外進行網路傳輸、資料庫提取等動作，可以直接從memory中取得資料，以加快響應速度。

這個概念可以擴及到所有面臨瓶頸的服務身上，因為所有服務都有構成他相對有快、慢差異的元件。

舉例來說我們的電腦就有memory及disk，如果OS在處理服務的過程，有一項技術是將常用的資料也放在memory，而不每次都從disk取得，這其實就是一個Cache的概念。

回到Web溝通的層面，當Client和Server溝通時，常見的像是瀏覽器與提供網頁服務的瀏覽器，相對快、慢的元件可能是本地儲存、遠端服務db，於是將常訪問的網站資料儲存在瀏覽器預先設定的空間，就算是disk內，也可以說這樣是一種Cache。

接下來會列出幾項在Web中常見的不同層次的瓶頸以及相對應實現Cache的技術。
- Browser layer: Browser Storage
- Server layer: Redis
- Client layer: CDN

## Browser layer: Browser Storage

### 快、慢元件
在瀏覽器與提供網頁瀏覽的Server交互時
- 快: 本地的儲存裝置
- 慢: 經過HTTP取得的資料

### 解決方案
大部分的瀏覽器都支援以下的方案: 

- HTTP Cache
瀏覽器每次發送Request前會先檢查Header裡的 `Cache-Control: no-cache, max-age=...` ，若在特定條件下可以不發出任何request。

根據[資料](https://web.dev/http-cache/)，下圖是Cache-Control的決策圖，黃底代表決定使用哪個參數。
![圖 10](https://i.imgur.com/ywXHNlb.png)  

- Data Store
在執行網頁時，藉由瀏覽器的API介面，透過JS去儲存、提取資料，其儲存的位置包含: Cookie、Web Storage、IndexedDB。

未來可能會有Cache的API，目前還在實驗中~

## Server layer: Redis、Memcached

### 快、慢元件
為了取得Client需要的資料，可能有與DB、或是其他服務溝通的必要
- 慢: Server的DB或其他提供服務的Server
- 快: Server的Memory

### 解決方案 
為了方便開發者使用Server的Memory，因此出現了以下兩種解決方案:

- Redis

之前在NoSQL DB介紹過，key-value的DB，可以讓使用者快速的利用Memory，且支援許多data-type，並且提供一種類似快照(Snap Shot)的功能，讓儲存在Redis的資料可以回存其他DB。

另外因為她支援套件，可以讓Redis得以處理類似關聯式的資料，或是JSON類型的資料，因此官方也宣稱他足以作為主DB來使用。

- Memcached

multi-thread & simple string data type，雖然data的種類限制了它的使用，但他的設計一開始就是為了減少DB或是API的壓力，於是若是在特定條件下也是一種方案

## Client layer: CDN
### 快、慢元件
全名是Content delivery network內容傳遞網路，他的情境與Browser layer Cache有點類似，但這裡的CDN是所有的Client都可以享受到好處的，他在意的情境除了網路傳輸的速度，更是提供服務的主機與Client的距離導致的傳輸延遲。
- 慢: 較遠的Source Service Server(提供服務的伺服器)
- 快: 較近的CDN Server

按照這裡提到的，Browser除了可以使用Browser Cache把資料放在本地，也可以在request時使用CDN嘗試獲取比較近的資源。

### 解決方案
本身就是解決方案，他期望做到的是，透過利用最靠近使用者的CDN Server，將從Source Service Server取得的資料，像是音樂、圖片、影片等，在CDN Server保留資料，並較快的提供給使用者。

它的運作模式大部分也是依賴由Source Server提供的response內的 `cache-control` Header去做控制。

除此之外廠商可能會提供API讓Source Server可以在資料被更新時主動更新CDN Server裡面的資料及相關回傳給Client的Header。

![圖 9](https://i.imgur.com/KPcLq4a.png)  


### 額外好處
除了加快資源取得的速度，他也包含幾項好處
- 減少用戶網路流量: 網路流量對使用者來說都是成本，不是全世界都有像台灣一樣吃到飽XD
- 減少Source Server負擔: 因為減少了訪問Server次數及流量
- 提高安全性: 舉例來說如果遭到DDoS攻擊，若CDN供應商有提供相關服務可以阻擋，若沒有，至少有一部份的攻擊會被CDN代替承受...XD


## 小結
最主要了解Cache是基於組成服務的元件的速度不一致，其中一個就會成為瓶頸，因此將常用的資料儲存在較快的元件上可以減少訪問慢速元件的次數提升體驗。

於是我們可以大膽猜測，如果哪天遠端服務響應的素快於本地硬體儲存的速度，這時候的Cache就會反過來儲存在遠端服務上了吧XD

我覺得保留Cache的概念，並知道如何分析瓶頸元件，就足以應付後面的變化，各樣的技術/解決方案無非也是為了解決當前遇到的問題。

此文章同步發表於[部落格](https://tim80411.github.io/code-blog/)，歡迎來逛逛～

## 參考資料
[[Front-end] Browser Cache : 熟悉的陌生人 I](https://hsien-w-wei.medium.com/front-end-browser-cache-%E7%86%9F%E6%82%89%E7%9A%84%E9%99%8C%E7%94%9F%E4%BA%BA-i-5e1f76a4713d)
[[note] HTTP Cache 快取](https://pjchender.dev/webdev/note-http-cache/)
[使用 HTTP 缓存避免不必要的网络请求](https://web.dev/http-cache/)
[Redis in 100 Seconds](https://www.youtube.com/watch?v=G1rOthIU-uo&ab_channel=Fireship)
[Redis vs Memcached 比較](https://medium.com/jerrynotes/redis-vs-memcached-%E6%AF%94%E8%BC%83-15d2ba829da7)
[簡單理解 CDN 原理](https://mgleon08.github.io/blog/2018/10/29/understand-cdn/)
[什麼是 CDN？| CDN 是如何工作的？](https://www.cloudflare.com/en-ca/learning/cdn/what-is-a-cdn/)