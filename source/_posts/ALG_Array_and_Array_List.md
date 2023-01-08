---
title: 資料結構與演算法-3-Array和ArrayList
tags:
  - Algorithms
  - Backend
  - Array
  - ArrayList
date: 2023-01-04 19:09:13
---
## 前言
作為一個JS開發者，我對於JS的「Array」一直都感到非常熟悉。
```js
const arr = [];
```
這樣就是一個Array不是嗎XD？
以前的我也是這麼想的~~反正大家都說他是Array~~。

直到有一天講師說JS的Array不是Array。
這篇筆記會跟著課程稍微深入瞭解一些Array及ArrayList。

於是知道為什麼JS的Array其實更準確的說法是ArrayList！

<!-- more -->
## 限制與運用
這邊因為是底層的部分，所以會用介紹代替實際程式碼。

### Array
![Array](https://i.imgur.com/FLcxHkQ.png)  
> 來自[What is Array](https://www.geeksforgeeks.org/what-is-array/)

- 定義: 一塊固定且連續的記憶體區塊。
- Pros: 這樣的資料結構有什麼好處呢？因為是連續的記憶體位置，所以取值的時候我可以直接根據順序取值，另外也因為資料連續，所以可以做優化的搜尋演算法，像是二分搜尋等等的。
- Cons: 缺點的話像是因為他是固定的連續記憶體區塊，所以資料能接受的最大值是固定的，另外他對於特定的寫入及刪除行為效率很低，比如有一個程式語言的Array結構如上圖，他可以不斷往右延伸直到到達這個連續記憶體所保留的終點，在往右的路上，新增跟刪除都是很容易的，是O(1)；但是，刪除Array中間的資料、新增刪除最左邊的資料(註1)，會導致需要重新整理資料讓他可以保持順序，此時時間複雜度為O(N)。

### ArrayList
![圖 2](https://i.imgur.com/Zigrbnk.png)  

- 定義: 在原本的Array基礎上，獲得新特性：最大長度(capacity)可以變化
- Pros: 相對於原本的Array，通常可變化的最大長度(capacity)是一個封裝的功能，在Capacity達到上限時自動allocation另外的記憶體好將原本的部分複製過去，會讓你省下類似操作所要寫的code。
- Cons: 方便是優點也是缺點，他換來的是效能的落差，當複製的時候至少是O(N)起跳的時間複雜度。

## 實作
事實上看到這邊我們大家就可以知道一個可自由伸縮的Array更應該被定義成ArrayList了。
這邊我會參照課程來寫一個簡單的實驗，來測試看看shift, unshift, push, pop，在`[1, 10, 100, 1000, 10000, 100000, 1000000]`數量的變化。

事情是這樣的，假如JS的Array實際上是一個node based的LinkedList，那其實他可以在這四種行為都獲得O(1)的時間複雜度，意思是不管數量怎麼變化，他應該都是差不多；如果是ArrayList的狀況下push, pop會維持O(1)，shift跟unshift則會隨著長度變化，出現近似於正比的時間增長。

```js
const a = [];

function getPassTime(fn, ...args) {
  const now = Date.now();
  fn(...args);
  return Date.now() - now;
}

function push(a, number) {
  for (let i = 0; i < number; i++) {
    a.push(Math.random());
  }
}

function pop(a, number) {
  for (let i = 0; i < number; i++) {
    a.pop();
  }
}

function unshift(a, number) {
  for (let i = 0; i < number; i++) {
    a.unshift(Math.random());
  }
}

function shift(a, number) {
  for (let i = 0; i < number; i++) {
    a.shift();
  }
}

function get(idx) {
  return function () {
    return a[idx];
  };
}


const tests = [10, 100, 1000, 10000, 100000, 1_000_000, 10_000_000];
console.log("push");
tests.forEach(t => {
  a.length = 0;
  push(a, t);

  console.log(t, getPassTime(push, a, 1000));
});

console.log("pop");
tests.forEach(t => {
  a.length = 0;
  push(a, t);

  console.log(t, getPassTime(pop, a, 1000));
});

console.log("unshift");
tests.forEach(t => {
  a.length = 0;
  push(a, t);

  console.log(t, getPassTime(unshift, a, 1000));
});

console.log("shift");
tests.forEach(t => {
  a.length = 0;
  push(a, t);

  console.log(t, getPassTime(shift, a, 1000));
});
```

最終結果如下圖～～～～
![圖 3](https://i.imgur.com/KaOqbq3.png)  

最終確定JS的Array為ArrayList～～～

## 小結
可喜可賀！！
了解Array有助於知道請盡量避開shift跟unshift使用XD

另外我後來有發現其實在Java就是有直接區分Array及ArrayList的～～～

此文章同步發表於[部落格](https://tim80411.github.io/code-blog/)，歡迎來逛逛～

## 參考資料
[The Last Algorithms Course You'll Need](https://frontendmasters.com/courses/algorithms/)
[What is Array](https://www.geeksforgeeks.org/what-is-array/)
[ArrayList Implementation in Java](javatpoint.com/arraylist-implementation-in-java)