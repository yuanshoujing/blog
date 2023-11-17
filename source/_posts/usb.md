---
title: 找到你 Linux 上的 USB 设备
date: 2023-10-30 17:41:07
tags:
---

USB 设备太广泛了，U 盘、移动硬盘、无线键鼠，还有打印机等许许多多外设。

如果系统已经自带了这些设备的驱动，并且设备可以自动挂载，那就比较好。象 U 盘、移动硬盘等，无论是 Linux 还是 Windows，挂载后你都能轻而易举的看到这些设备。不过，还是要稍微提一句。多数 Linux 服务器，默认是不支行在图形界面下的，自动挂载的 U 盘和移动硬盘在哪里呢？一般在 /media 下，可以用如下命令列出来：

```bash
df -Th | grep media
```

或者

```bash
lsblk | grep media
```

那么对于那些不能自动挂载的 USB 设备，比如小票打印机、读卡器以及一些 U 转串设备，怎么找到它们呢？Windows 上，如你所知，可以用 `设备管理器`。Linux 的话，有如下两个命令可以用。

```bash
lsusb
```

输出结果类似这样：

```bash
Bus 002 Device 002: ID 0781:5581 SanDisk Corp.Ultra
Bus 002 Device 001: ID 1d6b:0003 Linux Foundation 3.0 root hub
Bus 001 Device 004: ID 05e3:0608 Genesys Logic,Inc.Hub
Bus 001 Device 003: ID 046d:c534 Logitech,Inc.Unifying Receiver
Bus 001 Device 002: ID 3434:0280 KeychronKeychron K8 Pro
Bus 001 Device 006: ID 8087:0033 Intel Corp.
Bus 001 Device 005: ID 048d:5702 Integrated Technology Express,Inc.ITE Device
Bus 001 Device 001: ID 1d6b:0002 Linux Foundation 2.0 root hub
```

或者使用命令

```bash
usb-devices
```

其输出类似这样：

```bash
T:  Bus=01 Lev=00 Prnt=00 Port=00 Cnt=00 Dev#=  1 Spd=480 MxCh=16
D:  Ver= 2.00 Cls=09(hub  ) Sub=00 Prot=01 MxPS=64 #Cfgs=  1
P:  Vendor=1d6b ProdID=0002 Rev=04.19
S:  Manufacturer=Linux 4.19.0-6-amd64 xhci-hcd
S:  Product=xHCI Host Controller
S:  SerialNumber=0000:00:14.0
C:  #Ifs= 1 Cfg#= 1 Atr=e0 MxPwr=0mA
I:  If#=0x0 Alt= 0 #EPs= 1 Cls=09(hub  ) Sub=00 Prot=00 Driver=hub

T:  Bus=01 Lev=01 Prnt=01 Port=04 Cnt=01 Dev#=  2 Spd=12  MxCh= 0
D:  Ver= 1.10 Cls=00(>ifc ) Sub=00 Prot=00 MxPS=64 #Cfgs=  1
P:  Vendor=12d1 ProdID=0003 Rev=01.00
S:  Product=Keyboard/Mouse KVM 1.1.0
C:  #Ifs= 2 Cfg#= 1 Atr=60 MxPwr=0mA
I:  If#=0x0 Alt= 0 #EPs= 1 Cls=03(HID  ) Sub=01 Prot=01 Driver=usbhid
I:  If#=0x1 Alt= 0 #EPs= 1 Cls=03(HID  ) Sub=01 Prot=02 Driver=usbhid
```

厂商标识、设备标识之类的都有，差不多够用了。
