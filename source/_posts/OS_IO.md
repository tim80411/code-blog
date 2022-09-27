---
title: 電腦與外界的通訊方式-輸入/輸出(I/O)管理
tags: ['鐵人賽', 'OS', 'I/O']
date: 2022-09-27 21:24:21
---
## 前言
許多Process的執行除了依賴CPU的運算及Memory的儲存，也依賴於其他設備，其中一部分專門用於接受使用者輸入及引導輸出的設備，被稱為I/O設備，I/O就是input及output的簡稱。

透過今天的內容，會稍微了解IO管理的設計，以及是透過什麼方式整合IO設備與CPU的溝通。

<!-- more -->

## IO管理的目標
- 易用: 方便用戶使用
- 效率: 提高系統的併發工作能力
- 防錯: 增加設備的可靠及安全性

## IO流程
當系統發出指令需要執行IO功能時的流程是什麼呢?
我後來發現先大概看一下流程有個全觀的認識，後面了解起來會比較清楚。

以下資料來自[Day-17 I/O運作](https://ithelp.ithome.com.tw/articles/10274340?sc=iThelpR)

| 流程 | 動作                                                                     |
| :--- | :----------------------------------------------------------------------- |
| 1    | User process發出I/O request給OS                                          |
| 2    | OS收到請求，可能暫停此process執行，並執行相對應的system calls。          |
| 3    | kernel的I/O-subsystem會pass此請求給**Device driver**。                   |
| 4    | Device driver依此請求設定對應的I/O commands參數給**Device Controller**。 |
| 5    | Device Controller啟動，監督I/O-Device之I/O運作進行。                     |
| 6    | 在此時，OS可能將CPU切給另外一個process執行。                             |
| 7    | 後續步驟根據**IO控制方式**。                                             |

後面在介紹各個粗體的字詞後，我覺得對IO就會有個基本的認識了

## 控制器Registers
為了達到模組化及通用，一般會將IO區分為機械、電子兩個部分，機械通常是IO設備功能本體，而電子的部分會是用來連接系統的一塊主機板，稱作。

![](https://i.imgur.com/UJtbyjM.png)
控制器包含三個重要的部分:
- Command Register: 存放CPU所呼叫的命令，讓CPU控制裝置。
- Status Register: 存放CPU傳來的狀態資訊，讓CPU了解裝置狀態。
- Data Register: 存放預備輸入或輸出的資料

透過這三個控制器，操作系統簡化了開發不同設備的介面，有點像是操作系統預先設定好幾個標準介面要求IO設備去符合他們，好處是操作系統開發起來省力，並且可以提高設備的擴充性。

換個角度想就是，如果各家IO設備都有自己的API要求系統去處理，一是會累死系統開發人員，二是這樣就要等到系統支援才有辦法讓IO設備被系統使用。

## IO控制
我自己是根據CPU介入的程度來分為以下4種:
1. Process直接控制
2. Polling I/O
3. Interrputed I/O
4. DMA I/O

### Process直接控制
直接由Process控制IO，優點是簡單易實現，缺點就是在IO傳輸時，CPU也被迫閒置等待。

### Polling I/O
CPU 發出命令去執行IO功能後，在執行其他Process時會在完成指令週期時去輪詢polling裝置控制器確認是否完成。

因為CPU會有polling的成本，等於擠壓到執行Process的時間，適合Device執行速度的狀況，不然每次執行週期可能會需要輪詢過多device。

### Interrputed I/O
CPU 發出命令去執行IO功能後，IO會在執行完畢後發出中斷指令，系統一樣在完成指令週期時做檢查，不管變成僅檢查中斷指令。

和Polling的差異在IO是否會發出中斷指令，CPU是否能夠處理，若支援這樣的機制，好處是CPU可以減少輪詢時間。

### DMA I/O
透過建立一個直接的數據通路，以及授權讓一個DMA控制器對數據通路有存取的權力，使得CPU自由~~~

控制方式是，CPU在需要IO功能時授權DMA控制器，DMA會自行與IO溝通，並將所有工作完成，並且因為有一個直接的數據通道，DMA連數據傳輸也會處理，否則像Interrputed I/O仍需要由CPU處理數據，並發出中斷命令給CPU，CPU需要參與的部分僅在IO功能的開始及結束。

優點是因為解放CPU，CPU的使用率大幅提升，但因為數據通道直接放在Memory，DMA會跟CPU搶Memory的使用權。

## 硬體驅動程式
除了controller，IO中另外一環重要的部分為device driver。

驅動程式負責理解系統對IO設備發出的指令，並轉化成IO硬體能理解的內容以執行工作。

根據以下這張圖，應該可以更清楚device driver跟device controller之間的關係。

![](https://i.imgur.com/9kvjQpK.png)

剛好回頭對照前面IO功能在執行時的流程圖
system call被呼叫時，指令會透過kernel傳給device driver，在透過device driver將指令轉化成IO controller能理解的形式並傳送過去。

## 小結
今天就這樣啦~
明天會來看看關於Unix的標準-POSIX。

此文章同步發布於[部落格](https://tim80411.github.io/code-blog/2022/09/27/OS_IO/)，歡迎來逛逛喔~

## 參考資料
[IO核心子系統](https://wizardforcel.gitbooks.io/wangdaokaoyan-os/content/23.html)
[IO Management](https://www.omscs-notes.com/operating-systems/io-management/)
[IO運作](https://ithelp.ithome.com.tw/articles/10274340?sc=iThelpR)
[What-is-the-difference-between-device-driver-and-device-controllers](https://www.quora.com/What-is-the-difference-between-device-driver-and-device-controllers)