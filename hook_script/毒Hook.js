send('=====> App Hook Start <=====')

Java.perform(function () {
    // 新建一个类
    var request_utils = Java.use('com.shizhuang.duapp.common.utils.RequestUtils');
    // Hook 类方法
    request_utils.a.overload('java.util.Map', 'long').implementation = function(map, long){
        // console.log('[arg-1]', printHashMap(map));
        console.log('[arg-2]', long)
        
        print_object(map)

        var result = this.a(map, long)
        console.log('[result]', result)
        return result;
        
    }

    var AESEncrypt = Java.use('com.duapp.aesjni.AESEncrypt');
    AESEncrypt.b.overload('java.lang.Object', 'java.lang.String').implementation = function(obj, str){
        console.log(' AESEncrypt.b')
        send('[arg-1]' + obj);
        send('[arg-2]' + str);
        print_object(str)

        var result = encrypt(obj, str);
        var result = this.b(obj, str);

        send('[result]' + result)
        // console.log('result=', result)
        return result
    }

})

function print_object(obj){
    Java.openClassFile('/data/local/tmp/r0gson.dex').load()
    const gson = Java.use('com.r0ysue.gson.Gson');
    const data = gson.$new().toJson(obj)
    console.log('print_object==',data );
}


function encrypt(obj, data){
    var result;
    Java.perform(function(){
        console.log('encrypt start')
        Java.choose('com.duapp.aesjni.AESEncrypt', {
            onMatch: function (x){
                console.log("onMatch");

                // obj = Java.use('java.lang.Object').$new();
                result = x.b(obj, Java.use('java.lang.String'.$new(data)));
            },
            onComplete: function(){

            }
        })
    })
    console.log('rpc result=', result)
    // return Java.use('java.lang.String').$new(result);
}
//
// encrypt({}, 'werqwerwqrw')


function printHashMap(map){
    var hash_map = Java.use('java.util.HashMap');
    var args_map = Java.cast(map, hash_map);
    return args_map
}


rpc.exports = {
    // encrypt: encrypt
}