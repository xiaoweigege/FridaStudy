Java.perform(function () {

    console.log('Hello World');
    var StringClass = Java.use("java.lang.String");
    var KeyStore = Java.use("java.security.KeyStore");
    // @ts-ignore
    KeyStore.load.overload('java.security.KeyStore$LoadStoreParameter').implementation = function (arg0) {
        console.log(Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Throwable").$new()));

        console.log("KeyStore.load1:", arg0);
        this.load(arg0);
    };
    // @ts-ignore
    KeyStore.load.overload('java.io.InputStream', '[C').implementation = function (arg0, arg1) {
        console.log(Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Throwable").$new()));

        console.log("KeyStore.load2:", arg0, arg1 ? StringClass.$new(arg1) : null);
        this.load(arg0, arg1);
    };

    console.log("hook_KeyStore_load...");
})