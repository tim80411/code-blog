---
title: 十個好弱點，不保護嗎?-OWASP security risk
tags:
  - 鐵人賽
  - Backend
date: 2022-10-09 15:13:10
---
## 前言
OWASP是一個線上社群、非營利組織，全名為開放軟體安全計畫Open Web Application Security Project，在全世界有許多分會，這個組織主要目標是研究及討論網路軟體安全的標準、工具、文件。

這個組織同時會進行許多計畫，不過我們今天要討論的是他發佈的「十大網路弱點防護守則」，這個守則也被許多組織列為必要文件。

在2017年有一版，可以看這個[參考資料](https://owasp.org/www-pdf-archive/OWASP_Top_10-2017_%28en%29.pdf.pdf); 而在2021年時做了更新，來看一下最新版的Top 10提到了什麼？

<!-- more -->
## 簡介
這個Top 10的定義為何呢？
> The OWASP Top 10 is a standard awareness document for developers and web application security. It represents a broad consensus about the most critical security risks to web applications.

根據官方的文件，這指的是OWASP共識而來十項他們認為最為關鍵的網路安全風險。

從2017-2021的變化如下
![圖 1](https://i.imgur.com/Pw5dWY2.png)
> from [OWASP Top Ten](https://owasp.org/www-project-top-ten/)

## A01:2021-Broken Access Control
### 說明
相對於2017年的第五名，在2021年被上升到第一名。

他們對將近94%的網路應用程式做了某種形式的測試，其中有3.81%出現這個類型的錯誤。

最值得注意的弱點包括: CWE-200：暴露機敏信息給未授權者、CWE-201：將敏感信息插入發送數據(註1)和​​CWE-352：跨站請求偽造(CSRF)。

### 預防
登入控制Access Control僅能在server-side或是server-less的api中控制，讓攻擊者無法直接修改登入控制相關程式碼或是其他可能影響登入控制的metadata(描述資料的資料)。

根據文件舉出幾點:
- Access Control機制應該被共用，而不是在同一個服務中有多種機制
- 應該記錄所有的Access，並不讓使用者有可以對資料做CRUD的權限
- 做rate limit避免類似DDoS等自動化工具的攻擊
- 讓token能夠被失效，若有無法失效的JWT應該給予短暫的有效期限，若有長壽的JWT，強列建議遵循OAuth標準來撤銷權限。

## A02:2021 – Cryptographic Failures
### 說明
位置由#3變成#2，以前稱為Sensitive Data Expose，改名的原因是因為先前的命名更像是現象，而不是原因。

主要原因在此列出是密碼學的相關失敗，常會導致資料的暴露，常見的風險包括: 使用寫死(固定)的金鑰加密、使用損壞或有風險的加密演算法、隨機度不夠高(熵低)

### 預防
總結是：對敏感資料加密，時常關注加密演算法的變化，時時注意更新。

另外根據文件列出以下幾點：
- 需要做到
  - 將資料作出分類，並可根據隱私法、監管法、業務需求列出敏感資料的類別
  - 靜態敏感資料需要被加密
  - 確保採用最新的演算法、協定及金鑰，並妥善保管金鑰
  - 使用安全協議加密所有傳輸時的數據: 包括前向(FS)、強制HTTPS(HSTS)等
  - 使用有自適應性(可設置迴圈應付進步的算力)、加鹽敏感的慢雜湊演算法雜湊密碼後儲存，例: bcrypt
- 不要這麼做
  - 不保存不必要的敏感資料，在丟棄時注意不能被竊取
  - 禁止緩存敏感資料
  - 不要用FTP或SMTP傳輸敏感資料
  - 不使用已被驗證為低強度的加密或雜湊演算法: MD5, SHA1...等

## A03:2021 – Injection
### 說明
指的是透過各種由網站允許的輸入方式將惡意資料放入了資料庫中，或直接被程式使用(例如參數)。

### 預防
總結來說: 將數據和命令查詢分開

以下列舉幾點官方建議:
- 避免讓輸入的資料直接被interpreter直接解讀，使用安全的API、使用參數化接口或使用ORM
- 使用limit或其他設定讓資料在洩露時能被控制在一定範圍內

## A04:2021 – Insecure Design
### 說明
是2021年的一個新分類，關注的部分是設計跟架構有關的缺陷，他的目的是在呼籲大家使用安全的設計模式。

這個分類重點在於「不安全的設計」，並指出「不安全的設計」與「不安全的實現」（也就是其他分類的總和）是有區別的，並提到若不安全的設計出現問題，是無法靠完美的實現來解決。

並指出，這些分類的根本問題在於對於開發中的應用程式或系統缺乏必要的業務風險分析。

### 示例跟我的理解
因為這項分類太難以理解，每個字都看得懂，但合起來就不懂了...

於是我們看一下官方例子：
- 一家電影院允許團體預訂折扣，攻擊者可以透過threat modeling看是否可以在幾個請求完成對所有電影院大量座位的訂購，從而造成電影院的損失。
- 一間零售電商並未針對高端顯卡有對於自動訂購程序的保護，於是所有顯卡都被黃牛買走，造成不良形象的影響。

我覺得第二個例子會比較好明白這個分類想描述的狀況: 
> 顯卡被買走的流程是正常的，但他造成的業務損失(品牌形象)反而變得更為嚴重，這就源自於對於商業風險分析的缺乏，以致於無法注意到在開發時應著重於對於這樣流程正常但反倒造成損失的狀況作出預先的回應


## A05:2021 – Security Misconfiguration
### 說明
在應用程式有關的相關設置，像HTTP、雲端基礎設施...等設置不良

例如:
- 啟用或安裝不必要的服務: 因使用第三方廣告服務需設置CNAME，但後續停用後未處理，導致盜用，整個Domain被撤銷。
- 錯誤處理向用戶顯示stack info或是過多的錯誤資訊
- 未設置與安全性相關的HTTP Header
- default account仍保持啟用

### 預防
安全的各環境安裝過程，包括:
- 自動化的開發環境建立: 將開發人員的環境打包起來自動化建立，避免人為錯誤
- 最小化的平台，避免所有不必要的內容及設置，ex: 工具、文件及服務

## A06:2021 – Vulnerable and Outdated Components
### 說明
這裡指的就是你的應用程式有任何依賴的基礎或組件，包含系統或套件等具有安全風險。

### 預防
總結來說: 應該有一個對於依賴的管理流程處理關於依賴的安全風險

包括幾項:
- 刪除未使用的依賴
- 訂閱與依賴相關的安全警報
- 使用工具做依賴的風險檢查，像是OWASP依賴檢查、retire.js
- 通過安全管道從官方取得所需依賴
- 監控停止維護的套件，並在出現相關風險時

## A07:2021 – Identification and Authentication Failures
### 說明
這邊指的是應用程式在對於用戶身份認證的弱點

包括：
- 在URL中暴露Session token
- 允許弱密碼、眾所皆知的密碼
- 不能正確的失效Session

### 預防
- 實現多因素認證
- 弱密碼檢查

## A08:2021 – Software and Data Integrity Failures
### 說明
在2021年產生的新共識，在無法或未驗證完整性的狀況下，對應用程式的組件、關鍵數據和CICD的流程有樂觀的假設。

這項分類來自於不能保持資料完整性的程式碼與基礎設施有關。

這個弱點讓我想到在2022年初的faker及colors套件[意外](https://www.ithome.com.tw/news/148822)，有依賴於此library的應用程式都受到影響。

### 預防
軟體供應鏈的安全性近年來逐漸受到重視，其中包含:
- 使用signature來驗證組件是否來自官方並且未經修改
- 使用軟體供應鏈安全工具來驗證組件沒有包含已知漏洞
- 確保CICD的執行過程有得到適當的隔離、設置(configuration)、權限控制

## A09:2021 – Security Logging and Monitoring Failures
### 說明
此類弱點是指，是否有足夠且必要的監控及訊息紀錄以確保責任、事件警報、取證能被完善。

所以這個類別主要在確保其他類別的錯誤能被檢測、警報，常見的問題包含：
- 可被查核(Auditable)的資料未被記錄，像是: 登入、交易、錯誤報告
- log僅存在本地
- 應用程序對於攻擊無法實時進行通報

### 預防
根據應用程式的風險分析，可以執行的包括:
- 確保有日誌管理機制可以輕鬆的建立log
- 對應用程式建立有效的警報系統
- 確保有保留足夠充分的登入資料已驗證登入身份，以檢查惡意帳戶及身份


## A10:2021 – Server-Side Request Forgery (SSRF)
### 說明
這項攻擊是利用client => middle Server => internal Server 這樣的結構，透過middle Server與internal Server中間防禦較弱的特性。

將經過特別設計的url透過middle Server傳給internal Server達成攻擊。

### 預防
- 驗證所有從用戶端而來的資料
- 禁用HTTP redirect
- 強制url有他固定的目標
- 不向用戶發出 raw response

## 名詞解釋
### 註1: [CWE-201：將敏感信息插入發送數據](https://cwe.mitre.org/data/definitions/201.html)
CWE-201比較模糊一點，更多解釋是: 
> The code transmits data to another actor, but a portion of the data includes sensitive information that should not be accessible to that actor.

意指你將資料傳給一個授權者，但資料裡面包含機敏訊息，可能包括驗證用資料，或是能更近一步利用系統的資訊。

官方舉了一個例子是如果在資料錯誤發生時直接回傳，將暴露登入的資料結構給對方。:
```SQL
Warning: mysql_pconnect(): Access denied for user: 'root@localhost' (Using password: N1nj4) in /usr/local/www/wi-data/includes/database.inc on line 4
```

## 小結
今天是文件翻譯日...XD
是蠻值得去官方看看，有相關知識，在開發的時候會比較容易注意到一些資訊安全的壞味道也是好的～

此文章同步發表於[部落格](https://tim80411.github.io/code-blog/)，歡迎來逛逛～

## 參考資料
[OWASP Top Ten](https://owasp.org/www-project-top-ten/)
[網站安全🔒 伺服器端請求偽造 SSRF 攻擊 — 「項莊舞劍，意在沛公」](https://medium.com/%E7%A8%8B%E5%BC%8F%E7%8C%BF%E5%90%83%E9%A6%99%E8%95%89/%E7%B6%B2%E7%AB%99%E5%AE%89%E5%85%A8-%E4%BC%BA%E6%9C%8D%E5%99%A8%E8%AB%8B%E6%B1%82%E5%81%BD%E9%80%A0-ssrf-%E6%94%BB%E6%93%8A-%E9%A0%85%E8%8E%8A%E8%88%9E%E5%8A%8D-%E6%84%8F%E5%9C%A8%E6%B2%9B%E5%85%AC-7a5524926362)