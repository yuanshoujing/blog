---
title: Podman Compose 新手指南
tags: linux
---

技术人员多数又呆板又花心不长久。我知道你可能已经厌倦了 Docker，但是系统还没有复杂到需要高攀 K8S 的地步。那我建议您，有空的话可以约一下 Podman。

Podman 使用起来是足够简单的，直接把它当做改了名字的 Docker 就可以了。所以以下只介绍一下它的编排工具，也就是 `podman-compose`。

## 简介

用 Docker 的时候，你知道它提供了一个编排工具，可以将容器的细节，例如名称、镜像、重启策略、卷、挂载点、端口、标签等等，在一个单一的文件中指定，这个文件通常命名为 `docker-compose.yml`。

Podman 可以使用 `podman-compose` 达成类似的功能。简单的说，`podman-compose` 是使用 Podman 做为后端的一种 [Compose Spec](https://compose-spec.io/) 实现，它的关注点主要是：

- rootless 不需要 root 权限
- daemon-less 没有守护进程

它最终的实现结果与 `docker-compose.yml` 文件的兼容度非常高，只存在一些细微的差异，比如说某些值需要使用引号括起来等。

## 安装

`podman-compose` 算是一个相对较新的工具，因此很多稳定或长期支持的 Linux 发行版，很可能还没有将它放在内置的软件源中。这种情况下，可以从 PyPI 安装：

```bash
sudo pip3 install podman-compose
```

Ubuntu 22.10 及以上或 Debian 12 及以上，则可以使用包管理器安装它：

```bash
sudo apt install podman-compose
```

Fedora 36 及以上，也可以直接安装：

```bash
sudo dnf install podman-compose
```

Arch Linux 用户：

```bash
sudo pacman -Syu podman-compose
```

## 验证安装

可以简单输出一下版本号，以验证是否安装正确：

```bash
podman-compose --version
```

输出类似下面：

```bash
$ podman-compose --version
['podman', '--version', '']
using podman version: 4.3.1
podman-composer version 1.0.3
podman --version
podman version 4.3.1
exit code: 0
```

## 编排

如前所述，`podman-compose` 与 `docker-compose` 基本一致，所以不详细描述其文件结构了。直接看一个例子，比较容易理解，内容如下：

```yml
version: 3.7

services:
  reverse-proxy:
    image: docker.io/library/caddy:alpine
    container_name: caddy-vishwambhar
    command: caddy run --config /etc/caddy/Caddyfile
    restart: always
    ports:
      - "8080:80"
      - "8443:443"
    volumes:
      - /docker-volumes/caddy/Caddyfile:/etc/caddy/Caddyfile:Z
      - /docker-volumes/caddy/site:/srv:Z
      - /docker-volumes/caddy/caddy_data:/data:Z
      - /docker-volumes/caddy/caddy_config:/config:Z
      - /docker-volumes/caddy/ssl:/etc/ssl:Z
    labels:
      - io.containers.autoupdate=registry
      - pratham.container.category=proxy
    environment:
      - TZ=Asia/Kolkata
    depends_on:
      - gitea-web

  gitea-web:
    image: docker.io/gitea/gitea:latest
    container_name: gitea-govinda
    restart: always
    ports:
      - "8010:3000"
      - "8011:22"
    volumes:
      - /docker-volumes/gitea/web:/data:Z
      - /docker-volumes/gitea/ssh:/data/git/.ssh:Z
      - /etc/localtime:/etc/localtime:ro
    labels:
      - io.containers.autoupdate=registry
      - pratham.container.category=gitea
    environment:
      - RUN_MODE=prod
      - DISABLE_SSH=false
      - START_SSH_SERVER=true
      - SSH_PORT=22
      - SSH_LISTEN_PORT=22
      - ROOT_URL=https://git.mydomain.com
      - DOMAIN=git.mydomain.com
      - SSH_DOMAIN=git.mydomain.com
      - GITEA__database__DB_TYPE=postgres
      - GITEA__database__HOST=gitea-db:5432
      - GITEA__database__NAME=gitea
      - GITEA__database__USER=gitea
      - GITEA__database__PASSWD=/run/secrets/gitea_database_user_password
      - GITEA__service__DISABLE_REGISTRATION=true
      - TZ=Asia/Kolkata
    depends_on:
      - gitea-db
    secrets:
      - gitea_database_user_password

  gitea-db:
    image: docker.io/library/postgres:14-alpine
    container_name: gitea-chitragupta
    restart: always
    volumes:
      - /docker-volumes/gitea/database:/var/lib/postgresql/data:Z
    labels:
      - io.containers.autoupdate=registry
      - pratham.container.category=gitea
    environment:
      - POSTGRES_USER=gitea
      - POSTGRES_PASSWORD=/run/secrets/gitea_database_user_password
      - POSTGRES_DB=gitea
      - TZ=Asia/Kolkata
    secrets:
      - gitea_database_user_password

secrets:
gitea_database_user_password:
external: true
```

## 启动所有容器

可以简单使用 `up` 命令，启动编排文件中的所有容器与服务：

```bash
podman-compose up -d
```

上述命令背后将执行启动相关容器必须的所有操作，包括：

- 拉取镜像
- 使用指定选项（端口、卷、机密、网络等）创建容器
- 按特定顺序启动容器（由约束定义，例如 depends_on)

`-d` 选项，随便一猜大概就能明白，是做为后台进程启动容器的意思。

容器启动并运行后，可以通过以下命令进行验证：

```bash
$ podman ps
CONTAINER ID IMAGE COMMAND CREATED STATUS PORTS NAMES
d7b7f91c03aa docker.io/library/caddy:alpine caddy run --confi... 4 hours ago Up 4 hours ago 0.0.0.0:8080->80/tcp, 0.0.0.0:8443->443/tcp caddy-vishwambhar
1cfcc6efc0d0 docker.io/library/postgres:14-alpine postgres 4 hours ago Up 4 hours ago gitea-chitragupta
531be3df06d0 docker.io/gitea/gitea:latest /bin/s6-svscan /e... 4 hours ago Up 4 hours ago 0.0.0.0:8010->3000/tcp, 0.0.0.0:8011->22/tcp gitea-govinda
```

## 停止容器与服务

既然启动是 `up`，那停止很明显就是 `down` 了。这俩单词我老早就认识，不知道你认识不认识？

```bash
podman-compose down
```

此外，您还可以设置个超时时间，容器到时可以安全地自行关闭：

```bash
podman-compose down -t TIMEOUT_IN_SECONDS
podman-compose down --timeout TIMEOUT_IN_SECONDS
```

注意，以上命令仅停止容器，并不会删除容器。

## 启动或停止特定服务

你应该注意到了，上面的配置文件定义了多个服务，比如其中之一是 `gitea-db`。如果单独启停它的话，可以象这样：

```
$ podman-comopse start gitea-db
$ podman-compose stop gitea-db
$ podman-compose restart gitea-db
```

## 其它

主要的命令其实就是上述这些了。剩余一两个可能用到的，简单描述一下。

假如想预先拉取一下相关镜像，可以使用命令：

```bash
podman-compose pull
```

另外，前述命令都假定编排文件的名字仍然叫 `docker-compose.yml`。肯定是可以换成其它名字的，比如 `foo.yml`，则使用时需要多加个参数，指定配置文件：

```
podman-compose -f foo.yml
podman-compose --file foo.yml
```

总之，使用起来还是相当简单愉快的。请君试之。
