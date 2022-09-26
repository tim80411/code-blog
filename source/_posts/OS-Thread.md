---
title: 行程(Process)、執行緒(thread)傻傻分不清楚(中)-執行緒管理
date: 2022-09-24 00:40:37+08:00
tags: ['鐵人賽', 'OS', 'Thread', 'Process']
---

## 前言
行程是CPU分配資源的最小單位，以後還會聊到，甚至就連docker的container在run的時候就是一個process，很有趣吧，就來稍微認識一下~

<!-- more -->

## 行程架構

![](https://i.imgur.com/DlIreU0.png)
> 引用自 https://www.guru99.com/process-management-pcb.html

此圖大致代表Process在記憶體裡的結構，

- Stack: 暫時性資料，例如Function Parameters、Local variables
- Heap: 執行程式碼所需要的動態工作區
- Data: 儲存全域變數等
- Text: 程式碼所在

## 行程生命週期
![](https://i.imgur.com/KgOOxn6.png "")
> 引用自 https://medium.com/@akhandmishra/operating-system-process-and-process-management-108d83e8ce60

共有五種狀態

| 狀態           | 說明                                                                                                   |
| -------------- | :----------------------------------------------------------------------------------------------------- |
| new創建        | 初始狀態，分配及建立PCB以及其他資源，在完成上述工作後進入ready                                         |
| ready就緒      | 在隊列按照CPU Scheduling的演算法等待搶奪CPU以完成工作                                                  |
| running工作    | 一旦搶奪到CPU，此狀態會被設置為工作中，並執行應用程式中的指令。在與ready狀態切換時，會作Context Switch |
| waiting等待    | 如果因為事件或是IO速度的差異導致等待，就會停在此                                                       |
| terminated終止 | 完成執行、被迫結束(比如在硬性即時系統)或者遇到錯誤時就會進入此狀態                                     |


## Process Control Block, PCB
記錄行程相關狀態資訊的資料區，每個行程都有自己的一個，並在Process創建時被建立。
其內容包含:

| 項目                           | 內容                                                                                                                     |
| :----------------------------- | :----------------------------------------------------------------------------------------------------------------------- |
| 行程狀態process state          | 流程生命週期的狀態                                                                                                       |
| 程式計數器process counter      | 紀錄下一個要執行的指令的位址                                                                                             |
| CPU暫存器保存區                | 不在running state時，CPU暫存器內容會被保存在此                                                                           |
| 排班資訊                       | 例如行程優先等級(priority)等排班時所需要的參數                                                                           |
| 記憶體資訊                     | 其內容根據記憶體系統的種類而定                                                                                           |
| 帳號資訊Accounting Information | process所屬的使用者帳號(user id)、行程代號(process identification)、時間限制、已經使用掉的處理機時間、進入系統之實際時間 |
| IO狀態資訊                     | 如所配置之輸出入裝置串列、開啟(Opened)之檔案串列等資訊                                                                   |

大部分資訊由參考資料2來的，並統整了其他資料的內容，所以更詳細可以看參考資料2。

## Process Create
在OS內，Process可以建立child process，因此所有的排程可以組成一個樹狀結構。

如果你手邊有linux系統的話，可以使用 `pstree -aup` 看到在你的電腦裡的process的樹狀圖。

![](https://i.imgur.com/Mjv8Wl7.png)

如上圖，甚至可以知道我是在zsh之下執行的這個指令XD

大部分的OS會支援兩種Process Create的方式
- Fork: 複製父行程的PCB到子PCB
- Exec: 替換子行程的資料，初始化新的PCB資料

所以建立新的Process就是兩者混用，先Fork一個子行程後，再Exec初始化子行程。

文章同步更新在[個人部落格](https://tim80411.github.io/code-blog/2022/09/24/OS-Thread/)歡迎逛逛~


## 參考資料
[Operating System: Process and Process Management](https://medium.com/@akhandmishra/operating-system-process-and-process-management-108d83e8ce60)
[PCB](https://chenhh.gitbooks.io/parallel_processing/content/process.html)
[程序(process)概念--上](https://ithelp.ithome.com.tw/articles/10202866)
[Process Creation](https://www.tutorialspoint.com/inter_process_communication/inter_process_communication_process_creation_termination.htm)
[Process](https://ithelp.ithome.com.tw/articles/10276152?sc=rss.iron)