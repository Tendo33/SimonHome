FROM nginx:alpine

WORKDIR /var/www/html
COPY index.html ./index.html
COPY static ./static
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"] 
