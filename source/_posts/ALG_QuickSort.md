---
title: 資料結構與演算法-5-ALG_QuickSort
tags:
  - Algorithms
  - Backend
  - QuickSort
date: 2023-01-19 20:25:24
---
## 前言
Quick Sort跟Merge Sort很常被拿出來一起談，兩者在最佳狀況時都能達到O(nlogn)的時間複雜度，不過這次主要談的Quick Sort在特定情境下最糟也有可能達到如同Bubble Sort一樣的O(n^2)，不過因為他實作相對容易，且佔用的資源沒有Merge Sort來的多，且要遇到最糟的狀況也是非常極端的，所以還是很常被使用的～

另外也是因為用Recursion就可以簡單實作，所以接在Recursion後面真的是太適合了XD

<!-- more -->
## 說明
Quick Sort用的是一種Divide And Conquer(分治)的方式，意思是指，我們將一個問題拆成多個更小的問題各自處理，而相對更小的問題可以在各自拆成更更小的問題...以此類推，直到遇到問題變成很簡單為止。

Quick Sort的原理就是 Array ==排序==> 兩個次Array ==排序==> 四個次次Array...直到某次有個小Array的元素只剩下1(很簡單的問題)，我們就認定可以停在這裡等同於排列完成，或是換一種說法表示不再需要排列了。

所以關鍵在於兩個地方:
- 取得拆分pivot(中軸)
- 重複排序

通常有個最簡單的寫法也就是後面實作會這樣做的:
1. 該次排序時將陣列最右邊的元素視作pivot(中軸)
2. 兩個cursor會從陣列最左邊出發，其中一個cursor A(以下簡稱A)會開始遍歷整個該段Array，而cursor B會停留在原地。
3. A遍歷時會檢查遇到的元素是否**小於等於**pivot，若是的話就將A所在的元素與B所在的元素做更換，接著B向右前進一格
4. 當遍歷結束時，將pivot(最右邊的元素)插入到B所在位置的右邊
5. 這時候所有pivot左邊的元素全都會**小於等於**pivot，而pivot右邊的元素則都會**大於**pivot
6. 然後這時候以pivot為界就可以分成兩個次陣列
7. 兩個此陣列重複1-6(recursion)

## 實際展示
接下來為了增進了解，會按照上面的步驟實際用Array在排序中的變化來展示。

- 首先，有一個需要被排序的陣列資料
```js
[8, 7, 1, 9, 5]
```

- 該次排序時將陣列最右邊的元素視作pivot(中軸) 
```js
// 此時5被視為中軸
[8, 7, 1, 9, 5] 
```

- 兩個cursor會從陣列最左邊出發，其中一個cursor A(以下簡稱A)會開始遍歷整個該段Array，而cursor B會停留在原地。
- A遍歷時會檢查遇到的元素是否**小於等於**pivot，若是的話就將A所在的元素與B所在的元素做更換，接著B向右前進一格 
```js
// A跟B先停留在元素[0]也就是8上
[8, 7, 1, 9, 5]
// B停留在[0]，A開始遍歷
[8, 7, 1, 9, 5]
// A先檢查[0]也就是8，大於5，於是繼續往右至[1]
[8, 7, 1, 9, 5]
// 7比5大，於是繼續移動至[2]
[8, 7, 1, 9, 5]
// 1小於等於5，於是將[2]於[0]做swap，且指摽B向右前進至[1]
[1, 7, 8, 9, 5]
// 來確認指標位置，這時候B在[1], A在[2]
[1, 7, 8, 9, 5]
// A繼續完成遍歷，此時來到[3]，9大於5，不做動作，遍歷結束
[1, 7, 8, 9, 5]

```

- 當遍歷結束時，將pivot(最右邊的元素)插入到B所在位置的右邊
- 這時候所有pivot左邊的元素全都會**小於等於**pivot，而pivot右邊的元素則都會**大於**pivot
```js
// 當遍歷結束時，將pivot和B所在的位置做swap
[1, 5, 8, 9, 7]
```

- 然後這時候以pivot為界就可以分成兩個次陣列
- 兩個此陣列重複1-6(recursion)
```js
// 將原pivot(5)的左右分為兩個次陣列
// 重複上面的排序步驟直到完成排序
[1, 5, 8, 9, 7]
[1, 5, 7, 8, 9]
[1, 5 ,7, 8, 9]
// 大致如上
```

這邊有個別人分享的影片會比用文字這樣的陣列變化來的更為清楚，雖然他用的策略是比較不一樣的，但概念還是相同啦
[影片](https://www.youtube.com/watch?v=AsQW27DT82I&ab_channel=loyiCodes)

## 實作
```js
class QuickSort {
  /**
   * @param {Number} hi 
   * @param {Number} low 
   * @param {Number[]}} arr 
   * @returns {Number} index of pivot
   */
  static #partition(hi, low, arr) {
    // 方便起見將最大值設為pivot;
    const pivot = arr[hi];

    let cursorB = low - 1;
    // 指標1遍歷此次陣列
    for (let cursorA = low; cursorA < hi; cursorA++) {
      if (arr[cursorA] > pivot) continue;

      // 如果遍歷時小於等於pivot
      // 指標2向右移動1
      cursorB++;

      // swap 指標1及指標2
      const temp = arr[cursorA];
      arr[cursorA] = arr[cursorB];
      arr[cursorB] = temp;
    }

    // 繼續向移動一個位子，確保pivot在交換過後，其右邊的element一定大於pivot
    cursorB++
    arr[hi] = arr[cursorB];
    arr[cursorB] = pivot;

    return cursorB;
  }

  static #qs(hi, low, arr) {
    // base case
    if (low >= hi) return;

    // recursion
    const pivotIndex = this.#partition(hi, low, arr);

    this.#qs(pivotIndex - 1, low, arr);
    this.#qs(hi, pivotIndex + 1, arr)
  }

  static qs(arr) {
    // 個人習慣不改變輸入，而是產生新輸入，但會因此產生新成本
    const arrCopy = [...arr];
    this.#qs(arrCopy.length - 1, 0, arrCopy);
    return arrCopy
  }
}
```

## 小結
覺得quick sort很有意思！！！當初想出來的人頭腦也太好了吧～～～

我覺得這裡在實作時困難的地方是我要怎麼知道如何設計recursion的參數會讓程式更漂亮，一開始寫怎麼會知道要用對外的qs包著對內qs及partition，甚至recurse的function也不是partition而是qs；另外也包括cursorB從low - 1開始也是讓程式更為簡潔的一些關鍵。

再次提醒自己沒有這樣的直覺或是邏輯思考就是我與高手之間的差距，不能因為自己跟著課程學到了寫法就當作自己已經完全會了。

此文章同步發表於[部落格](https://tim80411.github.io/code-blog/)，歡迎來逛逛～

## 參考資料
[The Last Algorithms Course You'll Need](https://frontendmasters.com/courses/algorithms/)