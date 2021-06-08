
function show_stack() {
    Java.perform(function () {
        console.log(Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Throwable").$new()));

    })
}


function hook_java() {

    // 加载本地 dex

    /*
    * 如何遍历自己的类？
    * 1. 先在 android 里面用 build
    * 2. 将 class文件编译成 jar包 jar -cvf ddex.jar com/example/xiaowei/Decode.class
    * 3. 将jar包转 dex /Users/xiaowei/Library/Android/sdk/build-tools/30.0.3/dx --dex --output=ddex.dex ddex.jar
    * */


    var dex = Java.openClassFile('/data/local/tmp/ddex.dex')


    Java.perform(function () {

        dex.load()
        console.log('hello world\n')
        const System = Java.use('java.lang.System');
        System.getProperty.overload('java.lang.String').implementation = function (name) {
            let result = this.getProperty(name);

            console.log('getProperty = ', name, result);
            return 'Russia';

        }

        System.getenv.overload('java.lang.String').implementation = function (name) {
            let result = this.getenv(name);

            console.log('getenv = ', name, result);
            return 'RkxBR3s1N0VSTDFOR180UkNIM1J9Cg==';

        }

        // hook 密码检验  codenameduchess
        Java.use('com.tlamb96.kgbmessenger.LoginActivity').j.implementation = function () {
            return true
        }

        var ddex = Java.use('com.example.xiaowei.Decode')
        console.log('自己的类:',ddex.decode_p())


        const Activity = Java.use('com.tlamb96.kgbmessenger.MessengerActivity');
        const strings = Java.use('java.lang.String');
        // console.log(Activity.r.value);

        // Activity.a.implementation = function (s) {
        //     // let result = this.a(s);
        //     // console.log(this.q.value)
        //     // console.log(s)
        //     // console.log(result);
        //     return 'V@]EAASB\u0012WZF\u0012e,a$7(&am2(3.\u0003'
        // }
        // Activity.b.implementation = function (s) {
        //     // s =
        //     let result = this.b(strings.$new(' ay I *P EASE* h ve the  assword '));
        //     // console.log(s)
        //     // console.log(result);
        //
        //     // var a = 'AGRzbHB9b1EAIGRrcyR8TQBoICtBWVFnAFAqIU0kZ1EA'
        //     // var ss = base64ToString(a)
        //     // console.log(ss)
        //
        //     return result
        // }

    })

}

function main() {
    hook_java()
}

setImmediate(main)