FROM nginx:1.30.6-alpine

WORKDIR /var/www/html
COPY index.html ./index.html
COPY 404.html ./404.html
COPY static ./static
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -q -O /dev/null http://127.0.0.1/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
