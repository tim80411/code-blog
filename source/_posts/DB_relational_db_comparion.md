---
title: DB relational db comparison
date: 2022-09-29 12:39:03
tags: ['鐵人賽', 'RDBMS', 'RDB', 'SQL']
---
## 前言
開始進入DB的範圍，DB目前分兩類，SQL及No SQL，No SQL並不真的算是一種種類，他比較算是集合，所以兩者的意思說起來應該是:
> SQL DB跟那些不是SQL的DB

SQL也就是今天要聊的relational DB到底有什麼了不起的地方，竟然讓除了他以外的DB都被分成一類。
這就是好像有天有人跟你說，這世界上的飲料只分成烏弄跟不是烏弄得一樣XD

另外其實SQL裡面也分了很多不同的DB，那他們有什麼樣相同的特性，讓他們既是不同的DB卻被通稱為SQL DB呢?
我們今天也會稍微看看他們彼此的特色~

## 什麼是關聯式資料庫relational db(RDB)?
> 關聯資料庫 (RDB) 是在資料表、資料列和資料欄中建構資訊的方式。RDB 可透過彙整資料表來建立資訊之間的關聯或關係，以便輕鬆瞭解各資料點之間的關係並取得深入分析。
> -- [Google](https://cloud.google.com/learn/what-is-a-relational-database)

relational db將資料整合成行row跟欄column，多個row會集合成一個表table，多個table就會組成一個db。
table通常都會設定一個主鍵primary key(PK)的欄位代表該row，就好像一個大學裡面的學號一樣，每個人都不會重複。
table之間在需要存在類似資料時會以其他table的PK作為代表，稱為外鍵foreign key(FK)，就好比今天有入學文件，文件有文件的編號，文件上會寫著學生的學號。
透過PK和FK可以表現table之間的關係，以剛剛舉例，一個學生可能同時有很多份文件，每分文件只屬於一個學生，那學生與文件的關係就是一對多。

通常關聯式資料庫也代表他具有交易(事務)特性，具有這樣的特性代表他可以具有一個最小的執行單位稱為「交易」(Transaction)，在這個交易可能包含多個對資料庫操作的行為，並且這個交易是全有全無的。

另外relational db manager system(RDBMS)指的是管理RDB的系統，可以把他理解成是RDB的介面~

## 什麼是SQL?
SQL全名叫做結構話查詢語言Structured Query Language，專門用來與關聯式資料庫溝通的程式語言。
也正因為這樣，所以關聯式資料庫也常被稱為SQL資料庫。

而前面曾經說到SQL其實還有很多細微分支，但因為他們也是以RDB的概念管理資料，並且都能使用SQL和RDBMS溝通，所以也都被稱為SQL DB。
 
## 小結
原本是想要做一些對於DB的比較，但後來發現，能夠做出比較，已經是對該DB有不少研究或是已經有相關經驗。
所以那部分就沈船了。

但多少有點收穫是，發現一個常被拿來做效能量化數據的單位稱為TPC，他們有許多不同情境的測試，是一個值得作為參考的數據來源。
另外也發現，常會拿來比較的一些項目包括: 成本(學習、費用)、效能、安全性、擴充性。
不過針對效能這點，以別人做得比較來看，與其說誰最好，不如說誰相對最好會來的更準確一些。

最後就提供一些我找到的比較文章僅做紀念吧。
- [[Day15] 資料庫 - 介紹與比較](https://ithelp.ithome.com.tw/articles/10206222)
- [不同資料庫的比較 - SQL Server vs Oracle and MySQL](http://caryhsu.blogspot.com/2011/06/sql-server-vs-oracle-and-mysql.html)
- [PostgreSQL vs MySQL vs SQL Server vs Oracle](https://faq.postgresql.tw/postgresql-vs-mysql-vs-sql-server-vs-oracle)

此文章同步發表於[部落格](https://tim80411.github.io/code-blog/)，歡迎來逛逛～

## 參考資料
[Relational Databases](https://www.ibm.com/cloud/learn/relational-databases)
[Database Transaction & ACID](https://oldmo860617.medium.com/database-transaction-acid-156a3b75845e)
[Databases: Relational Databases and SQL](https://www.edx.org/course/databases-5-sql)