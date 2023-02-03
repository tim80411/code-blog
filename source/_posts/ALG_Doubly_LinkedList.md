---
title: 資料結構與演算法-6-ALG_Doubly_LinkedList
tags:
  - Algorithms
  - Backend
  - Doubly LinkedList
date: 2023-01-24 22:47:04
---
## 前言
![圖 1](https://i.imgur.com/zVM1EcY.png)  

跟著講師的進度，這次要嘗試實作doubly linkedList，所謂的doubly linkedList，如上圖所示，就是每個節點都具有兩個指標，分別指向prev, next。

<!-- more -->
## 介面
根據講師的說法，他主要是參考java的介面
```js
class Node {
  constructor(value) {
    this.value = value;
    this.prev = this.next = undefined;
  }
}

class DoublyLinkedList {
  constructor() {
    this.head = this.tail = undefined;
    this.length = 0;
  }

  prepend(value) { }
  insertAt(value, index) { }
  append(value) { }
  remove(value) { }
  removeAt(index) { }
  removeAt() { }
  get(index) { }
}
```
## 限制與運用
doubly linkedList 最大的好處應該是該節點有機會「返回」前一個節點做需要的處理，連結相對於single強上不少。

但相對應的問題就是，節點的資料(指標)佔用相對於single是兩倍之多。

另外在處理插入及刪除節點的複雜度也高出不少。
## 實作
這邊要謹記兩個原則：

1. 記得維護list length
2. 先建立(attach)指標、後刪除(break)指標

```js
class Node {
  constructor(value) {
    this.value = value;
    this.prev = this.next = undefined;
  }
}

class DoublyLinkedList {
  constructor() {
    this.head = this.tail = undefined;
    this.length = 0;
  }

  // 插入最前面(head)
  prepend(value) {
    this.length++;
    const node = new Node(value);

    // 這裡要小心~很容易忘記edge case
    if (!this.head) {
      this.head = this.tail = node;
      return;
    }

    node.next = this.head;
    this.head.prev = node;
    this.head = node;
  }

  // 插入到指定index之前
  insertAt(value, index) {
    if (index > this.length) {
      throw new Error('index bigger than list length');
    }

    if (index === this.length) {
      return this.append(value);
    } else if (index === 0) {
      return this.prepend(value);
    }

    this.length++

    // 遍歷至index; 使用this.get重構
    let curr = this.#getAt(index);
    const node = new Node(value);
    node.next = curr;
    node.prev = curr.prev;
    curr.prev = node;

    if (node.prev) {
      node.prev.next = node;
    }
  }

  // 插入到最尾端(tail)
  append(value) {
    this.length++;
    const node = new Node(value);
    if (!this.head) {
      this.head = this.tail = node;
      return;
    }


    node.prev = this.tail;
    this.tail.next = node;
    this.tail = node;
  }

  // 刪除List中的特定值
  remove(value) {
    let curr = this.head;
    for (let i = 0; i < this.length && curr; i++) {
      if (curr.value === value) break;
      curr = curr.next;
    }

    // 如果沒有此值(一開始就是空List)或找不到，等同於不用刪除
    if (!curr) return;

    // 如果能找到搜尋成功，且刪除後的length等於0，代表此List被刪除光了。
    return this.#removeNode(curr);
  }

  // 刪除指定index的值
  removeAt(index) {
    const node = this.#getAt(index);

    if (!node) {
      return undefined;
    }

    return this.#removeNode(node);
  }

  // 取得指定index的值
  get(index) {
    return this.#getAt(index)?.value;
  }

  // 取得指定index的node
  #getAt(index) {
    let curr = this.head;
    for (let i = 0; i < index && curr; i++) {
      curr = curr.next;
    }
    return curr;
  }

  // 刪除指定node
  #removeNode(node) {
    this.length--;
    const out = node?.value;
    if (this.length === 0) {
      this.head = this.tail = undefined;
      return out;
    }

    if (node.prev) {
      node.prev.next = node?.next;
    }

    if (node.next) {
      node.next.prev = node?.prev;
    }

    if (node === this.head) {
      this.head = node.next;
    }
    if (node === this.tail) {
      this.tail = node.prev;
    }
    node.prev = node.next = undefined;
    return out;
  }
}
```

## 小結
一樣給自己幾個提醒:
1. 注意length的維護
2. 操作的順序很重要: 先attach後delete
3. 記得自己寫的時候很容易出錯忘記細節XD

這章拖了好久，因為要實作的東西太多了好懶QQ但總算是生出來了！！！

此文章同步發表於[部落格](https://tim80411.github.io/code-blog/)，歡迎來逛逛～

## 參考資料
[The Last Algorithms Course You'll Need](https://frontendmasters.com/courses/algorithms/)