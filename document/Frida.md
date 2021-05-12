# Frida 学习笔记
[toc]


## 命令行参数详解
```
  --version             显示版本号
  -h, --help            查看帮助
  -D ID, --device=ID    用给定的ID连接到设备
  -U, --usb             连接 USB 设备
  -R, --remote          连接远程设备
  -H HOST, --host=HOST  连接远程的设备 地址
  -f FILE, --file=FILE  spawn FILE 模式
  -F, --attach-frontmost
                        attach to frontmost application 附加到最前端的应用程序
  -n NAME, --attach-name=NAME
                        attach to NAME 附加的名称
  -p PID, --attach-pid=PID
                        attach to PID 附加的进程ID
  --stdio=inherit|pipe  stdio behavior when spawning (defaults to “inherit”)
  --runtime=duk|v8      script runtime to use (defaults to “duk”) 指定js解释器 duk 或者 v8
  --debug               enable the Node.js compatible script debugger 
  -l SCRIPT, --load=SCRIPT 加载脚本文件
                        load SCRIPT
  -P PARAMETERS_JSON, --parameters=PARAMETERS_JSON
                        Parameters as JSON, same as Gadget
  -C CMODULE, --cmodule=CMODULE
                        load CMODULE
  -c CODESHARE_URI, --codeshare=CODESHARE_URI
                        load CODESHARE_URI
  -e CODE, --eval=CODE  evaluate CODE
  -q                    quiet mode (no prompt) and quit after -l and -e
  --no-pause            automatically start main thread after startup 启动后自动启动主线程
  -o LOGFILE, --output=LOGFILE 日志输出文件
                        output to log file
  --exit-on-error       exit with code 1 after encountering any exception in
                        the SCRIPT 异常退出脚本
```

## Frida 基本使用方法
- 两种操作frida模式: 命令行，python rpc
- frida 开发思想: `HOOK` 三板斧
- frida 两种操作APP模式： spawn(重新启动APP)、attach(app已经启动附加上去)
> SPAWN：创建进程时就hook：有壳的话就不行

> ATTACH：应用运行过程中hook：有壳也是ok
----
> 三板斧：

>先hook、看参数和返回值：定位：命令行
再构造参数、主动调用：利用：命令行
最后配RPC导出结果：规模化利用：PYTHON

## Frida 参数调用栈，返回值

- 获取调用栈
```js
console.log(Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Throwable").$new()));
```
- 构造参数
```js
var javaString = java.use('java.lang.String');
var newString = javaString.$new('hello world');
```
```js
// 创建一个类
Java.use()
// 通过扫描Java虚拟机的堆 枚举className类的实例
Java.choose()

```

> hook的两个原则:
> - 离数据越近越好
> - 离动作越近越好

> hook用不上Java.choose的

> hook函数时不分动静态

## Frida主动调用及批量自动化
- 忽略方法实现过程：构造参数、主动调用
```js

// 获取类的静态变量
var var_value = Jave.use('com.xxx.ccca').DEF_DIV.value;
// 修改变量的值
Jave.use('com.xxx.ccca').DEF_DIV.value = 20;

// 静态方法主动调用
var class_fun = Jave.use('com.xxx.cccc');
var result = class_fun.add('1', '2');

// 实例方法主动调用。
function call_enc(str_data) 
{
 //这里写函数对应的类名
  var str_cls_name = "com.wangtietou.test_rpc_all.Test_Enc_Dec";
  //返回值 
  var str_ret = null;
  
  Java.perform(function () 
  {
      Java.choose(str_cls_name, 
      {
        onMatch: function (instance) 
        {
            //调试用
            console.log("onMatch ");  
            //直接调用对象的函数 instance是找到的对象
            str_ret = instance.enc(str_data);
        },
        onComplete: function () 
        {
        }
      });
  });
  console.log("enc result: " + str_ret);
  return str_ret;
}

```
- 安卓设备信息类
`android.os.Build`

- 主动调用
<https://www.jianshu.com/p/a3d5d93eb91a>
  
- 模拟点击
> adb input 命令可以实现对手机的操作
```
The sources are:
      mouse
      keyboard
      joystick
      touchnavigation
      touchpad
      trackball
      stylus
      dpad
      touchscreen
      gamepad

The commands and default sources are:
      text <string> (Default: touchscreen)
      keyevent [--longpress] <key code number or name> ... (Default: keyboard)
      tap <x> <y> (Default: touchscreen)
      swipe <x1> <y1> <x2> <y2> [duration(ms)] (Default: touchscreen)
      press (Default: trackball)
      roll <dx> <dy> (Default: trackball)
```
frida 主动调用执行
```js
function subcommand(){
    Java.perform(function (){
        var process = Java.use('java.lang.Runtime').getRuntime().exec('input keyevent 24');
        console.log('Runtime', process)
    })

}
setImmediate(subcommand)
```
- 远程批量调用
> 可以在启动 frida-android-server 开放IP, 让python通过IP连接
> ./frida-server12.8.0 -l 0.0.0.0:8888

- 外网调用
> 通过nps来进行内网穿透，进行批量调用。