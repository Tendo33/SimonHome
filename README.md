# Nginx 部署说明

这个目录包含了使用 Nginx 部署网站的配置文件。

## 构建和运行

在 nginx 目录下执行以下命令：

```bash
# 构建镜像
docker build -t simon-home-nginx .

# 运行容器
docker run -d -p 80:80 simon-home-nginx
```

## 配置说明

- `nginx.conf`: Nginx 主配置文件
- `Dockerfile`: 用于构建 Nginx 容器镜像

## 特点

- 使用 Nginx Alpine 镜像，体积小
- 配置了 gzip 压缩
- 静态文件缓存优化
- 支持 SPA 应用的路由 