function hook_java() {

    Java.perform(function () {

        // const myapp = Java.use('com.gdufs.xman.MyApp');
        // myapp.m.value = 1;
        // console.log('m=', myapp.m.value);
        // myapp.saveSN.implementation = function (s) {
        //     let result = this.saveSN(s);
        //     console.log('myapp.saveSN:', s, result);
        //     return result;
        // }

        const Process = Java.use('android.os.Process');
        Process.killProcess.implementation = function (pid) {
            console.log('Process.killProcess:', pid)
        }

    })

}

function hook_native() {

    // 获取模块基址
    const my_jni = Module.findBaseAddress('libmyjni.so');

    if (!my_jni) return;

    // 查找 so 文件的 导出函数 地址
    const addr_n2 = Module.findExportByName('libmyjni.so', 'n2');
    console.log('my_jni: ', my_jni, 'addr_n2:', addr_n2);
    // 对函数地址进行Hook
    Interceptor.attach(addr_n2, {
        onEnter: function (arg) {
            console.log('addr_n2 onEnter :', arg[0], ptr(arg[1]).readCString(), ptr(arg[2]).readCString())
        },
        onLeave: function (retval) {

        }
    })


}

function hook_art() {

    // 查找模块
    const lib_art = Process.findModuleByName('libart.so');

    // 枚举模块的符号
    const symbols = lib_art.enumerateSymbols();

    for (let symbol of symbols) {

        var name = symbol.name;

        // if (name.indexOf('RegisterNatives') > -1) {
        //     console.log(name)
        // }

        if (name.indexOf("art") >= 0) {
            if ((name.indexOf("CheckJNI") == -1) && (name.indexOf("JNI") >= 0)) {
                // if (name.indexOf("GetStringUTFChars") >= 0) {
                //     console.log('开始 HOOK libart ', symbol.name);
                //     Interceptor.attach(symbol.address, {
                //         onEnter: function (arg) {
                //             // 打印调用栈
                //             // console.log('GetStringUTFChars called from:\n' + Thread.backtrace(this.context, Backtracer.ACCURATE).map(DebugSymbol.fromAddress).join('\n') + '\n');
                //         },
                //         onLeave: function (retval) {
                //             console.log('onLeave GetStringUTFChars:', ptr(retval).readCString())
                //         }
                //     })
                // } else if (name.indexOf("FindClass") >= 0) {
                //     console.log('开始 HOOK libart ', symbol.name);
                //     Interceptor.attach(symbol.address, {
                //         onEnter: function (arg) {
                //             console.log('onEnter FindClass:', ptr(arg[1]).readCString())
                //         },
                //         onLeave: function (retval) {
                //             // console.log('onLeave FindClass:', ptr(retval).readCString())
                //         }
                //
                //     })
                // } else if (name.indexOf("GetStaticFieldID") >= 0) {
                //     console.log('开始 HOOK libart ', symbol.name);
                //     Interceptor.attach(symbol.address, {
                //         onEnter: function (arg) {
                //             console.log('onEnter GetStaticFieldID:', ptr(arg[2]).readCString(), ptr(arg[3]).readCString())
                //         },
                //         onLeave: function (retval) {
                //             // console.log('onLeave GetStaticFieldID:', ptr(retval).readCString())
                //         }
                //     })
                // } else if (name.indexOf("SetStaticIntField") >= 0) {
                //     console.log('开始 HOOK libart ', symbol.name);
                //     Interceptor.attach(symbol.address, {
                //         onEnter: function (arg) {
                //             console.log('onEnter SetStaticIntField:', arg[3])
                //         },
                //         onLeave: function (retval) {
                //             // console.log('onLeave SetStaticIntField:', ptr(retval).readCString())
                //         }
                //     })
                // } else
                if (name.indexOf("RegisterNatives") >= 0) {
                    console.log('开始 HOOK libart ', symbol.name);
                    Interceptor.attach(symbol.address, {
                        onEnter: function (args) {
                            console.log("[RegisterNatives] method_count:", args[3]);
                            var env = args[0];
                            var java_class = args[1];
                            var class_name = Java.vm.tryGetEnv().getClassName(java_class);
                            //console.log(class_name);

                            var methods_ptr = ptr(args[2]);

                            var method_count = parseInt(args[3]);
                            for (var i = 0; i < method_count; i++) {
                                var name_ptr = Memory.readPointer(methods_ptr.add(i * Process.pointerSize * 3));
                                var sig_ptr = Memory.readPointer(methods_ptr.add(i * Process.pointerSize * 3 + Process.pointerSize));
                                var fnPtr_ptr = Memory.readPointer(methods_ptr.add(i * Process.pointerSize * 3 + Process.pointerSize * 2));

                                var name = Memory.readCString(name_ptr);
                                var sig = Memory.readCString(sig_ptr);
                                var find_module = Process.findModuleByAddress(fnPtr_ptr);
                                console.log("[RegisterNatives] java_class:", class_name, "name:", name, "sig:", sig, "fnPtr:", fnPtr_ptr, "module_name:", find_module.name, "module_base:", find_module.base, "offset:", ptr(fnPtr_ptr).sub(find_module.base));

                            }
                        }
                        ,
                            onLeave: function (retval) {
                                // console.log('onLeave SetStaticIntField:', ptr(retval).readCString())
                            }
                        })
                }
            }
        }


    }


}


function hook_libc() {

    const strcmp = Module.findExportByName('libc.so', 'strcmp');
    console.log('strcmp: ', strcmp);
    Interceptor.attach(strcmp, {
        onEnter: function (arg) {
            let str2 = ptr(arg[1]).readCString();
            if (str2 === 'EoPAoY62@ElRD') {
                console.log('strcmp:', ptr(arg[0]).readCString(), str2);
            }

        },
        onLeave: function (retval) {
        }
    })

}

// frida 方式写文件
function write_data() {
    const file = new File('/sdcard/reg.dat', 'w');
    file.write('EoPAoY62@ElRD');
    file.flush();
    file.close()

}

// hook libc.so 的方式来写文件
function write_data_native() {
    // 读取lic的导出函数地址
    const addr_fopen = Module.findExportByName('libc.so', 'fopen');
    const addr_fputs = Module.findExportByName('libc.so', 'fputs');
    const addr_fclose = Module.findExportByName('libc.so', 'fclose');

    console.log('fopen:', addr_fopen, 'fputs', addr_fputs, 'fclose', addr_fclose);
    // 构建函数
    const fopen = new NativeFunction(addr_fopen, 'pointer', ['pointer', 'pointer']);
    const fputs = new NativeFunction(addr_fputs, 'int', ['pointer', 'pointer']);
    const fclose = new NativeFunction(addr_fclose, 'int', ['pointer']);

    // 申请内存空间
    let file_name = Memory.allocUtf8String('/sdcard/reg.dat');
    let model = Memory.allocUtf8String('w+');
    let data = Memory.allocUtf8String('EoPAoY62@ElRD');
    let file = fopen(file_name, model);
    let ret = fputs(data, file);
    console.log('fputs ret: ', ret);
    fclose(file);

}


function main() {

    hook_java();
    // hook_native();
    // hook_art();
    // hook_libc();
}

setImmediate(main)