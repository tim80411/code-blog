---
title: 行程(Process)、執行緒(thread)傻傻分不清楚(中)-執行緒管理
date: 2022-09-24 00:40:37
tags: ['鐵人賽', 'OS', 'Thread', 'Process']
---

## 前言
今天會討論執行緒Thread，是一個我覺得很容易跟行程Process混淆的概念，為了學習跟整理這個概念，我們可以踩在前人的肩膀上前進XD

透過一張別人整理出來的Process、Thread比較圖，我們來問問一些「為什麼?」。
而透過回答經過整理的問題，可以看到兩者的差別及是什麼造成這些差別。

而最後我相信通過探究這些差異的過程，不只可以幫助理解Thread，也同時可以回頭幫助了解Process~

<!-- more -->

## 執行緒Thread

| Item           | Process                                | Thread             |
| :------------- | :------------------------------------- | :----------------- |
| 定義           | 在執行中的程式                         | 行程的一部分       |
| 輕量           | 不輕量                                 | 輕量               |
| 終止時間       | 較長                                   | 較短               |
| 建立時間       | 較長                                   | 較短               |
| 溝通           | 行程間的溝通較費力且相對Thread來說更久 | 溝通容易且相對較短 |
| 上下文交換     | 較長                                   | 較短               |
| 資源 (CPU時間) | 消耗較多資源                           | 較少               |
| 記憶體         | 幾乎隔離                               | 有共享的記憶體位置 |
| 資料共用       | 不共用資料                             | 共享資料           |
from [Process vs Thread – Difference Between Them](https://www.guru99.com/difference-between-process-and-thread.html)


### 為什麼說Thread是Process的一部分?
我們可以用三種角度來看這個定義，看能不能釐清他們!

#### 角度1: 工廠藍圖想像
我們先用比較淺顯的想像開頭:
> 想像我們按照「藍圖」建立「工廠」，「工廠」裡面會聘請「工人」來完成工作。

上面提到的藍圖、工廠、工人分別就是Program、Process、Thread。
所以實際上完成功作的是作為工人的Thread。

但這邊我在看的時候產生一個困惑，我們在操作系統簡介不是曾說: 
> Process會根據CPU scheduling機制搶占CPU資源

這樣到底是Process還是Thread完成工作呢?

其實這句話依舊是正確的，只是說的還不夠多，要了解這點，我們需要先知到Thread到底是什麼又存在哪裡。

透過一張圖的幫忙會更容易理解了。

#### 角度2: 單執行緒行程 vs 多執行緒行程
![](https://i.imgur.com/Np4e2XK.png)
> from [程序、行程(process)](https://chenhh.gitbooks.io/parallel_processing/content/process.html#%E8%A1%8C%E7%A8%8B%E7%8B%80%E6%85%8Bprocess-state)

這是一張單執行緒Process與多執行緒Process的比較圖。
我們回到表格中的定義:
> 執行緒是行程的一部分

這樣是不是就很明顯地看到這個定義了呢?
執行緒確實是行程的一部分，於是昨天提到的行程結構，其實就是一個單執行緒行程。

確切來說，執行緒的結構包含獨立的: stack、register、counter
並且與其他Thread共用code, date(共用變數區), files。

正因為每個Thread有自己的Register、Counter、Stack，所以他們可以自己決定執行哪段程式，也就是說:
> 每段執行緒可以執行各自片段的程式碼以完成Process需要完成的工作

#### 角度3: 概念總結
最後來整理一下，並帶到最後一個對Thread及Process之間差異的描述:
> Process是OS分配資源之對象單位，而Thread才是OS分配CPU時間之對象單位
>   -- [作業系統筆記(二)：利用處理程序、執行緒來多工處理](https://noob.tw/operating-system-multitasking/)


### 為什麼Thread相對輕量?建立及終止時間相對短?資源消耗較少?
<!-- 建立Thread就像在固定好，且較小的範圍建立資料 -->
Process建立流程包括:
1. 向系統註冊，讓系統紀錄執行清單，並標上PID。
2. 分配適當的資源，包含CPU使用權及獨立的資料儲存空間。

這個過程會申請空白PCB並初始化資料並填入PCB。

而因為Thread共用了大部分Process的狀態(這邊幫助你回憶一下，Thread是Process的一部分XD)，所以可以減少建立及管理的開銷。
另外一部分牽涉到Context Switch的成本，因為行程在進行Context Switch時，需要保存整個Process的狀態資訊，包括Counter、CPU registers、PCB，在處理這個過程花費的CPU相對Thread較多，因為Thread僅需要保存他自己的CPU register而已。

用工廠的說法來描述這些成本的差異好了。
建一個工廠需要選地址、找監督特別記錄所有工廠的資料、建立所有流程；而多請一個員工，因為原本的工廠裡面的流程都還在，所以大部分要做的事情都可以被省略。


### 為什麼Thread溝通容易?為什麼Thread可以共享資料?又為什麼Process不行?
一個相同行程裡面多個Thread在被建立時，都可以共用同一個Process裡面的區塊的資料，這個區塊就是Heap，可以把這個區塊理解成像是全域變數的存在。

而不同Process在被建立時，他們彼此之間就會被分配不同的記憶體位置，因為沒有共用記憶體，所以Process之間如果需要溝通就要靠其他方法，一般統稱這些方法為Inter-process communication(IPC)，而這個過程相對不易，但也確保了行程內的資料不易被汙染。

盡可能保持Process之間的獨立性是有它的意義的，就好像我們現在可以毫無猶豫的ctrl + alt + delete直接強制關閉行程卻不用擔心造成其他行程的影響，因為他們之間互不依賴。


## 小結
透過了解Thread，我們進一步釐清了Thread這個概念被建立想要去處理的問題是快速的多工，並提高了資源(CPU、Memory...)的使用率。
於是接下來會進到下集，我們要談的Concurrency，可以說Thread幾乎是為此而生XD至於為什麼這麼說，下一篇也會試圖解釋這件事情!
那就明天見囉~

本文章同步分享於[部落格]()，歡迎來逛逛~

## 後話
其實原本是要將內容分成上下兩個部分，但Process、Thread、Concurrency這三個主題實在太息息相關，可以講的東西又太多了。
不知不覺，篇幅就大到一天要讀完太過難受，為了閱讀體驗~~以及我的鐵人賽挑戰~~，所以最終才分成三篇。
另外，若有人看不懂本篇的內容的話，可以回頭從[OS overview](https://ithelp.ithome.com.tw/articles/10295580)開始看起喔。


## 參考資料
[行程及執行緒](https://chenhh.gitbooks.io/parallel_processing/content/process.html#%E8%A1%8C%E7%A8%8B%E7%8B%80%E6%85%8Bprocess-state)
[Why Thread Considered Cheap](https://www.quora.com/Why-are-threads-considered-cheap)
[What is the difference between concurrent programming and parallel programming?](https://stackoverflow.com/questions/1897993/what-is-the-difference-between-concurrent-programming-and-parallel-programming)
[程序(進程)、執行緒(線程)、協程，傻傻分得清楚！](https://oldmo860617.medium.com/%E9%80%B2%E7%A8%8B-%E7%B7%9A%E7%A8%8B-%E5%8D%94%E7%A8%8B-%E5%82%BB%E5%82%BB%E5%88%86%E5%BE%97%E6%B8%85%E6%A5%9A-a09b95bd68dd)
[作業系統筆記(二)：利用處理程序、執行緒來多工處理](https://noob.tw/operating-system-multitasking/)
[Linux 核心設計: 不僅是個執行單元的 Process](https://hackmd.io/@sysprog/linux-process)
[PPT in Operating system](https://ithelp.ithome.com.tw/articles/10280394)
[Threads and its types in Operating System](https://www.geeksforgeeks.org/threads-and-its-types-in-operating-system/)
[OS Process & Thread (user/kernel) 筆記](https://medium.com/@yovan/os-process-thread-user-kernel-%E7%AD%86%E8%A8%98-aa6e04d35002)