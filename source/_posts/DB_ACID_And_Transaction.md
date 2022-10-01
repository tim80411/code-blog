---
title: 交易的安全保證-ACID & Transactions
tags:
  - 鐵人賽
  - Backend
  - ACID
  - Transaction
  - Isolation
date: 2022-10-01 19:55:12
---
## 前言
在真實的網路行為上，一個只是點擊的動作常常會牽動對於多個數據的動作，這樣一系列動作的組成被稱為Transaction，中文有人說事務，也有人稱呼他為交易。
而ACID則是確保Transaction能正確可靠的四個特性。

後面會來稍微了解這個部分~

<!-- more -->
## Transaction錯誤
剛剛前提已經提到了關於Transaction的定義。
原則上，我們會希望當Transaction進行的時候，資料庫要像是時間停止一樣，直到commit之前所有的資料都保持不動；
而其他的事務的操作若有取得與前面事務相關的資料時，應該以前面事務的最終結果為結果。
ANSI/ISO standard SQL 92舉出一些並非如此的錯誤: 
- 髒讀Dirty Reads
- 不可重複讀Non-Repeatable Reads
- 幻讀Phantom Reads

### Dirty Reads
> 有兩個Transaction分別為A及B，若A的操作將包含更改一個欄位的資料，B這時候在A尚未commit(註1)的時候去讀取，並取得了更新後的結果，這就稱為Dirty Reads

為什麼這樣是一種錯誤呢?原因在於A並未確定已經成功了，若他失敗，將會把資料從已更新的資料退回，這時候B使用到的值就是錯誤的。
- 白話案例: 
假如有一個Transaction A的目的是將user的身分從一般normal轉成VIP，在更新完但還沒commit時，這時候Transaction B出現，他希望使用一個VIP才能使用的優惠，此時讀取的資料若是VIP，就能順利完成Transaction B，並用掉了優惠；沒想到這時候發現Transaction A後面在完成某個確認的流程沒有通過，於是所有動作都退回，導致使用者的身分其實還是normal卻使用了VIP才能用的優惠。

註1: 一個Transaction的commit代表在這個Transaction的所有操作都被確定完成了。

### Non-Repeatable Reads
> 一個Transaction裡面，讀取兩次相同欄位，卻得到不同結果，稱為Non-Repeatable Reads

### Phantom Reads
> 一個Transaction裡面，進行兩次查詢，得到不同數量的結果，就稱為Phantom Reads

看起來跟Non-Repeatable Reads有點相像，差異應該是讀取的層級不太一樣，以SQL的講法，Phantom Reads是發生在table內的等級，而Non-Repeatable Reads則是row內的等級，所以意思是，Non-Repeatable Reads跟Phantom Reads確實是可能在同一次搜尋裡面發生的。

## ACID 原則
為了避免上述的錯誤，大部分的關聯式資料庫都遵循這個原則，包括
- 原子性Atomicity
- 一致性Consistency
- 隔離Isolation
- 持久性Durability

### Atomicity
全有全無，Transaction的操作要就全部發生，要就全部沒有，視為一個整體。

