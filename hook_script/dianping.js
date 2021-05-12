send('=====> App Hook Start <=====')

function showStacks(name) {
    Java.perform(function () {
        send(name + Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Exception").$new()));
    });
};

Java.perform(function () {
    // 新建一个类

    var shop = Java.use('com.dianping.searchbusiness.shoplist.mainshop.MainShopAgent');
    // Hook 类方法
    shop.getList.overload('com.dianping.dataservice.mapi.g').implementation = function(a){

        console.log(a)


        var result = this.getList(a)
        print_object(result);

        showStacks('result')

        return result;

    }


})

function print_object(obj){
    Java.openClassFile('/data/local/tmp/r0gson.dex').load()
    const gson = Java.use('com.r0ysue.gson.Gson');
    const data = gson.$new().toJson(obj)
    console.log('print_object==',data );
}
