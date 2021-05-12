function showStacks(name) {
    Java.perform(function () {
        // send(name + Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Exception").$new()));
        console.log(name + Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Exception").$new()))
    });
};

Java.perform(function () {

    var vpn = Java.use('android.net.ConnectivityManager')
    vpn.getNetworkCapabilities.implementation = function (args) {
        showStacks();
        var result = this.getNetworkCapabilities(args);
        console.log('vpn 结果', result);
        return null;
    };

    var string_class = Java.use('java.lang.String');
    var network = Java.use('java.net.NetworkInterface');
    network.getName.implementation = function () {
        var name = this.getName();
        console.log('name=', name);
        if (name == 'tun0' || name == 'ppp0') {
            var result = string_class.$new('rmnet_data0')
            console.log('hook result=', result);
            return result
        }
        return name
    }
})


/*

   Android SSL Re-pinning frida script v0.2 030417-pier

$ adb push burpca-cert-der.crt /data/local/tmp/cert-der.crt

   $ frida -U -f it.app.mobile -l frida-android-repinning.js --no-pause

https://techblog.mediaservice.net/2017/07/universal-android-ssl-pinning-bypass-with-frida/



   UPDATE 20191605: Fixed undeclared var. Thanks to @oleavr and @ehsanpc9999 !

*/

// setTimeout(function () {
//
//     Java.perform(function () {
//
//         console.log("");
//
//         console.log("[.] Cert Pinning Bypass/Re-Pinning");
//
//         var CertificateFactory = Java.use("java.security.cert.CertificateFactory");
//
//         var FileInputStream = Java.use("java.io.FileInputStream");
//
//         var BufferedInputStream = Java.use("java.io.BufferedInputStream");
//
//         var X509Certificate = Java.use("java.security.cert.X509Certificate");
//
//         var KeyStore = Java.use("java.security.KeyStore");
//
//         var TrustManagerFactory = Java.use("javax.net.ssl.TrustManagerFactory");
//
//         var SSLContext = Java.use("javax.net.ssl.SSLContext");
//
// // Load CAs from an InputStream
//
//         console.log("[+] Loading our CA...")
//
//         var cf = CertificateFactory.getInstance("X.509");
//
//
//         try {
//
//             var fileInputStream = FileInputStream.$new("/data/local/tmp/cert-der.cer");
//
//         } catch (err) {
//
//             console.log("[o] " + err);
//
//         }
//
//
//         var bufferedInputStream = BufferedInputStream.$new(fileInputStream);
//
//         var ca = cf.generateCertificate(bufferedInputStream);
//
//         bufferedInputStream.close();
//
//         var certInfo = Java.cast(ca, X509Certificate);
//
//         console.log("[o] Our CA Info: " + certInfo.getSubjectDN());
//
// // Create a KeyStore containing our trusted CAs
//
//         console.log("[+] Creating a KeyStore for our CA...");
//
//         var keyStoreType = KeyStore.getDefaultType();
//
//         var keyStore = KeyStore.getInstance(keyStoreType);
//
//         keyStore.load(null, null);
//
//         keyStore.setCertificateEntry("ca", ca);
//
//
//         // Create a TrustManager that trusts the CAs in our KeyStore
//
//         console.log("[+] Creating a TrustManager that trusts the CA in our KeyStore...");
//
//         var tmfAlgorithm = TrustManagerFactory.getDefaultAlgorithm();
//
//         var tmf = TrustManagerFactory.getInstance(tmfAlgorithm);
//
//         tmf.init(keyStore);
//
//         console.log("[+] Our TrustManager is ready...");
//
//         console.log("[+] Hijacking SSLContext methods now...")
//
//         console.log("[-] Waiting for the app to invoke SSLContext.init()...")
//
//         SSLContext.init.overload("[Ljavax.net.ssl.KeyManager;", "[Ljavax.net.ssl.TrustManager;", "java.security.SecureRandom").implementation = function (a, b, c) {
//
//             console.log("[o] App invoked javax.net.ssl.SSLContext.init...");
//
//             SSLContext.init.overload("[Ljavax.net.ssl.KeyManager;", "[Ljavax.net.ssl.TrustManager;", "java.security.SecureRandom").call(this, a, tmf.getTrustManagers(), c);
//
//             console.log("[+] SSLContext initialized with our custom TrustManager!");
//
//         }
//
//     });
//
// }, 0);
//
//
// function hook_ssl() {
//     Java.perform(function() {
//         var ClassName = "com.android.org.conscrypt.Platform";
//         var Platform = Java.use(ClassName);
//         var targetMethod = "checkServerTrusted";
//         var len = Platform[targetMethod].overloads.length;
//         console.log(len);
//         for(var i = 0; i < len; ++i) {
//             Platform[targetMethod].overloads[i].implementation = function () {
//                 console.log("class:", ClassName, "target:", targetMethod, " i:", i, arguments);
//                 //printStack(ClassName + "." + targetMethod);
//             }
//         }
//     });
// }
//
//
// setTimeout(hook_ssl, 0);

// com.cmbchina.ccd.pluto.cmbActivity