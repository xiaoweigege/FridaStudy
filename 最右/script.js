function showStacks(name) {
    Java.perform(function () {
        send(name + Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Exception").$new()));
    });
};


var base64EncodeChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',
    base64DecodeChars = new Array((-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), 62, (-1), (-1), (-1), 63, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, (-1), (-1), (-1), (-1), (-1), (-1), (-1), 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, (-1), (-1), (-1), (-1), (-1), (-1), 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, (-1), (-1), (-1), (-1), (-1));

function stringToBase64(e) {
    var r, a, c, h, o, t;
    for (c = e.length, a = 0, r = ''; a < c;) {
        if (h = 255 & e.charCodeAt(a++), a == c) {
            r += base64EncodeChars.charAt(h >> 2),
                r += base64EncodeChars.charAt((3 & h) << 4),
                r += '==';
            break
        }
        if (o = e.charCodeAt(a++), a == c) {
            r += base64EncodeChars.charAt(h >> 2),
                r += base64EncodeChars.charAt((3 & h) << 4 | (240 & o) >> 4),
                r += base64EncodeChars.charAt((15 & o) << 2),
                r += '=';
            break
        }
        t = e.charCodeAt(a++),
            r += base64EncodeChars.charAt(h >> 2),
            r += base64EncodeChars.charAt((3 & h) << 4 | (240 & o) >> 4),
            r += base64EncodeChars.charAt((15 & o) << 2 | (192 & t) >> 6),
            r += base64EncodeChars.charAt(63 & t)
    }
    return r
};

function base64ToString(e) {
    var r, a, c, h, o, t, d;
    for (t = e.length, o = 0, d = ''; o < t;) {
        do
            r = base64DecodeChars[255 & e.charCodeAt(o++)];
        while (o < t && r == -1);
        if (r == -1)
            break;
        do
            a = base64DecodeChars[255 & e.charCodeAt(o++)];
        while (o < t && a == -1);
        if (a == -1)
            break;
        d += String.fromCharCode(r << 2 | (48 & a) >> 4);
        do {
            if (c = 255 & e.charCodeAt(o++), 61 == c)
                return d;
            c = base64DecodeChars[c]
        } while (o < t && c == -1);
        if (c == -1)
            break;
        d += String.fromCharCode((15 & a) << 4 | (60 & c) >> 2);
        do {
            if (h = 255 & e.charCodeAt(o++), 61 == h)
                return d;
            h = base64DecodeChars[h]
        } while (o < t && h == -1);
        if (h == -1)
            break;
        d += String.fromCharCode((3 & c) << 6 | h)
    }
    return d
};

function hexToBase64(str) {
    return base64Encode(String.fromCharCode.apply(null, str.replace(/\r|\n/g, "").replace(/([\da-fA-F]{2}) ?/g, "0x$1 ").replace(/ +$/, "").split(" ")));
};

function base64ToHex(str) {
    for (var i = 0, bin = base64Decode(str.replace(/[ \r\n]+$/, "")), hex = []; i < bin.length; ++i) {
        var tmp = bin.charCodeAt(i).toString(16);
        if (tmp.length === 1)
            tmp = "0" + tmp;
        hex[hex.length] = tmp;
    }
    return hex.join("");
};

function hexToBytes(str) {
    var pos = 0;
    var len = str.length;
    if (len % 2 != 0) {
        return null;
    }
    len /= 2;
    var hexA = new Array();
    for (var i = 0; i < len; i++) {
        var s = str.substr(pos, 2);
        var v = parseInt(s, 16);
        hexA.push(v);
        pos += 2;
    }
    return hexA;
};

function bytesToHex(arr) {
    var str = '';
    var k, j;
    for (var i = 0; i < arr.length; i++) {
        k = arr[i];
        j = k;
        if (k < 0) {
            j = k + 256;
        }
        if (j < 16) {
            str += "0";
        }
        str += j.toString(16);
    }
    return str;
};

function stringToHex(str) {
    var val = "";
    for (var i = 0; i < str.length; i++) {
        if (val == "")
            val = str.charCodeAt(i).toString(16);
        else
            val += str.charCodeAt(i).toString(16);
    }
    return val
};

function stringToBytes(str) {
    var ch, st, re = [];
    for (var i = 0; i < str.length; i++) {
        ch = str.charCodeAt(i);
        st = [];
        do {
            st.push(ch & 0xFF);
            ch = ch >> 8;
        }
        while (ch);
        re = re.concat(st.reverse());
    }
    return re;
}

//将byte[]转成String的方法
function bytesToString(arr) {
    console.log('bytesToString====');
    if (typeof arr === 'string') {
        return arr;
    }
    var str = '',
        _arr = arr;
    for (var i = 0; i < _arr.length; i++) {
        var one = _arr[i].toString(2),
            v = one.match(/^1+?(?=0)/);
        if (v && one.length == 8) {
            var bytesLength = v[0].length;
            var store = _arr[i].toString(2).slice(7 - bytesLength);
            for (var st = 1; st < bytesLength; st++) {
                store += _arr[st + i].toString(2).slice(2);
            }
            str += String.fromCharCode(parseInt(store, 2));
            i += bytesLength - 1;
        } else {
            str += String.fromCharCode(_arr[i]);
        }
    }
    return str;
}

function bytesToBase64(e) {
    var r, a, c, h, o, t;
    for (c = e.length, a = 0, r = ''; a < c;) {
        if (h = 255 & e[a++], a == c) {
            r += base64EncodeChars.charAt(h >> 2),
                r += base64EncodeChars.charAt((3 & h) << 4),
                r += '==';
            break
        }
        if (o = e[a++], a == c) {
            r += base64EncodeChars.charAt(h >> 2),
                r += base64EncodeChars.charAt((3 & h) << 4 | (240 & o) >> 4),
                r += base64EncodeChars.charAt((15 & o) << 2),
                r += '=';
            break
        }
        t = e[a++],
            r += base64EncodeChars.charAt(h >> 2),
            r += base64EncodeChars.charAt((3 & h) << 4 | (240 & o) >> 4),
            r += base64EncodeChars.charAt((15 & o) << 2 | (192 & t) >> 6),
            r += base64EncodeChars.charAt(63 & t)
    }
    return r
}

function base64ToBytes(e) {
    var r, a, c, h, o, t, d;
    for (t = e.length, o = 0, d = []; o < t;) {
        do
            r = base64DecodeChars[255 & e.charCodeAt(o++)];
        while (o < t && r == -1);
        if (r == -1)
            break;
        do
            a = base64DecodeChars[255 & e.charCodeAt(o++)];
        while (o < t && a == -1);
        if (a == -1)
            break;
        d.push(r << 2 | (48 & a) >> 4);
        do {
            if (c = 255 & e.charCodeAt(o++), 61 == c)
                return d;
            c = base64DecodeChars[c]
        } while (o < t && c == -1);
        if (c == -1)
            break;
        d.push((15 & a) << 4 | (60 & c) >> 2);
        do {
            if (h = 255 & e.charCodeAt(o++), 61 == h)
                return d;
            h = base64DecodeChars[h]
        } while (o < t && h == -1);
        if (h == -1)
            break;
        d.push((3 & c) << 6 | h)
    }
    return d
}

//
//
// //stringToBase64 stringToHex stringToBytes
// //base64ToString base64ToHex base64ToBytes
// //               hexToBase64  hexToBytes
// // bytesToBase64 bytesToHex bytesToString
// Java.perform(function () {
//     console.log('start2');
//
//     var secretKeySpec = Java.use('javax.crypto.spec.SecretKeySpec');
//     secretKeySpec.$init.overload('[B','java.lang.String').implementation = function (a,b) {
//         showStacks();
//         var result = this.$init(a, b);
//         send("======================================");
//         send("算法名：" + b + "|Dec密钥:" + bytesToString(a));
//         send("算法名：" + b + "|Hex密钥:" + bytesToHex(a));
//         return result;
//     }
//     var mac = Java.use('javax.crypto.Mac');
//     mac.getInstance.overload('java.lang.String').implementation = function (a) {
//         showStacks();
//         var result = this.getInstance(a);
//         send("======================================");
//         send("算法名：" + a);
//         return result;
//     }
//     mac.update.overload('[B').implementation = function (a) {
//         showStacks();
//         this.update(a);
//         send("======================================");
//         send("update:" + bytesToString(a))
//     }
//     mac.update.overload('[B','int','int').implementation = function (a,b,c) {
//         showStacks();
//         this.update(a,b,c);
//         send("======================================");
//         send("update:" + bytesToString(a) + "|" + b + "|" + c);
//     }
//     mac.doFinal.overload().implementation = function () {
//         showStacks();
//         var result = this.doFinal();
//         send("======================================");
//         send("doFinal结果:" + bytesToHex(result));
//         send("doFinal结果:" + bytesToBase64(result));
//         return result;
//     }
//     mac.doFinal.overload('[B').implementation = function (a) {
//         showStacks();
//         var result = this.doFinal(a);
//         send("======================================");
//         send("doFinal参数:" + bytesToString(a));
//         send("doFinal结果:" + bytesToHex(result));
//         send("doFinal结果:" + bytesToBase64(result));
//         return result;
//     }
//     var md = Java.use('java.security.MessageDigest');
//     md.getInstance.overload('java.lang.String','java.lang.String').implementation = function (a,b) {
//         showStacks();
//         send("======================================");
//         send("算法名：" + a);
//         return this.getInstance(a, b);
//     }
//     md.getInstance.overload('java.lang.String').implementation = function (a) {
//         showStacks();
//         send("======================================");
//         send("算法名：" + a);
//         return this.getInstance(a);
//     }
//     md.update.overload('[B').implementation = function (a) {
//         showStacks();
//         send("======================================");
//         send("update:" + bytesToString(a));
//         return this.update(a);
//     }
//     md.update.overload('[B','int','int').implementation = function (a,b,c) {
//         showStacks();
//         send("======================================");
//         send("update:" + bytesToString(a) + "|" + b + "|" + c);
//         return this.update(a,b,c);
//     }
//     md.digest.overload().implementation = function () {
//         showStacks();
//         send("======================================");
//         var result = this.digest();
//         send("digest结果:" + bytesToHex(result));
//         send("digest结果:" + bytesToBase64(result));
//         return result;
//     }
//     md.digest.overload('[B').implementation = function (a) {
//         showStacks();
//         send("======================================");
//         send("digest参数:" + bytesToString(a));
//         var result = this.digest(a);
//         send("digest结果:" + bytesToHex(result));
//         send("digest结果:" + bytesToBase64(result));
//         return result;
//     }
//     var ivParameterSpec = Java.use('javax.crypto.spec.IvParameterSpec');
//     ivParameterSpec.$init.overload('[B').implementation = function (a) {
//         showStacks();
//         var result = this.$init(a);
//         send("======================================");
//         send("iv向量:" + bytesToString(a));
//         send("iv向量:" + bytesToHex(a));
//         return result;
//     }
//     var cipher = Java.use('javax.crypto.Cipher');
//     cipher.getInstance.overload('java.lang.String').implementation = function (a) {
//         showStacks();
//         var result = this.getInstance(a);
//         send("======================================");
//         send("模式填充:" + a);
//         return result;
//     }
//     cipher.update.overload('[B').implementation = function (a) {
//         showStacks();
//         var result = this.update(a);
//         send("======================================");
//         send("update:" + bytesToString(a));
//         return result;
//     }
//     cipher.update.overload('[B','int','int').implementation = function (a,b,c) {
//         showStacks();
//         var result = this.update(a,b,c);
//         send("======================================");
//         send("update:" + bytesToString(a) + "|" + b + "|" + c);
//         return result;
//     }
//     cipher.doFinal.overload().implementation = function () {
//         showStacks();
//         var result = this.doFinal();
//         send("======================================");
//         send("doFinal结果:" + bytesToHex(result));
//         send("doFinal结果:" + bytesToBase64(result));
//         return result;
//     }
//     cipher.doFinal.overload('[B').implementation = function (a) {
//         showStacks();
//         var result = this.doFinal(a);
//         send("======================================");
//         send("doFinal参数:" + bytesToString(a));
//         send("doFinal结果:" + bytesToHex(result));
//         send("doFinal结果:" + bytesToBase64(result));
//         return result;
//     }
//     var x509EncodedKeySpec = Java.use('java.security.spec.X509EncodedKeySpec');
//     x509EncodedKeySpec.$init.overload('[B').implementation = function (a) {
//         showStacks();
//         var result = this.$init(a);
//         send("======================================");
//         send("RSA密钥:" + bytesToBase64(a));
//         return result;
//     }
//     var rSAPublicKeySpec = Java.use('java.security.spec.RSAPublicKeySpec');
//     rSAPublicKeySpec.$init.overload('java.math.BigInteger','java.math.BigInteger').implementation = function (a,b) {
//         showStacks();
//         var result = this.$init(a,b);
//         send("======================================");
//         //send("RSA密钥:" + bytesToBase64(a));
//         send("RSA密钥N:" + a.toString(16));
//         send("RSA密钥E:" + b.toString(16));
//         return result;
//     }
//
//     var NetCrypto = Java.use('com.izuiyou.network.NetCrypto')
//     NetCrypto.encodeAES.overload('[B').implementation = function (a){
//         // showStacks();
//         send('===== com.izuiyou.network.NetCrypto 加密 开始 =====')
//         send(bytesToString(a));
//         var result = this.encodeAES(a);
//         send(bytesToBase64(result));
//         send('===== com.izuiyou.network.NetCrypto 加密 结束 =====')
//         return result;
//     }
//
//     NetCrypto.decodeAES.overload('[B', 'boolean').implementation = function (a, b){
//         // showStacks();
//         send('===== com.izuiyou.network.NetCrypto 解密 开始 =====')
//         send(bytesToBase64(a));
//         send(b);
//
//         console.log('===a=' + a)
//         console.log('===b=' + b);
//         const crypto = Java.use('com.izuiyou.network.NetCrypto');
//         var aaa = crypto.decodeAES(a, b);
//         console.log('aaa=', +aaa);
//         // z = Java.use('boolean').$new(1);
//
//         var result = this.decodeAES(a, b);
//         send(bytesToString(result));
//         send('===== com.izuiyou.network.NetCrypto 解密 结束 =====')
//         return result;
//     }
//
//
// });


Java.perform(function () {
    var h_class = Java.use("ox3");
    var c_class = Java.use("ib$a");
    h_class.a.overload("java.lang.String").implementation = function (str) {
        console.log("str", str);
        if(str.indexOf('verifycode/login') != -1 || str.indexOf('verifycode_login') != -1){
            return true
        }
        return false;
    };
    c_class.c.implementation = function () {
        return -1;
    }


    var NetCrypto = Java.use('com.izuiyou.network.NetCrypto')
    NetCrypto.encodeAES.overload('[B').implementation = function (a) {
        // showStacks();
        send('===== com.izuiyou.network.NetCrypto 加密 开始 =====')
        send(bytesToString(a));
        var result = this.encodeAES(a);
        send(bytesToBase64(result));
        send('===== com.izuiyou.network.NetCrypto 加密 结束 =====')
        return result;
    }

    NetCrypto.decodeAES.overload('[B', 'boolean').implementation = function (a, b) {
        // showStacks();
        send('===== com.izuiyou.network.NetCrypto 解密 开始 =====')
        send(bytesToBase64(a));
        send(b);

        console.log('===a=' + a)
        console.log('===b=' + b);
        const crypto = Java.use('com.izuiyou.network.NetCrypto');
        var aaa = crypto.decodeAES(a, b);
        console.log('aaa=', +aaa);
        // z = Java.use('boolean').$new(1);

        var result = this.decodeAES(a, b);
        send(base64ToString(bytesToBase64(result)));
        send('===== com.izuiyou.network.NetCrypto 解密 结束 =====')
        return result;
    }

    const HoundDelegate = Java.use('cn.xiaochuankeji.tieba.delegate.HoundDelegate');
    HoundDelegate.a.overload('java.lang.String').implementation = function (str) {
        console.log(('shumei = ' + str));
        var result = this.a(str);
        console.log('result=' + result);
        return result

    }


})


function hook_register() {
    // libart.so 所有导出函数表
    var symbols = Module.enumerateSymbolsSync("libart.so");
    var addr_register = null;
    for (var i = 0; i < symbols.length; i++) {
        var symbol = symbols[i];
        var method_name = symbol.name;
        if (method_name.indexOf("art") >= 0) {

            if (method_name.indexOf("_ZN3art3JNI15RegisterNativesEP7_JNIEnvP7_jclassPK15JNINativeMethodi") >= 0) {
                addr_register = symbol.address;
            }
        }
    }

    // 开始hook
    if (addr_register) {
        Interceptor.attach(addr_register, {
            onEnter: function (args) {
                var methods = ptr(args[2]);
                var method_count = args[3];
                console.log("[RegisterNatives] method_count:", method_count);
                for (var i = 0; i < method_count; i++) {
                    var fn_ptr = methods.add(i * Process.pointerSize * 3 + Process.pointerSize * 2).readPointer();
                    var find_module = Process.findModuleByAddress(fn_ptr);
                    if (i == 0) {
                        console.log("module name", find_module.name);
                        console.log("module base", find_module.base);
                    }
                    console.log("\t method_name:", methods.add(i * Process.pointerSize * 3).readPointer().readCString(), "method_sign:", methods.add(i * Process.pointerSize * 3 + Process.pointerSize).readPointer().readCString(), "method_fnPtr:", fn_ptr, "method offset:", fn_ptr.sub(find_module.base));
                }
            }, onLeave(retval) {

            }
        })
    }

}

// function main() {
//     hook_register();
// }
//
// setImmediate(main);
