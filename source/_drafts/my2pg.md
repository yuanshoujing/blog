---
title: MySQL 平滑迁移至 PostgreSQL
tags:
---

太长不看三步曲：

1. 安装 pgloader

```bash
apt install pgloader
```

或用 docker

```bash
docker run --rm -it dimitri/pgloader:latest pgloader --version
```

2. 编写配置文件 **my2pg.load**，内容如下：

```
LOAD DATABASE
    FROM mysql://user:password@host:port/database
    INTO postgresql://user:password@host:port/database

 ALTER TABLE NAMES MATCHING ~/\w+/ SET SCHEMA 'public';
```

3. 执行如下命令：

```bash
pgloader my2pg.load
```

迁移完成后，会有很漂亮的报告输出，象这样：

```
                          table name     errors       rows      bytes      total time
------------------------------------  ---------  ---------  ---------  --------------
                     fetch meta data          0       1043                     3.592s
                      Create Schemas          0          0                     0.012s
                    Create SQL Types          0          0                     0.032s
                       Create tables          0        582                    13.764s
                      Set Table OIDs          0        291                     0.032s
------------------------------------  ---------  ---------  ---------  --------------
....
```

如果您不着急赶路，以下多聊几句。

1. 用 Navicat 的数据传输功能来做迁移并不好用。没错它的确是把表和数据都迁移过来了，但是它建的表结构以及数据类型并不一定合理，还可能有索引和约束的缺失。但是这也可能与 Navicat 的版本有关。

2. 如果用 mysqldump 导出 MySQL 数据为 sql 文件，然后修改此文件再导入 PostgreSQL 的话，那么至少有以下内容要改：

   - 清理掉文件中的 **\`** 符号
   - 清理掉表定义中多作的引擎、字符集等定义
   - 列定义中的注释要抽出来，使用单独的语句来定义，表的注释同样如此
   - 列定义中的索引和外键要抽出来，使用单独的语句来定义
   - DATETIME 类型要转换为 TIMESTAMP
   - 布尔类型不是 TINYINT，而是 boolen，并且接受的值是 '0', '1' 这样，而不是 0, 1
   - 自增主键要改成 serial 类型，数据迁移完成，还要更改对应序列的起始值
   - ...

总之还是有些麻烦的，需要写个脚本，大体上一两百行也能完成迁移了。但是有 **pgloader**，写脚本就显得很没必要了。

pgloader 的文档在 [https://pgloader.readthedocs.io/en/latest/index.html](https://pgloader.readthedocs.io/en/latest/index.html)，可以参考。
