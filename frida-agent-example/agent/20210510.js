// 模拟点击命令
function subcommand(){
    Java.perform(function (){
        var process = Java.use('java.lang.Runtime').getRuntime().exec('input keyevent 24');
        console.log('Runtime', process)
    })
    Module.getBaseAddress()

}
setImmediate(subcommand)