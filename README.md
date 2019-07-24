# Eli W. Hunter's Website

My personal website and blog! I post ideas here when I have them. This is also
a place for me to play with web-hosting and continuous deployment.

## Deployment

First, create a working [Docker] and [Docker Compose] installation. Then, run
the following commands starting in `_deploy/`.

[Docker]: https://docs.docker.com/install/
[Docker Compose]: https://docs.docker.com/compose/install/

```sh
# Create PDF of resume
./build_resume.sh
# Build website docker container
docker-compose build
```

If you have never run the container on this machine before, you must set up SSL
certificates. I use [certbot] for this with a setup based off of [this blog
post](blog-post). Run the following commands, in `_deploy/`.

[blog-post]: https://medium.com/@pentacent/nginx-and-lets-encrypt-with-docker-in-less-than-5-minutes-b4b8a60d3a71
[certbot]: https://certbot.eff.org/

```sh
# Set up dummy certs, start server, get real certs
./init_letsencrypt.sh
```

In `_deploy/` run:

```sh
# Fully restart the container cluster to apply changes
docker-compose kill
docker-compose up
```
