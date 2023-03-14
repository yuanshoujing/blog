---
title: blob animation
tags:
---

制作背景斑点动画仅需 1.5KB：分步指南
今天我们将向您展示如何创建此背景动画

它给人一种斑点随机变形的错觉。但实际上，我们只是用 CSS 旋转了四个静态 SVG 形状。

步骤 1：创建形状
首先，我们绘制形状。我正在使用 Illustrator，但任何支持 SVG 导出的矢量编辑器都可以使用。

首先创建一个方形画布。我有 100 x 100 像素，但由于我们正在制作 SVG 图像，它可以针对任何屏幕尺寸进行缩放而不会降低质量。因此，像素大小无关紧要。

空白画布

您需要两对圆形形状。形状的数量并不重要;它们只需要是圆形的，并且被视口很好地裁剪。

要设置动画的形状

此外，向中心点添加圆圈。它们不会停留在最终图像中;它们只是获取形状旋转原点坐标的简单方法。

要设置动画的形状 + 圆形

在这一点上，我们不关心样式和颜色。我们只需要从 Illustrator 收集形状。因此，让我们将整个图像导出为.svg 文件。

步骤 2：准备 SVG 代码
以下是从 Illustrator 导出的 svg 代码：
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
<path d="M37-5C25.1-14.7,5.7-19.1-9.2-10-28.5,1.8-32.7,31.1-19.8,49c15.5,21.5,52.6,22,67.2,2.3C59.4,35,53.7,8.5,37-5Z" fill="none" stroke="#1d1d1b" stroke-miterlimit="10"/>
<path d="M20.6,4.1C11.6,1.5-1.9,2.5-8,11.2-16.3,23.1-8.2,45.6,7.4,50S42.1,38.9,41,24.5C40.2,14.1,29.4,6.6,20.6,4.1Z" fill="none" stroke="#1d1d1b" stroke-miterlimit="10"/>
<path d="M105.9,48.6c-12.4-8.2-29.3-4.8-39.4.8-23.4,12.8-37.7,51.9-19.1,74.1s63.9,15.3,76-5.6c7.6-13.3,1.8-31.1-2.3-43.8C117.6,63.3,114.7,54.3,105.9,48.6Z" fill="none" stroke="#1d1d1b" stroke-miterlimit="10"/>
<path d="M102,67.1c-9.6-6.1-22-3.1-29.5,2-15.4,10.7-19.6,37.5-7.6,47.8s35.9,3.9,44.5-12.5C115.5,92.6,113.9,74.6,102,67.1Z" fill="none" stroke="#1d1d1b" stroke-miterlimit="10"/>
<circle cx="13.2" cy="25.6" r="1.6" fill="none" stroke="#1d1d1b" stroke-miterlimit="10"/>
<circle cx="84.7" cy="93.3" r="1.7" fill="none" stroke="#1d1d1b" stroke-miterlimit="10"/>
</svg>
代码可能看起来有所不同，具体取决于您使用的图形编辑器和导出设置。无论如何，我们需要通过删除从图形编辑器继承的所有样式来清理它。唯一应该保留的元素是：

的属性 viewBox<svg>
blob 的 4 个元素及其属性<path>d
2 附加元素
一旦我们有了最少的代码，我们就可以将其嵌入到 HTML 页面中并将图像设置为全屏：

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="author" content="Ksenia Kondrashova">
    <style>
        svg {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100vh;
        }
    </style>
</head>
<body>

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <path d="M37-5C25.1-14.7,5.7-19.1-9.2-10-28.5,1.8-32.7,31.1-19.8,49c15.5,21.5,52.6,22,67.2,2.3C59.4,35,53.7,8.5,37-5Z"/>
    <path d="M20.6,4.1C11.6,1.5-1.9,2.5-8,11.2-16.3,23.1-8.2,45.6,7.4,50S42.1,38.9,41,24.5C40.2,14.1,29.4,6.6,20.6,4.1Z"/>
    <path d="M105.9,48.6c-12.4-8.2-29.3-4.8-39.4.8-23.4,12.8-37.7,51.9-19.1,74.1s63.9,15.3,76-5.6c7.6-13.3,1.8-31.1-2.3-43.8C117.6,63.3,114.7,54.3,105.9,48.6Z"/>
    <path d="M102,67.1c-9.6-6.1-22-3.1-29.5,2-15.4,10.7-19.6,37.5-7.6,47.8s35.9,3.9,44.5-12.5C115.5,92.6,113.9,74.6,102,67.1Z"/>
    <circle cx="13.2" cy="25.6" r="1.6" />
    <circle cx="84.7" cy="93.3" r="1.7" />
