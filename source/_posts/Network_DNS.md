---
title: 自己家的地址自己取-網域(domain) v.s. 網域名稱系統(domain name system)
tags:
  - 鐵人賽
  - Backend
  - DNS
date: 2022-09-19 12:15:10
---
## 前言
域名讓網頁的ip地址轉變成能夠被人類理解的內容，根據維基百科的資料，到2022年已經有超過5億的域名登記註冊。

今天要稍微深入看一下Domain name這個部分的內容，內容應該會包含域名的結構、域名系統(DNS)如何在client要求與建立連線時將正確的ip交付。

<!-- more -->

## 特性
1. 可理解性: 比IP位置更好被記億。
2. 唯一性: 和IP位置一樣，域名也是唯一性的，同一個域名不會代表兩個不同的IP位置，另外，因為他是映射的IP位置可以被更改，你可以隨意修改你的DN對應到的服務器IP位置。

## 結構
一個域名可以由好幾個字串組成，這些字串被點(.)分隔，而最右邊的字串被稱為頂級域名Top-Level Domain(TLD)。

頂級域名可以大致分為國家和地區頂級域(ccTLD)以及通用頂級域(gTLD)，ccTLD就像是台灣的tw結尾，而gTLD通常具有特定意義代表多個組織，例如gov(政府)、edu(教育機構)、com(商業)...等等

頂級域名往左就會被稱為子域名，由二級開始，每向左多出一個域名就會下降一層，三級、四級...等等。


## DNS機制
我們稍稍回到昨天，當我們輸入網址並按下ENTER後，在透過DNS取得正確的步驟包括以下:

1. 檢查本機的DNS緩存是否有保存IP位置。
2. 假設並沒有緩存，現在要開始做DNS查詢。
3. DNS查詢首先會往此電腦被設定的DNS伺服器去查詢，我們在此處稱為本地伺服器。
4. 若是符合該主機的本域名會直接回答，沒有的話也會檢查Cache看有沒有相關資料。
5. 若依舊沒有的狀況，此本地DNS server會向此server有紀錄的根網域主機root domain name server(保管所有TLDNS的伺服器位置資料)發出請求。
6. 該根網域主機會回傳一台控制該網域的DNS的ip位置。
7. 在得到新的DNS IP後，本地DNS會向該DNS發出請求。
8. 若並非為該DNS儲存的資料，則會回傳更靠近該網域的DNS server。
9. 重複7, 8步驟直到收到正確ip為止

從以上資訊我們可以得到一個結論是一台DNS並不會存放所有域名的DN資料，資料都是分別儲存在層層搜尋出來的。

唯一共用位置資料的只有前面提到的根網域伺服器，他們共用同一份根域(Root Zone file)檔案，裡面記錄著頂級域名權威伺服器的ip位置。

## 有趣的小指令: whois
linux的系統可以透過apt install whois安裝這個命令。

這個命令可以讓你查看指定網域的註冊資料，你也可以知道你查詢的網域是不是已經被使用了。

## 小結
還記得過往曾經看過一些文章和你說，修改DNS的位置可以加速你的網路讀取速度，現在想想，他的邏輯應該是，若你可以直接在第一層詢問local DNS就拿到你要的ip位置，就可以少等待很多時間。

![windows DNS設定修改](https://i.imgur.com/L6EtBWC.png)

但換個方式來說，你的server或是你的電腦為了效率，其實也會將取得的IP做Cache，所以第二次連接相同網站速度還是無法提升時，也代表或許瓶頸並不是出現在DNS這段，對於排錯又可以多一些額外的資訊了。

今天差不多就到這裡囉，明天會聊聊託管(hoisting)

此文章同步發表於[部落格](https://tim80411.github.io/code-blog/)

## 參考資料
[MDN-Domain](https://developer.mozilla.org/zh-CN/docs/Learn/Common_questions/What_is_a_domain_name)
[Traffic](https://www.homenethowto.com/advanced-topics/traffic-example-the-full-picture/)
[網路大冒險](https://blog.twnic.tw/wp-content/uploads/2021/08/2021_jprs_ZH-TW_0830_final.pdf)
