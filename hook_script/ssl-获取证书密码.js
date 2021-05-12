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


    function storeP12(pri, p7, p12Path, p12Password) {
        var X509Certificate = Java.use("java.security.cert.X509Certificate")
        var p7X509 = Java.cast(p7, X509Certificate);
        var chain = Java.array("java.security.cert.X509Certificate", [p7X509])
        var ks = Java.use("java.security.KeyStore").getInstance("PKCS12", "BC");
        ks.load(null, null);
        ks.setKeyEntry("client", pri, Java.use('java.lang.String').$new(p12Password).toCharArray(), chain);
        try {
            var out = Java.use("java.io.FileOutputStream").$new(p12Path);
            ks.store(out, Java.use('java.lang.String').$new(p12Password).toCharArray())
        } catch (exp) {
            console.log(exp)
        }
    }

    //在服务器校验客户端的情形下，帮助dump客户端证书，并保存为p12的格式，证书密码为r0ysue
    Java.use("java.security.KeyStore$PrivateKeyEntry").getPrivateKey.implementation = function () {
        console.log('进来了1')
        var result = this.getPrivateKey()
        var packageName = Java.use("android.app.ActivityThread").currentApplication().getApplicationContext().getPackageName();
        storeP12(this.getPrivateKey(), this.getCertificate(), '/data/local/tmp/' + packageName + uuid(10, 16) + '.p12', 'r0ysue');
        var message = {};
        message["function"] = "dumpClinetCertificate=>" + '/data/local/tmp/' + packageName + uuid(10, 16) + '.p12' + '   pwd: r0ysue';
        message["stack"] = Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Throwable").$new());
        var data = Memory.alloc(1);
        console.log(message['stack'])
        send(message, Memory.readByteArray(data, 1))
        return result;
    }
    Java.use("java.security.KeyStore$PrivateKeyEntry").getCertificateChain.implementation = function () {
        console.log('进来了2')
        var result = this.getCertificateChain()
        var packageName = Java.use("android.app.ActivityThread").currentApplication().getApplicationContext().getPackageName();
        storeP12(this.getPrivateKey(), this.getCertificate(), '/data/local/tmp/' + packageName + uuid(10, 16) + '.p12', 'r0ysue');
        var message = {};
        message["function"] = "dumpClinetCertificate=>" + '/data/local/tmp/' + packageName + uuid(10, 16) + '.p12' + '   pwd: r0ysue';
        message["stack"] = Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Throwable").$new());
        var data = Memory.alloc(1);
        send(message, Memory.readByteArray(data, 1))
        return result;
    }

    Java.use("java.io.File").$init.overload('java.io.File', 'java.lang.String').implementation = function (file, cert) {
        var result = this.$init(file, cert)
        var stack = Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Throwable").$new());
        if (file.getPath().indexOf("cacert") >= 0 || stack.indexOf("X509TrustManagerExtensions.checkServerTrusted") >= 0) {
            var message = {};
            message["function"] = "SSLpinning position locator => " + file.getPath() + " " + cert;
            message["stack"] = stack;
            var data = Memory.alloc(1);

            send(message, Memory.readByteArray(data, 1))
            console.log(message['stack'])

        }
        return result;
    }

})