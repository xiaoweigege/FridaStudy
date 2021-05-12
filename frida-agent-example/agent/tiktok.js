function call_reg() {

    Java.perform(function () {
        var reg_info = '{"magic_tag":"ss_app_log","header":{"display_name":"TikTok","update_version_code":2021502030,"manifest_version_code":2021502030,"aid":1233,"channel":"googleplay","appkey":"5559e28267e58eb4c1000011","package":"com.zhiliaoapp.musically","app_version":"15.2.3","version_code":150203,"sdk_version":"2.5.5.8","os":"Android","os_version":"8.0","os_api":23,"device_model":"meizu 16s","device_brand":"meizu","cpu_abi":"armeabi-v7a","release_build":"f77b2da_20200301","density_dpi":480,"display_density":"mdpi","resolution":"2232x1080","language":"en","mc":"02:00:00:00:00:00","timezone":8,"access":"wifi","not_request_sender":0,"carrier":"","mcc_mnc":"46001","rom":"8135","rom_version":"HOMFU","sig_hash":"194326e82c84a639a52e5c023116f121","google_aid":"dd0c7037-724c-4f7f-8b30-5244cca688e1","openudid":"RffKSdOQm2pxw2RK","clientudid":"a74402b6-cb79-4ad8-a7d4-81b1d54e8941","sim_serial_number":[],"region":"CN","tz_name":"Asia\\/Shanghai","tz_offset":28800,"custom":{"web_ua":"Dalvik\\/2.1.0 (Linux; U; Android 6.0.1; Nexus 5 Build\\/MMB29X)"}},"_gen_time":1620359646759}';
        const String = Java.use('java.lang.String');

        var reg_data = String.$new(reg_info);

        Java.choose('com.ss.android.deviceregister.b.b$a', {
            onMatch: function (instance) {
                console.log('匹配到对象');
                var result = instance.a(reg_data, 1)
                console.log('主动调用', result);
            },
            onComplete: function (instance) {

            }
        })
    })


}

function guid2() {
    function S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }

    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}

// Use Java Vm
Java.perform(function () {

    const NetUtil = Java.use('com.ss.android.common.applog.NetUtil');
    const String = Java.use('java.lang.String');
    NetUtil.sendEncryptLog.implementation = function (str, barr, content, z) {
        if (str.indexOf('device_register') != -1) {
            var barr_str = String.$new(barr);
            str = str.replace('device_type=meizu+16s', 'device_type=meizu11s')
            str = str.replace('os_version=8.0', 'os_version=7.0')

            var return_value = this.sendEncryptLog(str, barr, content, z);
            let return_obj = JSON.parse(return_value);

            let device_id = return_obj['device_id_str'];
            let install_id = return_obj['install_id_str'];

            let message = `设备注册: ${device_id}\t${install_id}\t8.0\tmeizu 16s`
            console.log(return_value)
            console.log(message)



            // console.log('str=', str);
            // console.log('barr=', barr_str);
            // console.log('content=', content);
            // console.log('z=', z);
            // console.log('return=', return_value);
            return return_value
        }
        // console.log(str);
        return this.sendEncryptLog(str, barr, content, z);

    }

    const ba = Java.use('com.ss.android.deviceregister.b.b$a');
    ba.a.overload('java.lang.String', 'int').implementation = function (a, b) {

        var reg_obj = {
            "magic_tag": "ss_app_log",
            "header": {
                "display_name": "TikTok",
                "update_version_code": 2021502033,
                "manifest_version_code": 2021502033,
                "aid": 1233,
                "channel": "googleplay",
                "appkey": "5159e28267e58eb4c1000112",
                "package": "com.zhiliaoapp.musically",
                "app_version": "15.2.3",
                "version_code": 150203,
                "sdk_version": "2.5.5.8",
                "os": "Android",
                "os_version": "7.0",
                "os_api": 23,
                "device_model": "meizu 11s",
                "device_brand": "meizu",
                "cpu_abi": "armeabi-v7a",
                "release_build": "a87b2d2_20200311",
                "density_dpi": 480,
                "display_density": "mdpi",
                "resolution": "2232x1080",
                "language": "en",
                "mc": "02:00:00:00:01:06",
                "timezone": 8,
                "access": "wifi",
                "not_request_sender": 0,
                "carrier": "",
                "mcc_mnc": "46001",
                "rom": "8135",
                "rom_version": "HOMFU",
                "sig_hash": "1a4326e82c84a639a52e5c023141f22",
                "google_aid": guid2(),
                "openudid": guid2(),
                "clientudid": guid2(),
                "sim_serial_number": [],
                "region": "CN",
                "tz_name": "Asia\/Shanghai",
                "tz_offset": 28800,
                "custom": {
                    "web_ua": "Dalvik\/2.1.0 (Linux; U; Android 8.0.0; meizu 13s Build\/13s)"
                }
            },
            "_gen_time": new Date().getTime()
        }

        const String = Java.use('java.lang.String');

        var reg_data = String.$new(JSON.stringify(reg_obj));

        var result = this.a(reg_data, b);
        // console.log('result=', result)
        return result

    }

})

setImmediate()