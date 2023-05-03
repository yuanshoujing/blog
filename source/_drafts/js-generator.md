---
title: Javascript 生成器
tags:
---

生成器引入到 Javascript 中比较久了，但在日常代码中出场的频率仍然比较低。一方面可能是概念没有被普遍理解，另一方面当然也是因为在许多场景下没有必要使用。

但无论如何，生成器仍然是一项非常酷、非常重要的特性。它可以被简单认为是具有记忆功能的函数，可以让代码在执行的过程中挂起（暂停），在需要的时候继续执行。

举个例子，如下是普通函数：

```js
function foo() {
  console.log("--> %d", 0);
  console.log("--> %d", 1);
  console.log("--> %d", 2);
}
```

执行结果显而易见：

```js
> foo()
--> 0
--> 1
--> 2
```

代码就是一行一行按顺序执行而已，通常的代码归根结底都是这样的逻辑。但是生成器不同，它并非依次执行直到结束这样的逻辑。比如把上面的代码改成生成器函数：

```js
function* foo() {
  console.log("--> %d", 0);
  yield 0;
  console.log("--> %d", 1);
  yield 1;
  console.log("--> %d", 2);
  yield 2;
}
```

是的，生成器函数和普通函数的区别乍一看就是多了一个 `*`，实际的区别当然不止这么点儿，执行一下看：

```js
> foo()
Object [Generator] {}
```

咦，没有输出任何日志，反倒是返回了个对象，类型是 Generator，即生成器。这个对象怎么用呢？假如在 node 命令行中输出 `.` 后按 Tab 键，会得到如下提示：

```js
> const bar = foo()
undefined
> bar
Object [Generator] {}
> bar.
bar.__proto__             bar.hasOwnProperty        bar.isPrototypeOf         bar.propertyIsEnumerable
bar.toLocaleString        bar.toString              bar.valueOf

bar.constructor           bar.next                  bar.return                bar.throw
```

注意到没有，它有个 **next** 方法，来执行一下看：

```js
> bar.next()
--> 0
{ value: 0, done: false }
> bar.next()
--> 1
{ value: 1, done: false }
> bar.next()
--> 2
{ value: 2, done: false }
> bar.next()
{ value: undefined, done: true }
```

有意思，每次调用 `next()` 方法，函数就会往下执行一部分，遇见 `yield` 就暂停了，下次调用 `next()`方法，函数又会从上次暂停的地方继续执行，到下个 `yield` 为止。

你可能会想到，这个方法 `next()` 方法很象是用迭代器呀。猜对了，生成器就是一种特殊的迭代器，只能迭代一次，当 `done` 的值变为 true 后，就不能再迭代了。

```js
> const bar1 = foo();
undefined
>
> for (const b of bar1) {
...   console.log("first loop: %d of bar1", b);
... }
--> 0
first loop: 0 of bar1
--> 1
first loop: 1 of bar1
--> 2
first loop: 2 of bar1
undefined
>
> for (const b of bar1) {
...   console.log("second loop: %d of bar1", b);
... }
undefined
>
```

以上差不多就是生成器的主要内容了。那么，它可以用来干什么呢？

来玩一下，写个按天生成五位流水号的方法。普通函数的写法大概象这样：

```js
let ymd = "";
let num = 0;

function create_sn() {
  const year_month_day = new Date()
    .toISOString()
    .slice(0, 10)
    .replace(/-/g, "");

  if (year_month_day !== ymd) {
    num = 1;
    ymd = year_month_day;
  }

  result = year_month_day + `${num}`.padStart(5, "0");
  num += 1;

  return result;
}
```

用法如下：

```node
> create_sn()
'2023050200001'
> create_sn()
'2023050200002'
> create_sn()
'2023050200003'
> create_sn()
'2023050200004'
> create_sn()
'2023050200005'
```

假如用生成器，写出来的代码可能更优雅一些，象这样：

```js
function* sn_creator() {
  let ymd = "";
  let num = 0;

  const year_month_day = new Date()
    .toISOString()
    .slice(0, 10)
    .replace(/-/g, "");

  num++;

  yield year_month_day + `${num}`.padStart(5, "0");
}
```
