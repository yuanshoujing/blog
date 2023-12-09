---
title: Linux 自动关机
tags:
---

怎么做到，人走了，电脑还亮着，好像并未远去，还在加班的样子？

如果你用的是 Linux，可以用如下命令：

```bash
shutdown +N
```

意思是让系统在 N 分钟后关闭。例如：

```bash
shutdown +15
```

你的电脑就会在 15 分钟后关闭。

也可以指定具体时间，格式为：

```bash
shutdown hh:mm
```

例如：

```bash
shutdown 17:00
```

则会在下午五点关机。

我去，手抖输错了，下午五点还没下班呢，可咋整？

```bash
shutdown --show
```

会列出你的关机任务，象这样：

```bash
$ sudo shutdown --show
Shutdown scheduled for Fri 2023-12-08 17:00:00 CST, use 'shutdown -c' to cancel.
```

你已经看到了，使用：

```bash
$ sudo shutdown -c

Broadcast message from root@xxx on pts/1 (Fri 2023-12-08 15:33:27 CST):

System shutdown has been cancelled
```

再 show 一下，就会发现没有关机任务了：

```bash
$ sudo shutdown --show
No scheduled shutdown.
```

好了，就是这样。周末了，祝您工作顺心，摸鱼快乐。

以下是 shutdown 手册的一部分，只是为了凑够 300 字，不必看。

```bash
NAME
       shutdown - 停机、关机、重新启动

SYNOPSIS

       shutdown [OPTIONS...] [TIME] [WALL...]

描述
       shutdown 可用于停机、关机、 重新启动

       可选参数 [TIME] 是一个表示时间的字符串(通常是 "now")。可选参数 [WALL...]  用于设置在关机前发送给所有登录用户的
       警告信息。

       时间字符串可以是 "hh:mm" 格式， 表示在指定的时间点"小时:分钟"(24小时制)执行关机动作。 时间字符串也可以是 "+m"
       格式， 表示从现在起的 m 分钟之后执行关机动作。 "now" 与 "+0" 的含义相同， 表示立即触发关机流程。如果未指定时间
       字符串， 那么 "+1" 是默认值。

       注意，如果要设置 [WALL...]  参数， 那么必须同时设置 [TIME] 参数。

       如果使用了 [TIME] 参数， 那么在关机流程开始前5分钟将会创建 /run/nologin 文件， 以禁止用户登录。
```
