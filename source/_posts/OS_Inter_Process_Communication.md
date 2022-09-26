---
title: 行程間通訊(Inter Process Communication)
tags: ['鐵人賽', 'IPC', 'OS']
date: 2022-09-26 14:55:37
---
## 前言
在系統內，Process或是Thread若需要與其他合作，就須要有溝通的方式，而溝通的原因包括資料分享需要、模組...等等，這些就被稱為行程間通訊。

<!-- more -->

## 定義
多個 process/thread 內部要去溝通，都統稱叫做 IPC。

關於這點我曾經有點困惑，為什麼Thread之間的溝通也被稱為行程間通訊，我個人給他的解釋是，因為Thread本身也可以算是一個Process，只是跟其他同Process的Thread共享了部分記憶體空間。

~~不過說不定只是那時候的人取錯名字了?~~

## 情境需要
- 資訊分享: node.js經過cluster產生的child process和main process需要溝通。
- 加速運算: Parallel
- 模組化
- 方便

## 類別
- Shared Memory
- Message Passing

## Shared Memory
共享記憶體以進行通訊，使用時不需要kernel。
不過若是兩個Process之間想要使用這個方式進行通訊會因為需要額外建立共享的memeory區塊而發出system call了。

## Message Passing
要實現這個通訊方式，必須包含
- 溝通方法: send & receive
- 溝通管道

在有些資料中，雖然會將IPC分為更多類，不過我最後根據[inter-process-communication-ipc](https://www.geeksforgeeks.org/inter-process-communication-ipc/)這份資料，認為理解他們的方式應視為在討論Message Passing實踐時的相異之處。

其中包括討論:
- 溝通管道如何被建立?
通常會討論是直接通訊Direct Communication或是間接通訊Indirect Communication。
- 一個管道是否可以與兩個以上的Process有關?
- Process與Process之間可以有多少管道?
- 管道的容量有多少?可容納的訊息是固定還是可變的
- 管道是雙向還是單向的

## 小結
看了資料後才發現其實IPC蠻靠近我們的
包括我們在shell裡面常用的pipe
```
find a | xargs grep 'something'
```
因為每個指令是一個process，前指令在將結果傳給後指令接收時使用的就是IPC。

另外瀏覽器請求server的通信也是。
不過IPC的細節實在太燒腦了，差點寫不完只好先停在這裡，若之後真的有機會再回頭來更新吧。

## 參考資料
<!-- Tanenbaum & Bos 的Modern Operating Systems -->
[IPC (Interprocess Communication)](https://hackmd.io/@YiZjennnnn/OS_Note/https%3A%2F%2Fhackmd.io%2F%40YiZjennnnn%2Fipc_interprocess_communication?type=book)
[inter-process-communication-ip](https://www.geeksforgeeks.org/inter-process-communication-ipc/)