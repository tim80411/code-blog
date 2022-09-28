---
title: OS_system_classification_overview
tags:
  - 鐵人賽
  - Backend
date: 2022-09-22 12:58:23
---
## 前言
今天要介紹各個系統作業類別，透過了解系解的分類及概要的內容，會對於作業系統有更進一步的認識的~
那就開始吧!

<!-- more -->

## 作業系統類別
1. 多元程式規劃 Multiprogramming System
2. 分時系統 Time Sharing System
3. 分散式系統 Distributed System
4. 即時系統 Real Time System
5. 集成/叢集式系統 Clustered System


### 多元程式規劃Multiprogramming System
- 定義: 存在多組Process同一段時間內同時執行
- 目的: 避免CPU閒置，提升使用率

系統內存在許多等待執行的Process，而透過CPU Scheduling讓CPU可以在不同Process中切換(Context Switch)，讓CPU保持忙碌減少閒置。

為什麼需要切換，因為為了完成軟體需執行的動作，可能需要依賴除了CPU以外的硬體，若CPU的運算過程出現需等待其他硬體先完成後才能繼續執行的事件，就會造成閒置(idle)。

一般而言，Multiprogramming degree(註1)越高，CPU使用率越高，意思是指說越不會出現因為等待其他軟體操做其他硬體工作而造成閒置，除非遇到輾轉現象(Thrashing(註2))。


### 分時系統 Time Sharing System
- 定義: 屬於Multiprogramming System其中之一，透過資源共享技術，使User認為有各自專屬的系統存在。
- 技術:
    - CPU: CPU Scheduling，採用Round-Robin(註3)
    - Memory: 共享Memory Space
    - I/O device: Spooling(註4) 

此系統容許多人同時使用，並對個別的請求盡可能快的產生反應，如果這個輪流使用資源的速度夠快，會看起來像是每個人都在同時與該系統互動，故也會被稱為交談式系統，像是遊戲。


### 分散式系統 Distributed System
可分成兩類: 
1. 緊密耦合Tightly Coupled: Multiprocessor, Parallel
2. 鬆散耦合Loosely Coupled: Distributed

#### 緊密耦合 Multiprocessor/Parallel
- 定義: 同一機器具有2顆以上的CPU或Processor存在，且同時符合以下特性
    - 共享記憶體、I/O設備、Bus(註5)
    - 受同一個Clock及OS的控制
    - CPUs之間的資料交換，採Share Memory(註6)

支援Parallel Computing，可將Processes或單一Process上subtasks指派到不同CPU，平行直行。

- 優點:
    - 產能: 可同時執行多工作，或單一工作拆分部分。
    - 符合效益: 共用記憶體、I/O、BUS，在完成MultiProcessor的演算法之後，就不用用多台電腦叢集，但閒置了必配置的上述資源。
    - 可靠度: 單一Processor掛掉之後可以保證工作繼續維持。

- 問題:
n個CPU不等同於n倍效能，會因為前者提到在多工的通訊或共用的資源的競爭導致效能的消耗。

可以想像看看，公司的團隊人數增加兩倍時，就會有兩倍的產能出現嗎...

- 類型細分:
    - 對稱式多元處理Symmetric Multiprocessing, SMP: 
      每一個Processor功能相同，可靠度較高，單一Processor壞掉會將未完成工作轉移到其他Processor身上，強調負載平衡，想像起來有點像並聯的感覺。
    - 非對稱式多元處理Asymmetric Multiprocessing, ASMP:
      又稱做Master/Slave架構，通常有一個單位(個/群)的Master Processor，負責控制、分配Process到其他Processor去運作，效能相對SMP好，但可靠度較差。

#### 鬆散耦合 Distributed
- 定義: 相對於緊密耦合，可以視為多台電腦的叢集。

現代網路的運作模式可以視為是這樣的鬆散耦合，通過一些經過標準化的協定傳遞訊息做溝通。

- 類型細分:
    - 網路作業系統(NOS):
      在知道其他端點的資訊下，透過網路協定進行訊息溝通。
    - 分散式作業系統(DOS):
      讓使用者已像是在存取自己資源的方式使用遠方端點資源，資料以及運算全在OS控制之下，使用者無法得知是在遠端或是本端得到資源。
      
