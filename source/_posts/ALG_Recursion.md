---
title: 資料結構與演算法-4-Recursion
tags:
  - Algorithms
  - Backend
  - Recursion
  - CallStack
date: 2023-01-05 20:17:11
---
## 前言
![圖 1](https://i.imgur.com/BrLP6VO.png)  
> pic from [AlogDaily](https://algodaily.com/categories/recursion)
遞迴(Recursion)是一個說起來可以很簡單但實際用起來很難的東西。

有多少的機會我們會用到它呢？XD

<!-- more -->
## 限制與運用
非常簡略說起來，我們可以說地回的定義就是: 某個函數呼叫他自己(Something calling itself)。但如果單純如此，那就會變成無限迴圈了是嗎？所以通常Recursion會包括一個目標條件，英文直翻是基底條件(Base case)，當遞迴完成目標條件後即會返回一個結果。

如果從JS的call stack 來看，當我們執行遞迴的時候，若沒有到達目標條件時會不斷產生新的函式，直到最後一個函式抵達目標條件時return，接著回到倒數第二個，持續執行直到抵達目標條件時return回到倒數第三個，以此類推。

我個人覺得遞迴最好的應用思路是樹狀圖的流程，像是檔案系統，一個資料夾裡會有幾個次要資料夾，每個次要資料夾又有多少的資料夾呢？當然或許可以用別的方式處理這個流程，比如每進入一層資料夾就先計算數量，並紀錄，直到抵達最底，但這樣會讓程式變得複雜，使用遞迴會讓這樣的過程大大簡化。

很多的指令都會有--recursive的參數，像是前陣子剛好用到aws s3 cp的指令，讓你可以透過指令下載資料夾下所有的檔案。

另外遞迴最大的缺點就在於對於記憶體的使用，這也是剛剛前面提到JS call stack的原因，如果你的base case太難達到，最後可能就會造成memory超過最大限制而導致錯誤。

## 實作
課程中提到兩個案例：

1. base: foo case
2. advance: path resolver

### Part I - foo case
```js
function foo(n) {
  // base case
  if (n === 1) return 1;

  return n + foo(n - 1);
}

console.log(foo(3)) // 6
```

可以理解他如何使用遞迴，但通常都會有一個困惑，有必要嗎？
如果我們想計算n + n-1 + n-2 + ... + 1會怎麼做？
就算我們不知道公式好了，用for迴圈都比用遞迴來的直觀多了？

```js
function bar(n) {
  let sum = 0;
  for (let i = 1; i <= n; i++) {
    sum += i;
  }

  return sum;
}
```

事實上這個例子太簡單理解到實在不需要使用遞迴來處理。

所以講師提到了，可以用for、while迴圈思考的東西基本上都是不需要遞迴的。

### Part II - path solver
這邊要先描述問題，這邊有個以String[]畫成的迷宮，我們需要寫出一個可以告訴我們如何從Start通過迷宮，順利從End離開的「路徑」。

迷宮範例:
```js
const maze = 
[
  '######S#',
  '#      #',
  '#E######',
];
```

因為我們的目標是「走」，於是我們首先來分析「不再走」(base case)的條件：

1. 離開地圖
2. 撞牆(#)
3. 去過重複的地方
4. 抵達終點(E)

接著我們知道在一個點只有4個方向可以移動: 上下左右，這就是遞迴條件(recursive case)。

來寫看看~~~
```js
const directs = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],
]

/**
 * 移動
 * @param {String[]} maze 迷宮
 * @param {String} wall 牆壁的符號
 * @param {Point} curr 現在點，一個包含x, y內容的object
 * @param {Point} end 終點，一個包含x, y內容的object
 * @param {Boolean[][]} seen 像是maze的結構，只不過是boolean[][]版本
 * @param {Point[]} path 路徑
 * @returns {Boolean} isEnd 離開此層函式本身也等於不再走，所以我們並不會使用return 決定是否要走。
 */
function walk(maze, wall, curr, end, seen, path) {
  // base case: 順序不影響
  if (curr.x < 0 || curr.x >= maze[0].length || curr.y < 0 || curr.y >= maze.length) {
    return false;
  }

  if (maze[curr.y][curr.x] === wall) {
    return false;
  }

  if (curr.x === end.x && curr.y === end.y) {
    return true;
  }

  if (seen[curr.y][curr.x]) {
    return false;
  }

  // note: recursive case 通常可解構為三個部分
  // 1. 進入遞迴前(pre recurse)
  seen[curr.y][curr.x] = true;   // 將走過的路紀錄為已走過
  path.push(curr)                // 等於紀錄這次的前進 

  // 2. 遞迴(recurse)
  for (const direct of directs) {
    const [x, y] = direct;
    const newCurr = { x: curr.x + x, y: curr.y + y };

    if (walk(maze, wall, newCurr, end, seen, path)) return true;
  }

  // 3. 結束遞迴後(post recurse)
  path.pop()                     // 退回一步; ex: [{3, 1}, {3, 2}] => [{3, 1}]

  return false;
}

// actual solver
const maze =
  [
    '######S#',
    '#      #',
    '#E######',
  ];

function getMazePath(maze, wall, start, end) {
  const path = [];
  const seen = Array.from({ length: maze.length }, () => Array.from({ length: maze[0].length }).fill(false));


  walk(maze, wall, start, end, seen, path);

  return path
}

const path = getMazePath(maze, '#', { x: 6, y: 0 }, { x: 1, y: 2 });

console.log('===path===', path)
```

內容大致如此了~
相關的知識點備註、補充也都寫在comment上了。
## 小結
「Always think about base case」 - ThePrimeagen

大概是這堂課中最重要的部分，當我們在思考如何使用或是分析一個遞迴的時候，先找base case會是理解他的有效途徑。

此文章同步發表於[部落格](https://tim80411.github.io/code-blog/)，歡迎來逛逛～

## 參考資料
[The Last Algorithms Course You'll Need](https://frontendmasters.com/courses/algorithms/)