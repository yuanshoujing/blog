---
title: Java 和 Nodejs 的 AES 加解密互操作
tags:
---

AES 加解密非常常用，常用到大家其实很多时候都是不求甚解，直接从网上复制一段代码就用了。并且绝大多数情况下也都用的挺好。

除了一种情况，就是接口交互时，接口的调用方和提供方，经常会在加解密部分调试很久也搞不通。双方都觉得挺委屈，都不理解明明是“标准的” AES 加密，不知道为什么对方就是解密不了。

原因其实就在于，就 AES 加解密的内部细节上，双方的代码并未对齐。比如工作模式不一致、填充方式不一致等等。具体可以搜 一些 AES 原理之类的文章来看，这里不再展开。

以下直接上代码，展示一种 Java 和 Nodejs 可以互相加解密的方案。

先来看 java 部分，由于密钥派生算法用了 Scrypt，所以需要引入一个依赖：

```xml
<dependency>
    <groupId>com.lambdaworks</groupId>
    <artifactId>scrypt</artifactId>
    <version>1.4.0</version>
</dependency>
```

然后加解密函数象这样：

```java
public static String aesEncrypt(String source, byte[] key, byte[] slat, byte[] iv) throws Exception {
    byte[] scrypted = SCrypt.scrypt(key, slat, 16384, 8, 1, 24);
    SecretKey secretKey = new SecretKeySpec(scrypted, "AES");
    AlgorithmParameterSpec parameterSpec = new IvParameterSpec(iv);
    Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5Padding");
    cipher.init(1, secretKey, parameterSpec);
    byte[] bytes = cipher.doFinal(source.getBytes(StandardCharsets.UTF_8));
    return Base64.encodeBase64URLSafeString(bytes);
}

public static String aesDecrypt(String source, byte[] key, byte[] slat, byte[] iv) throws Exception {
    byte[] scrypted = SCrypt.scrypt(key, slat, 16384, 8, 1, 24);
    SecretKey secretKey = new SecretKeySpec(scrypted, "AES");
    AlgorithmParameterSpec parameterSpec = new IvParameterSpec(iv);
    Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5Padding");
    cipher.init(2, secretKey, parameterSpec);
    byte[] bytes = cipher.doFinal(Base64.decodeBase64(source));
    return new String(bytes, StandardCharsets.UTF_8);
}
```
