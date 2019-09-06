---
title: 在 Eclipse 中使用 Gradle 构建多模块项目
---
本文基本是一篇手把手教程，如果你正巧不觉得太小儿科、又正巧闲极无聊，可以一边读一边跟着敲几个命令试试，说不定会有那么一点儿收获。万一没弄成，也正好可以有借口骂一句：“什么傻X玩意儿”。正反都不亏，何乐而不为。

其实也是偶然，前几天天气不好，想着重装一下系统，把心中的苦闷排遣排遣。你猜怎么着，装完系统发现 [Jetbrains](https://www.jetbrains.com) 全家桶不老好找注册码了。那两家“著名”的在线提供注册码的网站都停止服务了，只好别的地方一顿儿搜，到底找到能用的注册码把心爱的 [IDEA](https://www.jetbrains.com/idea) 激活了。激活是激活了，可是看着熟悉的屏幕，不知为嘛，突然就“无尽的空虚涌上心间”。迷糊了好一阵儿，才想起这些年真是挺对不住 [Jetbrains](https://www.jetbrains.com)。交往了这么久，却没舍得在她身上花过一分钱。呸，渣男！何况自己也算是写一点儿软件的人呢！真是越想越觉得惭愧，越想越觉得应该有所改变，应该装个 [Eclipse](https://www.eclipse.org)。

Welcome to [Hexo](https://hexo.io/)! This is your very first post. Check [documentation](https://hexo.io/docs/) for more info. If you get any problems when using Hexo, you can find the answer in [troubleshooting](https://hexo.io/docs/troubleshooting.html) or you can ask me on [GitHub](https://github.com/hexojs/hexo/issues).

## Quick Start

### Create a new post

``` bash
$ hexo new "My New Post"
```

More info: [Writing](https://hexo.io/docs/writing.html)

### Run server

``` bash
$ hexo server
```

More info: [Server](https://hexo.io/docs/server.html)

### Generate static files

``` bash
$ hexo generate
```

More info: [Generating](https://hexo.io/docs/generating.html)

### Deploy to remote sites

``` bash
$ hexo deploy
```

More info: [Deployment](https://hexo.io/docs/deployment.html)
---
