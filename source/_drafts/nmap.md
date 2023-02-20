---
title: 你是不是暴露了？
tags: linux
---

如果您是计算机相关从业人员，那么应该经历不止一次网络安全专项检查了，你肯定是收到过信息系统技术检测报告，要求你加强风险监测，确保你提供的系统服务坚实可靠了。

没检测到问题还好，检测到问题的话，有些处理起来还是挺麻烦的，尤其是线上正在运行的系统。所以，如果能在正式上线部署前，自检一番，把能处理的问题处理掉，可能会省掉一些麻烦。

怎么自检呢？方案很多，这里介绍其中的一种，就是 `nmap`。你可能听说过，没有的话，先记住它是一种网络映射工具，被系统管理员、网络工程师甚至黑客广泛用于主机发现、端口规则、系统检测、漏洞扫描等。

本文就是和您一起看几个 `nmap` 命令的实际用例。

> 💡 本文中的大多数示例，都将使用 `nmap` 本身提供的目标：scanme.nmap.org。

## 安装

多数 Linux 发行版上，可能预装了。不确定的话，可以输入如下命令检测一下：

```bash
nmap -v
```

类似如下输出，说明是已经装好了的。

```bash
Starting Nmap 7.80 ( https://nmap.org ) ...
Read data files from: /usr/bin/../share/nmap
WARNING: No targets were specified, so 0 hosts scanned.
Nmap done: 0 IP addresses (0 hosts up) scanned in 0.02 seconds
```

否则的话，可以使用操作系统对应的方式安装它。例如对于 Debian/Ubuntu，使用：

```bash
sudo apt install nmap
```

对于 RHEL/Fedora base：

```bash
sudo dnf install nmap
```

对于基于 Arch 的发行版：

```bash
sudo pacman -S nmap
```

对于 Windows，如果你使用 `Scoop` 的话，也很简单：

```bash
scoop install nmap
```

安装完成后，可以开始我们的实验。

## 扫描开放端口

命令格式如下：

```bash
nmap Target
```

其中 **Target** 是要扫描的目标 IP 或域名。如果想快速扫描，可以加上 `-F` 参数：

```bash
nmap -F Target
```

如下是示例：

```bash
nmap -F scanme.nmap.org
```

```
...
Not shown: 98 filtered ports
PORT   STATE SERVICE
22/tcp open  ssh
80/tcp open  http

Nmap done: 1 IP address (1 host up) scanned in 8.52 seconds
```

可以看到 `22` 和 `80` 端口是开放的。

## 扫描多个主机

如果想一次扫描多个主机，有几种方法：

- 命令后直接追加多个域名或 IP
- 使用通配符一次搜索整个子网
- 指定 IP 地址范围
- 指定 IP 地址的不同结尾

例如，一次扫描 3 个 IP：

```bash
nmap 192.168.1.9 192.168.1.8 192.168.1.10
```

扫描整个网段

```bash
nmap 192.168.1.*
```

扫描从 192.168.1.8 到 192.168.1.10 的 IP：

```bash
nmap 192.168.1.8-10
```

另一种扫描从 192.168.1.8 到 192.168.1.10 的方式：

```bash
nmap 192.168.1.8,9,10
```

扫描某个网段，但排除其中之一：

```bash
nmap 192.168.1.* --exclude 192.168.1.6
```

192.168.1.6 这台主机将不会被扫描。

## 防火墙检测

可以使用 nmap 命令发送 ACK 数据包，以检查目标系统是否启用了防火墙：

```bash
sudo nmap -sA scanme.nmap.org
```

注意 `sudo`，这条命令需要 **root** 权限。输出如下：

```bash
...
Not shown: 995 unfiltered ports
PORT     STATE    SERVICE
135/tcp  filtered msrpc
139/tcp  filtered netbios-ssn
445/tcp  filtered microsoft-ds
593/tcp  filtered http-rpc-epmap
4444/tcp filtered krb524

Nmap done: 1 IP address (1 host up) scanned in 32.48 seconds
```

## 获取主机服务信息

扫描端口后了解服务后，您可能希望了解有关这些服务的更多信息，可以使用标志：sV

```bash
nmap -sV scanme.nmap.org
```

