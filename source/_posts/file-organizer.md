---
title: 扫叶林风后，拾薪山雨前
date: 2023-02-09 16:38:20
tags:
---


> 草堂南涧边，有客啸云烟。
> 扫叶林风后，拾薪山雨前。
> 野桥通竹径，流水入芝田。
> 琴月相亲夜，更深恋不眠。

话说周世宗显德年间，有位老先生，性情疏野，不以荣宦为意。一生遇见了很多人、经历了许多事。可惜这些事我一件也不知道、这些人我一个也不晓得。所以以下内容除了这个开头，通篇与这首诗、这个人都毫无关系。

只不过是前天随意翻了一下我的移动硬盘，存的东西那叫一个乱。很多东西在不同的目录或者是相似的目录多次出现，也不知道哪个是新的、哪个是老的，哪个是有用的、哪个是没用的，动也不敢动、删也不敢删，越看越闹心、越不顺眼。是时候该整理一下了。

![](/images/fo0.jpeg)

但是真要动手，就发现这个事儿并不有趣。单单是比较两个文件，就很浪费时间和精力。难道要一个个打开来看？很明显就不现实。我要有这么勤快，硬盘也不会乱到这种程度。只好写一段程序来处理了。
用什么写呢？这种事儿，Windows 上`bat`或`powershell`、Linux 上 `shell` 可能就很合适，只不过这些我都不熟悉。我用的是 `python`，几十行代码就基本可以使用了。最终效果如下：

![](/images/fo1.gif)

你可能注意到，最终生成的是一个命令行程序 `file_organizer.exe`（文末附下载链接）。回头有空也可以写个图形界面的，不过一回头通常就不知道回到啥时候了，管它呢，总之回头再说。眼下先把已经写过的这几十行代码交待一下。

## 需求分析

简单的说，文件**整理**这个事儿可以分解为**分类**和**清理**两个过程。大概需要回答以下问题：

1. 要从哪个文件夹里挑选文件？
2. 挑选哪种类型的文件，文档、表格、图片还是别的？
3. 挑出的文件放在哪个文件夹？
4. 挑出的文件放入新文件夹时，如果发现新文件夹中已经有同名文件了，该怎么处理？
5. 文件放到新文件夹后，原来的文件夹中还保留不保留？

## 接口定义

问题弄明白，事儿就好干了。根据上述五个问题，我们可以给出如下的函数定义：

```python
def organize(src: str, exts: str, dst: str, copy: bool = True, strategy: str):
    """
    :param src:str 源路径
    :param exts:str 扩展名
    :param dst:str 目的路径
    :param copy:bool 复制文件还是移动文件到目的路径
    :param strategy:str 重名处理策略
    """
    pass
```

上述定义中，源路径和目的路径都是目录。目录可能有很多层级，我们需要遍历其中的每一个文件，如果发现文件的扩展名，是需要处理的类型，则按策略对其采取迁移到目的路径的操作。这个操作会在遍历的过程中反复执行，因此可以针对它再定义如下函数：

```python
def deal(src: Path, dst: Path, copy: bool = True, strategy: str = "both"):
    """
    :param src:Path 源路径
    :param dst:Path 目的路径
    :param copy:bool 复制文件还是移动文件到目的路径
    :param strategy:str 重名处理策略
    """
    pass
```

其它还有不少操作，其中之一是假如遇到同名文件，如何判定它们是一样的？方法有很多，比如对比它们的 md5sum 结果等等。Python 标准库中有个 filecmp 就是处理这件事儿的，所以我们不用计算 md5sum 了。除此之外似乎没什么需要特别关注的点了。

## 编码实现

事儿不大，不啰嗦了。以下就是核心代码了：

```python
import shutil

from loguru import logger
from os import walk, listdir
from pathlib import Path
from filecmp import cmp


def rename(file_name: str) -> str:
    idx = file_name.index(".")
    return file_name[:idx] + "_1" + file_name[idx:]


def deal(src: Path, dst: Path, copy: bool = True, strategy: str = "both"):
    if not dst.exists():
        shutil.copy2(src, dst)
        logger.info("迁移原文件到 {}", dst)
    elif cmp(src, dst):
        logger.info("无需迁移文件 {}", dst)
    elif strategy == "later" and src.stat().st_mtime > dst.stat().st_mtime:
        shutil.copy2(src, dst)
        logger.info("迁移新文件到 {}", dst)
    elif strategy == "bigger" and src.stat().st_size > dst.stat().st_size:
        shutil.copy2(src, dst)
        logger.info("迁移大文件到 {}", dst)
    else:
        dst = dst.parent / Path(rename(dst.name))
        shutil.copy2(src, dst)
        logger.info("重命名文件到 {}", dst)

    if not copy:
        src.unlink()


def organize(src: str, exts: str, dst: str, copy: bool = True, strategy: str = "both"):
    if not exts or len(exts) < 1:
        raise ValueError('"exts" is invalid')

    lc_exts = [e.lower() for e in exts.split()]

    src_path = Path(src)
    dst_path = Path(dst)

    if not src_path.exists() or not src_path.is_dir():
        raise ValueError('"src" is invalid')

    if not dst_path.exists():
        dst_path.mkdir(parents=True, exist_ok=True)

    for root, _, files in walk(src):
        for name in files:
            file = Path(root) / Path(name)
            if file.suffix.lower() not in lc_exts:
                continue

            target = dst_path / Path(name)
            deal(file, target, copy, strategy)

    if not copy and len(listdir(src_path)) < 1:
        src_path.rmdir()
```

除此之外，就是些辅助代码了，例如命令行帮助等等。此处不再罗列，我放在了 Github 上，需要的话可以去看。https://github.com/yuanshoujing/file_organizer

## 下载

最后，如果你需要的话，可以点击如下链接下载打包的命令行程序：

- [file_organizer.exe](https://github.com/yuanshoujing/file_organizer/releases/download/v0.1.0-alpha/file_organizer.exe)

此程序只能在 win10 以上系统中运行，并且没有经过严肃测试，请谨慎使用，出了问题概不负责。
