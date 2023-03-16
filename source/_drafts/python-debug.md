---
title: python debug
tags:
---

什么是 Python 中的调试？
开发人员经常发现自己处于他们编写的代码无法正常工作的情况。发生这种情况时，开发人员通过检测、执行和检查代码来调试其代码，以确定应用程序的哪些状态与代码应如何正确运行的假设不匹配。

在计算机的历史上，从来没有一个意想不到的调试周期这么短。

通常，调试是识别和修复软件代码、硬件或任何其他系统中的错误或缺陷的过程。它涉及检查程序的行为并确定发生的任何错误或意外行为的根本原因。

调试的目标是识别和解决阻止软件或系统正常运行的问题。这涉及分析代码、检查变量和数据结构，以及测试不同的方案以确定错误的原因。确定问题的根本原因后，开发人员可以对代码进行更改以解决问题。

现在特定于 python 语言，调试器是一个可以帮助您找出计算机程序中发生的事情的程序。您可以在任何规定的行号处停止执行，打印出变量，继续执行，再次停止，逐个执行语句，并重复此类操作，直到您跟踪异常行为并发现错误为止。

为什么调试很重要？
每个中等大小或较大的应用程序中都有错误。每个开发人员都必须学习如何调试代码，以便编写在时间和预算允许的情况下正确工作的程序。

除了修复错误之外，调试是通过优化性能和改进逻辑来提高应用程序效率的一项重要技能。调试是一项复杂的技能，开发人员需要时间和实践才能获得一项功能。

调试是软件开发人员的一项基本技能，因为它有助于确保软件正常运行且没有缺陷。调试可能是一个耗时的过程，但它对于确保软件的质量和可靠性至关重要。

计算机编程中会发生错误和错误，因为它是一种抽象和概念性的活动。计算机以电子信号的形式操纵数据。编程语言抽象这些信息，以便人类可以更有效地与计算机交互。任何类型的软件都有几层抽象，不同的组件进行通信以使应用程序正常工作。发生错误时，查找和解决问题可能具有挑战性。调试工具和策略有助于更快地解决问题并提高开发人员的工作效率。因此，软件质量和最终用户体验都得到了改善。

如何在 python 中执行调试？
有许多工具和技术可用于调试，包括集成到开发环境中的调试工具、命令行工具、日志记录和各种测试框架。有效的调试需要仔细关注细节、耐心和解决问题的系统方法。

调试过程如何工作？
调试过程通常需要以下步骤。

错误识别
开发人员、测试人员和最终用户报告他们在测试或使用软件时发现的错误。开发人员找到导致错误的确切代码行或代码模块。这可能是一个乏味且耗时的过程。

错误分析
编码人员通过记录所有程序状态更改和数据值来分析错误。他们还根据错误修复对软件功能的影响来确定其优先级。软件团队还根据开发目标和要求确定错误修复的时间表。

修复和验证
开发人员修复错误并运行测试，以确保软件继续按预期工作。他们可能会编写新的测试来检查该错误将来是否再次出现。

调试与测试：调试和测试是互补的过程，可确保软件程序按预期运行。在编写完整的部分或部分代码后，程序员进行测试以识别错误和错误。一旦发现错误，编码人员就可以开始调试过程，并努力消除软件中的任何错误。

有哪些编码错误需要调试？
软件缺陷是由于软件开发固有的复杂性而出现的。软件上线后，也会观察到轻微的生产错误，因为客户以意想不到的方式使用它。我们在下面给出了一些通常需要调试过程的常见错误类型。

语法错误
语法错误是当计算机程序具有错误键入的语句时发生的错误。它相当于文字处理中的拼写错误或拼写错误。如果存在语法错误，程序将不会编译或运行。代码编辑软件通常会突出显示此错误。

2. Semantic errors

Semantic errors occur due to the improper use of programming statements. For example, if you are translating the expression 100/(2×10) into Python, you might write:

However, this statement is not correct because multiplication and division have the same precedence in Python and are evaluated from left to right. Therefore, this expression computes as (100/2) \*10, leading to bugs.

3. Logic errors

Logic errors occur when programmers misrepresent the step-wise process or algorithm of a computer program. For example, the code may exit a loop too early or may have an incorrect if-then outcome. You can identify logic errors by stepping through the code for several different input/output scenarios.

4.Runtime errors