```
...
Not shown: 991 closed ports
PORT      STATE    SERVICE        VERSION
22/tcp    open     ssh            OpenSSH 6.6.1p1 Ubuntu 2ubuntu2.13 (Ubuntu Linux; protocol 2.0)
80/tcp    open     http           Apache httpd 2.4.7 ((Ubuntu))
135/tcp   filtered msrpc
139/tcp   filtered netbios-ssn
445/tcp   filtered microsoft-ds
593/tcp   filtered http-rpc-epmap
4444/tcp  filtered krb524
9929/tcp  open     nping-echo     Nping echo
31337/tcp open     tcpwrapped
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 23.71 seconds
```

## 扫描特定端口

指定端口，需要使用 `-p` 参数：

```bash
nmap -p 443 scanme.nmap.org
nmap -p 443,80 scanme.nmap.org
nmap -p 20-80 scanme.nmap.org
```

如下是真实的扫描示例：
```bash
nmap -p 443 scanme.nmap.org
```

```
...
PORT    STATE  SERVICE
443/tcp closed https

Nmap done: 1 IP address (1 host up) scanned in 0.54 seconds
```

## 隐身模式扫描

坏人喜欢的模式，对不对？使用参数 `-sS`，需要 **root** 权限：

```bash
sudo nmap -sS Target
```
没有示例。

## 获取系统信息

要获取操作系统信息，需要在扫描时使用参数 `-A`：

```
nmap -A scanme.nmap.org
```

```
...
PORT      STATE    SERVICE        VERSION
22/tcp    open     ssh            OpenSSH 6.6.1p1 Ubuntu 2ubuntu2.13 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey:
|   1024 ac:00:a0:1a:82:ff:cc:55:99:dc:67:2b:34:97:6b:75 (DSA)
|   2048 20:3d:2d:44:62:2a:b0:5a:9d:b5:b3:05:14:c2:a6:b2 (RSA)
|   256 96:02:bb:5e:57:54:1c:4e:45:2f:56:4c:4a:24:b2:57 (ECDSA)
|_  256 33:fa:91:0f:e0:e1:7b:1f:6d:05:a2:b0:f1:54:41:56 (ED25519)
80/tcp    open     http           Apache httpd 2.4.7 ((Ubuntu))
|_http-server-header: Apache/2.4.7 (Ubuntu)
|_http-title: Go ahead and ScanMe!
135/tcp   filtered msrpc
139/tcp   filtered netbios-ssn
445/tcp   filtered microsoft-ds
593/tcp   filtered http-rpc-epmap
4444/tcp  filtered krb524
9929/tcp  open     nping-echo     Nping echo
31337/tcp open     tcpwrapped
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 29.91 seconds
```

## 查找活动主机

通常用 ping，但 nmap 命令也可以，比如：

```bash
nmap -sP 192.168.1.0/24
```

## 获取本机和路由

通常用 `ip addr` 和 `ip route`，但 nmap 也可以：

```bash
nmap --iflist
```
```
...
************************INTERFACES************************
DEV   (SHORT) IP/MASK                      TYPE     UP   MTU  MAC
eth0  (eth0)  169.254.38.224/16            other    down 1500
eth0  (eth0)  fe80::a185:605b:4962:26e0/64 other    down 1500
lo    (lo)    127.0.0.1/8                  loopback up   1500
lo    (lo)    ::1/128                      loopback up   1500
wifi0 (wifi0) fe80::35e9:f194:3704:3178/64 ethernet up   1500 64:79:F0:2A:28:E4
wifi1 (wifi1) 169.254.113.12/16            other    down 1500
wifi1 (wifi1) fe80::f520:4762:ad46:710c/64 other    down 1500
wifi2 (wifi2) 169.254.103.91/16            other    down 1500
wifi2 (wifi2) fe80::d14:5bb0:9a34:675b/64  other    down 1500

**************************ROUTES**************************
DST/MASK                      DEV   METRIC GATEWAY
0.0.0.0/32                    wifi0 0      192.168.99.1
127.0.0.1/32                  lo    256
127.255.255.255/32            lo    256
255.255.255.255/32            lo    256
255.255.255.255/32            wifi0 256
127.0.0.0/8                   lo    256
224.0.0.0/4                   lo    256
224.0.0.0/4                   wifi0 256
::1/128                       lo    256
fe80::35e9:f194:3704:3178/128 wifi0 256
fe80::/64                     wifi0 256
ff00::/8                      lo    256
ff00::/8                      wifi0 256
```

玩法还有很多，不一一列举了。你有空的话，自己发掘发掘吧。
