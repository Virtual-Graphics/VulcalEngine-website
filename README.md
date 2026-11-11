# Vulcal Engine 网站

Vulcal Engine 的官方网站与文档，使用 Docusaurus 构建。

- 网站：https://virtual-graphics.github.io/VulcalEngine-website/
- 网站仓库：https://github.com/Virtual-Graphics/VulcalEngine-website
- 引擎仓库：https://github.com/Virtual-Graphics/VulcalEngine

## 本地开发

建议使用 Node.js 24，与 GitHub Actions 的构建环境保持一致。

```bash
npm ci
npm run start
```

## 生产构建

```bash
npm run build
npm run serve
```

静态网站生成到 `build/` 目录。`node_modules/`、`build/` 和 `.docusaurus/` 不提交到仓库。

## 部署

推送到 `main` 分支会自动触发 `.github/workflows/deploy.yml`，安装依赖、构建网站并发布到 GitHub Pages。也可以在 GitHub Actions 中手动运行该工作流。

仓库的 **Settings → Pages → Build and deployment → Source** 应选择 **GitHub Actions**。

网站发布路径为 `/VulcalEngine-website/`，对应 `docusaurus.config.js` 中的 `url` 和 `baseUrl`。
