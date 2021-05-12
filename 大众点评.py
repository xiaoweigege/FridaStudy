
import os
import sys
from pprint import pprint

import frida

js_path = '/Users/xiaowei/Desktop/Android-逆向/Frida-学习/hook_script/jiami.js'
with open(js_path, 'r', encoding='utf-8') as js_file:
    js_code = js_file.read()


def message(message, data):
    if message['type'] == 'send':
        print('[*] {0}'.format(message['payload']))
    else:
        pprint(message)


os.system("adb forward tcp:27042 tcp:27042")
device = frida.get_remote_device()
# pid = device.spawn('cn.xiaochuankeji.tieba')
# device.resume(pid)
process = device.attach('com.bbk.appstore')

# process = device.spawn('cn.xiaochuankeji.tieba')

script = process.create_script(js_code)
script.on('message', message)

script.load()
sys.stdin.read()
