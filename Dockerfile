FROM node:15.0.1-alpine AS build
WORKDIR /app/
COPY . .
RUN yarn
RUN yarn build

FROM nginx:alpine AS server
WORKDIR /usr/share/nginx/html
COPY --from=build /app/build .

RUN rm /etc/nginx/conf.d/default.conf

COPY appsettings.template.json .
COPY nginx.conf /etc/nginx/conf.d

RUN apk add --no-cache gettext
COPY nginx-entrypoint.sh /

ENTRYPOINT [ "sh", "/nginx-entrypoint.sh" ]