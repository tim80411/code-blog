---
title: 超文本傳輸協定(HTTP)是什麼?
tags:
  - 鐵人賽
  - Backend
  - HTTP
date: 2022-09-17 20:38:27
---
## 前言
前一天提到HTTP作為應用層的協定，定義了訊息內容如何被解讀。

今天會較為詳細的了解這個協定，目前Web，也就是我們使用瀏覽器讀取各式各樣WebSite的集合，就是基於此協定發展出來的。

我們會從簡單的HTTP歷史開始，在逐步說明特性、結構，最後也會談談HTTP/3。

<!-- more -->

## HTTP版本及歷史
版本大部分都向下相容，以下簡介:
- HTTP/0.9: 
只能使用GET

- HTTP/1.0:
此版的特性是提供了HTML擴充性，除了是第一個在通訊中指定版本號的版本，新增response狀態碼、Header的概念。特別是HEADER的概念，讓HTTP可以基於Content-Type這個HEADER的定義傳輸不同類型的文檔。

- HTTP/1.1:
特性是將所有概念標準化，也是時至今日最為常見的版本，他從1999年第二版後就持續使用至今。

- HTTP/2:
特性是效能，在基於網頁的複雜及交互性提高之下，溝通的成本不斷提高，因此有了HTTP/2，其強化效能的特性包括，二進制的協定、並行的情求可在同一個連接中處理、HEADER壓縮。

- HTTP/3:
為了應對HTTTP/2的問題而生，應用基於UDP的QUIC取代TCP，去解決了TCP出現隊頭阻塞（head-of-line blocking），在容易丟失封包網路環境，HTTP/3有更穩定的表現。


## HTTP特性
### Client-Server協定: 
我個人覺得也可以說是request-response協定，意指，兩個的端點在一次連接中，一定有一方是client發出request，而另外一方則作為server，在接收到request後發回response給client。
這邊要特別注意到client跟server角色並不是固定的。

比如A、B兩個端點分別稱為診所(server)及醫院(server):
1. 會話1: 醫院向診所發出request要求取得診所的X光照片，此時醫院是client，診所則為server。
2. 會話2: 診所向醫院發出request要求取得醫院的就醫紀錄，此時診所是client，醫院則為server。

