FROM alpine:edge AS builder

RUN apk add hugo

WORKDIR /src
COPY . .
RUN hugo && mv ./public /public

FROM nginx:alpine

COPY --from=builder /public /usr/share/nginx/html
