---
title: 常見的API架構比較
tags:
  - 鐵人賽
  - Backend
  - API
  - RESTful
  - SOAP
  - gRPC
  - graphQL
date: 2022-10-03 18:41:25
---
## 前言
在網路開發中，最常見的就是以HTTP協定與其他端點溝通，但各自使用不同的內容及結構可能會造成困擾。
比如不同的服務都需要閱讀各自的文件並適應不同的格式，於是為了解決這個問題，出現了諸如SOAP, REST, gRPC, graphQL等用來規範彼此如何規範的技術。

雖然聽起來有點複雜，但大致來說，他們想解決的事情就是:
> 如何訪問 Web 服務

今天會對不同的架構各自有些介紹，那就開始吧～
<!-- more -->

## SOAP
是一種完全依賴XML進行傳輸且經過明確規範的協定，當初建立的目的是包括:
1. 抽象化介面: 讓不同語言都可以透過相同的格式取得資料。
2. 擴展性: 根據不同需求選用類似於Header的結構，像是: WS-ReliableMessaging, WS-Coordination。
3. 多網路協定可用: SMTP...等

正因為他是明確的協定，所以如果不遵守規則就無法使用他，另外，相較於REST，因為解析規則、標準的必要開銷，以及內部包含的大量訊息，所以他普遍被認為成本更高。

![圖 1](https://i.imgur.com/bXUoRAb.png)  
> -- [維基百科](https://zh.wikipedia.org/zh-tw/%E7%AE%80%E5%8D%95%E5%AF%B9%E8%B1%A1%E8%AE%BF%E9%97%AE%E5%8D%8F%E8%AE%AE)

在使用的時候通常會搭配網路服務描述語言(Web Service Description Language, WSDL)，告訴我們如何解析一個SOAP server，而這樣的過程通常可以透過第三方套件來自動處理。
所以使用SOAP的好處就是，因為SOAP是經過明確定義的結構，因此可以自動化處理不論XML的產出或是解析，讓我們使用其他Web Server的元件就像是在使用function一樣。

### 使用時機
- 需要高度結構化、有限制的傳輸
- 狀態性的

## REST
相對於SOAP，REST更像是一種準則或建議，甚至是風格，並不強調完全遵守。
REST的全名為表現層狀態轉換，只要遵守一下規則的就可以稱他為RESTful服務:
- Client-Server
- Stateless: 需假設服務並不知道當前的狀態，
- Cache: 可以將資料做緩存
- Uniform Interface: 統一的資源介面，使責任分離，client並不用知道server如何實作
- Layered System: client端並不知道使用的url是否直接連到server，可以經過層層伺服器。

所以RESTful API就是遵守以上架構風格的API，特別針對統一介面來說明
1. 資源: 使用名詞
2. 動詞: 使用HTTP method
3. 回應: http code

比如:
```
GET https://www.example.com/users
```

在統一介面下，可以清楚的知道這是取得所有users的資料的一條API。

### 使用時機
- 有限的網路速度: 因為資料格式較小, 故傳輸要求較小
- 快速實現: 因為標準、強制規則較少，可以快速編寫程式碼
- 緩存需要: 如果需要緩存，因為統一了介面，所以可以針對固定介面保存資料，減少對於server的請求

## gRPC
### 簡介
RPC指的是remote procedure call，原本在1980左右產生，當時就是為了解決電腦間的溝通，而在現在，由google在這個概念之上發展了gRPC，使用Protocol Buffers來描述資料如何交換，提供了另一種有別於RESTful的溝通方式。

那gRPC是什麼呢？用中文來說就是「遠端程式呼叫系統」
意思就是呼叫API時就像呼叫自己的函式一樣。

### 使用方式
- 編寫.proto定義
- client 直接使用定義好的function

### 特色
- 快且小: 因為資料傳輸被編譯成二進制; 關於人類不可讀這點視情況決定是好是壞。
- 直觀得命名: 因為是直接使用function name，可依據需要像是取用function一樣做取名。
- 跨程式: Protocol Buffer可以根據語言編譯不同檔案。
- 強型別: 型別明確。
- 文件化: proto檔案可以寫註解，可以說定義本身就是文件。

## graphQL
## 簡介
一種讓使用者可以通過定義好的語法取得指定的資料及修改指定的資料。

通常會拿它來和RESTful api做比較，相較於後者:
- 較小的資料傳輸: 因為可以指定資料，就可以讓資料在最小限度下傳輸
- 可重複使用的介面: 因伺服器僅是定義資料schema，不用為了需求的變耕重複修改api

某種程度上你可以說他跟SQL還真的蠻像的XD


## 理念
- 分層Hierarchical: 為了資料的多層結構，graphQL也配合這樣的概念進行分層query。
- 產品中心Product‐centric: 以畫面的需求為主。
- 強型別Strong‐typing
- 客戶客製化搜尋Client‐specified queries: 可以針對client端的需求客製化每次的query並處理。
- 內省(自我查詢的)Introspective: 翻譯內省其實有點怪，不過他的意思大致是說，他自己的型別可以透過graphQL的語法搜尋出來。

## 流程
他大致的流程如下:
1. client端呼叫graphQL query
2. 後端解析query產生AST語法樹語法樹
3. 檢驗是否有語法錯誤
4. 執行query
5. 傳送

## 小結
一次性了解不同的訪問web service的方式確實有點吃力，很多部分都只寫到最淺顯的部分...
剩下的部分就交給未來的自己了，現在至少可以在別人提到這個字的時候點頭然後不會睜眼瞎了XDD

此文章同步發表於[部落格](https://tim80411.github.io/code-blog/)，歡迎來逛逛～

## 參考資料
[REST vs. SOAP](https://www.redhat.com/en/topics/integration/whats-the-difference-between-soap-rest)
[SOAP vs REST. What's the Difference?](https://smartbear.com/blog/soap-vs-rest-whats-the-difference/)
[Why SOAP](https://coherence0815.wordpress.com/2016/02/11/why-soap/)
[表現層狀態轉換](https://zh.wikipedia.org/zh-tw/%E8%A1%A8%E7%8E%B0%E5%B1%82%E7%8A%B6%E6%80%81%E8%BD%AC%E6%8D%A2)
[[gRPC] gRPC Getting Started](https://pjchender.dev/golang/grpc-getting-started/)
[https://ithelp.ithome.com.tw/articles/10200678](https://ithelp.ithome.com.tw/articles/10200678)
[graphQL](http://spec.graphql.org/draft/#sec-Overview)