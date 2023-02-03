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

module.exports = DoublyLinkedList;