Runtime errors occur due to the computing environment in which the software code runs. Examples include insufficient memory space or stack overflow. You can resolve runtime errors by surrounding statements in try-catch blocks or logging the exception with an appropriate message.

What are some common debugging techniques?
There are several strategies programmers use to minimize errors and reduce the time required for debugging.

Printing values
As name suggest, we print out or display values of variables and state at certain times during the execution of an application.

Stepping on code line
It will step on each code line by line during the execution of a program. Through this technique, we can trace state of variables changing during execution.

Altering path of program
Changing the state of a program to make it do different things.

Adding breakpoints
It is indicating line of code where we can stop execution of code to access or manipulate state.

Adding trace points
A trace point is a breakpoint with a custom action associated with it. The trace command defines a trace point, which is a point in the target program where the debugger will briefly stop, collect some data, and then allow the program to continue.

Adding watchpoint
Stopping the program at certain events. For this, we have to give some variable value and variable value with relational operator. When this condition gets satisfied, the system will automatically stop there.

Analyzing output
Viewing the output of a program in a debugger window

Logging
Study log files to locate and resolve bugs.

What is the Python Debugger (a python module)?
The Python debugger is an interactive source code debugger for Python programmers. It can set conditional breakpoints and single stepping at the source line level.

It also supports inspection of stack frames, source code listing, and evaluation of arbitrary Python code in any stack frame’s context.

Create a file ‘demopdb.py’ with the following contents:

First, let’s see what this code does. We first import pdb. Then, we define a variable ‘x’ with the value 8.

Next, we define a function ‘power_of_itself’ that returns a number to its own power.

Now here, we slip in a breakpoint in the code; we enter the debugger. The next statement is a call to ‘power_of_itself’, with the argument 7, storing the return value into the variable ‘seven’.

After that, we print the value of ‘seven’. Finally, we store the return value of power_of_itself(3) into the variable ‘three’, and print it out.

Now, let’s save this as ‘demopdb.py’ on the Desktop, and switch to the command line interface (CLI).

Once Command Prompt, and run this python file:

As you can see, the prompt is at the first line after the breakpoint we set in our code. This is a call to ‘power_of_itself’ with the argument 7.

Now we’re at the debugger, and we can type in some Python debugger commands to proceed with the debugging.

Example of debugging in Pycharm IDE:
Breakpoints suspends the program upon reaching the line of code where the breakpoint was set. This type of breakpoints can be set on any executable line of code.

Create main.py file and open inside pycharm.

Here, red dots imply breakpoints.

In the next step, run program in debug mode. To do so, click debug icon in top right of screen in pycharm as shown below or alternatively you can use short-cut (Shift + F9).

As soon as you click debug icon, it will pop debug toolbar in bottom. As you can see in below image, it is stopped running at line 28 which was first breakpoint of script. In debug toolbar, left side indicates details of code where it is currently stopped while right side indicates variables stored in heap till current breakpoint hit.

Now to move forward with execution, we can use `Resume Program` button. As name suggest, by clicking this button program continues to run and stops to next breakpoint if any.

As we can see in below image, after clicking ` Resume Program` button, program continue to execute and stopped again at line 5 which is second breakpoint of program. Pycharm provides blue line indicating that we are stopped at line 5 for better visualization.

此外，随着代码执行的进行，我们可以看到它在调试工具栏中维护我们在执行期间命中的所有断点详细信息的记录。

同样在右侧，我们可以通过输入栏输入来添加/检查变量的值。使用该输入栏，我们还可以插入新代码来检查进一步程序的行为。我们可以提出错误或更改值以查看进一步的程序是否能够处理它，这主要用于代码的手动测试。

结论
在这篇博客中，我们通过示例介绍了调试的一些基本和常见用法：

可以使用调试的错误类型
调试的常用技术，如打印表达式
探索 Python 调试器模块 （PDB）
调试模式期间使用的命令
在代码执行之间修改值
显示表达式
在代码执行的不同点显示值
我自己更喜欢打印语句而不是单行调试器（如 PDB），但可视化调试器要好得多（因为您可以看到更改的内容，此外还可以获得增强的导航等）这只是我的意见，但我还没有找到任何接近 Pycharm 的东西来调试 python。

当调试器不存在时，我调试 Python 和其他语言的首选方法是添加日志记录。Python 具有广泛的日志记录功能，文档非常出色。
