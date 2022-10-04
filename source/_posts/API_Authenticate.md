---
title: 先生你誰?-身分驗證Authentication (Oauth, Basic, JWT, token)
tags:
  - 鐵人賽
  - Backend
  - Basic Authentication
  - Token Based Authentication
  - JWT
date: 2022-10-04 19:54:36
---
## 前言
前面不管是在提到HTTP這個應用協定或是REST的風格，都有提到無狀態(stateless)這個特性。

這個特性其中一個目的是希望可以將每次的request都隔離，讓各request不用依賴其他的請求，僅依靠自己單個請求身上所帶的資料完成目的。

但我們回想類似FB, Google，有許多服務的商業模式都是以「會員制」作為基礎，那我們該如何在維持無狀態的特性下，實現這樣的會員制，讓伺服器「認得」請求呢?

今天就會談到這個部分: 「驗證Authenticate」。

<!-- more -->
## 概念
其實不管是哪種驗證過程，最終的目的就是要讓伺服器可以「認得」你是誰。

不過「認得」這個字眼實在太過哲學。

想想，如果有一天你已經7, 80歲，突然有個陌生人說他是你的某某國小同學，你該怎麼認得出來是他呢?

最終我們憑藉認得一個人的方式大概分兩種:
1. 只有當事人跟你才知道的知識: 共同的回憶、秘密。
2. 只有當事人才有的東西: 身分證、長相。

根據不同情境其實這兩個概念可以講出的東西可能有點不太一樣。
比如看電影的時候，門口的人看的是門票，他相信的是，只有當事人才會那個座位的電影票，所謂的認票不認人。

回到程式這邊，不知道腦筋有沒有開始自動分類常見的驗證機制?
1. 共同知識: 帳號、密碼、密碼提示問題...等等。
2. 獨有物品: email、電話號碼、密碼卡、指紋、面部特徵...等等。

這兩個類別可能會重疊，比如，伺服器會記錄你的電話號碼，並且在你請求時發送一次性密碼。

概念大致如此，我們實作上一般可分為兩種驗證策略(註1)。

註1: 大部分的驗證策略其實是一種「約定」，這指的是，我們通過一種有共識的做法減少溝通鎖需要的成本。

