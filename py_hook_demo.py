
import os
import sys

import frida


JS_CODE = """

// 进入Java 虚拟机
Java.perform(() => {
    console.log('Hello World')
})

"""

with open('hook_script/jiami.js', encoding='utf-8') as file:
    JS_CODE = file.read()



def message(msg, data):
    """
    消息回调
    :param msg:
    :param data:
    :return:
    """
    if msg['type'] == 'send':
        print('[*] {0}'.format(msg['payload']))

    elif msg['type'] == 'error':
        print('错误', msg['stack'])
    else:
        print('错误', msg)


def main():
    """
    启动函数
    :return:
    """
    # 1. 转发frida端口
    os.system("adb forward tcp:27042 tcp:27042")
    # 2. 获取远程设备
    # frida.get_usb_device()
    device = frida.get_remote_device()
    # device = frida.get_usb_device()
    # 3. 获取当前活动进程PID
    pid = device.get_frontmost_application()
    # 4. 创建进程会话
    # 可以是进程ID 可以是包名称
    # session = device.attach(pid.pid)
    # spawn 方式
    # pid = device.spawn('com.rong.fastloan')
    session = device.attach('com.rong.fastloan')
    device.resume(pid)
    # device.spawn()
    import time
    time.sleep(0.5)
    # 5. 添加js脚本
    script = session.create_script(JS_CODE)
    # 6. 消息监听
    script.on('message', message)

    # 7. 加载会话
    script.load()

    # 8. 监控状态
    sys.stdin.read()


if __name__ == '__main__':
    main()




"""
import ryxq.ak;
import ryxq.bsm;
import ryxq.bvi;
import ryxq.chr;
import ryxq.ift;
"""