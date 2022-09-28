[![Timothy Liao](https://miro.medium.com/fit/c/96/96/0*ugONj5k-ur7_Rmip)

](https://medium.com/@tim80411?source=post_page-----f9474c383069--------------------------------)[Timothy Liao](https://medium.com/@tim80411?source=post_page-----f9474c383069--------------------------------)Follow

Jul 20

·8 min read

vs code debugger初探 + 特別需求調整
===========================

如果有pm2 及 pino-pretty該怎麼適配於debugger
----------------------------------

> 前言

vscode debugger是vscode的偵錯工具，具有中斷點、變數、監看等方便的功能。

一直以來，遇到bug的時候，我一樣是使用大量的logger(console.log)去檢查變數，並推測可能的錯誤的原因，隨著逐步縮小錯誤原因找到最終的cause，不過這樣常常需要多次步驟才可以找到錯誤來源。

前不久，聽朋友提起使用vscode debugger的體驗，決定來使用看看，希望能夠再增進除錯的效率。

> 需求

基本上就是希望在不影響原先專案上增加對debugger的支援。

因為我已經都實驗過了，所以有發現以下兩個部分在使用上需要因為debugger做出調整。

1.  pino + pino-pretty: pino本身沒什麼問題，但作為prettier的pino-pretty，如果使用pipe的做法( cmd | pino-pretty)會導致debugger無法運行(原因目前不清楚)。
2.  pm2: 我待會會介紹一個vscode提供的js debugger terminal，可以很方便的做debugger，也能用web app，但卻無法用於pm2。

在一般使用後會特別介紹針對這兩個部分怎麼調整～

> 一般使用方式

> 運行debugger

基本上我的理解是，debugger是一個interceptor，就是另外一個程式，他會監聽你原本程式的反應，並記錄變數在debugger上。

基本步驟是點選ctrl(cmd) + shift + d打開debug頁面，並點選建立configuration(組態)，他會自動在.vscode內建立一個launch.json的檔案，並填入預設資料。

```
{  
  "version": "0.2.0",  
  "configurations": \[  
    {  
      "type": "node",  
      "request": "launch",  
      "name": "Launch Program",  
      "skipFiles": \["<node\_internals>/\*\*"\],  
      "program": "${workspaceFolder}\\\\app.js"  
    }  
  \]  
}
```

其中，request成兩個模式，launch跟attach。

Launch
------

launch就是一般先建立debugger之後再運行program，並自動attach到該程式之上。

除此之外也可以使用 `vscode js debugger terminal` 去快速launch一個deubugger，不過官方建議使用launch.json，這樣可以保留每次固定的設定。

Attach
------

那attach呢？

有注意到前面提到其實launch也是一種attach～

所以其實也可以直接使用attach模式去監聽已經存在的port

可以增加一個configuration的設定

```
// configurations  
{  
  "name": "Attach to Process",  
  "type": "node",  
  "request": "attach",  
  "port": 9229  
} 
```
![](https://miro.medium.com/max/1400/1*IbYswMp43hY1Ghnug9rOMw.png)
設定好configuration，name會出現在選單內

> 基本使用

中斷點
---

加上中斷點（圖中的紅點），當程式執行到此處時就會暫停在此。

![](https://miro.medium.com/max/1400/1*tqO520K7iRRU5dB4sooPIw.png)遇到中斷點時的反應

另外的用法是在加上中斷點的地方按右鍵，能夠設定運算式或是叫用次數，讓你決定在什麼情況下中斷。

我想像適合的地方可能是驗證假設、迴圈時觀察特定次數的變數狀況。

根據實驗，他的條件應該是交集(AND)，意思是要每個條件都滿足才會中斷。

![](https://miro.medium.com/max/1400/1*Rl_9ho-twbIfHf5G1Bvtjw.png)這樣子不會中斷

記錄點
---

不過有時候你會遇到一些情境，你不是想看靜止的狀況，你想看的是持續性的變化，那這時候你就會需要記錄點這個東西，你可以把它想像成console.log(value)，你輸入的內容就是那個value，並且placeholder也有提醒想要使用此時存在的變數時可以用 `{variable}`去引用經過記錄點當下的變數資料。

如下圖，程式在經過此行時會輸出 hello 2。

![](https://miro.medium.com/max/1400/1*tYK_7TgES_-ZAJPT2lMCRA.png)示意圖

變數
--

加上中斷點通常就是想看到當程式運行到此處時的變數資訊為何，藉由這些資訊判斷錯誤原因。

所以如圖中的範例，vscode會自動幫你擷取當下那個function當下所有有用上的變數，並列舉在變數區

![](https://miro.medium.com/max/1400/1*6Pv187Muvlp0EWJscOhGYA.png)變數及監看示例

另外你也可以在點選變數區域後，直接輸入你想尋找的值做篩選

![](https://miro.medium.com/max/1400/1*K-DLZw6Y-02XWTdxrLSybw.png)篩選

監看
--

我覺得這裡是最有意思的地方，除了單純把他當成變數讓你專注單一函式以外，也可以直接輸入JS原生method做運算。

![](https://miro.medium.com/max/1400/1*J1LdnCs_bfAoPJ1hhPxpeA.png)可運算的監看區

> 針對pino-pretty的處理

當我們使用官方建議的 `node app.js | pino-pretty`時，看起來是因為經過pipeline導致監聽的process無法正常監聽，既然如此，我們的條件就要變成：

1.  build pino-pretty在程式內部
2.  官方強烈建議prod不要使用pino-pretty

根據官方文件，是有可以在程式內部使用stream的方式輸出log的，最後寫成的方式是這樣，或許有更好的寫法XD

參考資料
----

[

GitHub - pinojs/pino-pretty: 🌲Basic prettifier for Pino log lines
------------------------------------------------------------------

### This module provides a basic ndjson formatter. If an incoming line looks like it could be a log line from an ndjson…

github.com

](https://github.com/pinojs/pino-pretty)

> 針對pm2的處理

這部分需要兩步驟

1.  設定pm2的inspect模式
2.  使用attach主動綁定

首先我們設定pm2的設定檔，當你使用--inspect時，監聽的process預設會監聽到127.0.0.1:9229的位置，你也可以透過--inspect={port}主動設置監聽ip。

pm2 設定檔

接著我們建立一個launch.json的組態

![](https://miro.medium.com/max/1400/1*0kahaSalO2PYYsMKkWJZzg.png)vscode debugger組態

這樣在開啟pm2的process後，你就可以使用vscode debugger並點選attatch to pm2，這樣就會成功監聽並可以開始使用囉。

```
node\_args: \['--inspect'\],},
```

其實是跟著node.js的inspect功能來的～

> 同場加映

> 為什麼launhch.json的port要設定為9229

[

Debug Node.js Apps using Visual Studio Code
-------------------------------------------

### The Visual Studio Code editor includes Node.js debugging support. Set breakpoints, step-in, inspect variables and more.

code.visualstudio.com

](https://code.visualstudio.com/docs/nodejs/nodejs-debugging)

> 關於node.js的--inspect後面發生的事情

[

Debugging - Getting Started | Node.js
-------------------------------------

### This guide will help you get started debugging your Node.js apps and scripts. When started with the --inspect switch, a…

nodejs.org

](https://nodejs.org/en/docs/guides/debugging-getting-started/)

> 後記

有趣的事情是，在試著了解vscode的功能以及大致如何運作時，為了解決冒出來的「為什麼」，無意間讓我對於node.js的測試(inspect)功能是怎麼運作的有了更多認識，算是一個有趣的收穫吧～

> 參考資料

[

Debug application which is run using pm2
----------------------------------------

### pm2 version 3.2.2\] The following would work if you want to attach Vscode with PM2. In the ecosystem file which is…

stackoverflow.com

](https://stackoverflow.com/questions/29900253/debug-application-which-is-run-using-pm2)[

Debugging With PM2 And Vscode
-----------------------------

### Thanks for contributing an answer to Stack Overflow! Please be sure to answer the question. Provide details and share…

stackoverflow.com

](https://stackoverflow.com/questions/57002100/debugging-with-pm2-and-vscode)[

Debugging in Visual Studio Code
-------------------------------

### One of the great things in Visual Studio Code is debugging support. Set breakpoints, step-in, inspect variables and…

code.visualstudio.com

](https://code.visualstudio.com/docs/editor/debugging#_launch-versus-attach-configurations)