## Basic Authentication
這是一個透過Header來進行驗證的策略，你可以想像你每次要進到一間店裡，都得告訴他你的帳號跟密碼才會放行。
![圖 6](https://i.imgur.com/hJGqG3B.png) 

### 概要流程
1. 一個有因應此策略的client訪問一個使用Basic Authentication的server
2. 伺服器會檢查在Header裡的Authorization欄位，規格應為 `Authorization: Basic <value>`
3. 此時因為沒有Authorization並沒有資料，server按照約定會回傳401 status code並在Header上加上 `WWW-Authenticate: Basic realm="<value>"`
4. client當發現得到以上的回應後，會出現一個給予使用者輸入用戶名稱及密碼的地方
5. client將用戶名稱跟密碼做成一個base64的資料，虛擬碼表示為: `base64(username:password)`
6. client將資料放到Header: `Authorization: base64(username:password)`
7. server重複2開始的動作。

### 原則
從上面的流程我們可以整理出Basic Authentication的一些原則
1. client使用`Authorization: Basic <value>` 放置待驗證資料(每次請求都會放)
2. 約定使用base64編碼/解碼: 用於將不相容的資料轉換HTTP相容的字元
3. server使用`WWW-Authenticate: Basic realm="<value>"` 與client告知結果。

### 優點
- 簡單易用
- 大部分的瀏覽器都有支援

### 缺點
- 幾乎是明碼傳輸帳密
- 瀏覽器保存通過驗證的資訊，但沒有提供Server如何透過HTTP指示刪除，意味除了關閉瀏覽器或分頁，沒辦法登入使用者

### 應用
- 通常會搭配HTTPS使用
- 在安全內網應用

## Token Based Authentication
相較於Basic Authentication把用戶名稱及密碼帶在每次request上，Token Based Authentication則是改將一個名為Token的資訊帶在每次request上以代替前者。

Token是什麼呢?指的是一段由server提供給client端以作為驗證身分的字串。

你可以想像你走進店裡的時候，先用「某種方式」讓警衛認得你，而後警衛就念給你一串無意義的字，告訴你在一段時間內，可以不用用前面的方式進到店裡，念給他那串字就可以。

### 流程
![圖 7](https://i.imgur.com/vWP7Sia.png)

### Token的特徵
- 看似隨機、無意義的資料
- 被放在 `Authorization: <method> <value>`
- (可選)具有使用期限
- (可選)具有驗證用的資訊

### 優點
- 安全

相對於使用Basic Authentication安全，主要是避開每次request都需要帶上沒有經過雜湊或加密的username和password。

以前面的例子來說，你每次都跟警衛講用戶名稱跟密碼，會不會哪天就被聽到了?

- 可帶資訊

透過一些加密的方式，可以讓token本身帶有資訊可以被client解析。

- 可控制

跟前面可帶資訊有關，透過帶著過期的資訊讓資料在指定的時間無法在被使用或拋棄。

### 產生token的方法
1. SWT(Simple Web Token)
2. JWT(JSON Web Token)

這兩個的比較可以參考以下
> Appendix C.  Relationship of JWTs to Simple Web Tokens (SWTs)
> 
>  Both JWTs and SWTs [SWT], at their core, enable sets of claims to be
>  communicated between applications.  For SWTs, both the claim names
>  and claim values are strings.  For JWTs, while claim names are
>  strings, claim values can be any JSON type.  Both token types offer
>  cryptographic protection of their content: SWTs with HMAC SHA-256 and
>  JWTs with a choice of algorithms, including signature, MAC, and
>  encryption algorithms.
> -- [JSON Web Token (JWT)](https://tools.ietf.org/html/rfc7519#appendix-C)

概要的意思是:
1. 兩個產生的目的都是為了在應用程式間溝通
2. SWT組成value的方式是string, JWT是JSON
3. SWT雜湊的方式是HMAC SHA-256, JWT則是可選的雜湊演算法

稍微介紹一下目前比較常見的JWT的結構跟製作流程:
#### 組成

包括: Header, Payload, Signature，這三者會以(.)做分隔
![](https://tyk.io/docs/img/dashboard/system-management/jwt_jwtio_example.png)
> 圖片來自[JSON Web Tokens](https://tyk.io/docs/basic-config-and-security/security/authentication-authorization/json-web-tokens/)

- Header: 包含是否要簽章、雜湊演算法的訊息
- Payload: 資料
- Signature: 簽章

#### 製作過程
1. 按照需求產出Header, Payload
2. 將Header做base64得到`base64(Header)`
3. 將Payload做base64得到`baser64(Payload)`
4. 從伺服器得到一個秘密字串稱為secret
5. (若HMACSHA256)將`base64(Header)`及`baser64(Payload)`使用secret做雜湊，參考下方虛擬碼


```
// Signature虛擬碼
HMACSHA256(base64(header) + '.' + base64(payload), secret)
```

## 小結
稍稍了解了有關於驗證的知識，略過了關於cookie、session的概念，以及基於token延伸出的OAuth，有興趣可以再去找相關資訊。

那就這樣啦，明天見~

此文章同步發表於[部落格](https://tim80411.github.io/code-blog/)，歡迎來逛逛～

## 參考資料
[User Authentication: Understanding the Basics & Top Tips](https://swoopnow.com/user-authentication/)
[Token Based Authentication](https://roadmap.sh/guides/token-authentication)
[HTTP基本認證](https://zh.wikipedia.org/zh-tw/HTTP%E5%9F%BA%E6%9C%AC%E8%AE%A4%E8%AF%81)
[深入理解JSON Web Token系列1：JWT的历史](https://codingnote.com/2021/01/18/jwt-intro-1/)
[產生 JWT](https://pjchender.dev/webdev/note-jwt/)