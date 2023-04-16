---
title: JavaScript 的执行过程
tags:
---

JavaScript 可以说是这个世界上最重要的编程语言。如果只允许保留一种编程语言，我认为是 C；如果只允许保留两门编程语言，我认为是 C 和 JavaScript。

多年来，JavaScript 一直是 Github 上使用最多的编程言，没有之一。原因大概是它足够简单，并且几乎可以用来开发任何应用程序。

但是简单也未必都是优点，太省心了，往往容易被轻视，JavaScript 也是如此。提到它的时候，很多人心里或许是有些不屑一顾的，但是到真动手的时候，又可能会搞出一些“莫名其妙”的错误。

所以不如来一起回顾几个 JavaScript 的基本原理。需要说明的是，下文的一些术语或名词，在 JavaScript 中并不一定是一一对应或严格存在的关系，但是原理大致就是这么个原理。不对的地方，请留言指正。

以下进入正题。

## 执行上下文。

人们说话写文章有上下文语境，代码的执行也同样有其上下文环境。执行上下文可以被认为是一个容器，它包含程序当前执行状态的所有必要信息。例如可用的变量、函数和对象等等。

首先被创建出来的是全局上下文，它包括全局的变量和函数声明，比如浏览器中的 window 对象、Node 中的 global 对象等，然后将 this 绑定到这些对象。

### 声明前置

当代码开始执行时，首先会把所有的变量和函数`声明`移动到其作用域的最前端。请注意，移到最前端的仅是变量和函数的`声明`，不包括为其赋的`值`。看如下代码：

```js
let foo = "Hello";

fn(); // 返回 Hello undefined

var bar = "world";

function fn() {
  console.log("%s %s", foo, bar);
}
```

但是以最佳实践来说，应该忘掉 `var`，尽可能的将变量声明为 `const`，必要时声明为 `let`。那么以此原则，改造上述代码，会怎么样呢？

```js
const foo = "Hello";

fn(); // 报异常 ReferenceError: Cannot access 'bar' before initialization

const bar = "world";

function fn() {
  console.log("%s %s", foo, bar);
}
```

说明了什么呢？说明了 const 变量与 var 变量不同，在声明前移后，并没有被初始化为 undefined。let 变量也是如此，不仅是变量，以 const 或 let 声明的函数也同样遵循此规则。

### 函数上下文

函数执行时也遵循同样的规则。每当一个函数开始执行，可以认为一个新的函数相关的上下文对象就会被创建。它记录了该函数执行时的状态信息，其中的变量及嵌套函数的处理逻辑，与前述规则保持一致。

函数之间通常相互调用、层层嵌套，因此它们的执行上下文也同样如此。JavaScript 使用调用堆栈来组织上述信息。

## 调用堆栈

调用堆栈是 JavaScript 运行时环境的一个基本组件，用于跟踪当前的执行上下文。它是一种数据结构，用来管理在程序中调用和执行函数的顺序。

每次在 JavaScript 中调用一个函数，它的执行上下文就会被添加到调用堆栈的顶部。这个执行上下文包括关于函数的信息，比如它的参数、局部变量和作用域。一旦函数执行完，此上下文对象就会从调用堆栈的顶部删除，控制权同时也被转交回此函数的调用者。

调用堆栈遵循后进先出(LIFO)原则，最后添加的项最新被弹出。也就是说，后调用的函数在堆栈顶部，先调用的函数在堆栈底部。例如如下代码：

```js
function multiply(a, b) {
  return a * b;
}

function square(n) {
  return multiply(n, n);
}

console.log(square(2));
```

当程序开始运行时，全局执行上下文被添加到调用堆栈中。调用 square 函数时，它的执行上下文被添加到调用堆栈的顶部。在 square 函数内部，调用 multiply 时，multiply 的执行上下文又会被添加到调用堆栈的顶部。

接下来，multiply 执行完后，它的执行上下文将从调用堆栈顶部删除，控制权交回 square。square 执行完，它的执行上下文也会从调用堆栈的顶部删除，控制权被传递回全局上下文。

以上描述的是同步函数，异步函数不完全一样。

## 调用队列

JavaScript 是单线程的，一次只能执行一个任务。那耗时的异步任务，例如从服务端取数据、等待用户输入之类怎么办？JavaScript 维护了一个调用队列来处理这些东西。任何需要异步执行的函数，都会被加入这个调用队列。

与调用堆栈不同的是，这个调用队列是先进先出的(FIFO)，先加进来的任务先执行。看如下代码：

```js
console.log("First");

setTimeout(function () {
  console.log("Second");
}, 1000);

console.log("Third");
```

第一行不说了。当程序执行到 setTimeout 时，因为它是异步的，于是被加进了调用队列。接下来第七行代码被加入调用堆栈执行，输出 Third。一秒后，setTimeout 的回调函数被加入到调用堆栈执行，输出 Second。
上述过程发生在事件循环当中。

## 事件循环

可以简单认为事件循环是一个不停运行的死循环。在程序运行期间，它会不断的检测调用队列中是否有异步任务。如果有，它就去检查调用堆栈是否空闲，空闲的话，就把异步任务加入调用堆栈执行。

如下是一个示意图：

![](/images/jep0.gif)