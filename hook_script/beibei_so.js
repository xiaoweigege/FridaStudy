Java.perform(function () {
    send('Hook Start');


    var nativePointer = Module.findExportByName("libcommon-jni.so", "md5");
    send("native: " + nativePointer);
    Interceptor.attach(nativePointer, {
        onEnter: function (args) {
            console.log('==a', args[0]);
            print_dump(args[0], 1000);
            console.log('==b', args[1]);
            // print_dump(args[1], 1000);
            console.log('==c', args[2]);
            print_dump(args[2], 100);

        },
        onLeave: function (retval) {
            console.log('result', retval);
            // print_dump(retval, 100);
            return retval

        }
    });

    function print_dump(addr, size) {
        var buf = Memory.readByteArray(addr, size);
        console.log("[function] send@ " + addr.toString() + "  " + "length: " + size.toString() + "\n[data]");
        console.log(hexdump(buf, {
            offset: 0,
            length: size,
            header: false,
            ansi: false
        }));
        console.log("")

    }

    function printClassInfo(clazz){
        if(clazz == null){
            return;
        }
        var fields = Java.cast(clazz.getClass(), Java.use('java.lang.Class')).getDeclaredFields();
        for (var i = 0; i < fields.length; i++) {
            var field = fields[i];
            field.setAccessible(true);
            var name = field.getName();
            var value = field.get(clazz);
            console.log("name:" + name + "\tvalue:" + value);
        }
    }
});
