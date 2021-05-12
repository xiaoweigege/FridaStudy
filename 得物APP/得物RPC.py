import sys

import frida


def message_header(message, payload):
    message_type = message['type']
    if message_type == 'send':
        print('[* message]', message['payload'])

    elif message_type == 'error':
        stack = message['stack']
        print('[* error]', stack)

    else:
        print(message)


# 1. 端口转发
# os.system('adb forward tcp:27042 tcp:27042')

# 2. 获取USB设备
device = frida.get_usb_device()

# 3. 附加进程
# pid = device.spawn(['com.shizhuang.duapp'])
# device.resume(pid)
# time.sleep(1)
# session = device.attach(pid)

session = device.attach('com.ilulutv.fulao2')

# 4. 打开hook_js脚本
with open('../hook_script/毒Hook.js', 'r') as file:
    hook_code = file.read()

# 5. 加载脚本
script = session.create_script(hook_code)

# 6. 消息加载
script.on('message', message_header)

# 7. 加载
script.load()

# 8. 一直等待
sys.stdin.read()
