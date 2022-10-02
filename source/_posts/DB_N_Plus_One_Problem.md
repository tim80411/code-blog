---
title: 效能危機-N+1 problems
tags:
  - 鐵人賽
  - Backend
  - N+1 Problems
  - RDBMS
date: 2022-10-02 17:06:08
---
## 前言
有個好故事可以回答什麼是N+1 problems: 
> 假如有一天你拿到一份食譜，希望製作蘋果派，你待在廚房裡，食材都在儲藏室，你需要去拿:
> 1. 你需要蘋果，於是你去了一趟儲藏室。
> 2. 你需要糖，於是你是去了一趟儲藏室。
> 3. 你需要麵粉，於是你去了一趟儲藏室，然後你發現今天已經快過完了XD

<!-- more -->

## 定義
你一定在吐槽，不能一次看完，然後再一起從儲藏室把食材拿回來嗎？
沒錯，這麼麻煩的部分就是N+1 problems提到的，我們現在改用描述現象的方式解釋N+1 problems：
> 在查詢主資料時，為了取得有與主資料有關連的資料，重複的查詢相同資料。

用SQL來表示一下:
```SQL
SELECT * FROM 'Recipes' WHERE Recipes.id = '1' -- 取得食譜1的資料
SELECT * FROM 'Foods' WHERE Foods.id = '1' -- 取得食材1的資料
SELECT * FROM 'Foods' WHERE Foods.id = '2' -- 取得食材2的資料
SELECT * FROM 'Foods' WHERE Foods.id = '3' -- 取得食材3的資料
SELECT * FROM 'Foods' WHERE Foods.id = '4' -- 取得食材4的資料
-- 以此類推N個，看取得食譜1時包含多少個Foods需要被查詢
```

## 錯誤發生的原因
先總結的話，可以說是在使用關聯式資料庫且在應用程式層沒有處理好搜尋造成的錯誤。
不過實際狀況，常發生在使用ORM不當的狀況下。

以node.js搭配sequelize這個SQL的ORM來操作SQL為例:
```javascript
(async ()=> {
  // 省略了sequelize的設定、對Recipe及Food的引入。
  const recipes = await Recipe.findAll({id: 1}); // 取得食譜1的資料
  const foods = [];
  for (const recipe of recipes) { // 取得n次食材的資料
    const foodId = recipe.foodId;
    const food = await Foods.findOne({id: foodId});
    foods.push(food)
  }
})()
```
正因為關聯式資料庫的資料並未存在單獨的table身上，可能僅是存了FK在db，為了透過FK取得其他table的資料。
就使用了迴圈一一收集資料，造成了n+1 problems。

## 解決方式
如果熟悉SQL，其實要解決這樣的問題倒是蠻容易的。
```SQL
SELECT * FROM Recipes 
INNER JOIN Foods on Recipes.food_id = Foods.id
WHERE Recipes.id = 1
```
也就是直接透過JOIN將資料做成一個新的table，而後續的query都直接使用此新的table，就沒有重複搜尋資料的問題了。

在sequelize這裏，我們可以參考[官方文件](https://sequelize.org/docs/v6/advanced-association-concepts/eager-loading/)
> As briefly mentioned in the associations guide, eager Loading is the act of querying data of several models at once (one 'main' model and one or more associated models). At the SQL level, this is a query with one or more joins.

如果是在node.js透過Sequelize提供的includes介面，我們也可以完成JOIN
```javascript
(async ()=> {
  // 省略了sequelize的設定、對Recipe及Food的引入。
  const recipes = await Recipe.findAll({
    where: {
      id: 1,
    },
    includes: {
      model: Food
    }
  }); // 取得id=1的Recipe以及他所關聯到的食材Food
})()
```

## eager loading & lazy loading
這邊會提到的是，ORM如何處理關聯的兩種概念。
注意，這邊強調概念是有原因的，我們後面看下去:
- eager loading: 一開始就透過較大的查詢取得所有內容，包括關聯資料
- lazy loading: 僅在確實需要時才取得關聯資料

會強調概念，指的是各個ORM實現這個概念的技術並不一定相同。
以Sequelize而言--[官方範例](https://demopark.github.io/sequelize-docs-Zh-CN/core-concepts/assocs.html):
```javascript
// lazy loading
const awesomeCaptain = await Captain.findOne({
  where: {
    name: "Jack Sparrow"
  }
});
console.log('Name:', awesomeCaptain.name);
console.log('Skill Level:', awesomeCaptain.skillLevel);
// getShip即為Sequelize實現lazy loading的方式，他會被自動加入Captain實例中。
const hisShip = await awesomeCaptain.getShip();

// eager loading
const awesomeCaptain = await Captain.findOne({
  where: {
    name: "Jack Sparrow"
  },
  // include為Sequelize實現的方式
  include: Ship
});
```
Sequelize的實現方式:
lazy loading是透過他提供的getInstance()介面，多做一次query並將資料對應到之上；而eager loading，則是在搜尋的時候，就直接使用JOIN建立新的table以供搜尋。

## 不一樣的實現方式
以Laravel的Eloquent而言，他在eager loading其實是採用多次query而非JOIN的方式。
如果將他的方式寫成SQL發生的query，大概會是
```SQL
SELECT * FROM Captain WHERE Captain.name = 'Jack Sparrow'
SELECT * FROM Ship WHERE Ship.id IN ['1', '2', '3'] -- 看有幾艘船
```
然後透過ORM把兩次query資料組合給應用程式。

根據了解，這樣雖然可能會相對於JOIN來的慢，但他的好處可能包括:
- 關聯式資料庫與非關聯式資料庫的關係可以透過這樣的分離較容易實現。
- 對於Paginator有利

詳情可以在閱讀參考資料～
我認為對於eager loading 及lazy loading是以一個概念或技術的角度去理解，並了解不同的ORM如何實現。
有助於我們思考如何針對情境使用更有利的方式做搜尋～

## 小結
這個單元有比較多程式碼，同時也對於eager loading 及 lazy loading在不同的ORM有不同的實現有了一些認識！
而且從這裡的概念也可以知道，其實無論是什麼資料庫，若資料AB間具有一對多關係，若想同時取得資料，就需要預防撰寫程式時發生N+1 problems。

今天就這樣啦，明天就要進到有關於API的部分囉

此文章同步發表於[部落格](https://tim80411.github.io/code-blog/)，歡迎來逛逛～

## 參考資料
[Understanding and fixing N+1 query](https://medium.com/doctolib/understanding-and-fixing-n-1-query-30623109fe89)
[What is the "N+1 selects problem" in ORM (Object-Relational Mapping)?](https://stackoverflow.com/questions/97197/what-is-the-n1-selects-problem-in-orm-object-relational-mapping)
[Why can't Laravel/Eloquent use JOIN for Eager Loading?](https://stackoverflow.com/questions/23920540/why-cant-laravel-eloquent-use-join-for-eager-loading)