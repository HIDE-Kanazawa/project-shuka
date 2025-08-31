# Shuka – 秀歌 公式サイト

このリポジトリは、AI 音楽アーティスト **Shuka – 秀歌** の公式サイトのソースコードを公開しています。日本の四季を感じる和風テイストと、インタラクティブなアニメーション・音声体験を提供します。

## プロジェクト構成

```
project-shuka/
├── index.html            # エントリーポイント
├── css/                  # モジュール化した CSS
│   ├── base/
│   ├── components/
│   └── layouts/
├── js/                   # JavaScript モジュール
├── styles.css            # バンドル済み CSS
├── scripts.js            # バンドル済み JavaScript
├── img/                  # 画像
├── audio/                # 楽曲
└── video/                # 動画
```

HTML/CSS は `index.html` および `css/` ディレクトリに配置しています。JavaScript は `js/` にモジュールとして置き、ページでは `scripts.js` を読み込みます。Three.js による追加演出は `three-lanterns.js` に実装されています。

## ローカルプレビュー

- 推奨（インストール不要）:

```bash
npx http-server -c-1
```

ターミナルに表示される URL にアクセスしてください（例: <http://127.0.0.1:8080/>）。

- 代替（Python 標準機能）:

```bash
python3 -m http.server
```

ブラウザで <http://localhost:8000/> を開いてください。

## デプロイ

本サイトは GitHub Pages で公開できます。リポジトリ設定から Pages を有効化し、`main` ブランチ（ルート）を公開対象に設定してください。カスタムドメイン `project-shuka.com` 用の `CNAME` ファイルを同梱しています。

### CNAME について
- 目的: GitHub Pages でサイトをカスタムドメイン `project-shuka.com` に紐付けるためのファイルです。
- 形式: ドメイン名のみを 1 行で記載します（プロトコル・パス不可）。コメントは記述できません。
- DNS: ドメインが GitHub Pages を指すように DNS（A/ALIAS/CNAME）を設定し、リポジトリの Pages 設定で Custom domain を登録してください。

## 補足

本サイトは静的サイトとしてリポジトリに格納されています。ビルド工程は不要です。ツール互換性のため Node.js 18 以上の利用を推奨します。
