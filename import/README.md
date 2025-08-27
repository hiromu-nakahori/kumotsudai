
# 📦 Kumotsudai App (Amplify Gen2 + React)

このアプリは、カルト的世界観を持つ供物投稿アプリ「供物台」の最小構成サンプルです。
Amplify Gen2 + React + TypeScript で構築されています。

## ✅ 機能概要

- 🔐 **認証機能**：Cognitoを利用した新規登録・ログイン・ログアウト
- 💾 **ユーザーデータ保存**：Amplify Data (DynamoDB) にユーザー情報を登録
- 🎨 **UI構成**：簡易的なログイン・登録画面あり（後からFigma Makeなどで差し替え可能）
- 🧠 **状態管理**：AppContextによるグローバル状態制御

---

## 📁 ディレクトリ構成

```
kumotsudai_rebuild/
├── amplify/
│   └── data/
│       └── resource.ts      # Amplify Data モデル定義（User）
├── src/
│   ├── components/
│   │   └── AppContext.tsx   # 認証・ユーザー管理コンテキスト
│   ├── screens/
│   │   ├── LoginScreen.tsx  # ログイン画面
│   │   └── RegisterScreen.tsx # 新規登録画面
│   ├── App.tsx              # 画面遷移・Provider 包含
│   └── main.tsx             # アプリ起動とAmplify設定
└── README.md
```

---

## ⚙️ Amplify関連

この構成は Amplify Gen2 (`amplify pull --sandbox`) を前提としています。

- `amplify_outputs.json` は既に `main.tsx` にて `Amplify.configure()` に適用されています。
- `generateClient<Schema>()` によって Amplify Data（DynamoDB）との接続が可能です。

---

## 📌 ファイル別の説明

### 1. `AppContext.tsx`
- 全アプリの状態管理（`isAuthenticated`, `currentUser`）を担当。
- `register()` は `Auth.signUp` + DynamoDBへの保存を両方実行。
- `login()` は Cognitoでログインし、状態を更新。
- `updateProfile()` は local state更新（※ DB反映は未実装）

### 2. `resource.ts`
- `User` モデル定義のみ実装。
- 必要に応じて `Offering` や `Comment` を追加可能。

### 3. `main.tsx`
- アプリのエントリポイント。
- `amplify_outputs.json` を利用して Amplify全体を構成。

### 4. `App.tsx`
- `AppProvider` を全体で包みつつ、現在の画面を `currentScreen` で出し分け。

### 5. `RegisterScreen.tsx`
- 登録フォームと `register()` 呼び出し。
- `name`, `email`, `password`, `department`, `age`, `avatar` を入力。

### 6. `LoginScreen.tsx`
- `email` と `password` でログイン可能。
- 成功/失敗メッセージ表示あり。

---

## 🔧 今後の追加予定

- ✅ ユーザー一覧取得（`listUsers`）
- ✅ Offering投稿（供物）・コメント・いいね
- ✅ UIテーマ切替（秋・冬）
- ✅ Figma Make と世界観統合

---

## ✨ 開発手順

```bash
git clone <this-repo>
cd kumotsudai_rebuild
npm install
npm run dev
```

Amplify は事前に `amplify pull --sandbox` を済ませておく必要があります。

---

## 👤 制作・監修

- 提供: あなた（世界観構築者）
- 支援: ChatGPT（設計/実装支援）

