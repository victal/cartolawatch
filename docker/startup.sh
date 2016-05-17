#!/bin/bash -xe

envsubst < /etc/nginx/conf.d/application.template > /etc/nginx/conf.d/default.conf 
nginx -g 'daemon off;'
