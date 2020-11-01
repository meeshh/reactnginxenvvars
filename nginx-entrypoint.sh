#!/bin/sh

WWW_DIR=/usr/share/nginx/html
INJECT_FILE_SRC="${WWW_DIR}/appsettings.template.json"
INJECT_FILE_DST="${WWW_DIR}/appsettings.json"

envsubst < "${INJECT_FILE_SRC}" > "${INJECT_FILE_DST}"

[ -z "$@" ] && nginx -g 'daemon off;' || $@