![](https://i.imgur.com/zProh6x.png)
> 圖片來自碁峯-作業系統理論與實務--第二版(雙色印刷)15-3

### 即時系統 Real Time System
- 定義: 嚴謹的定義的時間限制，Processor在處理工作時必須在時間內完成，若否即失效。

可分成兩類
1. 硬性即時系統
2. 軟性即時系統


#### 硬性即時系統
狹義化的即時系統定義，並相對於柔性即時系統。
- 注意限制: 除了OS運作的時間以外，也要考慮系統內的delay(如傳輸、硬體運算等)必須須小於情境所需要的Time Constraint。
- OS特性: OS的功能少甚至沒有，以減少干預，強調即時，限制延遲。
- 使用需求可以想像這個系統是需要在特定時間限制需求的環境下使用的。

#### 軟性即時系統
確保高優先權Process會先於低優先權被完成，且高優先權Process的優先權要維持到工作完成，對比硬性即時系統來看，此系統僅能保證高優先權最先，但不會限定什麼時間完成。
- 注意限制: OS造成的延遲要盡可能縮短，避免優先權反轉(註7)問題。
- OS特性: 支援Priority優先權演算法，且優先權不能被Aging(註8)。

### 集成/叢集式系統 Clustered System
- 定義: 其定義有點類似分散式系統: 集合多個CPU完成工作並共享儲存裝置稱為一個clustered，且又透過連線緊密連結。

差異的話，相對於Tightly coupled，他不是多個CPU共用相同資源；而相對於loosely coupled，他也不是多個**單獨系統**作訊息溝通。

硬要想像跟理解的話，有點像是多個Tightly coupled系統作loosely coupled，不過每個Tightly coupled系統僅共享儲存裝置這樣。

不過回頭來看，我們要說Tightly coupled系統也是一種Clustered System，應該也是符合定義的吧。


## 名詞解釋
### 註1- Multiprogramming degree
系統內等待執行的Process數量

### 註2- Thrashing
因為Context switch需要記憶體或虛擬記憶體作為資訊存放的地方，於是，當Multingprogramming degreee超過一定程度時，會讓所有Process忙於資訊在記憶體及虛擬記憶體(disk)轉換之中，CPU為了等待完成反而造成閒置。

### 註3- Round-Robin
每個Process有固定的配額時間，配額的時間沒完成目前的工作，Process會被迫放棄並讓出CPU的使用。


### 註4- Spooling
為了因應速度不相同的裝置，在兩者之間設置緩衝區(Buffering)，以減少兩者速度傳輸造成的閒置或是順序錯誤。

常見的舉例像是: 印表機處理多個裝置的影印工作不會錯置順序。

### 註5- 匯流排Bus
指的是電腦組件之間交換資料的方式，我的理解就是主機板上連接著組件間的線路。

### 註6- Share Memory
允許兩個不相關的Process進入讀取、寫入的邏輯記憶體。


### 註7- Priority Inversion優先權反轉
高優先權Process在特定情況下，遭到低優先權阻擋而無法完成工作。

特定情況像是，雖然高優先權拿到了CPU的使用權，但低優先權霸佔了高優先權完成工作時需要的資源，造成CPU idle。

### 註8-aging
系統根據特定規則，將系統內很長時間未完成工作的process逐步提高其 Priority的技術。

## 小結
在了解了這些不同的作業系統類別之後，我發現這些作業系統的設計其實都是跟著實務上使用的需求而專門誕生的，只是後續才被整理出這些類別才是。

在大概了解完OS之後，其實還是有很多大大小小的內容可以在深入了解一些，那接著就是在介紹時常常提到的行程Process囉!

此篇文章同步發表於[部落格](https://medium.com/on-my-way-coding/%E4%BD%9C%E6%A5%AD%E7%B3%BB%E7%B5%B1-operating-system-os-overview-%E4%B8%8B-37670e4c368a)，歡迎逛逛~

如果沒有前面那是正常的，因為我從今天才決定要放部落格的XD

## 參考資料
[作業系統簡介](https://www.youtube.com/watch?v=tA4KiYrFdAM&ab_channel=%E3%80%90%E6%9D%B0%E5%93%A5%E6%95%B8%E4%BD%8D%E6%95%99%E5%AE%A4%E3%80%91)
[即時作業系統](https://ithelp.ithome.com.tw/articles/10203950)
[Shared Memory](https://zh.wikipedia.org/zh-tw/%E5%85%B1%E4%BA%AB%E5%86%85%E5%AD%98)
[匯流排](https://zh.m.wikipedia.org/zh-tw/%E6%80%BB%E7%BA%BF)