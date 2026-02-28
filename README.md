# US ETF Leverage Backtester

米国ETFのレバレッジ・バックテストシミュレーター。過去の指数データを使って、レバレッジETFのパフォーマンスをシミュレーションできます。

## デモ

[GitHub Pages で公開中](https://tokikataaaaaaaaaaaaa.github.io/typechain/)

## 機能

### バックテストシミュレーター (`docs/`)

- **対応指数**: S&P 500 / Nasdaq 100 / Dow Jones / VTI / 日経225 / Gold
- **レバレッジ比較**: 1x・2x・3x を個別または一括比較
- **投資方式**: 一括投資 / 積立投資（DCA）
- **通貨切替**: USD ($) / JPY (¥) 対応
- **3つのモード**:
  - **初心者モード** — 直近N年間の簡易シミュレーション
  - **基本モード** — 任意の期間を指定してバックテスト
  - **専門家モード** — ローリングテスト（開始時期をずらした繰り返し分析）
- **危機期間プリセット**: ドットコム・バブル、リーマンショック、コロナショックなど
- **分析指標**: CAGR、最大ドローダウン（MDD）、ボラティリティ、シャープレシオ、年別リターン

### ETF ティッカーデータベース (`src/etf/`)

TypeScript で構築されたETFティッカーのデータベースとサービスレイヤー。

```typescript
import { ETFService } from "./etf";

const service = new ETFService();

// レバレッジETFを取得
service.getLeveraged();

// S&P 500 のレバレッジ比較 (1x, 2x, 3x)
service.getLeverageComparison("S&P 500");

// カテゴリ・指数・発行体でフィルタリング
service.filterByCategory("index");
service.filterByIndex("Nasdaq 100");
service.filterByIssuer("ProShares");
```

対応カテゴリ: index / sector / bond / commodity / international / crypto / thematic

## セットアップ

```bash
npm install
```

### 開発

```bash
npm run dev     # ts-node で実行 (ホットリロード)
npm run build   # TypeScript をコンパイル
npm start       # コンパイル済みコードを実行
```

### テスト

```bash
node docs/test.js
```

## 技術スタック

- **フロントエンド**: HTML / CSS / Vanilla JavaScript
- **チャート**: [Chart.js](https://www.chartjs.org/)
- **バックエンド型定義**: TypeScript
- **データソース**: [Stooq.com](https://stooq.com/)

## データについて

各指数の日次終値データを収録しています。期間は指数により異なります:

| 指数 | 開始日 |
|------|--------|
| S&P 500 | 1990-01-02 |
| Nasdaq 100 | 1990-01-02 |
| Dow Jones | 1990-01-02 |
| VTI | 2005-02-25 |
| 日経225 | 1970-01-05 |
| Gold | 1970-01-05 |

## 免責事項

本シミュレーターは過去データに基づく参考ツールです。将来の投資成果を保証するものではありません。

## フィードバック

改善要望はこちらまで: [@tokikata_dev (Instagram)](https://www.instagram.com/tokikata_dev)
