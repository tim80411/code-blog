---
title: 說只有對方聽得懂的話-HTTPS & SSL & TLS
tags:
  - 鐵人賽
  - Backend
  - HTTPS
  - SSL
  - TLS
date: 2022-10-07 19:25:47
---
## 前言
之前曾經談過關於Internet Protocol Suite(IPS)，提到過Web中的各個網站就是HTTP的應用，又提到過IPS可以以四層來理解:
1. 應用(application): HTTP
2. 傳輸(transport): TCP
3. 網路互連(internet): IP
4. 網路存取(Network Access (link))。

但我們都曾經在瀏覽器上的網址欄看到https開頭的網址
![圖 12](https://i.imgur.com/yofUKox.png)  

這樣，https又是什麼呢?

那就來了解一下吧

<!-- more -->
## HTTPS
HTTPS全名為超文本傳輸安全協定HyperText Transfer Protocol Secure，還記得昨天提到過的加密嗎?
其實HTTPS就是指將要傳輸的資料經過加密傳輸出去再讓對方解密獲得資訊，以確保資料僅能被傳輸的雙方知道的一種協定。

## SSL & TLS
全名分別是安全通訊協定Secure Sockets Layer(SSL)及傳輸層安全性協定Transport Layer Security(TLS)，這兩個協定的目的就是為了讓HTTP之間的通訊可以安全，且避免被竊聽。
SSL是比較早期的協定，後來由TLS取代~

他的工作層的位置如圖
![圖 14](https://i.imgur.com/nsPnWjP.png)  

他的工作主要包括兩個:
- 通訊驗證: 驗證證書以確認網站身分
- 資訊加解密: 對資料使用對稱加密

## HTTPS工作流程

要了解HTTPS如何工作以及為何要這樣做，我們需要對加密如何在對話兩端如何被應用、可能會發生什麼問題、如何改進逐步討論。

### 對稱加密
最單純的事情就是，我們共享一個密碼就好了~
而對稱加密就是指兩方都使用相同的密碼來作加解密。

- 問題:
不管是由誰產生密碼，為了將密碼交給對方好讓對方解密，為了方便性就不得不經過網路。
只要會經過網路就有封包被劫持的風險，所以我只要劫持到某次封包裡包含著密碼，那我就發了XD

- 解決方案:
於是出現了非對稱加密~

### 非對稱加密
既然共用的密碼會被劫持，那就不要讓密碼共用就好啦。
後面出現了一種加密用A密碼，稱謂公鑰；解密用B密碼稱為私鑰的做法。

於是Server決定產出A1公鑰及A2私鑰，他將公鑰透過網路傳輸給Client(Browser)。
這樣Client就可以將資料用公鑰加密，然後Server用從來沒外流過的私鑰解密，而就算公鑰被劫持，但因為他沒有私鑰，他也沒辦法解密了。

這樣Client => Server的單向傳輸安全了，那雙向呢?
ok，那Client也製作一個公私鑰，讓Server => Client 也安全呢?

- 問題:
看起來是可行的，但除了考量安全還得考量效能。
HTTP想要傳輸的資料可能會很龐大，而非對稱加密其實很費時，所以對於頻繁溝通且資料可能龐大的HTTP來說並不有利。

- 解決方案:
原本不使用對稱加密是因為網路不安全，密碼會在傳輸過程中被盜走。
那如果在安全的環境下分享密碼呢?

沒錯，我們應用剛剛提到的非對稱加密製造安全的傳輸環境來傳輸對稱加密用的密碼!

### 非對稱 + 對稱
我覺得當初想到這個人很聰明XD

狀況現在就變成
1. 在經過連線建立後
2. Server製造公私鑰p1及s1，並將公鑰p1交給Client
3. Client用公鑰p1加密密碼(對稱加密用)，並把加密後的資料傳回Server
4. Server收到後用私鑰s1解密
5. 之後兩方都用對稱加密來加解密資料

這樣是不是就完美了!!!!

- 問題:
HTTPS確實採用類似這樣的方案，但這會出現一個問題: 中間人攻擊。

什麼是中間人攻擊呢?中間人就是指在Server和Client之間多了一個人，作為兩者之間的轉發。
模擬一下他會做的事情:
1. 在經過連線建立後
2. Server製造公私鑰p1及s1，並將公鑰嘗試交給Client
3. **中間人攔截p1，並將自己製作的公鑰p2轉發給Client**
4. Client用公鑰p2加密密碼(對稱加密用)，並把加密後的資料嘗試傳回Server
5. **中間人攔截，加資料用自己的私鑰s2解密(取得共用密碼)，並將Client資料用p1加密後傳回Server**
6. Server收到後用私鑰s1解密
7. 之後兩方都用對稱加密來加解密資料

中間人就這樣開心拿資料，然後Client-Server都沒發現其實拿到的資料有問題。

我們從上帝視角看，知道你明明就拿錯公鑰了，但問題就出在:
Client並不知道他拿到的公鑰是誰的，他只知道是一串無意義的資料~

- 解決方案:
交給別人證明這個公鑰是真的，也就是現在的證書系統。

### 憑證

打開Chrome，點開網址左邊的那個鎖，如果你也是使用HTTPS的連線，一定會看到跟憑證有關的資訊。
![圖 15](https://i.imgur.com/CCdeSS8.png)  

**那這樣憑證是怎麼運作的?**

他的核心就跟學校頒發畢業證書一樣，大家相信這些學校，所以相信他們頒發的證書；也有一個概念相同的機構在頒發這些證書。

Server會將他的證書傳給Client，裡面會包含Server的相關資訊以及最重要的公鑰。

**要怎麼不被假冒跟修改?**

不過這樣似乎沒有解決原本的問題，就算有資訊，中間人還是可以竄改後再傳給Client。

所以在Client的通訊加密層TLS還有一個任務就是要向權威機構確認這個證書到底是不是真的。

**如何確認?**

第一件事情: Server需要向權威機構申請證書，而權威機構這邊也會產生公私鑰，公鑰一樣發出去給大家，但機構會將資料先做雜湊再用私鑰加密(非對稱加密)。

第二件事情: TLS在收到證書時，會拿到兩項重要的東西
- 加密後的雜湊值: 簽章signature
- 證書內容: 包含雜湊演算法

他會把這兩項經過處理後去比對看是否相同，相同就ok，不相同就中斷連線
1. 把證書內容用證書上的雜湊演算法做出雜湊值hash1
2. 把簽章用公鑰解密得到hash2

防止中間人的關鍵在2這段
1. 如果想要改證書內容: 但因為他沒有私鑰，所以就算他重新雜湊並加密，Client端會用權威機構的公鑰解密，會因此與證書內容的雜湊值相異。
2. 直接抽換成一個合格的證書: 因為這樣就不能更換內容，Client端比對他原本想要request的資料跟證書內容不相符也會直接失敗。

**我們來當駭客看看**

那這樣真的沒辦法騙過嗎?

我想了一陣子，前面提到的關鍵是權威機構握有只有他才知道的私鑰。
而有了對於證書的非對稱加密才會無法騙過，所以我想到的方法只有:

1. 成為Server跟權威機構的中間人，讓Client取得的公鑰也是中間人的公鑰，這樣就可以直接抽換證書內容了XD

也不知道對不對，不過這部份我們就不再深究了哈哈

## 流程總結
![圖 13](https://i.imgur.com/hETv3Qm.png)  
> -- [你知道，HTTPS用的是对称加密还是非对称加密？](https://zhuanlan.zhihu.com/p/96494976)

## 小結
以上圖做為總結就很足夠了，感謝製圖的大大，惠我良多~

所以HTTPS其實是非對稱及對稱加密的結合，權威機構製作證書時做非對稱加密，傳輸時憑藉證書做對稱加密。
這樣的好處還蠻多的，除了安全性外，非對稱加密的時間成本在還沒傳輸前就解決了!

今天又是有收穫的一天，明天見~

此文章同步發表於[部落格](https://tim80411.github.io/code-blog/)，歡迎來逛逛～

## 參考資料
[一文搞懂 HTTP 和 HTTPS 是什麼？兩者有什麼差別](https://tw.alphacamp.co/blog/http-https-difference)
[終於有人把 HTTPS 原理講清楚了！](https://www.readfog.com/a/1638923950567297024)
[你知道，HTTPS用的是对称加密还是非对称加密？](https://zhuanlan.zhihu.com/p/96494976)
[HTTPS(一) -- 基础知识（密钥、对称加密、非对称加密、数字签名、数字证书）](https://blog.51cto.com/u_15290941/3047577)