---
title: 等我，或许？
tags:
---

如果你觉得标题有些小暧昧，别在意。因为接下来要讨论的内容，和之前一样，还是呆板并且无趣。

Python 中的 asyncio 是个特别棒的东西，相信你已经用过无数次了。对于她的高贵出身、她浑身闪闪发光的华彩，我们是不必讨论的。总之就是，很好、特别好。

但是金无足赤，asyncio 如果说有缺点的话，可能就在于她的魅力过大，很容易“感染”周边的事物。听起来不象人话，对吧？那换个相对直白的说法：在异步的调用堆栈中，需要把函数定义成异步的，异步的函数的执行时需要等待。如果你正在写异步的代码，很可能会发现。你本来只是打算在某个功能点上使用异步，但是现在此功能点调用堆栈后的一系列方法，都被定义成异步的了。

直接看代码可能更容易说明问题：

```python
import asyncio


async def mem_value_reader():
    """从程序逻辑中计算出某个值"""
    return "A value in memory"


async def db_value_reader():
    """从数据库中读取某个值"""
    return "A value in the database"


async def bootstrap(*readers):
    result = []
    for reader in readers:
        v = await reader()
        result.append(v)
    print(result)


if __name__ == "__main__":
    asyncio.run(bootstrap(db_value_reader, mem_value_reader))
```

代码很简单，不解释。需要讨论的是其中的改进空间，应该很容易想到：在程序中计算一个值，通常是不需要异步的。上述代码中的 mem_value_reader，去年 async 关键字，可能更合适。

```python
def mem_value_reader():
    """从程序逻辑中计算出某个值"""
    return "A value in memory"
```

那为什么不去掉呢？因为去掉之后，bootstrap 中的 await reader() 部分就不总是成立了。同步的函数是不可以 await 的。

正是这个原因造成了，我们前面提到异步的“感染”性。本不必异步的函数，迫不得已被定义成异步的了。不仅如此，函数一旦被定义成异步，就不能直接在同步函数中调用了。例如下面的代码是不成立的：

```python
def foo():
    await db_value_reader()
```

这就有些不太美好了。试想一下，假如 mem_value_reader 的计算逻辑是可以复用的，类似工具方法，我们希望它既能在异步函数中用，也能在同步函数中用，该怎么办呢？

其中的一种解决方案是引入一个中间函数，来揉合同步函数和异步函数。象这样：

```python
import inspect

async def await_me_maybe(callback):
    result = callback()
    if inspect.isawaitable(result):
        return await result
    return result
```

顺便说一句，这个函数的名称，正是本文标题的由来。函数的想法也很简单，就是先执行一下传入函数，如果执行结果是可等待的，就等待此结果，否则直接返回。

有了这个函数，之前的代码就可以改写成如下这个样子：

```python
import asyncio
import inspect


def mem_value_reader():
    """从程序逻辑中计算出某个值"""
    return "A value in memory"


async def db_value_reader():
    """从数据库中读取某个值"""
    return "A value in the database"


async def await_me_maybe(callback):
    result = callback()
    if inspect.isawaitable(result):
        return await result
    return result


async def bootstrap(*readers):
    result = []
    for reader in readers:
        v = await await_me_maybe(reader)
        result.append(v)
    print(result)


if __name__ == "__main__":
    asyncio.run(bootstrap(db_value_reader, mem_value_reader))
```

这样以来，我们的 bootstrap 就似乎“神通广大”了，既可以接收同步的函数，也可以接收异步的函数。世界又美好了一些。

但是等等，你可能会想到：同样的问题在 Javascript 中是否也存在呢？来写段代码：

```javascript
function foo() {
  return "foo";
}

async function bar() {
  return "bar";
}

async function bootstrap(...funcs) {
  result = [];
  for (const f of funcs) {
    r = await f();
    result.push(r);
  }
  console.log(result);
}

(async () => {
  await bootstrap(foo, bar);
})();
```

在 node 中执行一下，我 X，竟然可以！为什么呢，因为在 Javascript 中，尽管异步函数同样必须在异步函数内执行，但是 await 一个同步函数也没什么问题。

OK，这个话题就到这里了。有不合适的地方，请留言指正。
