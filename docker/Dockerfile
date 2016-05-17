FROM nginx
COPY application.template /etc/nginx/conf.d/application.template
COPY startup.sh /usr/local/bin/startup.sh
#COPY ./app /usr/share/nginx/html/app

ENV NGINX_PORT 80
ENV API_ENDPOINT https://api.cartolafc.globo.com

CMD ["bash", "/usr/local/bin/startup.sh"]
