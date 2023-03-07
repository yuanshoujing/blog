---
title: 2023 最值得关注的JS框架与技术
tags:
---

2023 年顶级 JavaScript 框架和技术
TL;DR：JavaScript + React + Redux 仍然以压倒性优势占据主导地位。与 Next.js&Vercel 配对以获得最佳效果。人工智能正在爆炸式增长。Web3 增长强劲。

图片来源：中途
在过去的一年里发生了如此多的变化，感觉一切都已经成熟，可以颠覆，但尽管是我见过的科技领域最具颠覆性的一年，但今年名单上对我来说最大的惊喜是框架生态系统的变化如此之小。

董事会上有很多新玩家（向 SolidJS 大喊大叫），但去年的大赢家今年仍然占据主导地位，而且似乎并没有在就业市场上放弃太多（见下文的数据支持证据）。

那么发生了什么变化呢？

人工智能正在加速开发人员
当我在 3 年对 GPT-2020 进行第一次视频采访时，很少有人相信它真的理解了任何东西，更不用说它可以生成有用的代码了。

快进到今天 - 如果每个开发人员不使用像 Copilot 这样的 AI 工具或使用 ChatGPT 审查他们的代码以查找问题，错误和建议，他们已经处于巨大的劣势。

GitHub 进行了一项测试，以发现 AI 开发工具对开发人员生产力的影响（特别是 GitHub Copilot），他们的发现非常有趣。在对 95 名开发人员的测试中，其中 45 名使用 Copilot 的用户完成的时间比不使用 Copilot 的开发人员少 55%。

Copilot helps developers produce a web server in 55% less time. Source: GitHub Blog
ChatGPT Changed the Game
In November, 2022, OpenAI dropped a bomb with ChatGPT, which became one of the fastest growing apps in history. Within a week, it had over 1 million users, and by January, it had 100 million.

AI Breaks Mainstream with ChatGPT. Source: Google Trends
I was tech lead on a natural language AI project about a decade ago and even then, I recognized the potential to disrupt every industry. I’ve been writing about it on this blog every year since 2015, trumpeting the approaching tidal wave that got going in 2020, and is now flooding into every aspect of technology. Today, that sea-change of disruption is a global reality. AI-first tools are proving their value at scale, and they’re no longer only in the hands of the super-rich.

In 2023, more AI-first tools will launch. The power of embedding models will quietly brew a revolution in things like smart chat bots with huge memory and code assistance tools that deliver insight from your entire code base. If you thought ChatGPT and Codex were cool, trust me: you ain’t seen nothin’ yet.

JavaScript is Still On Top
JavaScript is still the most used language on GitHub, followed closely by Python, which is growing in popularity partially because of fuel from the AI revolution we just discussed.

GitHub Language Popularity Rankings. Source: GitHub
Today, JavaScript is a mature programming language with the largest open source module ecosystem in the world by a landslide.

Module Counts by Package Repository (NPM = JavaScript). Source: Module Counts
Front End Frameworks
TL;DR: React dominates. Angular holds a respectable second-place in job demand, but poor placement in developer satisfaction. Nothing else is close.

This year, we have some new front-end frameworks on the scene. I’m not going to attempt to tell you which one is best — only which one is in strong demand and use in the job market in 2023. I tried to gather data for the following frameworks:

React
Angular
Vue.js
Svelte
SolidJS
Job Market

According to Indeed.com, in the job market, React is mentioned in over 57% of all job listings that mention any front-end framework. Angular comes in second place at 32.5%.

Source: Indeed.com
Search Interest

Source: Google Trends
Downloads

Source: NPM Trends
User Satisfaction
The State of JavaScript Survey 2022 asked users “Would you use it again?” about common JavaScript technologies. Here are the results for several popular frameworks. Next.js, Svelte, and React have great scores. Vue.js rates a passing score. Angular and Gatsby have a lot of room to improve. Data was unavailable for other options.

User Satisfaction. Source: The State of JS 2022
State Management
TL;DR: Redux still dominates front-end state management by a landslide. Nothing else is close.

Source: NPM Trends
For systems where state is managed primarily on the server, tools like React Query and RTK Query have gained some momentum, and GraphQL is still a great way to flexibly query your back-end data services.

For client-side state, Redux still leads the pack by an order-of-magnitude, holding both of the top 2 positions. For good reason: Redux provides deterministic, transactional state management and still has the best middleware ecosystem available. Don’t like the boilerplate? Check out tools like Autodux, Redux Toolkit, etc. Alternatives like Zustand and Jotai may be worth a look for some use-cases, and recoil may be a good option if your UI has thousands or hundreds of thousands of elements that need atomic updates.

Full Stack Frameworks
These frameworks span both the server and the client, and often have great deployment automation features. TL;DR: Next.js enjoys a comfortable lead, but Nest.js has a respectable grip on second place. If you enjoy a more functional approach, and a focus on magical developer experience and deployment automation, Next.js is a safe bet.

I like to tell people that using Next.js with Vercel is like hiring the best DevOps team in the world, except instead of paying them salaries, they save you money. Still true, and still the best, in my opinion.

Source: NPM Trends
Web3
TL;DR: Web3 and cryptocurrency growth and adoption is still strong. Ethereum and EVM L2s and side-chains dominate developer traction and transaction volume by 10x.

In spite of the bear market, crypto funds still plan to invest many billions of dollars in Web3 in 2023. For example, a16z doubled down on their crypto investments, with the announcement of their $4.5B fund 4 in 2022.

In 2020, DeFi was the big story and driver of usage in Web3, but since 2021, its place has been usurped by digital assets called NFTs, representing provable scarcity and ownership for everything from video game items, to art, to music. Here’s how the blockchains are doing in terms of NFT volume over the past 30 days:

按 30 天 NFT 交易量划分的区块链排名。来源： 加密大满贯
默认安全
2018 年，Chrome 宣布将开始将 http 网站标记为“不安全”。从那时起，默认安全变得更加重要。

但是我们习惯于在为应用程序生成的 id 中泄露信息。这可能会导致各种安全问题和用户隐私侵犯。10 多年前，我担心标识符冲突，我创建了一个 id 标准来防止它们，这帮助启发了 UUID V6-V8。

但是 Cuid 的第一个版本并不透明。它泄漏的信息包括确切的 ID 创建时间、主机指纹和会话计数器。为了解决这个问题，我最近发布了 Cuid2。今天，应用程序开发人员应该使用不透明的 ID 而不是 k 可排序的 ID。

结论
今天的现代技术堆栈与去年非常相似。下面是一个典型的例子：

React + Redux on Next.js.在 Vercel 上部署无服务器。
使用 Jest 和测试库进行单元测试很受欢迎，但我非常喜欢 Riteway 的简单性。
Web3 与以太坊，在多边形上进行高频交易。
密码已过时且不安全。首选使用魔术连接或密钥进行 Web3 身份验证。
使用安全、不透明的 id 生成器，如 Cuid2。
