---
title: 資料結構與演算法-2-Queue And Stack
tags:
  - Algorithms
  - Backend
  - Queue
  - Stack
date: 2022-12-25 22:15:06
---
## 前言
![圖 1](https://i.imgur.com/MGEaiZz.png)  
Queue簡單的說法就是一個FIFO(First In First Out)的結構，Stack則是一個LIFO(Last In First Out)的結構，今天會以基於LL的方式來聊一下～

<!-- more -->
## 介面
```js
class Node {
  constructor(value) {
    this.value = value,
    this.next = null;
  }
}

class Queue {
  constructor() {}

  enqueue(value) {} // 加入資料
  dequeue() {}      // 移除queue中最早加入的
  peak() {}
}

class Stack {
  constructor() {}

  push(value) {}    // 加入資料
  pop() {}          // 移除stack中最晚加入的
  peak() {}
}
```

## 限制與運用
在queue和stack中，因為插入和刪除都是固定的步驟，不會因為包含的節點數量導致不同的步驟，於是這兩者都是O(1)的時間複雜度，而讀取及搜尋因為不得不沿著節點一路檢查，所以都是O(n)的時間複雜度。

運用的話，JS語言本身就包含這兩種資料結構：task queue, call stack。

因為JS本身是單執行緒的語言，所以一個process在運行的時候會由一個call stack控制目前要執行的程式碼
比如說:
```js
function inner() {
  console.log('===inner===')
}

function middle() {
  inner()
}

function outside() {
  middle()
}

outside()
```

程式執行依序是 outside => middle => inner 一層層疊加上去，直到inner結束後，回到middle，最後回到outside，也就是stack的LIFO。

至於Task Queue，就是JS將非同步的東西交給別人做之後，那些執行完的部分會去「排隊」，等著一個個回到call stack繼續執行。

## 實作
```js
class Node {
  constructor(value) {
    this.value = value,
    this.next = null;     // 用於queue
    this.prev = null;     // 用於stack
  }
}

/**
 * 學習心得: 當屬性可能超過臨界值需要注意, 比如length介於0~Infinity, 見dequeue
 */
class Queue {
  constructor() {
    this.head = this.tail = null;
    this.length = 0;
  }

  enqueue(value) {
    this.length++;
    const node = new Node(value)
    if (!this.tail) {
      this.head = this.tail = node;
      return;
    }

    this.tail.next = node;
    this.tail = node;
  }

  dequeue() {
    this.length = Math.max(0, this.length - 1);
    const removedHead = this.head;
    if (!removedHead) return null;

    this.head = this.head.next;
    removedHead.next = null;
    return removedHead.value;
  }

  peak() {
    return this.head?.value;
  }
}

/**
 * 學習心得1: 自由控制屬性，不用按照已經固定的概念，見next及prev實作
 * 這裡相對複雜一些，他的結構會像是O <= O <= O，並且一路由左向右增加
 */
class Stack {
  constructor() {
    this.tail = null;
    this.length = 0;
  }

  push(value) {
    this.length++;
    const node = new Node(value);
    if (!this.tail) {
      this.tail = node;
      return;
    }

    node.prev = this.tail;
    this.tail = node;
  }

  pop() {
    this.length = Math.max(0, this.length - 1);
    const removedTail = this.tail;
    if (!removedTail) return null;

    this.tail = removedTail.prev;
    removedTail.prev = null;
    return removedTail.value;
  }

  peak() {
    return this.tail?.value;
  }
}
```


## 小結
在上課的時候，講師在講Queue和Stack的時候是接續在LL(Linked List)之後，於是我那時候自然而然覺得Queue和Stacked就是一種Linked List的延伸，但在寫筆記文章的時候，突然在想，這件事情是必然的嗎？難道不能是以Array為底嗎？這一點在筆記到Array及ArrayList的時候會說得更清楚些，不過答案是肯定的，不是因為這是定理，而是因為這樣比較適合。

什麼是適合呢？適合是指盡可能在特定情境下保持最大的效率，也就是O(1)的時間複雜度。

就好像上面在寫Stack的時候，我使用prev取代next，原因為何呢？也是因為這樣比較適合，我們換個角度想，如果使用next，當我們在pop的時候，會因為不知道tail前一個資料是什麼，不得不透過head一路探查，導致在刪除的時候得先有一個O(n)的操作。
而使用tail + prev，就可以免除上面的問題，甚至不需要head的存在。

此文章同步發表於[部落格](https://tim80411.github.io/code-blog/)，歡迎來逛逛～

## 參考資料
[The Last Algorithms Course You'll Need](https://frontendmasters.com/courses/algorithms/)
[Stacks And Queues](https://gohighbrow.com/stacks-and-queues/)
