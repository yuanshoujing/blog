---
title: 超简单的 Web 存储库
tags:
---

这是一个超级简单的 Web 存储工具，可用于浏览器，也可用于 Node 环境。代码测试覆盖度接近 100%，基本可用。

```
-----------|---------|----------|---------|---------|-------------------
File       | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
-----------|---------|----------|---------|---------|-------------------
All files  |   96.21 |    76.52 |   97.36 |   96.21 |
 base.js   |   98.49 |    79.22 |     100 |   98.49 | 200,298
 helper.js |   96.15 |       84 |     100 |   96.15 | 50
 index.js  |       0 |        0 |       0 |       0 |
 logger.js |      50 |      100 |       0 |      50 | 4
 pager.js  |    87.5 |    46.15 |     100 |    87.5 | 25,45,67
-----------|---------|----------|---------|---------|-------------------
```

## 安装

```bash
npm i niba-data
```

## 定义模型

```javascript
class Organ extends NBModel {
  propsMap = {
    name: String,
    spell: String,
    kind: String,
    parent_id: String,
    state: Number,
    remark: String,
    avatar_id: String,
    create_time: Date,
  };

  fulltext = ["name", "spell", "remark"];

  constructor() {
    super({ name: "organs" });
  }
}
```

## 保存

```javascript
const organ = new Organ();
const { _id } = await organ.save({
  name: `测试机构`,
  spell: `csjg`,
  avatar_id: null,
  kind: "0",
  parent_id: "178b7af3-4c85-4dc0-8a25-8c80db425ae8",
  state: 1,
  remark: null,
  create_time: new Date(),
});
```

## 保存或更新

```javascript
const organ = new Organ();
const saved = await organ.upsert({
  name: `测试机构`,
  spell: `csjg`,
  avatar_id: null,
  kind: "0",
  parent_id: "178b7af3-4c85-4dc0-8a25-8c80db425ae8",
  state: 1,
  remark: null,
  create_time: new Date(),
});

await organ.upsert({
  ...saved,
  ...{
    name: "测试机构X",
  },
});
```

## 读取

```javascript
const indb = await organ.get(saved._id);
```

## 删除

```javascript
const result = await organ.delete(_id);
```

## 查询

```javascript
const selector = {
  kind: "30",
  spell: "csjg_86",
};

const organ = new Organ();
const result = await organ.query({ selector, sort: ["name"] });
```

## 分页

```javascript
const organ = new Organ();
const result = await organ.pagedQuery({
  selector: {
    spell: "csjg_86",
  },
  sort: ["name"],
  page: 1,
  rows: 10,
});
```

## 全文检索

```javascript
const organ = new Organ();
const result = await organ.search({
  kws: "_86",
  sort: [{ name: "asc" }],
});
```

## 分页全文检索

```javascript
const organ = new Organ();
const result = await organ.pagedSearch({
  kws: "_86",
  rows: 2,
});
```

你如果好奇，niba 就是“泥巴”，土味十足的意思。是我基于 pouchdb 做的薄薄一层封装，源码在 [niba-data](https://github.com/yuanshoujing/niba-data)。欢迎围观嘲笑。
