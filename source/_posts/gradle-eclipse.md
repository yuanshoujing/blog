---
title: 在 Eclipse 中使用 Gradle 构建多模块项目
---

本文基本是一篇手把手教程，如果你看了标题之后不觉得太小儿科、又正巧闲极无聊，可以一边读一边跟着敲几个命令试试，说不定会有所收获。万一没弄成，也正好可以有借口骂一句：“什么傻X玩意儿”。正反都不亏。

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

[Eclipse](https://www.eclipse.org) 你应该已经有了，这里只说一下我用的是 **eclipse-jee Version: 2019-06 (4.12.0)**，已经内置了 [Buildship](http://marketplace.eclipse.org/content/buildship-gradle-integration) 插件。请检查你的 [Eclipse](https://www.eclipse.org) 是否安装了此插件，如果没有，请自行安装一下。此外，如果你的 [Eclipse](https://www.eclipse.org) 版本过低，小于 **2018-12 (4.10)**，可能首先需要升级一下 [Eclipse](https://www.eclipse.org)。

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

听你的，这一节就不在命令行中“装13”了，下一节再装。

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

在 **src/test/java** 下新建个包 **com.example.gradle**，然后再建个类 **Greeter**。建完后 **src** 下目录结构是这样：

```
├── main
│   └── java
└── test
    └── java
│       └── com
│           └── example
│               └── gradle
│                   └── Greeter.java
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
		logger.debug("--> Hello world");
	}
}
```

不要着急去运行，还需要添加 log4j2 的配置文件。打开 [Cmder](https://cmder.net) 或 **PowerShell** 或终端，按约定建立配置文件目录，输入如下命令：

``` bash
$ mkdir -p src/main/resources
$ mkdir -p src/test/resources
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

在 **src/test/resources** 下新建一个 **log4j2-test.xml**，内容如下：

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

好了，现在再运行一下 **Greeter**。不出意外的话，会输出以下内容：

```
15:43:45.937 [main] DEBUG com.example.gradle.Greeter - --> Hello world
```

很不错，日志用起来了。

还有些东西要提一下，所以接着来做实验，在 **src/main/java** 下也建个包 **com.example.gradle**，然后在它下面也建个类 **Greeter**，代码如下：

``` java
package com.example.gradle;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class Greeter {
	private static final Logger logger = LoggerFactory.getLogger(Greeter.class);

	public static void main(String[] args) {
		logger.info("--> Hello world");
	}
}
```

注意它与 **src/test/java** 下的**同名类**并不完全一样，那个是 **logger.debug**，这个是 **logger.info**，仅此而已。现在来运行一下这个 **Greeter**，不出意外的话，没有任何输出。但是看一眼现在的目录结构，会变成这样：

```
├─gradle
├─logs
└─src
```

多了个 **logs** 目录，其中的 **app.log** 文件中记录了刚才的运行结果。

说明了什么呢？说明运行 **src/test/java** 下的代码，会优先使用 **src/test/resources** 下的配置；运行 **src/main/java** 下的代码，则会使用 **src/main/resources** 下的配置。这样，我们就很容易把开发环境的配置与线上环境的配置区分开来，不用每次打包时都改来改去。很好，是不是？

上面说的是正常情况，在 [Eclipse](https://www.eclipse.org) 下可能会出现与上述描述不一致的情况。有时候明明在 **debug** **src/test/java** 下的代码，但就是没有正常加载 **src/test/resources** 下的配置。那该怎么办呢？可以手工修改一点儿设置。首先点那个 **debug** 按纽的下拉菜单，打开 **Debug Configurations** 窗口，象这样：

![](/images/eclipse7.png)

然后就是 Classpath -> User Entries -> Advanced，就会弹出上图的 **Advanced Options**，然后选 **Add Folders**，手工把 **src/test/resources** 加上，然后点 **Up** 让它出现在 **User Entries** 下的最前面就可以了。

这一段很无趣，我知道。所以为了缓解这种情况，我特意在上面的一幅插图中画了一只可爱的小兔子，不知道你注意到没有？好了，不要往回翻了，我随口瞎说的，我哪里会画什么可爱的小兔子？不要少女心泛滥。技术大多时候就是看起来如此板正没意思，连这样的介绍文章，想写的有趣些都几乎毫无办法。所以程序员才如此苦逼，不是吗？

但既然你已经读到了这里，我敬你是一条汉子。咱们还是要继续下去，毕竟目标还未完成。到现在为止，我们只是构造了一个单模块项目，我们的目的其实是多模块项目。

## 增加子模块

回到我们“最爱”的命令行，在项目根目录（gradle_demo）下为子模块初始化目录结构：

``` bash
$ mkdir -p gradle_demo_domain/src/main/java
$ cp build.gradle gradle_demo_domain
```

完成后，gradle_demo 目录，大体如下：

```
├─gradle_demo_domain
│  └─src
│      └─main
│          └─java
└─src
    ├─main
    │  ├─java
    │  │  └─com
    │  │      └─example
    │  │          └─gradle
    │  └─resources
    └─test
        ├─java
        │  └─com
        │      └─example
        │          └─gradle
        │              └─test
        └─resources
```

现在打开 **gradle_demo_domain/build.gradle** 文件，把其中的内容先清空，然后加入以下内容：

``` gradle
archivesBaseName = "gradle-demo-domain"
```

接着打开项目根目录下的 **settings.gradle**，改成这样：

``` gradle
rootProject.name = 'gradle_demo'

include "gradle-demo-domain"
```

好了，来输个命令测试一下：

``` bash
$ gradle projects
```

```
> Task :projects

------------------------------------------------------------
Root project
------------------------------------------------------------

Root project 'gradle_demo'
\--- Project ':gradle-demo-domain'

To see a list of the tasks of a project, run gradle <project-path>:tasks
For example, try running gradle :gradle-demo-domain:tasks

BUILD SUCCESSFUL in 810ms
1 actionable task: 1 executed
```

可以看到根项目 **gradle_demo** 下挂了个子项目 **:gradle-demo-domain**。如果你之前已经把项目导入到 [IDEA](https://www.jetbrains.com/idea) 中，那你现在应该能看到让你导入 gradle 变更的提示，如果没有也可以手动点 Gradle 面板的刷新按纽，之后 Gradle 面板下应该会变成这样：

![](/images/idea4.png)

相应的 Project 面板也会出现相应的子模块。

不巧的是，如果你现在在 [Eclipse](https://www.eclipse.org) 中执行 gradle 刷新，子模块不一定能正确出现，或者子模块出现了但看不到源代码目录。所以我们还需要改点东西。重新打开项目根目录下的 **settings.gradle**，改成这样：

``` gradle

rootProject.name = 'gradle_demo'

include "gradle-demo-domain"

project(':gradle-demo-domain').projectDir = new File(settingsDir, './gradle_demo_domain')
```

现在再来刷新 gradle 就应该可以在 [Eclipse](https://www.eclipse.org) 中看到项目被正确加载，并且可以正常构建，如下图：

![](/images/eclipse8.png)

这样的话，本篇的主旨已经完成了，其实可以 Game Over 了。但是，下课了不拖课，算什么老师？开会时不补充两点，做领导怎么好意思？“见贤思齐”，我也要再啰嗦几句！

## 模块间依赖

子模块有了，那如何引用子模块中的内容呢？来做了试验，在子项目 **gradle-demo-domain** 的 **src/main/java** 下新建个包，比如叫 **com.example.gradle.model**，然后在它下面新建个类 **User**，代码如下：

``` java
package com.example.gradle.model;

public class User {

	private String name;

	private String address;

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	@Override
	public String toString() {
		return "来自" + address + "的" + name;
	}

}
```

现在尝试一下在之前写的 **com.example.gradle.test.Greeter** 中引入这个 **User**，肯定是不行的。那怎么弄？找到根项目 **gradle_demo** 下的 **build.gradle** 打开，把它改成这样：

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


dependencies {
    compile project(":gradle-demo-domain")
}
```

然后再在根项目上刷新一下 Gradle。接着打开 **com.example.gradle.test.Greeter**，就会发现可以顺利引入 **User** 了。加几行代码试验一下，比如改成这样：

``` java
package com.example.gradle.test;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.example.gradle.model.User;

public class Greeter {
	private static final Logger logger = LoggerFactory.getLogger(Greeter.class);

	public static void main(String[] args) {
		User user = new User();
		user.setName("葡萄皮");
		user.setAddress("吐鲁番");
		logger.debug("--> Hello, {}!", user);
	}
}
```

运行一下，看到类似下面这样就 OK 了。

```
10:40:24.030 [main] DEBUG com.example.gradle.test.Greeter - --> Hello, 来自吐鲁番的葡萄皮!
```

别走，还有最后一个主题。

## 发布模块

如果我们编写的是一个类库项目，可能最终需要编译打包成 **jar** 供其它项目使用。那比较好的方案通常是用 [Nexus](https://www.sonatype.com/nexus-repository-oss) 搭建一个私有依赖库，然后将 **jar** 发布到这个私有依赖库。在 [Gradle](https://gradle.org) 中要完成此项任务也很方便。继续来改根项目 **gradle_demo** 下的 **build.gradle**，如下：

``` groovy
allprojects {
    group = "com.example.gradle"
    
    apply plugin: "java"
    apply plugin: "maven"

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

    configurations {
        deployerJars
    }

    uploadArchives {
        repositories {
            mavenDeployer {
                configuration = configurations.deployerJars
                repository(url: "http://ip:port/repository/maven-releases/") {
                    authentication(userName: "username", password: "password")
                }
            }
        }
    }
}


dependencies {
    compile project(":gradle-demo-domain")
}
```

不要完全照抄，如下部分注意按你的实际情况更改：

``` groovy
repository(url: "http://ip:port/repository/maven-releases/") {
    authentication(userName: "username", password: "password")
}
```

现在在项目根目录 **gradle_demo** 下输入以下命令：

``` bash
$ gradle tasks
```

会看到输出中有如下部分：

```
...

Upload tasks
------------
uploadArchives - Uploads all artifacts belonging to configuration ':archives'

...
```

试着输入以下命令：

``` bash
$ gradle uploadArchives
```

如果你之前的仓库配置没有问题，就会看到正常编译打包并自动上传到了你的私有依赖库。生活一下子美好了很多，是不是？

## 结语

这次是真的没了，很感谢你能读到这里。

基本上，我把如何使用 Gradle 做 Java 开发，简单的描述了一遍。应该是可以解决**如何做（HOW）**这个问题，但是对于**为什么这样（WHY）**则没有过多讨论。程序员通常是学习能力很强的一个群体，相信你可以通过搜索、查资料找到答案。

最后，如果发现上面的叙述中有错误的地方，可以告诉我，我找时间订正。