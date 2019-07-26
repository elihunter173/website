FROM ruby:2.6-alpine AS builder
WORKDIR /tmp/website
RUN apk add --update --no-cache ruby-dev g++ musl-dev make
RUN gem install bundler:2.0.2
COPY . .
RUN bundle install --deployment
RUN bundle exec jekyll build -d /opt/website


FROM nginx:1.17-alpine
COPY ./_deploy/nginx /etc/nginx/conf.d
COPY --from=builder /opt/website /srv/www
