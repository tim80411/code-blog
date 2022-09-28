---
title: 瀏覽器(Browser)與他們的產地-瀏覽器是怎麼運作的?
tags:
  - 鐵人賽
  - Backend
  - Browser
date: 2022-09-18 12:20:15
---
## 前言
這邊將提及的是，當我們在瀏覽器的搜尋欄中輸入一串網址`https://ithelp.ithome.com.tw/`時，在瀏覽器的背後到底發生了什麼事情?

稍稍了解這個部分，對於開發者在開發符合使用者需求的網站-快速渲染網頁、交互溝通順暢，是會帶來幫助的；甚至當網頁出現問題或效率不彰的時候，透過對於瀏覽器運作機制的了解，也能對糾錯帶來一定的幫助。

不過因為這邊主要側重後端的角度上，瀏覽器溝通的前面步驟導航其實就是典型的HTTP溝通，也是後端常會接觸到的範圍，所以這部分會多些篇幅，而在解析、渲染的部分等關於畫面的部分就會說得相對少很多XD。

那就開始今天的部分吧!!

## 流程
透過MDN的分類，可以將這段流程分為以下幾段
1. 導航Navigation: 建立與Server連線
2. 回應Response: 發出請求並得到回應
3. 解析Parsing: 解析回應
4. 渲染Render: 渲染畫面
5. 交互Interactivity: 與使用者互動

## 導航
此部分將完成的工作是透過傳輸層與Server建立連線。

這部份我們會先以HTTP/2.0之前作為範例，在前一天已經有提到過HTTP/3會使用不同的傳輸層協定，有興趣可以再回頭看一下。
- [超文本傳輸協定(HTTP)是什麼?](https://ithelp.ithome.com.tw/articles/10292700)

### 網域名稱系統Domain Name System(DNS)
在瀏覽器與OS溝通完畢要進行與目標網址的對話後，第一步要做的就是與DNS溝通取得正確ip位置，在談及DNS時，我們稍微談一下網址，並以`https://ithelp.ithome.com.tw/`作為範例，網址結構上分為:

1. 傳輸協定Protocol: `https://`
2. 主機/網域Host/Domain: `ithelp.ithome.com.tw`
3. 路徑Path: `/`


接著，我們目前僅需要知道的部分是，目前可讀的網域其實僅是一種對照，他會被對照到一個真實的ip，好處包括彈性(可以隨意變換Domain背後的ip)、易讀易記等。

而要怎麼透過Domain去找到真實的ip，這個就是DNS工作的範疇了，詳情我就不解釋，這是明天的主題XD

### TCP連線
在得知ip位置之後，會進行經典的TCP三次握手(TCP 3-way Handshake)，其目的是為了確保連接的正確性，包含SYN, SYN-ACK, ACK。

A及B分別代表Client及Server, 而三次握手分別完成的工作包括有:
1. 同步Sync: 由A發出，讓Server知道我們的TCP設置。
2. 同步確認Sync Check: 由B發出，回應Client他已經收到訊息並準備建立連線進行通信。
3. 確認Check: 由A再度發出，表示完成連線。

在這裡我當時自問了一個有趣的小問題: 為什麼需要第三次確認才算建立連線呢?
這邊找到了一個解釋: 
> 一句話，主要防止已經失效的連接請求報文突然又傳送到了服務器，從而產生錯誤。 -- [兩張動圖-徹底明白TCP的三次握手與四次揮手](https://blog.csdn.net/qzcsu/article/details/72861891)
————————————————
版权声明：本文为CSDN博主「小书go」的原创文章，遵循CC 4.0 BY-SA版权协议，转载请附上原文出处链接及本声明。


他的原意是為了避免產生錯誤且不必要的連結，假設是二次握手好了: 
1. 比如連接X請求SYN送出，雖沒丟失但因為某些原因被延誤。
2. A因為遲遲沒收到SYN-ACK誤以為連接請求丟失就重發連接請求Y。
3. 重發後完成二次握手，在完成request-response後關閉連線。
4. 此時連接請求X總算到了B，B發回SYN-ACK
5. A在收到訊息後就又建立了新的連線了。

作為旁觀者的我們知道這個步驟5的連接其實是不必要的損耗，為了避免這個損耗，於是就出現了三次握手，我們回到原本的過程5。

5. 此時SYN-ACK回到A，A這邊有資訊知道這個連接是不用被建立的，就不會再回傳一次ACK給B
6. B在收不到ACK的狀況下，就也可以知道這個連接是不用被建立的。

### SSL/TLS握手
基於安全的需求，在TCP之上又多出了一層SSL/TLS安全協定，於是當我們使用HTTPS的網址時就會多出這段過程，其目的在於讓端點雙方溝通的訊息僅能被彼此看懂，這也會在後面的鐵人賽在多加敘述XD。

## 回應Response
總算完成連接之後，就會開始進行HTTP的Request-Response過程，輸入在網址欄的網址，會作為GET請求被發出，更準確來說，瀏覽器會替你發出一條HTTP報文並請求Server回覆。

## 解析Parsing、渲染Render、交互性Interactivity
在收到`https://ithelp.ithome.com.tw`回應的網頁資料之後，接著就是開始將資料做解析。
其過程根據不同的瀏覽器，有不同的渲染引擎，像是Chrome使用的是開源引擎WebKit的分支Blink，FireFox使用的則是Gecko，解析的流程略有不同，但概念的大方向其實是接近的。

1. 將HTML轉換成DOM tree，CSS轉換成CSSOM tree
2. 將兩者計算並建立Render Tree
3. Layout過程，為每個Render tree的節點決定在螢幕上的確切座標
4. 遍歷Render Tree的節點，使用UI後端繪製畫面。

在完成畫面繪製後，畫面就可以與使用者互動了。

## 小結
還有好些地方可以深入研究，包括解析、渲染、交互之後的TCP關閉連線，甚至是HTTP/3的QUIC連線都有深入可以理解的部分。

不過透過對於這些內容的理解究竟可以做些什麼呢?

來舉一些例子好了，從比較底層的來看，當我們知道SSL/TLS是作為安全性的增強而產生的協議，並且知道他產生了多次的RTT(封包往返時間)，如果未來網頁溝通效率很遭，有可能可以以此猜測瓶頸出現在哪。

另外一個比較實際的角度，我們的網頁有可能突然掛掉，並收到伺服器回饋表示DNS parsing fail，這時候或許就不是一籌莫展，我們因為知道DNS僅代表ip的映射，若有些重大服務/第三方服務，在考量之下也可以請對方先以真實ip代替迴避重大損失。

大概就是這樣囉，明天我們會稍稍深入DNS，了解到我們的DN是怎麼被映射回ip的，明天見~

此文章同步發表於[部落格](https://tim80411.github.io/code-blog/)

## 參考資料
[How Browsers Work](https://web.dev/howbrowserswork/)
[Traffic example](https://www.homenethowto.com/advanced-topics/traffic-example-the-full-picture/)
[TCP壅塞控制機制](https://bbs.huaweicloud.com/blogs/314817)
[MDN-How_browsers_work](https://developer.mozilla.org/en-US/docs/Web/Performance/How_browsers_work)
