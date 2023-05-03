---
title: 几行代码了解响应式原理
tags:
---

作为当下的开发人员，无论是不是前端，可能都会频繁的与 React、Vue、Svelte、Solidjs 等等打交道。也许你已经很清楚它们背后的运作原理，那不必往下看了。如果还不是很清楚，那咱们可以一起写几行代码，来瞅一眼这些响应式框架背后的思路。

响应式框架最根本的功能其实只有一条：**当数据发生变化时，让界面随之发生变化**。

如何达成这一点呢？粗略的想一下就会觉得，首先要在数据和与之对应的 HTML 元素之间建立绑定关系。可以以某种方式给特定的 HTML 元素打个标记，然后当与此元素相关的值发生变更时，我们就能通过这个标记找到此元素，然后动态的改变它展示出来的值。

比如如下 HTML 模板片断：

```html
<p>{{ current_time }}</p>
```

我们可以定义一个模板编译函数：

```js
function compile(tpl) {
  const re = /(\{\{\s+)(\w+)(\s+\}\})/m;
  const mg = tpl.match(re);
  return tpl.replace(">{{", ' vid="' + mg[2] + '">{{').replace(mg[0], "");
}
```

执行该函数，就会给相关元素打上 vid 标记：

```js
> compile('<p>{{current_time}}</p>')
<p vid="current_time"></p>
```

这样如果需要，我们就可以很方便的找到页面上需要响应的元素：

```js
const vel = document.querySelector("[vid=current_time]");
```

接下来是数据部分。如何监测数据的变化呢？一种方案是使用代理。假如我们有如下数据对象：

```js
{
  current_time: "2023-05-03T05:14:46.176Z";
}
```

可以使用如下函数，为其生成一个代理，拦截其赋值操作：

```js
function reactive(data) {
  return new Proxy(data, {
    set(target, property, value) {
      const prev = target[property];
      target[property] = value;

      if (prev !== value) {
        const vel = document.querySelector(`[vid=${property}]`);
        vel.innerHTML = value;
      }

      return true;
    },
  });
}
```

接下来，就可以面向数据编程了：

```js
const data = reactive({
  current_time: "2023-05-03T05:14:46.176Z",
});

setInterval(() => {
  data.current_time = new Date().toISOString();
}, 1000);
```

最终效果如下：

![](/images/reactive.gif)

以下是完整代码：

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <div id="root"></div>
    <script>
      function compile(tpl) {
        const re = /(\{\{\s+)(\w+)(\s+\}\})/m;
        const mg = tpl.match(re);
        return tpl.replace(">{{", ' vid="' + mg[2] + '">{{').replace(mg[0], "");
      }

      function reactive(data) {
        return new Proxy(data, {
          set(target, property, value) {
            const prev = target[property];
            target[property] = value;

            if (prev !== value) {
              const vel = document.querySelector(`[vid=${property}]`);
              vel.innerHTML = value;
            }

            return true;
          },
        });
      }

      const app = {
        tpl: "<p>{{ current_time }}</p>",

        data: {
          current_time: "2023-05-03T05:14:46.176Z",
        },

        mount() {
          const rootEl = document.querySelector("#root");
          rootEl.innerHTML = compile(this.tpl);

          this.data = reactive(this.data);

          this.mounted();
        },

        mounted() {
          setInterval(() => {
            this.data.current_time = new Date().toISOString();
          }, 1000);
        },
      };

      document.addEventListener("DOMContentLoaded", () => {
        app.mount();
      });
    </script>
  </body>
</html>
```
