---
title: Unix的標準-POSIX Basics
tags: ['鐵人賽', 'OS', 'POSIX', 'UNIX']
date: 2022-09-28 12:36:32
---
## 前言
POSIX到底是什麼神秘的東西呢?老實說，在roadMap提到這個單字前，我是真的完全不知道他是什麼XD

其實他就是一種interface的標準，為了要讓作業系統之間的相容性提高，所以符合POSIX的應用程式都會有一個重要的特性是:
> 應該要能與其他符合POSIX標準的作業系統相容

於是今天會講到一些歷史，並提到關於POSIX具有移植性的一些原因。

<!-- more -->

## 定義
有人說他的全稱是Portable Operating System Interface，並且最後加上X代表Unix，不過官方似乎也沒針對名字的全稱給出解釋。
他是由IEEE制定的，並且符合此標準的應用程式應該具有如前言所說的特性。

也因為這樣，在Linux及類Unix系統上多數工具的行為會幾乎相同。
這邊為什麼會將Linux與Unix分開說呢?
因為Linux雖然是根據大部分的POSIX的標準實現的，但他是從頭開發的，所以根本上他並不與Unix有實質的關聯。

## 歷史小故事
Unix在1974年由貝爾實驗室對外發布，自此開始出現了多個版本，並也有Unix廠商試圖加上一些不相容的特性來讓系統與其他有所區隔。
而後，為了提高相容性及應用程式的可移植性，IEEE開始著手將Unix的開發標準化，後由Richard Stallman命名為"POSIX"。

## 可移植性
這邊會談到為什麼遵循POSIX就代表具有可移植性。
基本上作業系統有兩種方式可以跟硬體溝通:
1. system call
2. library function

### system call
由作業系統提供給Process的溝通介面，因為是由作業系統直接提供的，所以不同的作業系統他們所提供的system call介面可能不同。

### library function
作業系統會提供另一種方式，將很多過程封裝成一些常用的函式，比如說，一個寫入的函式可能包含很多記憶體、硬碟的操作。
而所謂的符合POSIX其實就是指:
> 這些函式需要輸入的參數、型別、回傳值等都符合POSIX要求的規範

根據下圖你就能看到事實上其實一個function可能封裝了system call在其中，那這樣可以帶來什麼好處呢?
![](https://i.imgur.com/FGJlGxm.png)

### 使用library function的好處
1. 節省成本: 會這樣說的原因，需要回到前幾天談過的Kernel mode，當我們使用system call的時候其實會經過mode的轉換，這其實需要一些成本，我們可能會接著問，那library也會使用system call不會嗎?當然會，所以我們的角度會變成，盡可能在進入kernel mode時完成大部分的system call。
2. 可移植: 回到原本談得移植性，當我們的Program是用符合POSIX標準的library與硬體溝通時，這代表這段程式碼可以被直接搬到一樣符合標準的系統，就算這些不同的library內部實現這些介面的方式不同，但這並不是開發人員在乎的事情。不過如果是直接使用system call呢?假如兩邊使用的參數或甚至名稱不同，那段就要經過檢查後重寫...

## 小結
這次的學習解答了為什麼我們在Linux或是其他類Unix的系統上所使用的script大部分都無法搬到windows上使用XD
而且通過資料，也看到windows從windows NT原本也期望符合POSIX，但最終放棄，他目前是改為面對開發人員，推出了wsl(Windows Subsystem for Linux)。

到今天為止總算在OS overview的部分告一段落了，後面幾天開始就是DB的一些overview囉!
明天見~~

本文章同步發布於[部落格](https://tim80411.github.io/code-blog/2022/09/28/OS_POSIX_Basics/)，歡迎來逛逛~

## 後話
閒聊一下，我在寫這天的內容時，使用的正是wsl2，一般而言他還是蠻好用的，他讓我們可以在windows有好用的GUI基礎上，可以透過vscode或是terminal實現類似在linux上開發的感受，我個人覺得是可行的。
不過今天也出現問題，在複製照片想貼進md文件時出現了錯誤，看來是在同步剪貼簿時對於照片的轉換出現了問題...

## 參考資料
[A Guide to POSIX](https://www.baeldung.com/linux/posix)
[What exactly is POSIX?](https://unix.stackexchange.com/questions/11983/what-exactly-is-posix/220877#220877)
[posix是什麼都不知道，還好意思說你懂Linux](https://zhuanlan.zhihu.com/p/392588996)