function hook_java() {

    Java.perform(function () {

        console.log("hello world")
        // 登录关
        const login = Java.use('com.example.androiddemo.Activity.LoginActivity');
        login.a.overload('java.lang.String', 'java.lang.String').implementation = function (a1, a2) {
            let result = this.a(a1, a2);
            console.log(a1, a2, result);
            return result
        }
        // 第1关
        Java.use('com.example.androiddemo.Activity.FridaActivity1').a.implementation = function (a) {

            return 'R4jSLLLLLLLLLLOrLE7/5B+Z6fsl65yj6BgC6YWz66gO6g2t65Pk6a+P65NK44NNROl0wNOLLLL='
        }

        // 第2关, 主动调用,
        // 这种写法错误，不是静态方法不能直接这么调用, 要通过 Jaca.choose
        // Java.use('com.example.androiddemo.Activity.FridaActivity2').setBool_var();
        Java.choose('com.example.androiddemo.Activity.FridaActivity2', {
            onMatch: function (instance) {
                // 调用方法
                instance.setBool_var()
                // 设置变量值
                instance.static_bool_var.value = true;
            },
            onComplete: function () {

            }
        })

    })

}

function call_frida3() {
    Java.perform(function () {
        // 第3关, 设置属性的值

        const frida3 = Java.use('com.example.androiddemo.Activity.FridaActivity3')
        frida3.static_bool_var.value = true;

        console.log(frida3.static_bool_var.value);

        Java.choose('com.example.androiddemo.Activity.FridaActivity3', {
            onMatch: function (instance) {
                // instance.static_bool_var.value = true;
                instance.bool_var.value = true;
                // TODO 关注一下这个属性，他跟函数名重名了，需要加一个  _  下划线
                instance._same_name_bool_var.value = true;
                console.log(instance.bool_var.value, instance._same_name_bool_var.value)
            },
            onComplete: function () {

            }
        })
    })
}

function call_frida4() {
    // 第 4 关 hook 类的多个函数, 内部类
    Java.perform(function () {

        const FridaActivity4 = Java.use('com.example.androiddemo.Activity.FridaActivity4$InnerClasses');
        // getDeclaredMethods 获取当前类的方法   getMethods 获取当前类以及继承类的所有方法
        const methods = FridaActivity4.class.getDeclaredMethods();
        for (let method of methods) {
            // console.log(method)
            let method_str = method.toString();
            let mtdsplit = method_str.split('.')
            let meds = mtdsplit[mtdsplit.length - 1].replace('()', '');
            console.log(meds)
            FridaActivity4[meds].implementation = function () {
                return true
            }
        }


    })
}

function call_frida5() {

    // 第 5 关 hook 动态加载的dex 类, 以及查看类的类名

    Java.perform(function () {

        // 1. 尝试 hook 一下 接口类
        // 会提示 Error: java.lang.ClassNotFoundException:
        // Java.use('com.example.androiddemo.Dynamic.AbstractC0000CheckInterface');

        // 2. 查看动态加载的类名
        const FridaActivity5 = Java.use('com.example.androiddemo.Activity.FridaActivity5');
        FridaActivity5.getDynamicDexCheck.implementation = function () {

            let result = this.getDynamicDexCheck();
            // 查看当前返回值的 类名
            console.log(result.$className)
            return result

        }

        // 这个时候还是 没有找到类 需要将 类 loader 进来
        // Java.use('com.example.androiddemo.Dynamic.DynamicCheck').check.implementation = function (){
        //     return true
        // }

        // 3. hook 动态加载的 dex
        Java.enumerateClassLoaders({
            onMatch: function (loader) {
                console.log(loader)
                try {
                    if (loader.findClass('com.example.androiddemo.Dynamic.DynamicCheck')) {
                        console.log(loader);
                        // 切换classloader
                        Java.classFactory.loader = loader
                    }
                } catch (e) {
                    // console.log(e)

                }


            },
            onComplete: function () {

            }
        })
        // 这个时候再来 hook 这个类
        Java.use('com.example.androiddemo.Dynamic.DynamicCheck').check.implementation = function () {
            return true
        }


    })
}

function call_frida6() {

    // 第 6 关  hook 多个 class
    // 发现一个关键点 就是 当一个类 没有执行的时候, frida 枚举是枚举不出来的。
    Java.perform(function () {
        // 遍历当前 loader 的 所有类
        Java.enumerateLoadedClasses({
            onMatch: function (name, handle) {
                // console.log(name)
                if (name.indexOf('com.example.androiddemo.Activity.Frida6') >= 0) {
                    console.log(name);
                    Java.use(name).check.implementation = function () {
                        return true;
                    }

                }
            },
            onComplete: function () {

            }
        })


    })
}


function main() {
    hook_java();
}

setImmediate(main)