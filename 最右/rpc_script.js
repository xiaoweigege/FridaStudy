send('=====> App Hook Start <=====')

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

function print_object(obj) {
    Java.openClassFile('/data/local/tmp/r0gson.dex').load()
    const gson = Java.use('com.r0ysue.gson.Gson');
    const data = gson.$new().toJson(obj)
    console.log('print_object==', data);
}


function aa(path, key1, value1, key2, value2) {
    return new Promise(resolve => {
        Java.perform(() => {
            var Makeurl = Java.use("com.xxx.lib.http.MakeUrlClient");
            var context = Java.use('android.app.ActivityThread').currentApplication().getApplicationContext();
            console.log(context);
            console.log(Makeurl);
            result = Makeurl.b(context, path, key1, value1, key2, value2, 0, 1);
            resolve(result);
        });
    })
}


function encode(data) {
    data = base64ToBytes(data)
    var key;
    var result;
    return new Promise(resolve => {
        Java.perform(function () {

            const crypto = Java.use('com.izuiyou.network.NetCrypto');

            key = crypto.getProtocolKey();
            result = crypto.encodeAES(data);
            data = {
                key: key,
                result: bytesToBase64(result)
            }
            data = JSON.stringify(data);
            resolve(data);


        })
    })


}

function decode(data, key, z) {
    data = base64ToBytes(data)
    var result;
    // Java.boolean
    return new Promise(resolve => {
        Java.perform(function () {

            // var bool = Java.use("boolean"); //boolean
            // z = Java.use("java.boolean").$new(true);
            // console.log(data);
            // console.log(z);
            // z = bool.$new(true);
            const crypto = Java.use('com.izuiyou.network.NetCrypto');
            data = Java.array('byte',data)

            // crypto.setProtocolKey(key);
            result = crypto.decodeAES(data, true);

            data = {
                result: bytesToBase64(result)
            }
            data = JSON.stringify(data);
            resolve(data);


        })
    })

}

function sign(url, data) {
    data = base64ToBytes(data)
    var result;
    return new Promise(resolve => {
        Java.perform(function () {

            const crypto = Java.use('com.izuiyou.network.NetCrypto');
            data = Java.array('byte',data);
            result = crypto.sign(url, data);
            data = {
                result: bytesToString(result)
            }
            data = JSON.stringify(data)
            resolve(data);

        })
    })

}


Java.perform(function () {
    var h_class = Java.use("ox3");
    var c_class = Java.use("ib$a");
    h_class.a.overload("java.lang.String").implementation = function (str) {
        console.log("str", str);
        // return false;
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
        showStacks()
        a = bytesToString(a);
        a = a.replace('97ad6822d32fd923', '97ad6822d32fd924')
        a = stringToBytes(a);
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




rpc.exports = {
    encode: encode,
    decode: decode,
    sign: sign
}


