---
title: Python 元编程
tags: python
---

元编程并不象它听起来那么时髦和新奇。常用的 `decorator` 就可以认为是一种元编程。简单来说，元编程就是编写操作代码的代码。

有点绕，是吧？别着急，咱们一点一点来讨论。

> 注意：本文中的代码适用于 Python 3.3 及以上。

## 元类

多数编程语言中，一切东西都有类型。Python 也不例外，我们可以用 `type()` 函数获取任意变量的类型。

```python
num = 23
print("Type of num is:", type(num))

lst = [1, 2, 4]
print("Type of lst is:", type(lst))

name = "Atul"
print("Type of name is:", type(name))
```

执行结果是：

```python
Type of num is: <class 'int'>
Type of lst is: <class 'list'>
Type of name is: <class 'str'>
```

Python 中的**所有类型**都是由 Class 定义的。这一条与其它编程语言，比如 Java、C++ 等等不同。在那些语言中，int、char、float 之类是基本数据类型，但是在 Python 中，它们是 int 类或 str 类的对象。

象其它 OOP 语言一样，我们可以使用 **class** 定义新类型：

```python
class Student:
    pass

stu_obj = Student()
print("Type of stu_obj is:", type(stu_obj))
```

执行结果是：

```python
Type of stu_obj is: <class '**main**.Student'>
```

一点儿也不意外，对吧？其实有意外，因为在 Python 中，类也是一个对象，就像任何其他对象一样，它是元类的实例。即一个特殊的类，创建了 **Class** 这个特殊的类实例。看如下代码：

```python
class Student:
    pass

print("Type of Student class is:", type(Student))
```

执行结果是：

```python
Type of Student class is: <class 'type'>
```

既然类也是一个对象，所以以修改对象相同的方式修改它就顺理成章。如下先定义一个没有任何属性和方法的类，然后在外部为其添加属性和方法：

```python
class test:
    pass

test.x = 45
test.foo = lambda self: print('Hello')

myobj = test()
print(myobj.x)
myobj.foo()
```

执行结果是：

```python
45
Hello
```

以上过程可以简单概括为：

> 元类创建类，类创建实例

画个图象这样:

>
> 元类 -> 类 -> 实例
>

因此，我们就可以编写自定义的元类，执行额外的操作或者注入代码，来改变类的生成过程。这在某些场景下很有用，主要是比如有些情况下使用元编程更简单，另一些情况只有元编程才能解决问题。

## 创建自定义元类

创建自定义元类，有两种方法。第一种是继承 `type` 元类，并且覆写两个方法：

1. **new()**

它在 **init()** 之前调用，生成类实例并返回。我们可以覆盖此方法来控制对象的创建过程。

2. **init()**

这个不多解释，相信你都明白。

如下是个例子：

```python
class MultiBases(type):
    def __new__(cls, clsname, bases, clsdict):
        if len(bases)>1:
            raise TypeError("Inherited multiple base classes!!!")

        return super().__new__(cls, clsname, bases, clsdict)


class Base(metaclass=MultiBases):
    pass


class A(Base):
    pass


class B(Base):
    pass


class C(A, B):
    pass
```

执行结果是：

```python
Traceback (most recent call last):
File "<stdin>", line 2, in <module>
File "<stdin>", line 8, in **new**
TypeError: Inherited multiple base classes!!!
```

第二种方法是直接使用 **type()** 函数创建类。这个方法如果只用一个参数调用，它会返回该参数的类型，前文已经描述过。但是使用三个参数调用时，它会创建一个类。这三个参数如下：

1. 类名称；
2. 继承的父类的元组。你没看错，是元组，别忘了 Python 可以多继承；
3. 一个字典。定义类属性和方法；

以下是示例：

```python
def test_method(self):
    print("This is Test class method!")


class Base:

    def myfun(self):
        print("This is inherited method!")


Test = type('Test', (Base, ), dict(x="atul", my_method=test_method))
print("Type of Test class: ", type(Test))

test_obj = Test()
print("Type of test_obj: ", type(test_obj))

test_obj.myfun()
test_obj.my_method()

print(test_obj.x)
```

执行结果是：

```python
Type of Test class: <class 'type'>
Type of test_obj: <class '**main**.Test'>
This is inherited method!
This is Test class method!
atul
```

## 使用元类解决问题

了解了元类的创建方法后，可以来解决一些实际问题了。例如，如果我们想在每次调用类方法时，都先输出一下它的全限定名，该怎么办呢？

最常用的方法是使用 `decorator`，象这样：

```python
from functools import wraps


def debug(func):

    @wraps(func)
    def wrapper(*args, **kwargs):
        print("Full name of this method:", func.__qualname__)
        return func(*args, **kwargs)
    return wrapper


def debugmethods(cls):
    for key, val in vars(cls).items():
        if callable(val):
            setattr(cls, key, debug(val))
    return cls


@debugmethods
class Calc:

    def add(self, x, y):
        return x+y

    def mul(self, x, y):
        return x\*y

    def div(self, x, y):
        return x/y


mycal = Calc()
print(mycal.add(2, 3))
print(mycal.mul(5, 2))
```

执行结果是：

```
Full name of this method: Calc.add
5
Full name of this method: Calc.mul
10
```

这个方案很漂亮。但是，如果变更一下需求，例如我们希望 **Calc** 的所有子类的方法执行时，都先输出一下它的全限定名，该怎么办呢？

在每一个子类上加上 **@debugmethods** 是一种方案，但是有点啰嗦，是不是？

该基于元类的解决方案出场了，以下是个例子：

```python
from functools import wraps


def debug(func):

    @wraps(func)
    def wrapper(*args, **kwargs):
        print("Full name of this method:", func.__qualname__)
        return func(*args, **kwargs)
    return wrapper


def debugmethods(cls):

    for key, val in vars(cls).items():
        if callable(val):
            setattr(cls, key, debug(val))
    return cls


class debugMeta(type):

    def __new__(cls, clsname, bases, clsdict):
        obj = super().__new__(cls, clsname, bases, clsdict)
        obj = debugmethods(obj)
        return obj


class Base(metaclass=debugMeta):
    pass


class Calc(Base):

    def add(self, x, y):
        return x+y


class Calc_adv(Calc):

    def mul(self, x, y):
        return x\*y


mycal = Calc_adv()
print(mycal.mul(2, 3))
```

执行结果是：

```python
Full name of this method: Calc_adv.mul
6
```

## 何时使用元类

该说的基本说完了，剩下最好一件事。元编程算是 Python 的一个魔法，多数时候我们其实用不到。但是什么时候需要呢？大概有三种情况：

- 如果我们想要一个特性，沿着继承层次结构向下传递，可以用；
- 如果我们想在类创建后，能动态修改，可以用；
- 如果我们是在开发类库或者 API，可能会用到；

全文完。
