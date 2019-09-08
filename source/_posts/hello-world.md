---
title: 在 Eclipse 中使用 Gradle 构建多模块项目
---

本文基本是一篇手把手教程，如果你正巧不觉得太小儿科、又正巧闲极无聊，可以一边读一边跟着敲几个命令试试，说不定会有所收获。万一没弄成，也正好可以有借口骂一句：“什么傻X玩意儿”。正反都不亏。

其实也是偶然，前几天天气不好，想着重装一下系统，把心中的苦闷排遣排遣。你猜怎么着，装完系统发现 [Jetbrains](https://www.jetbrains.com) 全家桶不老好找注册码了。那两家“著名”的在线提供注册码的网站都停止服务了，只好别的地方一顿儿搜，到底找到能用的注册码把 [IDEA](https://www.jetbrains.com/idea) 激活了。激活是激活了，可是看着熟悉的屏幕，不知为嘛，突然就“无尽的空虚涌上心间”。迷糊了好一阵儿，才想起这些年真是挺对 [Jetbrains](https://www.jetbrains.com) 不起。交往了这么久，却没舍得在她身上花过一分钱。呸，臭渣男！何况自己也算是写一点儿软件的人呢！真是越想越觉得惭愧，越想越觉得应该有所改变，应该用回 [Eclipse](https://www.eclipse.org)。

上面一段的确是在扯淡。真正的缘由其实是发现周边的兄弟们，有很多不仅没有用 [Gradle](https://gradle.org)，也从来不曾用 [IDEA](https://www.jetbrains.com/idea)。大家一直在守着 [Eclipse](https://www.eclipse.org) 过日子，就象刚认识她那会儿一样。“人生若只如初见，何事秋风悲画扇”。这让我觉得我有时候确实挺事儿，随随便便用 [Gradle](https://gradle.org) 已属不该，何况项目还不能直接在 [Eclipse](https://www.eclipse.org) 中跑的起来。我觉得有必要写一点儿说明文字，解决掉这个问题。

终于啰嗦完了，以下进入正题。

## 环境准备

先来安装一下 [Gradle](https://gradle.org)。在 **Windows** 上，可以打开 [Cmder](https://cmder.net) 或 **PowerShell**，输入以下命令：

``` bash
λ scoop install gradle
```

如果你看到报错：**'scoop' 不是内部或外部命令，也不是可运行的程序或批处理文件**。那就先装一下 [Scoop](https://scoop.sh)，味道还可以，不骗你。

在 **macOS** 上，也是打开终端，输入以下命令：

``` bash
$ brew install gradle
```

同样，如果你看到报错：**-bash: brew: command not found**。那就先装一下 [Homebrew](https://brew.sh)。[Scoop](https://scoop.sh) 灵感来源于 [Homebrew](https://brew.sh)，所以它的味道当然也还行。

在 **Linux** 上安装，也是一条命令，比如 [Debian](https://www.debian.org) 系:

``` bash
$ sudo apt-get install gradle
```

安装完成后，随便来输个命令检查一下：

``` bash
$ gradle -v
```

如果输出类似：

``` bash
------------------------------------------------------------
Gradle 5.5.1
------------------------------------------------------------

Build time:   2019-07-10 20:38:12 UTC
Revision:     3245f748c7061472da4dc184991919810f7935a5

Kotlin:       1.3.31
Groovy:       2.5.4
Ant:          Apache Ant(TM) version 1.9.14 compiled on March 12 2019
JVM:          1.8.0_221 (Oracle Corporation 25.221-b11)
OS:           Mac OS X 10.12.6 x86_64
```

就证明是可以了。当然，也有可能在你那儿还是会报“命令未找到之类”的，基本上是环境变量未加载，把终端或命令行窗口关了，重新打开后再输入如上命令，八成就可以了。

## 初始化工程

正式开始之前先来个约定，从此处开始，我将不再区分操作系统环境。也就是说，以下的命令同时适用于 **Windows**、**macOS** 和 **Linux**。有一个小小的前题，就是假如你用的是 **Windows**，那么请你使用 [Cmder](https://cmder.net) 或 **PowerShell** 来操作，而不要使用那个**命令提示符(CMD)**。

先来建个工程目录，并切换进去：

``` bash
$ mkdir gradle_demo
$ cd gradle_demo
```

接着初始化工程：

``` bash
$ gradle init
```

会有如下输出。遇到提示可以读一读，我这里就一路回车执行过去。

``` bash
Select type of project to generate:
  1: basic
  2: application
  3: library
  4: Gradle plugin
Enter selection (default: basic) [1..4] 

Select build script DSL:
  1: Groovy
  2: Kotlin
Enter selection (default: Groovy) [1..2] 

Project name (default: gradle_demo): 


> Task :init
Get more help with your project: https://guides.gradle.org/creating-new-gradle-builds

BUILD SUCCESSFUL in 6s
2 actionable tasks: 2 executed 
```

然后看一眼我们现在的目录结构：

``` bash
$ tree
```

```
├── build.gradle
├── gradle
│   └── wrapper
│       ├── gradle-wrapper.jar
│       └── gradle-wrapper.properties
├── gradlew
├── gradlew.bat
└── settings.gradle
```

很干净，我们接着来一点点完善。先来按约定加上源代码目录和测试目录：

``` bash
$ mkdir -p src/main/java
$ mkdir -p src/test/java
```

现在的目录结构是这个样子：

```
├── build.gradle
├── gradle
│   └── wrapper
│       ├── gradle-wrapper.jar
│       └── gradle-wrapper.properties
├── gradlew
├── gradlew.bat
├── settings.gradle
└── src
    ├── main
    │   └── java
    └── test
        └── java
```

我知道你不喜欢命令行，别着急、马上就好、不骗你。再来改一个文件，使用你习惯的编辑器，打开 **build.gradle**，改成这样：

```
apply plugin: "java"
```

删除了文件中原来的注释，加了一行代码。然后输入如下命令试一下：

``` bash
$ gradle build
```

```
BUILD SUCCESSFUL in 829ms
1 actionable task: 1 up-to-date
```

很好，那么接下来，要起飞了！

## 在 **IDE** 中导入

听你的，这一节就不在命令行中“装十三”了，下一节再装。

如果你有 [IDEA](https://www.jetbrains.com/idea)，打开吧。然后导入工程，注意如下图选择 **Gradle**：

![](/images/idea1.png)

然后一路 **Next** 就好了。最终是这个样子：

![](/images/idea2.png)

找到右侧 gradle_demo -> Tasks -> build，双击，不出意外的话，会正常构建成功的。

[Eclipse](https://www.eclipse.org) 也是一样。执行工程导入，如下图：

![](/images/eclipse1.png)

一路 **Next** 到这里，红色圈中的部分你当然要选你对应的工程目录：

![](/images/eclipse2.png)

点 **Finish** 之后大概是这个样子：

![](/images/eclipse3.png)

“非礼勿视”，请自行忽略马赛克。在右下方的 **Gradle Tasks** 中找到 gradle_demo -> Tasks -> build，双击，不出意外的话，也是会正常构建成功的。

## 写几行代码

在 **src/main/java** 下新建个包 **com.example.gradle**，然后再建个类 **Greeter**。建完后 **src** 下目录结构是这样：

```
├── main
│   └── java
│       └── com
│           └── example
│               └── gradle
│                   └── Greeter.java
└── test
    └── java
```

**Greeter** 中随便写些代码，比如我的是个 *Hello world*：

``` java
package com.example.gradle;

public class Greeter {

	public static void main(String[] args) {
		System.out.println("--> Hello world!");
	}

}
```

运行一下看，肯定不会有什么问题。但如果只是这样，要 [Gradle](https://gradle.org) 干吗使？所以接下来引入依赖管理。比如上面的代码，**System.out** 不老美，不如换 **slf4j** 试试。打开项目根目录下的 **build.gradle**，改成这样：

``` groovy
allprojects {
    group = "com.example.gradle"
    
    apply plugin: "java"

    sourceCompatibility = JavaVersion.VERSION_1_8

    tasks.withType(JavaCompile) {
        options.encoding = "UTF-8"
        options.compilerArgs = ['-parameters']
    }

    repositories {
        jcenter()
    }

    dependencies {
        // log
        compile group: 'org.slf4j', name: 'slf4j-api', version: '1.7.26'
        compile group: 'org.apache.logging.log4j', name: 'log4j-slf4j-impl', version: '2.11.2'
    }
}
```

别忘了，最终我们是要构建一个多模块项目。所以上面这段配置描述了当前项目及其未来子模块的共同特征。我没加注释，谁还没背过两单词，你肯定能看懂。

现在在你的 IDE 中刷新一下 [Gradle](https://gradle.org)。比如在 [Eclipse](https://www.eclipse.org) 中是在项目上单击右键，如下图：

![](/images/eclipse4.png)

刷新完成后，你会看到自动加载好的依赖，象这样：

![](/images/eclipse5.png)

[IDEA](https://www.jetbrains.com/idea) 中更方便，一旦改动 **build.gradle**，通常会有提示，如下图中绿色圈中的部分，直接点上面的 **Import Changes** 就好了。如果没有提示，也可以点图中红色圈中的刷新按纽。

![](/images/idea3.png)

接着改一点儿代码，把 **Greeter** 改成这样：

``` java
package com.example.gradle;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class Greeter {
	private static final Logger logger = LoggerFactory.getLogger(Greeter.class);

	public static void main(String[] args) {
//		System.out.println("--> Hello world!");
		logger.info("--> Hello world");
	}
}
```

不要着急去运行，还需要添加 log4j2 的配置文件。打开 [Cmder](https://cmder.net) 或 **PowerShell** 或终端，按约定建立配置文件目录，输入如下命令：

``` bash
$ mkdir src/main/resources
$ mkdir src/test/resources
```

之后 **src** 下目录结构是这样：

```
├── main
│   ├── java
│   │   └── com
│   │       └── example
│   │           └── gradle
│   │               └── Greeter.java
│   └── resources
└── test
    ├── java
    └── resources
```

接着在 **src/main/resources** 下新建一个 **log4j2.xml** 的文件，输入以下内容：

``` xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration status="error">
    <appenders>
        <RollingFile name="RollingFile" fileName="logs/app.log"
                     filePattern="log/$${date:yyyy-MM}/app-%d{MM-dd-yyyy}-%i.log.gz">
            <PatternLayout pattern="%d{yyyy-MM-dd 'at' HH:mm:ss z} %-5level %class{36} %L %M - %msg%xEx%n"/>
            <SizeBasedTriggeringPolicy size="1MB"/>
        </RollingFile>
    </appenders>

    <loggers>
        <root level="info">
            <appender-ref ref="RollingFile"/>
        </root>
    </loggers>
</configuration>
```

在 **src/main/resources** 下新建一个 **log4j2-test.xml**，内容如下：

``` xml
<?xml version="1.0" encoding="UTF-8"?>
<Configuration status="WARN">
    <Appenders>
        <Console name="Console" target="SYSTEM_OUT">
            <ThresholdFilter level="DEBUG" onMatch="ACCEPT" onMismatch="DENY"/>

            <PatternLayout pattern="%d{HH:mm:ss.SSS} [%t] %-5level %logger{36} - %msg%n"/>
        </Console>
    </Appenders>

    <Loggers>
        <Root level="debug">
            <AppenderRef ref="Console"/>
        </Root>
    </Loggers>
</Configuration>
```



## Quick Start

### Create a new post

``` bash
$ hexo new "My New Post"
```

More info: [Writing](https://hexo.io/docs/writing.html)

### Run server

``` bash
$ hexo server
```

More info: [Server](https://hexo.io/docs/server.html)

### Generate static files

``` bash
$ hexo generate
```

More info: [Generating](https://hexo.io/docs/generating.html)

### Deploy to remote sites

``` bash
$ hexo deploy
```

More info: [Deployment](https://hexo.io/docs/deployment.html)
---
