# SimonHome

> 基于 [ZYYO666/homepage](https://github.com/ZYYO666/homepage) 二次开发，保留纯静态站点的部署方式，并补充了测试、校验和资源优化流程。

## 项目简介

SimonHome 是一个使用原生 `HTML + CSS + JavaScript` 构建的个人主页项目，运行时不依赖框架，也不需要打包器。  
首页核心内容直接写在 `index.html` 中，确保首屏可直出；交互逻辑由模块化脚本负责，使用 Nginx 直接托管静态文件，并通过 Docker 进行部署。

## 技术栈

- 原生 HTML / CSS / JavaScript
- Nginx
- Docker
- Node.js（仅用于校验、测试和资源处理）

## 目录说明

- `index.html`：主页入口与首屏内容
- `static/css/`：主题与样式
- `static/js/`：页面交互逻辑
- `static/img/optimized/`：运行时使用的优化图片资源
- `scripts/`：图片优化和链接校验脚本

## 本地开发

### 1. 安装依赖

```bash
npm install
```

### 2. 重新生成优化图片

当你替换了背景图、头像图或大尺寸卡片图标后，执行：

```bash
npm run optimize:images
```

### 3. 运行测试与校验

```bash
# 运行 smoke / 单元测试
npm test

# 运行完整校验
npm run validate
```

`npm run validate` 当前包含：

- `vitest + jsdom` smoke 测试
- `html-validate` HTML 结构校验
- 本地资源与链接校验

## 内容维护

首页首屏内容直接维护在：

`index.html`

更新 `Sites`、`Projects`、`Plugins` 卡片时，优先保持现有 DOM 结构、类名和图片资源路径不变，避免影响已有样式和交互逻辑。

## Docker 部署

### 构建镜像

```bash
docker build -t simon-home-nginx .
```

### 启动容器

```bash
docker run -d -p 80:80 simon-home-nginx
```

镜像只包含运行所需的 `index.html`、`static/` 和 `nginx.conf`，不会把历史文件、文档和开发依赖一起打包进去。

## 发布流程

当推送符合 `v*` 规则的 tag 时，GitHub Actions 会按顺序执行：

1. 安装 Node.js 依赖
2. 执行 `npm run validate`
3. 创建 GitHub Release
4. 构建并推送 Docker 镜像

如果校验失败，发布和镜像推送都会被拦截。

## 许可证

MIT License