有一個說法是我覺得很清楚的
> 一般來說，原子性 意為某樣東西不可在被切割的更小塊。但在計算機領域中，則是指在多執行緒底下，某個執行緒若執行一個原子操作 (atomic operation)，另一個執行緒無法看到該操作中的半完成狀態，只有操作前跟操作後兩個狀態。
> -- [Transactions (1) - ACID](https://ithelp.ithome.com.tw/articles/10259236)

### Consistency
> 在事務開始之前和事務結束以後，資料庫的完整性沒有被破壞。這表示寫入的資料必須完全符合所有的預設約束、觸發器、級聯回滾等
> -- [維基百科](https://zh.wikipedia.org/zh-tw/ACID)

這邊在維基百科其實說的有點抽象，但我看到一些其他的說法，包括: 
- data is consistent before and after a transaction without any missing steps--[參考](https://retool.com/blog/whats-an-acid-compliant-database/)
- transaction 完成前後，資料都必須永遠符合 schema 的規範，保持資料與資料庫的一致性--[參考](https://tw.alphacamp.co/blog/mysql-intro-acid-in-databases)
- 不同的數據都會有一些基本的約束，而這些約束在交易前跟交易後都必須要遵守，如果沒辦法遵守交易就必須失敗--[參考](https://lance.coderbridge.io/2021/04/24/short-what-is-acid/)

我覺得一致性這邊要提到的約束其實是泛指所有，上面的說法都可能是其中一個部分，比如schema可能會限制unique index、另外不在schema中的約束可能是FK constraint等等的。

不過這裡的一致性也部分受到原子性保護著，比如說錯誤的操作因為原子性的全有全無機制，不會因此出現例外，而是會回到原本的狀態，這樣也就確保錯誤時的一致性不會被破壞了。

### Isolation
這裡指的是當多個Transaction併發(concurrent)時，不會互相造成影響。

最完美的作法當然後依序執行，也就是每次只完成一個Transaction，但這樣效能太差，這不就代表沒有併發嗎XD。
所以後面就會出現不同等級的隔離，都相對於依序執行隔離來的弱，有機率發生併發，但是在效能、情境上考量後可接受。
而開發者就需要了解不同層級的差異，以盡可能減少併發造成的bug，也就是前面提到的三種錯誤。

以下分為幾個層級，由低到高分別為: 
#### Read Uncommitted
保證A事務已更新但未commit的資料，B事務僅可讀取。
因為可以讀取其他Transaction尚未commit的結果，其實意思幾乎等同於沒隔離了XD
不過他的意義還是在的，想像一下若沒有這層隔離會發生的狀況:
1. 原始資料X為0
2. 事務A更新資料X為1
3. 事務B更新資料X為2
4. 事務A rollback 回原值0

原本預期嘗試更新為2就因此消失了，因此此層還是能至少避免更新的遺失。

此隔離性會發生的問題包括:
- 髒讀
- 不可重複讀
- 幻讀

#### Read Committed
保證讀取到的資料都是經過確認(commit)的。
因此可以避免髒讀。

為什麼無法避免其餘錯誤呢?
有一個案例如下
1. 原始資料X為1
2. 事務A讀取資料X得到1
3. 事務B更新資料X為2並確認
4. 事務A讀取資料X得到2

這樣就發生不可重複讀了。
同上，如果這裡的更新變成插入資料一樣無法避免幻讀。

此隔離性會發生的問題包括:
- 不可重複讀
- 幻讀

#### Repeatable Read
保證同一次事務，取得的資料都相同。

此隔離性會發生的問題包括:
- 幻讀

#### Serializable
以效能換取隔離。

### Durability
若Transaction完成，就算出現錯誤，已經完成操作的資料也應該保持原樣、永久的。

## 小結
這次大致了解了Transaction，以及保持Transaction正確可靠的ACID。
不過其中在隔離性的部分雖然介紹了層級，但各資料庫實現這些層級隔離的方式完全是看他們自己XD
通常會應用到關於鎖Lock的觀念，不過這部分就只好留待以後了~~

明天會了解一下與DB效能有關的話題-N+1 problem。

此文章同步發表於[部落格](https://tim80411.github.io/code-blog/)，歡迎來逛逛～

## 參考資料
[Transactions (1) - ACID](https://ithelp.ithome.com.tw/articles/10259236)
[What is a database transaction?](https://fauna.com/blog/database-transaction)
[簡介隔離層級](https://openhome.cc/Gossip/HibernateGossip/IsolationLevel.html)
[Transaction 併發錯誤與隔離層級 - (1)](https://ithelp.ithome.com.tw/articles/10247232)
[資料庫交易的 Isolation](https://blog.amis.com/database-transaction-isolation-a1e448a7736e)