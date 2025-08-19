#!/bin/sh
# 環境変数を Nginx 設定に置換
envsubst '$FRONTEND $BACKEND $SERVER_NAME $HTTP_PORT $HTTPS_PORT' \
  < /etc/nginx/templates/default.conf.template \
  > /etc/nginx/conf.d/default.conf

# Nginx 起動
exec nginx -g 'daemon off;'
