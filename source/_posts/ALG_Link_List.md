---
title: 資料結構與演算法-1-Linked List
tags:
  - Algorithms
  - Linked List
  - Backend
date: 2022-12-22 19:53:52
---
## 前言
![參考資料2](https://i.imgur.com/FA5ta4p.png)  
講師將Linked List(以下縮寫為LL)稱為node base data structure是蠻有道理，看看上面的圖，每一個節點包含資料本身以及指向另一個資料位置的紀錄。
根據指向的內容，可能有不同稱呼，像是指向next的Single Linked List、既指向next也指向previous的Bio Linked List。

<!-- more -->
## 介面
下面是一個單向的LL的介面
```js
class Node {
  constructor(value) {
    this.value = value;             // 資料本身
    this.next = null;               // 指針
  }
}

class LL {
  constructor() {
    this.head = this.tail = null;
    this.length = 0;
  }

  print() {}
  pop() {}
  insert(value) {}
}
```

## 限制與運用
LL最大的優點在於寫入跟刪除的速度極快，因為是固定的步驟去重新指向，所以時間複雜度是O(1)等級，另外他在儲存上也有一個優勢是可以散亂的儲存，因為有指針的存在，不用連續資料也可以；而LL的缺點在於讀取資料，在讀取資料的時候，因為要跟著指針一個個循序讀取，而隨著資料的變大，他的worst case可能跟著跟著變大，所以時間複雜度是O(n)，另外因為需要額外儲存指向的資料，需要額外花費容量。

而他的所以優缺點剛好都相對於Array，之後到Array時再來多加介紹。

## 實作

```js
class LL {
  constructor() {
    this.head = this.tail = null;
    this.length = 0;
  }

  print() {
    let now = this.head;
    while (now) {
      console.log(now.value);
      now = now.next;
    }
  }

  // 移除LL最後一個節點: 因為是單向LL，所以要找到最後一個節點的前一個只能循序訪問。
  pop() {
    this.length = Math.max(0, this.length - 1);
    if (!this.tail) return undefined;

    let current = this.head;
    const tail = this.tail;
    while (node.next !== tail) {
      current = node.next;
    }

    const prevTailNode = currentNode;
    this.tail = prevTailNode;
    this.tail.next = null;

    return tail;
  }

  // 插入最後一個節點
  insert(value) {
    this.length++;

    const newNode = new Node(value);
    if (!this.tail) {
      this.tail = this.head = newNode;
      return newNode;
    }

    this.tail.next = newNode;
    this.tail = newNode;

    return newNode;
  }
}
```


## 小結
這個系列會來學習資料結構與演算法，並透過撰寫文章整理想法及內化知識，大致會以這樣的架構輸出：前言也就是簡介，聊聊這個資料結構的運用情境、強弱限制、時間複雜度等，最後就會是用javascript實作，特別感謝免費課程The Last Algorithms Course You'll Need，帶給我大量的啟發以及對資結及演算法的興趣。

此文章同步發表於[部落格](https://tim80411.github.io/code-blog/)，歡迎來逛逛～

## 參考資料
[The Last Algorithms Course You'll Need](https://frontendmasters.com/courses/algorithms/)
[What is Linked List](https://www.geeksforgeeks.org/what-is-linked-list/)