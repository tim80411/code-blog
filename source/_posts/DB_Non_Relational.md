---
title: db大觀園(下)-非關聯式資料庫overview及分散式設計
tags:
  - 鐵人賽
  - Backend
  - DBMS
  - NoSQL
date: 2022-09-30 18:51:35
---
## 前言
談到NoSQL時常有兩種說法，一種說不是SQL，一種說不僅僅是SQL，但總之，這一類的資料庫相對於SQL，不再採用昨天所說的關係表。

關聯式資料庫最大的特色是可以減少冗餘，除了減少儲存成本，在資料更新上也會佔到優勢。
不過在儲存成本大幅降低的時候開始，開始出現了已管理而非最少資料為導向的NoSQL DB。

除此之外，資料與資料間具有關係的關聯式資料庫在分散式系統設計上的困難也讓NoSQL冒出頭來。

雖然我所在的工作使用的是mongoDB，但今天也會稍稍看一下其他不同種類的DB，拓展一點視野，那就開始吧~
<!-- more -->
## 類型
以資料型態來區分，可以分為四種類型
- Document database
- Key-value database
- Wide-column store
- Graph databases

### Document database
資料被存在類似JSON結構的檔案中，被稱為document，每個document包含成對的值。
舉例像是: mongoDB
特色: 資料結構彈性高，且可對應開發時的資料結構。

### Key-value database
如名字所示，資料被表示成key及對應的value，因為通常只能用key去搜尋value，所以查詢上相對簡單，適合儲存大量、不需複雜查詢的資料，常用於cache。
舉例像是: redis及DynanoDB
特色: 查詢速度快且簡單

### Wide-column store
資料被儲存在column family中，每個column family會儲存常被一起搜尋的資料，例如若有一個Person類別，年資跟薪水或許是被認定常被一起搜尋的內容，就會被放在一起。
由上可知，被儲存的資料是根據我們預先會查詢他們的方式被儲存起來的。
舉例像是: Cassandra、HBase
特色: 特定查詢效能高

### Graph databases
將資料以圖的方式儲存，每個資料實例都是一個節點。
而節點之間有一個具有方向性、可命名的連結，稱為關係。
這樣的資料庫常用來處理具有多層關係的數據資料，例如推薦引擎、地圖等。
舉例像是: Neo4j
特色: 以數據之間的關係作為重心，適用情境相對少。

## CAP

### 初步認識
什麼是CAP呢?

> 在理論計算機科學中，CAP定理（CAP theorem），又被稱作布魯爾定理（Brewer's theorem），它指出對於一個分布式計算系統來說，不可能同時滿足以下三點: Consistency一致性、Availability可用性、Partition tolerance分隔容忍
> -- [維基百科](https://zh.m.wikipedia.org/zh-tw/CAP%E5%AE%9A%E7%90%86)

根據這個理論，一個資料庫在做分散式系統時，不可能同時滿足三者，你也可以稱它為魚與熊掌不可兼得理論XD
也因此產生下圖說明這件事情

![圖 4](https://i.imgur.com/dYbstCB.png)  

稍微解釋一下三者
- Consistency一致性
> all nodes see the same data at the same time

如果把多個資料中的各個單台稱為節點好了，一致性指的是每個節點都拿的到最新的資料。

- Availability 可用性
> a guarantee that every request receives a response about whether it was successful or failed

意思是指所有對資料庫的請求都能得到回應，也就是服務持續可用

- Partition Tolerance分區容錯性
> the system continues to operate despite arbitrary message loss or failure of part of the system

分散式系統的部分因為機器或是網路問題無法運作時，其餘系統仍能提供完整的服務

### CAP與NoSQL
在查到許多資料的時候，常把CAP與NoSQL一起談，但我一直很困惑為什麼一個談分散式資料庫的理論和NoSQL有什麼很強的關聯嗎?
後來想想，這大概跟NoSQL的一個特性有關-資料間的關聯性弱或沒有，在這樣的狀況下，當資料規模變很大的時候，我可以直接增加機器去接受請求，這樣的方式稱做水平擴展。
事實上，SQL本身也是可以討論CAP，正如上圖所言，他會落在CA這區，犧牲了分區容錯性。

但因為剛剛提到的平行擴展，也就是增加多台DB必定無法容忍分區容錯性的問題，也代表SQL相對難以水平擴展。
而NoSQL通常都適宜水平擴展，也就是符合CP、或是AP的狀況。

這兩個狀況其實就代表使用情境的選擇，畢竟，適合的才是最好的~
- AP
重視可用性，也代表犧牲了強一致性，意思是指，雖然每次請求資料庫都會有結果，但資料拿到手有可能不是最新的。

- CP
重視強一致性，也代表犧牲了可用性，剛好和上方顛倒。

## 小結
透過了解NoSQL的出現，對於整個開發的發展也可以看到，在各場景適用各自適合的方法的論述變得越來越明顯。
而且蠻有趣的，這些概念也都會對於未來需要判斷如何決策帶來重要的影響，雖然淺淺的，但也算是開頭了吧~~

明天會來看一下關聯式資料庫的一個重要特性-ACID及和此相關的Transactions。

此文章同步發表於[部落格](https://tim80411.github.io/code-blog/)，歡迎來逛逛～

## 參考資料
[[淺談]-NoSQL資料庫怎麼選？](https://ithelp.ithome.com.tw/articles/10256528)
[學了那麼多 NoSQL 資料庫 NoSQL 究竟是啥](https://ithelp.ithome.com.tw/articles/10256528)
[初步認識分散式資料庫與 NoSQL CAP 理論](https://oldmo860617.medium.com/%E5%88%9D%E6%AD%A5%E8%AA%8D%E8%AD%98%E5%88%86%E6%95%A3%E5%BC%8F%E8%B3%87%E6%96%99%E5%BA%AB%E8%88%87-nosql-cap-%E7%90%86%E8%AB%96-a02d377938d1)
[Brewer's CAP Theorem](https://www.julianbrowne.com/article/brewers-cap-theorem)
[學習分佈式不得不會的CAP理論](https://www.twblogs.net/a/5b8c64a82b7177188332865e)