---
title: 行程(Process)、執行緒(thread)傻傻分不清楚(下)-並發(concurrency)
tags: ['鐵人賽', 'OS', 'Concurrency', 'Thread', 'Process']
date: 2022-09-25 00:40:37+08:00
---

## 前言
並發Concurrency也是一個常在開發中聽到的名詞，他跟並行Parallel有什麼差別呢?他能夠給系統帶來什麼好處?又有什麼風險需要注意?我們常聽到js是個單執行緒的語言，這又是什麼意思?node.js是單執行緒嗎?

這就是今天會希望解答的問題，那就開始吧~

<!-- more -->

## Concurrency vs Parallel
雖然我們今天的主題談的是Concurrency(並發)，但通常會與Parallel(並行)作個比較。

![](https://i.imgur.com/kPV2fk8.png)

這是我在找資料學習時最喜歡的一張圖，我覺得他比較正確的視覺化Concurrency及Parallel的定義及關係。
邊對照圖片，我們邊看這兩者的定義

- Concurrency: 多件事可以在一段時間內同時進行
- Parallel: 有多件事可以在一個時間點同時進行

看起來很像對吧，雖然兩邊都是講同時，但他們對於時間的粒度不太相同，我覺得用排除法去想這件事情比較容易:
> 當我們在判斷現在是什麼狀況時，先看**某一個瞬間**可不可以有多個任務同時進行，有的話那就是Parallel；若否，再看**一段時間軸**內可不可以有多件事情同時進行，那就是Concurrency。

這也是圖片說的，如果一個系統內可以作到Parallel，那他必定也是Concurrency。
另外從圖裡面的CPU的表示也能看到，一般而言(註1)一個CPU同時只能被分配給一個thread，在這個狀況下，只有多CPU的狀況才能出現Parallel，這也是為什麼今天我們只先討論Concurrency。

註1: 除非今天CPU支援Hyper-threading(超執行緒)。

## Multi process, Multi thread 都擠?
根據Concurrency的定義其實我們可以有兩種Concurrency的方法，一個是多執行緒，一個是多行程，他們都會有多個執行緒讓CPU得以分配時間在他們身上。
不過如果你有從昨天一路看下來，就會發現，多行程是一個非常大的成本花費，我們也可以有一個結論，基本上除非你希望資源被隔離得很徹底，不然在Concurrency上，我們應該盡可能使用多執行緒去作Concurrency。

這邊就有一個例子，大部分的web server在接受到新的request時，是不用等待前面的請求結束對吧?一般而言，都是建立thread去處理請求而非process，然後結束時就立刻把thread terminate。

再來我們試著用反例想想，如果我們是以建立process的方式來處理多請求同時出現會發生什麼狀況?
第一可能會在建立process就花一點時間，當處理完請求後，又會遇到一個難題是要不要把Process砍掉，如果砍掉下次建立又要花時間，但是不砍掉，他會霸佔部分記憶體資源無法使用，如果有某個請求需要超過原本的記憶體大小，就可能造成memory leak。

當然也有使用多Process的例子，根據這篇資料:
> Google had to decide how to handle that separation of tasks. They chose to run each browser window in Chrome as a separate process rather than a thread or many threads, as is common with other browsers.
> -- [What’s the Diff: Programs, Processes, and Threads](https://www.backblaze.com/blog/whats-the-diff-programs-processes-and-threads/)

Google決定選擇使用多進程的原因可以在內文詳看，但他們認為這可以減少最終對於記憶體的使用。

## 並發的好處
於是我們可以來整理一下，使用並發的好處包括有什麼呢?(無論Process或是Thread)

- 性能提升: 能夠做到並發的系統，多個Process在運行時的總時間 <=(註1) 順序運行Process的總時間。
- 多程式應付可能: 透過CPU scheduling可以讓系統體感像是多個程式在同時進行一樣。
- 資源利用: 減少CPU閒置。

額外補充，若使用多Thread相對多Process處理並發的好處有什麼呢: 
- Parallel的可能性: 我們前面談的是單核心處理多Thread的狀況，但如果假使是在一個多Processor(多核心、單核心超執行緒...等等)的架構中，經過規劃的多執行緒程式可以在一個時間點同時進行多個Thread的工作，讓並行得以發生。
- 專業化: 我們可以把工作分門別類產生多個Thread去處理特定工作，甚至可以管理Thread，像是可以去管理Thread的優先層級。
- 高效: 前面也提到過，Thread相對Process，建立成本低、資料分享容易、資源利用度高，這都是相對多Process高效的原因。


註1: 假如這邊範例中的多個process都僅需要CPU運算，因為沒有速率差異導致的閒置問題，那執行併發跟順序執行，總時間都會相同。


## 並發的風險
除了好處，事實上多執行緒有許多因為共用資源等特性產生的風險需要在開發時顧慮:
- 競爭race condition: 
正因為共用資料，當出現I/O或其他不可控的時間或順序事情時，有可能導致順序依賴的錯誤。
例如: 有個變數x = 3，兩個共用資源的程式可能有兩個操作 x = x + 2, x = x + 3，結果意外出現5或6，但原本預期最後結果要是8，想像這如果是你的存款XD
而且這樣的錯誤又相當難以追蹤，因為並沒有相關錯誤訊息~

- 死鎖dead lock:
當一個Process在等待其他Process釋放手上的資源時。
比如P1需要P0手上的disk資源，但此時P0因為讓出CPU給P1，以至於兩者都無法完成工作。

- 飢餓starvation:
當一個Process因為一直被剝奪完成工作需要的資源。
比如因為優先權演算法，P0因為其他優先權更高的Process不斷出現而遲遲拿不到CPU運算。

他們最大的差異，死鎖是除非有額外的機制處理，不然兩者是永遠無法完成工作的；而飢餓則是有機會完成工作，只是不知道什麼時候才會完成。

## User Thread vs Kernel Thread
並發的內容看起來結束了，但看到這邊還有一長段你就會知道還沒有XD
事實上，大部分的操作系統為了介入一般應用程式及管理他們，他們會使用一個叫做Kernel的程式。
而這個Kernel也影響了多執行緒行程如何與操作系統工作，由此出現了user thread及kernel thread這兩個概念。
我覺得有個更好稱呼他們的方式是user-level thread及kernel-level thread。

於是在比較他們之前我們需要先了解什麼是Kernel及mode。

### Kernel 是什麼?
所以究竟Kernel是什麼，他產生thread的原因是什麼呢?

![](https://upload.wikimedia.org/wikipedia/commons/8/8f/Kernel_Layout.svg)
他其實也是一個系統中的一個具有足夠優先權限的Process，負責處理其他Process與硬體之間的溝通。
需要他的原因在於與硬體溝通是相當複雜的，他提供了介面讓硬體操作被抽象化。

> 嚴格地說，核心並不是電腦系統中必要的組成部分。有些程式可以直接地被調入電腦中執行；這樣的設計，說明了設計者不希望提供任何硬體抽象和作業系統的支援
> -- [維基百科](https://zh.wikipedia.org/zh-tw/%E5%86%85%E6%A0%B8)

Kernel會在其他任何Process被載入，讓操作系統得以介入每個Process，這個介入就是讓User-level Thread與Kernel-level Thread綁定在一起。
而當User-level Thread需要與硬體溝通，他就會先與Kernel-level Thread溝通，

### Kernel Mode vs User Mode
我把他理解成是兩種不同的權限，為什麼需要兩種特權呢?

> 為了避免一個使用者的程式修改其他使用者的程式甚至是系統核心， 並且更進一步，讓作業系統可以壟斷所有的硬體資源，大部分的機器(或者 CPU)至少會有二個執行特權(privilege)：Kernel mode (又稱 System mode) 與 User mode。
> -- [Kernel Mode 與 User Mode 的概念](https://medicineyeh.wordpress.com/2015/02/10/kernel-mode-%E8%88%87-user-mode-%E7%9A%84%E6%A6%82%E5%BF%B5/)

既然知道這兩者模式的差異，那又跟Kernel有什麼關係呢?
> Kernel mode is the CPU's "natural" mode, with no restrictions (on x86 CPUS - "ring 0"). User mode (on x86 CPUs - "ring 3") is when the CPU is instructed to trigger an interrupt whenever certain instructions are used or whenever some memory locations are accessed. This allows the kernel to have the CPU execute specific kernel code when the user tries to access kernel memory or memory representing I/O ports or hardware memory such as the GPU's frame buffer.
> -- [Difference between Kernel, Kernel-Thread and User-Thread](https://stackoverflow.com/questions/57160637/difference-between-kernel-kernel-thread-and-user-thread)

大概意思是，在程式要求執行一些動作時，若他不具有特定權限，Kernel也能夠去要求CPU執行一些相對的Kernel code去中斷目前的Process。
這樣讓開發者少掉維護或檢查影響到其他的程式的壓力跟錯誤。

如果是web後端，用最優先的middleware來理解Kernel是不是會容易些?

### User Thread / User-level Thread
擁有user mode權限的thread，透過特定介面的library建立的，OS並不知道他們的存在，但在要工作時，會mapping到Kernel thread上。
特性: 
- 產生、管理的成本低
- 舉例像是: POSIX Pthreads, Win32 threads, Java threads

### Kernel Thread / Kernel-level Thread
僅運行kernel code且與user space(memory) process毫無關聯的Thread。
並且我們知道thread一定在process之中，而Kernel thread就是Kernel這個Process產生出來的thread
- CPU能查覺到存在的其實是Kernel-level Thread，而非mapping於他的User-level Thread。
- 舉例像是: Windows 2000(NT), Solaris, Linux 


## 多執行緒模式
由上，我們會知道，所以在user mode的Process要操作到硬體的部分是需要經過kernel thread。
而這個對映的方式稱為mapping，mapping的方式共有三種:

- 多對一
- 一對一
- 多對多

### 多對一
![](https://i.imgur.com/Sd5bMmQ.png)
- 定義: 多個User-level Thread mapping到一個Kernel-level Thread
- 優點:
    - Thread管理在user space(memory)完成，效率高
- 缺點:
    - 整個process可能會因為其中一個user thread發出的指令而導致block。
    - 因為OS僅察覺到一個kernel thread，如果在一個以thread數量平分cpu使用使間的系統中，他的單位仍是一。
    - 只有一個thread可以訪問kernel，就算是多processor的環境也無法平行。

### 一對一
![](https://i.imgur.com/IxbwdDb.png)
- 定義: 一個User-level Thread mapping到一個Kernel-level Thread
- 例子: Linux, Windows XP/NT/2000
- 優點:
    - 所有多對一的缺點的相反。
- 缺點:
    - 產生一個thread時就同時產生kernel thread，負擔較高
    - 所有的操作都會進行system call，要進行前者的動作，需要將權限改為kernel mode，而這是一個昂貴的操作

### 一對多
![](https://i.imgur.com/SHSoik1.png)
- 定義: 多個User-level Thread mapping到多個Kernel-level Thread
- 優點:
    - 可在多Processor系統中平行執行。
    - 某個thread被block後可安排其他kernel thread執行
- 缺點:
    - 需要user thread 管理器與 kernel thread 管理器支援這種協調。


## node.js的有趣事實
關於node.js，他究竟是不是單執行緒的runtime呢?
他像是，但其實並不是的。
他一共有7個執行緒，包括1個執行JS的主執行緒、4個node.js執行緒、2個V8執行緒。

### 調查多執行緒的事實
要證明這件事情其實意外的容易:
1. 先做一個可以永久執行的node.js，例如web server或是無限while迴圈之類的
2. 取得PID
```
ps | grep node
```
3. 查看執行緒
```
top -H -p <PID>
# -H可以顯示行程中的執行緒
# -P指定特定PID
```

你就可以看到7個執行緒了
不過4個node.js的執行緒其實只會做I/O相關的工作，如果遇到CPU密集的工作，其實還是會發生JS主執行緒阻塞而導致整個Process阻塞的狀況。

### worker-threads module
node.js v12開始支援worker-threads，於是剛剛提到的CPU密集型的工作就可以透過模組建立新的thread去承接這個工作。
詳細有興趣的人可以去[](https://www.digitalocean.com/community/tutorials/how-to-use-multithreading-in-node-js)跟著教學一起玩一下，蠻有意思的喔!

### cluster module
cluster則是支援建立主Process的child processes，而官方的資料也確實提到，若沒有隔離行程的必要，就使用worker-threads代替。
> Clusters of Node.js processes can be used to run multiple instances of Node.js that can distribute workloads among their application threads. When process isolation is not needed, use the worker_threads module instead, which allows running multiple application threads within a single Node.js instance.
> [node.js](https://nodejs.org/api/cluster.html)

不過根據官方文件以及在實務上看到cluster的用法，cluster更像是一種負載平衡的機制，worker-threads則可以用來應付CPU密集的工作，所以我覺得完全有可能混用他們!

也確實有stackoverflow的回答這樣認為~
> Which is better? It depends on the problem you're solving. Worker threads are for long-running functions. Clustering makes a server able to handle more requests, by handling them in parallel. You can use both if you need to: have each nodejs cluster process use a worker thread for long-running functions.
> [When is better using clustering or worker_threads?](https://stackoverflow.com/questions/61328960/when-is-better-using-clustering-or-worker-threads)

## 小結
雖然寫的辛苦，但總算對於Program、Process、Thread有了更進一步的了解。
而且回過頭來，我覺得這樣我在使用一些與Thread以及Process相關的功能時也能更有把握些。
想起第一次面試時，當時考官就問我node.js是否是單執行緒這個問題，結果直到今天我才有辦法稍稍好一點的回答這個問題XD

## 後話
發現我用了一些中文單字其實是有中、台兩種說法的，參照[此篇](https://oldmo860617.medium.com/%E9%80%B2%E7%A8%8B-%E7%B7%9A%E7%A8%8B-%E5%8D%94%E7%A8%8B-%E5%82%BB%E5%82%BB%E5%88%86%E5%BE%97%E6%B8%85%E6%A5%9A-a09b95bd68dd)特意列出，避免混淆。
* concurrent:
    * 台灣：並行
    * 大陸：並發
* parallel:
    * 台灣：平行
    * 大陸：並行

## 參考資料
[PPT in Operating system](https://ithelp.ithome.com.tw/articles/10280394)
[Thread](https://www.kshuang.xyz/doku.php/operating_system:course_concept:thread)
[作業系統 CH4 Multithreaded Programming](https://hackmd.io/@Chang-Chia-Chi/OS-CH4)
[Difference between user-level and kernel-supported threads?](https://stackoverflow.com/questions/15983872/difference-between-user-level-and-kernel-supported-threads)
[Difference between Kernel, Kernel-Thread and User-Thread](https://stackoverflow.com/questions/57160637/difference-between-kernel-kernel-thread-and-user-thread)
[核心](https://zh.wikipedia.org/zh-tw/%E5%86%85%E6%A0%B8)
[Kernel Mode 與 User Mode 的概念](https://medicineyeh.wordpress.com/2015/02/10/kernel-mode-%E8%88%87-user-mode-%E7%9A%84%E6%A6%82%E5%BF%B5/)
[Operating System: Threads and Concurrency](https://medium.com/@akhandmishra/operating-system-threads-and-concurrency-aec2036b90f8)
[https://www.digitalocean.com/community/tutorials/how-to-use-multithreading-in-node-js](https://www.digitalocean.com/community/tutorials/how-to-use-multithreading-in-node-js)
[Improving Node.js Application Performance With Clustering](https://blog.appsignal.com/2021/02/03/improving-node-application-performance-with-clustering.html)