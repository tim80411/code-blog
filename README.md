# 個人部落格
- 網址: https://tim80411.github.io/code-blog/


## 維運事件
2022/9/27 若hexo版本更新，除了dependency更新外，package.json > hexo也需要更新到相同版本

## 客製化node_modules
2022/9/28 因為習慣下底線最為文件名稱的分隔，但不知道為什麼她沒辦法根據我的下底線做這個處理，後來發現是node_modules\hexo-util\lib\slugize.js裡面的separator預設值的問題，目前先本地強迫設定_，在看到時候要不要發issue。