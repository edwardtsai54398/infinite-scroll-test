# Infinte Scroll 實作
此專案示範如何使用 GitHub REST API 搭配 前端無限滾動機制，每次請求載入指定開發者的 repository，每次取得 10 筆資料。

## 運行方式
```
git clone https://github.com/edwardtsai54398/infinite-scroll-test.git
cd infinite-scroll-test
npm install
npm run dev
```

## GitHub Token 設定方式

因為使用 GitHub REST API 時，需要使用 Personal Access Token (PAT)。

如何產生自己的 Token：

1️⃣ 登入 GitHub

前往：https://github.com/login

2️⃣ 建立 Token

進入：

Settings → Developer settings → Personal access tokens → Fine-grained tokens

3️⃣ 建立新 Token

點選 “Generate new token”，設定：

Repository access（必要） → 選 Public repositories

Permissions → 至少勾選 read-only（只需要讀取 repo 列表）

4️⃣ 建立後複製 Token

⚠️ GitHub 的 Token 只會顯示一次，請務必複製起來。

## 在專案中使用 Token

請將 Token 放入程式碼

```
//App.vue line:9

const MY_TOKEN = 'YOUR_GITHUB_TOKEN_HERE' // Replace with your GitHub token
```
