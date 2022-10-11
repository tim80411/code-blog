---
title: 跟著設計原則走，好維護阿自然有(單押)-設計模式software design principle
tags:
  - 鐵人賽
  - Backend
  - Design Principle
  - SOLID
  - KISS
  - YAGNI
  - DRY
date: 2022-10-11 18:55:40
---
## 前言
今天會聊一下設計原則，包括為什麼我們需要設計原則，以及常見的設計原則。

強調是原則而不是模式，是因為我們並不會進到細節去討論類似工廠模式、策略模式等~

<!-- more -->

## 什麼是原則?
在聊常見的設計原則前，我們可能會想問知道這樣的程式設計原則能對開發帶來什麼幫助。

根據之前聽過Will保哥分享的，知道原則可以:
- 依循原則寫出較好的程式碼
- 聞到程式碼的壞味道

另外原則通常都是來自於前人的錯誤經驗總結而來，所以盡可能實踐原則也可以讓程式碼相對強健、具有維護性。

接下來介紹一些常見的原則。
## SOLID
是一個有關於物件導向設計的五個原則。

原則間的關係
![圖 18](https://i.imgur.com/RauIFL9.png)

其中包含
### Single Responsibility, SRP:

他的定義是每個模組都只應該因為一個原因而被修改。

舉個實際的例子不知道會不會更清楚一點，有沒有看過一個大型事務機，影印、傳真、列印都有的那種，當你是這樣所有功能都整合在一個機器(模組)裡面時，如果設計不好，比如說共用了同一個軟體，結果一個軟體壞了，導致三個功能都無法使用了。

當然你可能會問那拆越細越好嗎?事實上也不一定，因為你拆越細能共用的部分就越少了，比如以上面的例子來看，那是不是個別每個功能都要使用自己的軟體去處理呢?會不會導致成本上升呢?所以最通用的說法是看需求XD

詳細的不會介紹到這麼多，有興趣的話歡迎再看一下[參考資料](https://medium.com/coding-book-club/solid-srp-2470578f0191)

### OCP

> You should be able to extend the behavior of a system without having to modify that system.

這個原則要求程式碼的撰寫，在擴充他的行為時不應該修改到系統。

這個概念最常見的實例是什麼?Google Chrome Extension、webpack。

我把固定的介面封裝起來，所有要擴充的新功能完全不會影響到原本已經穩定運作的功能。

### LSP

> If S is a subtype of T, then objects of type T may be replaced with objects of type S without altering any of the desirable properties of the program (correctness, task performed, etc.)
> 翻譯: 如果類別S是類別T的subType，程式碼中的類別T的物件，都可以被一個類別S的物件給取代，而且程式碼還運作正常。

就算翻譯了還是複雜XD

意思是說，子類別的程式行為應該遵循父類別的設計、約束。

如果實務上來說，我們希望，如果父類別能通過的限制，子類別也應該通過；父類別會錯誤的地方，子類別也應該錯誤，這樣就不會出現令人措手不及的例外。

詳細可看[參考資料](https://medium.com/coding-book-club/liskov-substitution-principle-lsp-liskov-%E6%9B%BF%E6%8F%9B%E5%8E%9F%E5%89%87-3dd1d3a37ede)

### ISP

> No client should be forced to depend on methods it does not use.
> 翻譯: 使用者不應該被強迫依賴他們用不到的介面

有一個我很喜歡的例子是政府表單，假如你去區公所辦事，他們請你填寫表單，所有的服務都使用同一份表單，只是分ABCDE區塊，可能你想辦婚姻相關需要填寫AB，辦福利可能要ACD區塊，是不是很麻煩還很容易填錯?

這樣的全能介面就是ISP希望解決的，為了避免的問題包括
- 關注點分離
- 模組之間因為沒有分割清楚導致誤用


### DIP
> 1.High-level modules should not depend on low-level modules. Both should depend on abstractions.
> 2.Abstractions should not depend on details. Details should depend on abstractions.
> 翻譯: 高階模租不應該依賴低階模組，兩者皆須要依賴抽象層；抽象層不應該依賴實作，實作應該應賴抽象層

前面的圖片有提到，其實DIP幫助實現了OCP，這是什麼意思呢?

舉例來說，今天有A牌的冷氣跟遙控器，看起來冷氣提供了功能告訴我們怎麼操控她，比如說cold()、hot()，所以冷氣是遙控器的底層。

如果哪天某間工廠冷氣改了命令他的方式，cold => freeze，那這樣所有遙控器都要被修改發出的指令了，這就是高階依賴低階。

那該怎麼做呢?

我們為了避免這樣改底層壞掉高層的狀況，所以我們訂一個命令對照表，要求所有的冷氣都要按照 cold(), hot(), wind()的方式實作底下的功能，而該牌所有的遙控器都按照這個方式呼叫冷氣，那這樣自然這個廠牌的遙控器都可以通用控制冷氣的這三種功能了，至於這三種功能的細節會不會因為這個有所差異，也可以隨著不同機種的狀況自行處理，我們只是統一介面。

## KISS
是Keep It Simple, Stupid的首字母簡寫。

這裡的stupid通常被解釋成易於理解，用程式碼維護的過程來說，指的就是你的程式碼應該能被輕鬆理解。

## DRY
是Don’t repeat yourself的首字母簡寫。

字面上很單純就是避免重複的意思，在The Pragmatic Programmer書中將DRY分成四種:
### 強制重複(Imposed duplication)
所謂的強加，是指開發人員認為必要，但其實並不必要的重複，比如說對於程式碼的註解有沒有可能從命名就可以減少註解數量?

這部分的討論一直以來都有很多派說法，我個人的經驗是: 註解那些商業邏輯，但盡量不註解程式邏輯，因為商業邏輯你會忘掉，有些部分可能會影響程式刻意沒有效率，但程式邏輯應該盡可能以程式本身呈現。

### 無意的重複(Inadvertent duplication)

開發者並未注意到某些邏輯可以避免重複。

引入一個例子
```js
// from https://shawnlin0201.github.io/Methodology/Methodology-001-DRY-principle/
function Cube(length, width, height, volumn) {
  this.length = length
  this.width = width
  this.height = height
  this.volumn = volumn
}

Cube.prototype.getVolumn = function () {
  console.log(this.volumn)
}

let sixCMcube = new Cube(6,6,6)
sixCMcube.getVolumn()
```

我個人的經驗是會造成這種重複的原因是來自忽略了邏輯的前提，以上面的程式碼為例，忽略自己在寫的立方體的定義前提。

### 缺乏耐心的重複(Impatient duplication)

是一個對於copy and paste的常用建議。

在開發的時候，對於功能類似的部分，我們可能會選擇從其他類似功能將程式碼貼過來用，但卻懶得將裡面的重複項去做整合。

記得曾經聽過Ruddy老師的演講是說，最大的技術債來自於妳現場就發現卻未處理的部分。

### 開發者間的重複(Inter-developer  duplication)
共同開發時常發生的問題，對於彼此所開發的程式碼並不熟悉，導致相同功能的程式碼被重複撰寫並各自引用。

## YAGNI

有那麼多的原則，總算要來個平衡他們的部分了。

這個原則叫做You aren’t gonna need it，我個人的翻譯是要注意時態，所以是: 你現在還不需要它。

為什麼說他是其他原則的平衡呢?

不管是什麼設計原則，都需要注意過度設計(over-designed)，特別是像DRY、SRP等維持高聚合的原則，我們需要這個原則澆個冷水，停下來再想想。

不過大部分的時候，我們為什麼會過度設計是有邏輯: 我們覺得現在把這個功能建立起來比未來建立來的成本低。

因此它提供了一些思考方向，包括:
- 構思尚不存在的需求所花費的成本 v.s. 專注開發產生的效益
- 增加尚不存在的新功能所導致的維護複雜性

特別推薦這篇[文章](https://martinfowler.com/bliki/Yagni.htmlA)

他提到了Over designed導致的成本有哪些
![圖 19](https://i.imgur.com/DjsX6n5.png)  

並提到一個結論是:
YAGNI適用在假定需求的功能，但不適用在讓程式更易於維護的努力。

## 小結
不管是哪一種原則，我認為都應該跟實務經驗結合去思考他如何在開發過程中去使用他。

透過對照自己的經驗、自我反駁、重新理解，我認為是內化這些原則的最好方法。

為了寫出更好的程式，共勉之~~~~

此文章同步發表於[部落格](https://tim80411.github.io/code-blog/)，歡迎來逛逛～

## 參考資料
[A Solid Guide to SOLID Principles](https://www.baeldung.com/solid-principles)
[使人瘋狂的 SOLID 原則：開放封閉原則 (Open-Closed Principle)](https://medium.com/@ChunYeung/%E4%BD%BF%E4%BA%BA%E7%98%8B%E7%8B%82%E7%9A%84-solid-%E5%8E%9F%E5%89%87-%E9%96%8B%E6%94%BE%E5%B0%81%E9%96%89%E5%8E%9F%E5%89%87-open-closed-principle-f7eaf921eb9c)
[程式設計心法 避免重複原則（DRY principle）](https://shawnlin0201.github.io/Methodology/Methodology-001-DRY-principle/)