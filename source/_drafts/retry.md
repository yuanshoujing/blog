---
title: 用重试机制来构建弹性系统
tags:
---

## 介绍

任何通过网络与其它应用通讯地的程序，都应该有足够的灵活性，来应对短暂的临时性故障。因为这些故障很多时候是可以自恢复的。

例如，为了避免服务过载，很多应用会采取某些限流措施，在并发请求达到一定数量时，暂时性的拒绝新的请求加入。这种情况下，尝试使用该应用的程序，一开始可能会被拒绝连接，但下一刻就好了。

因此，在设计任何系统时，应该考虑到此种故障。本文尝试介绍众多重试机制实现方式当中的一种。

## 故障有哪些

当我们的应用通过网络交互时，可能会遇到很多种意外情况，常见的有：

- 响应慢、无响应
- 格式不正确
- 数据不完整

其它还有很多，开发者应该尽可能处理所有这些错误。

## 重试的前提

重试是在条件允许时，自动再次发起请求的过程。在一些情况下，会显著改善应用程序的用户体验。

![](/images/retry01.png)

能否发起重试，最重要的前提之一是，对同一资源的发起多次相同的请求，能否得到相同的结果。即资源接口是否具有幂等性。

> 标准 REST API 中，**GET/HEAD/OPTIONS** 通常是不会更改服务器上的资源的，因此大多是可重试的。

换个说法就是，如果能够确定，下次请求有可能成功，那就可以尝试重试。否则的话，就不必浪费时间、精力以及系统资源了。

例如，在请求 HTTP 服务时，收到 503 或 408 这样的状态码，则重试可能会有效；但是如果收到了 401 或 403 之类的状态码，则简单的重试肯定不起作用。

## 重试的时机

可以确定的是，并不一定是请求失败后，立即发起重试，而是需要根据具体的场景，选择合适的重试时机。

假如说我们请求失败的原因，是服务端请求过载。则立即发起重试，除了给服务端添乱外，不会有其它结果。严重情况下，可能会加剧服务器的负担，直到耗尽服务器资源。

为了解决这个问题，我们可以在重试失败的请求时引入一些延迟。

退避
请求与其后续重试之间的等待时间称为退避。

使用退避时，请求之间的时间量会随着重试请求数量的增加呈指数级增长。

我们上面刚刚讨论的情况是，退避会有所帮助，它会根据以前的失败次数更改尝试之间的等待时间。

带抖动的退避

从上图中，假设初始请求在第 0 毫秒处发出，并失败并显示可重试的状态代码。假设我们设置了 200 毫秒的退避时间并忽略了请求-响应时间，则第一次重试尝试发生在第 200 毫秒 （1*200ms） 处。如果再次失败，则第二次重试将在 400 毫秒 （2*200） 处发生。同样，随后的重试发生在 800 毫秒，直到我们用尽所有重试。

如果任何请求失败是由上游服务过载引起的，这种分散请求和重试的机制为我们提供了获得成功响应的更好机会。

抖动
退避策略允许我们分配发送到上游服务的负载。然而，事实证明，这并不总是最明智的决定，因为所有重试仍将同步，这可能导致服务激增。

抖动是通过增加或减少退避延迟以进一步分散负载来破坏此同步的过程。

抖动

回到我们之前的示例，假设我们的上游服务正在提供它可以处理的最大负载，并且四个新客户端发送了他们的请求，这些请求失败，因为服务器无法处理该数量的并发请求。仅通过退避实现，假设在 200 毫秒后，我们重试所有 4 个失败的请求。现在，由于同样的原因，这些重试请求也会再次失败。为了避免这种情况，重试实现需要具有随机性。

实现
通过浏览此深入探讨指数退避算法的 AWS 文档，我们使用 Axios 拦截器实现了重试机制

该示例是在 Nodejs 应用程序中编写的，但无论您使用哪种 JavaScript 框架，该过程都是相似的。

在此，我们期望以下设置：

总重试次数在向客户端返回失败响应之前所需的最大重试次数。

重试状态代码要重试的 HTTP 状态代码。默认情况下，我们为所有状态代码 >=500 保持打开状态。

退避这是我们在发送任何后续重试请求时必须等待的最短时间。
axios.interceptors.response.use(
async (error) => {

    const statusCode = error.response.status
    const currentRetryCount = error.response.config.currentRetryCount ?? 0
    const totalRetry = error.response.config.retryCount ?? 0
    const retryStatusCodes = error.response.config.retryStatusCodes ?? []
    const backoff = error.response.config.backoff ?? 100

    if(isRetryRequired({
      statusCode,
      retryStatusCodes,
      currentRetryCount,
      totalRetry})
    ){

      error.config.currentRetryCount =
          currentRetryCount === 0 ? 1 : currentRetryCount + 1;

     // Create a new promise with exponential backoff
     const backOffWithJitterTime = getTimeout(currentRetryCount,backoff);
     const backoff = new Promise(function(resolve) {
          setTimeout(function() {
              resolve();
          }, backOffWithJitterTime);
      });

      // Return the promise in which recalls Axios to retry the request
      await backoff;
      return axios(error.config);

    }

}
);

function isRetryRequired({
statusCode,
retryStatusCodes,
currentRetryCount,
totalRetry}
){

return (statusCode >= 500 || retryStatusCodes.includes(statusCode))
&& currentRetryCount < totalRetry;
}

function getTimeout(numRetries, backoff) {
const waitTime = Math.min(backoff \* (2 \*\* numRetries));

// Multiply waitTime by a random number between 0 and 1.
return Math.random() \* waitTime;
}
While making an Axios request you have to make sure to add the variables in the request configurations:
const axios= require('axios');
const sendRequest= async () => {
const requestConfig = {
method: 'post',
url: 'api.example.com',
headers: {
'authorization': 'xxx',
},
data: payload,
retryCount : 3,
retryStatusCodes: ['408', '429'],
backoff: 200,
timeout: 5000
};
const response = await axios(requestConfig);
return response.data;
}
When configuring the retry mechanism, it is important to tune the total retries, and maximum delay together. The goal is to tailor these values keeping in mind the worst-case response time to our consumers.

Pictorially this is how it will work:

更好的重试次数

对于基于 Java 的应用程序，使用 resilience4j 也可以完成相同的操作。

结论
在这篇文章中，我们研究了众多服务可靠性机制之一：重试。我们了解了它是如何工作的，如何配置它，并解决使用退避和抖动重试的一些常见问题。

我希望你觉得它有帮助。随时欢迎评论或更正。

上述源代码的 GitHub 链接可以在这里找到
