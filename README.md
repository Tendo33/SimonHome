# Simon Home

> 基于 [ZYYO666/homepage](https://github.com/ZYYO666/homepage) 二次开发
> 特别感谢原作者的优秀作品！

## 🚀 项目简介

这是一个使用 Nginx 部署的个人主页项目，采用 Docker 容器化部署方案，确保快速部署和一致性运行环境。

## 🛠️ 技术栈

- Nginx
- Docker
- Alpine Linux

## 📦 部署指南

### 前置要求

- Docker 环境
- 80 端口可用

### 快速开始

在项目根目录下执行以下命令：

```bash
# 构建 Docker 镜像
docker build -t simon-home-nginx .

# 启动容器
docker run -d -p 80:80 simon-home-nginx
```

## ⚙️ 配置说明

项目包含以下关键配置文件：

- `nginx.conf`: Nginx 主配置文件
- `Dockerfile`: Docker 镜像构建文件

## ✨ 特性

- 🐳 基于 Nginx Alpine 镜像，体积小巧
- 🚀 配置了 gzip 压缩，提升加载速度
- 💾 优化的静态文件缓存策略
- 🔄 支持 SPA 应用的路由配置
- 🔒 安全加固的 Nginx 配置

## 📝 许可证

MIT License

## 🙏 致谢

特别感谢 [ZYYO666](https://github.com/ZYYO666) 提供的优秀开源项目！
