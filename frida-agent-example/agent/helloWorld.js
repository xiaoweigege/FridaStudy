// 进入Java 虚拟机
Java.perform(function () {
    console.log('Hello World')
    console.log('My Name is Xiaowei')
    // 获取一个类
    const Arith = Java.use('com.example.junior.util.Arith');
    Arith.add.overload('java.lang.String', 'java.lang.String').implementation = function (a, b) {

        console.log(a, b);
        const result = this.add(a, b);
        console.log(result);
        return 'daaa'
    }

    Java.use('com.example.junior.CalculatorActivity').caculate.implementation = function () {

        console.log('calllll')
        // 应该先找到当前类的实例，然后对实例中的属性进行修改?
        // this.result = 'sdsss'
        this.caculate()

        return true
    }

})