</svg>

</body>
</html>
接下来是向元素添加颜色和类名。顺便说一句，为 coolors.co 漂亮的随机调色板干杯。
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <path fill="#9b5de5" class="out-top" d="M37-5C25.1-14.7,5.7-19.1-9.2-10-28.5,1.8-32.7,31.1-19.8,49c15.5,21.5,52.6,22,67.2,2.3C59.4,35,53.7,8.5,37-5Z"/>
    <path fill="#f15bb5" class="in-top" d="M20.6,4.1C11.6,1.5-1.9,2.5-8,11.2-16.3,23.1-8.2,45.6,7.4,50S42.1,38.9,41,24.5C40.2,14.1,29.4,6.6,20.6,4.1Z"/>
    <path fill="#00bbf9" class="out-bottom" d="M105.9,48.6c-12.4-8.2-29.3-4.8-39.4.8-23.4,12.8-37.7,51.9-19.1,74.1s63.9,15.3,76-5.6c7.6-13.3,1.8-31.1-2.3-43.8C117.6,63.3,114.7,54.3,105.9,48.6Z"/>
    <path fill="#00f5d4" class="in-bottom" d="M102,67.1c-9.6-6.1-22-3.1-29.5,2-15.4,10.7-19.6,37.5-7.6,47.8s35.9,3.9,44.5-12.5C115.5,92.6,113.9,74.6,102,67.1Z"/>
</svg>
我保持背景透明，因此可以将页面背景设置为黄色。或者，我们可以设置或包含黄色回到图像中。我们在如何处理颜色方面非常灵活。<svg>background-colorsvg
body {
    background-color: #fee440;
}
非动画预览

步骤 3：为形状添加动画效果
下一步是使用 CSS 对元素进行动画处理。这可以通过在标记外部添加常规 CSS 代码或直接在 SVG 代码中插入部分来完成。我插入 CSS 是为了保持代码结构更干净，因为这允许将动画另存为单独的.svg 文件。<path><svg><style>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
<defs>

<style>

        </style>

    </defs>
    ...

</svg>
四个形状中的每一个都将在无限循环中沿同一方向旋转。所以我们只需要一个从 0 到 360 度旋转。keyframes

所有 4 个移动速度都非常慢，但速度不同。因此，对于每个 blob，我们仅更改动画持续时间和原点。

对于原点，我们使用圆的坐标（特别是和属性）。完成后，我们可以删除圆圈。cxcy

<style>
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
</style>

...

// turns to transform-origin: 13px 25px
<circle cx="13.2" cy="25.6" r="1.6" />
// turns to transform-origin: 84px 93px
<circle cx="84.7" cy="93.3" r="1.7" />
以像素为单位设置原点可能会令人困惑。实际上，这些值与屏幕像素无关，而是与 SVG 内部坐标系有关，SVG 内部坐标系是我们在 Illustrator 中创建的 100 x 100 像素大小的画布。同样，SVG 可以缩放到任何屏幕尺寸，因此将像素作为原点只是 CSS 语法的问题。

动画完成！

步骤 4：设置响应能力
让我们在浏览器中打开页面并尝试不同的屏幕比例。默认情况下，SVG 通过在侧面添加额外的空间来保持整体始终可见。这样，我们可以清楚地看到圆形旋转的形状。viewBox

.GIF
响应能力，空间宽敞

相反，我们希望裁剪图像，以便斑点仅部分可见。它可以通过属性轻松完成。preserveAspectRatio="xMidYMid slice"

.GIF
裁剪的响应能力

就是这样！动画可以用作内联或保存在外部 blob.svg 文件中。即使没有最小化，文件大小也在 1.5kb 左右，这很酷 😎
