---
title: CSS 涟漪动画
tags:
---

> 我是天空里的一片云，
> 偶尔投影在你的波心 ──
> 你不必讶异，
> 更无须欢喜 ──
> 在转瞬间消灭了踪影。
> 你我相逢在黑夜的海上，
> 你有你的，我有我的，方向；
> 你记得也好，
> 最好你忘掉，
> 在这交会时互放的光亮！

来搞个不太复杂但是稍有趣味的东西，用 CSS 来做个涟漪动画。先来看下最终的效果：

![](/images/bloba00.gif)

尽管看起来象是几块区域在随机变形，但是背后的原理，只不过是用 CSS 旋转了四个静态的 SVG 图形。以下是它的具体步骤。

## 制作 SVG

首先，来绘制一个如下这样的图形。

![](/images/bloba01.svg)

用什么编辑器都可以，只要能支持导出失量的 SVG 格式就可以。比如说 Illustrator。当然，如果你水平足够，也可以直接写 SVG 文件。

制作完成导出的 SVG 文件内容大致如下，编辑器不同可能稍有差别：

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <path d="M37-5C25.1-14.7,5.7-19.1-9.2-10-28.5,1.8-32.7,31.1-19.8,49c15.5,21.5,52.6,22,67.2,2.3C59.4,35,53.7,8.5,37-5Z" fill="none" stroke="#1d1d1b" stroke-miterlimit="10"/>
  <path d="M20.6,4.1C11.6,1.5-1.9,2.5-8,11.2-16.3,23.1-8.2,45.6,7.4,50S42.1,38.9,41,24.5C40.2,14.1,29.4,6.6,20.6,4.1Z" fill="none" stroke="#1d1d1b" stroke-miterlimit="10"/>
  <path d="M105.9,48.6c-12.4-8.2-29.3-4.8-39.4.8-23.4,12.8-37.7,51.9-19.1,74.1s63.9,15.3,76-5.6c7.6-13.3,1.8-31.1-2.3-43.8C117.6,63.3,114.7,54.3,105.9,48.6Z" fill="none" stroke="#1d1d1b" stroke-miterlimit="10"/>
  <path d="M102,67.1c-9.6-6.1-22-3.1-29.5,2-15.4,10.7-19.6,37.5-7.6,47.8s35.9,3.9,44.5-12.5C115.5,92.6,113.9,74.6,102,67.1Z" fill="none" stroke="#1d1d1b" stroke-miterlimit="10"/>
  <circle cx="13.2" cy="25.6" r="1.6" fill="none" stroke="#1d1d1b" stroke-miterlimit="10"/>
  <circle cx="84.7" cy="93.3" r="1.7" fill="none" stroke="#1d1d1b" stroke-miterlimit="10"/>
</svg>
```

需要先清理一下其中由编辑器生成的样式，只留下图形部分。以便接下来我们用 CSS 来控制样式。上述 SVG 清理后如下：

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <path d="M37-5C25.1-14.7,5.7-19.1-9.2-10-28.5,1.8-32.7,31.1-19.8,49c15.5,21.5,52.6,22,67.2,2.3C59.4,35,53.7,8.5,37-5Z"/>
    <path d="M20.6,4.1C11.6,1.5-1.9,2.5-8,11.2-16.3,23.1-8.2,45.6,7.4,50S42.1,38.9,41,24.5C40.2,14.1,29.4,6.6,20.6,4.1Z"/>
    <path d="M105.9,48.6c-12.4-8.2-29.3-4.8-39.4.8-23.4,12.8-37.7,51.9-19.1,74.1s63.9,15.3,76-5.6c7.6-13.3,1.8-31.1-2.3-43.8C117.6,63.3,114.7,54.3,105.9,48.6Z"/>
    <path d="M102,67.1c-9.6-6.1-22-3.1-29.5,2-15.4,10.7-19.6,37.5-7.6,47.8s35.9,3.9,44.5-12.5C115.5,92.6,113.9,74.6,102,67.1Z"/>
    <circle cx="13.2" cy="25.6" r="1.6" />
    <circle cx="84.7" cy="93.3" r="1.7" />
</svg>
```

然后我们就可以把它嵌入到 HTML 中，并为其添加自定义的属性，象这样：

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="author" content="Ksenia Kondrashova" />
  </head>
  <body>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <path
        fill="#9b5de5"
        class="out-top"
        d="M37-5C25.1-14.7,5.7-19.1-9.2-10-28.5,1.8-32.7,31.1-19.8,49c15.5,21.5,52.6,22,67.2,2.3C59.4,35,53.7,8.5,37-5Z"
      />
      <path
        fill="#f15bb5"
        class="in-top"
        d="M20.6,4.1C11.6,1.5-1.9,2.5-8,11.2-16.3,23.1-8.2,45.6,7.4,50S42.1,38.9,41,24.5C40.2,14.1,29.4,6.6,20.6,4.1Z"
      />
      <path
        fill="#00bbf9"
        class="out-bottom"
        d="M105.9,48.6c-12.4-8.2-29.3-4.8-39.4.8-23.4,12.8-37.7,51.9-19.1,74.1s63.9,15.3,76-5.6c7.6-13.3,1.8-31.1-2.3-43.8C117.6,63.3,114.7,54.3,105.9,48.6Z"
      />
      <path
        fill="#00f5d4"
        class="in-bottom"
        d="M102,67.1c-9.6-6.1-22-3.1-29.5,2-15.4,10.7-19.6,37.5-7.6,47.8s35.9,3.9,44.5-12.5C115.5,92.6,113.9,74.6,102,67.1Z"
      />
    </svg>
  </body>
</html>
```

接下来就是写 CSS 了，代码如下：

```css
body {
  background-color: #fee440;
}

svg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
}

@keyframes rotate {
  100% {
    transform: rotate(360deg);
  }
}

.out-top {
  animation: rotate 20s linear infinite;
  transform-origin: 13px 25px;
}

.in-top {
  animation: rotate 10s linear infinite;
  transform-origin: 13px 25px;
}

.out-bottom {
  animation: rotate 25s linear infinite;
  transform-origin: 84px 93px;
}

.in-bottom {
  animation: rotate 15s linear infinite;
  transform-origin: 84px 93px;
}
```

上述样式有关 SVG 的样式，既可以直接放在 HTML 的 head 部分，也可以嵌入到 SVG 代码当中，类似如下这样的位置：

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <defs>
        <style>
	<!-- 样式写这里 -->
        </style>
    </defs>
    <!-- 略 -->
</svg>
```

现在可以打开 HTML 查看效果了，符合您的审美不？不符合的话，您可以自行调整一下样式。

剩下最后一件事，这个效果不是响应式的。如果你调整屏幕比例，就会发现它在不同屏幕下显示效果不一样。怎么搞呢？给 SVG 添加一个属性就可以了。

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
    <!-- 略 -->
</svg>
```
可以收工了。怎么样，是不是有点儿意思？😎
