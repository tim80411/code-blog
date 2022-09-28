---
title: 作業系統(Operating System/OS) Overview(上)
tags:
  - 鐵人賽
  - Backend
  - OS
  - CPU Scheduling
date: 2022-09-21 12:08:02
---
## 前言
從今天開始進入OS一般知識的範圍，透過了解我們正運行中的程式(Process)在OS如何運作的過程及相關知識，包含I/O, Thread, Memory...等，可以進一步優化程式。

稍微具體舉個例子來說，以node.js來說，作為單執行緒(thread)的執行環境，若一下出現大量的使用者情求時會是什麼狀況呢，如果已經在工作的人，你可以想像辦公室明明有很多人，但電話只跑到你這裡，你頂多叫他們做點事情幫忙，但最終還是你一個人處理所有的電話...情何以堪XD

為了解決這個問題，因此有了pm2套件、原生的cluster及worker threads，他們各自有不同的問題解決邏輯，或許通過這段時間的鑽研我們可以稍微探討這些差異。

我個人是蠻期待這部分的學習，那，就開始今天的OS overview吧。

<!-- more -->

## 定義
> 一組主管並控制電腦操作、運用和執行硬體、軟體資源和提供公共服務來組織使用者互動的相互關聯的系統軟體程式。 -- [維基百科](https://zh.wikipedia.org/zh-tw/%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F)

這邊我用我的方式來理解作業系統是: 提供易於操作的介面，讓程式開發者/使用者可以用更簡單直覺的方式操作硬體。

## 用途
於是，作業系統的用途包含但可能不限於以下:
1. 控制及管理硬體資源
2. 提供使用者介面
3. 程式的錯誤預防

根據需求情境及使用者對象，其考量而產生的作業系統型態可能會完全不一樣，比如說，家用個人電腦的目標是讓使用者更方便的使用系統，所以可能會更在意GUI(圖形化介面)的方便性；而伺服器的目標是資源的隔離性及使用率最佳化，可能面向的對象多是開發者，其介面可能僅會使用CLI(文字命令介面)。

## 作業系統與硬體的互動
一般來說會分成使用者(User)及應用程式(Program)透過OS與硬體互動，使用者通過OS的命令直譯器(Command Interpreter)與硬體互動，而當使用者在操作應用程式時，應用程式會對OS做系統呼叫(System Call)，進而與硬體層溝通，完成使用者指定的操作。

## 名詞解釋
在進入後面一般系統種類介紹前，也想先對幾個名詞作概要的解釋，會對於後面的內容有比較好的理解。

### CPU Scheduling(Short-term Scheduling)
最早期的系統其實是單純的順序，意思是指，CPU會按照程式的執行順序，依序把工作完成，其中常有造成CPU珍貴的運算資源被閒置的狀況，像是程式設計錯誤，或是因為硬體的速度不一，導致CPU等待其他工作完成...等等。

因此為了得到最大的CPU使用率，會藉由適當的排班演算法，先CPU處理該process(CPU Burst)，接著做I/O資料的傳送(I/O Burst)，process會在這兩個狀態一直循環，最後在工作完成後呼叫一個終止Process的System Call作為結束。

這可以說是後面的系統類別在設計時的核心之一，目標式在確保CPU使用率的狀況下，作出最符合當前系統情境的需求的決策。

### Context Switching
CPU使用權轉移時，需要儲存舊的Process資訊，載入新Process資訊，這個工作就稱之為Context Switching。


## 小結
內容遠比我想得來的多了，不得已之好分成兩天完成來完成了XD
明天會開始介紹作業系統的種類。


## 參考資料
[Node Cluster 讓你的 Thread 不再孤軍奮戰](https://ithelp.ithome.com.tw/articles/10232695)
[Different between cluster and worker thread](https://stackoverflow.com/questions/56656498/how-do-cluster-and-worker-threads-work-in-node-js)
[作業系統簡介](https://www.youtube.com/watch?v=Cl0uql06KK0&ab_channel=%E3%80%90%E6%9D%B0%E5%93%A5%E6%95%B8%E4%BD%8D%E6%95%99%E5%AE%A4%E3%80%91)
[CPU Scheduling](https://ithelp.ithome.com.tw/articles/10203990)