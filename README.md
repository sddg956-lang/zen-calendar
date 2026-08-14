# Zen Calendar PWA V1.2.0

本版補回 PWA 的滑動功能，並維持「點擊優先、滑動輔助」。

## 滑動
- 今日頁空白處左右滑：前一天 / 下一天
- 行事曆空白處左右滑：上一月 / 下一月
- 睡前整理空白處左右滑：上一步 / 下一步
- 待辦左滑：延後 / 完成
- 按鈕、卡片、輸入框不攔截成頁面滑動

## PWA
- 可加入 iPhone 主畫面
- Service Worker 離線快取
- 版本：1.2.0
- 更新快取版本：zen-calendar-v1.2.0

## GitHub Actions 發布流程

本專案已加入：

`.github/workflows/deploy-pages.yml`

GitHub 設定：
1. Repository → Settings
2. Pages
3. Source 選擇 **GitHub Actions**
4. 每次 push 到 `main`，GitHub Actions 會自動部署新版 PWA

## 固定版本規則

每次發布都必須同步更新：

- `app.js` → `APP_VERSION`
- `service-worker.js` → `CACHE_VERSION`
- `VERSION`

目前版本：**1.2.0**

App 畫面上方也會直接顯示目前版本，例如：

`Zen Calendar v1.2.0`

之後每次修改並發布，版本會依序為：

`1.2.1` → `1.2.2` → `1.3.0` ...

小修正使用 patch 版本，例如 1.2.1。
新增較大功能使用 minor 版本，例如 1.3.0。
