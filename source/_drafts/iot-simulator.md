---
title: 使用 Node.js 编写物联网设备模拟器
date: 2019-09-12 12:01:04
tags:
---

> It was the best of time, it was the worst of time, it was the age of wisdom, it was the age of foolishness, it was the epoch of belief, it was the epoch of incredulity, it was the season of light, it was the season of darkness, it was the spring of hope, it was the winter of despair, we had everything before us, we had nothing before us...

据说拽英文可以提升逼格，所以开篇也来这么一段。狄更斯《双城记》的开头，写的真带劲儿。现在而今眼目下，是不是也如狄老头儿所写不清楚，但却实实在在是一个物联网的时代。随便扫一眼，周边到处都是物联网应用的例子。所以，做为程序员，我估计你很可能已经直接或间接的参与过一些物联网项目。

与传统的 CRUD 项目相比，IOT 项目技术复杂度有所增加。但就我个人感受来说，有时候麻烦的部分其实是在测试，尤其是开发过程中的测试。你可能需要写两行代码、点几下手机、再瞅瞅旁边的硬件设备，一天下来，事儿没进展多少，换来换去倒腾的很充实。除此之外，有时候硬件设备也未必可以很方便的放你身边、供咱调试，这样的话，想欢乐的倒腾都没地儿倒腾去。

那怎么办呢？手段之一就是写个硬件模拟器，直接在电脑上跑，让开发过程尽可能少的离开电脑，回归我们之前熟悉的方式。这是本文的部分目的。但是常见的物联网设备，很多其实是作为网络客户端设备出现的。如此以来，所谓模拟器，重点其实是在模拟网络客户端而已。所以本文的另外一部分，实际是在介绍如何使用 Node.js 编写 TCP 客户端程序。

## 环境准备

如果你还没有 Node.js，第一件事肯定是先来安装它。我通常习惯使用 nvm 来管理 Node.js，建议你不如也先来安装一下 nvm，象这样：

``` bash
λ scoop install nvm          # windows
$ brew install nvm              # macOS
$ curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash # linux
```

然后使用 nvm 来安装和设定特定版本的 Node.js，象这样：

``` bash
$ nvm 
```