### 無狀態(stateless)
根據資料的定義
> there is no link between two requests being successively carried out on the same connection -- [MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview#http_is_stateless_but_not_sessionless)

白話翻譯是: 在一個連線之中，兩個成功的請求(request)之間是毫無關聯的。

曾經看過一個蠻好的比喻，可以把這件事情想成一間店的老闆(server)永遠認不得你(client)，就算你先後兩次踏入店內，他還是會把你當成不同的客人。

### 可擴展的(extensible)
基於HEADER讓HTTP具有相當地擴展性。
一些常用的HEADER包括: 
- Content-Type: 決定傳輸的資料如何被解析，是不同類型檔案傳輸的基礎
- Authorization: 處理網站身分驗證常用的HEADER
- Cookie: Cookie機制會使用此HEADER


## HTTP結構

### Request
- Start line

包含Method, Target, HTTP version。

方法Method是用來描述當次請求的行為，每個方法具有不同語意但可能具備相同特性。
特性包含安全Safe, 冪等Idempotent, 快取cacheable。
**安全** - 指的是不會修改server的數據的方法，例如GET、HEAD、OPTIONS，所有安全的方法都是冪等Idempotent的，但反過來卻不一定這樣，比如說PUT跟DELETE，這邊就會提到什麼是冪等。
**冪等** - 指的是同樣的請求不管執行一次或是多次結果都相同，以前面提到的DELETE來說好了，不管執行幾次，他指定的資源就是會不存在。
不過需要注意到實務狀況上，因為這比較像是約定的標準，實際上得看server如何實現這些方法，是有可能會出現例外的。
**快取** - 可以被快取的Method，除了特定方法外，也要滿足以下特點，可緩存的狀態碼、Response不具有特定阻止緩存的Headers(Cache-Control)

目標Target用來描述當次請求的目的地，可能是URL、協議或絕對路徑。

版本HTTP version用來表示對於response回傳資料的版本的指示。

可能範例: 
```HTTP
// ex1
OPTIONS * HTTP/1.1
// ex2
POST /restaurants?id=1 HTTP/1.1
// ex3
GET https://www.google.com.tw HTTP/1.1
```

- Headers

請求Request或是Response的Headers都遵循相同結構: case insensitive的字串，加上冒號(:)以及header的值。

大致可分為幾類: General headers、Request headers、Entity headers。

```HTTP
// ex1:
content-type: application/x-javascript; charset=utf-8
// ex2:
cross-origin-resource-policy: cross-origin
// ex3:
Cache-Control: public
```

- Body

不是每個請求都會有Body，比較常見具有Body的請求是POST。


### Response
- Status line

回應的Status通常被HTTP version, status code, status test組成。

```HTTP
// ex1
HTTP/1.1 200 OK
// ex2
HTTP/1.1 404 Not Found
```

- Headers
- Body

## HTTP/3
HTTP/3早在2019年被Google Chrome（Canary build）支援，而他的規範已經在2022年6月6日，被IETF正式標準化HTTP/3為RFC9114。

那究竟這個規範為什麼會出現呢?

前言曾提到HTTP想要解決的問題是封包丟失的網路環境造成的阻塞，這個環境其實就是網路流量轉至手機等無線網路環境。

相對於HTTP/2，使用QUIC作為傳輸協定的HTTP/3有以下幾項好處:
### Connection establishment latency

更快的連接建立: 一次封包往返被稱為1RTT，原TCP+TLS需要1-3次，但QUIC僅在第一次需要1次RTT，但第二次連線開始就可以傳輸資料。

### Improved congestion control

可以為阻塞控制提供相對TCP更多的資訊。

### Multiplexing without head-of-line blocking

TCP也會有Head of Line Blocking (HOL Blocking)問題，此問題簡單的定義是指: 

> 當單個（慢）物件阻止其他/後續的物件前進時

可以想像排隊的時候看到前面的人不會操控行動支付，於是後面的人就都沒辦法結帳了XD

而TCP會發生這個的原因在於他會因為丟失的封包而暫停後續的封包傳輸，需要等到發送端發現並重新傳送，就算我們從應用層知道這個被丟失的封包其實是獨立的，不用等待重新傳送。

於是QUIC做了一件事情相對TCP的是讓傳輸的封包有了獨立的概念，可以被獨自處理。

### Forward error correction

更好的丟失恢復機制，資料被切成多個封包後，會有一段資訊跟著封包一起傳輸，若不幸有封包被丟失，就可以憑藉其餘封包運算出被丟失的包的資料。

### Connection migration

在wifi與4G切換時可以不用重新連線。


### HTTP/3特性
透過以上說明，其實可以很清楚看到HTTP/3關注的部分非常符合現況，傳輸的頻寬不再是瓶頸，而往返時間才是，所以在適當的範圍內增加冗餘資料，去減少重複的傳輸。


## 小結
HTTP的特性: 結構簡單、高擴充性得以開發各種應用方式。包括安全、認證、快取、壓縮、重導向等議題，這些在1.1開發初沒特別約定的部分，都透過了Headers做了約定並實現。

從看見HTTP的歷史你也可以看見網路的產業是怎麼隨著硬體的發展而做出相對應的改變的，就像是限制理論說到的，系統的最短板會不斷改變，並且在解決之後會有新的限制出現在別處。

接著會介紹永遠的client端，也是讓Web可以深入日常生活的重要因素-Browser。

此文章同步發表於[部落格](https://tim80411.github.io/code-blog/)，歡迎來逛逛～

## 參考資料
[What is HTTP?](https://www.cloudflare.com/en-gb/learning/ddos/glossary/hypertext-transfer-protocol-http/)
[MDN-HTTP Headers](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers)
[維基好朋友-HTTP](https://zh.wikipedia.org/zh-tw/%E8%B6%85%E6%96%87%E6%9C%AC%E4%BC%A0%E8%BE%93%E5%8D%8F%E8%AE%AE)
[HTTP/3 傳輸協議 - QUIC 原理簡介](https://medium.com/@chester.yw.chu/http-3-%E5%82%B3%E8%BC%B8%E5%8D%94%E8%AD%B0-quic-%E7%B0%A1%E4%BB%8B-5f8806d6c8cd))
[QUIC at 10,000 feet](https://docs.google.com/document/d/1gY9-YNDNAB1eip-RTPbqphgySwSNSDHLq9D5Bty4FSU/mobilebasic)
[HOL blocking](https://www.gushiciku.cn/pl/gkVS/zh-tw)
[快速讀懂 HTTP/3 協定](https://www.it145.com/9/82134.html)

