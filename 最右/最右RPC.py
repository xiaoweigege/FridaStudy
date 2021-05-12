import sys
import json
import frida

from flask import Flask, jsonify, request


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
pid = device.spawn(['cn.xiaochuankeji.tieba'])
device.resume(pid)
# time.sleep(1)
session = device.attach(pid)

# session = device.attach('cn.xiaochuankeji.tieba')

# 4. 打开hook_js脚本
with open('rpc_script.js', 'r') as file:
    hook_code = file.read()

# 5. 加载脚本
script = session.create_script(hook_code)

# 6. 消息加载
script.on('message', message_header)

# 7. 加载
script.load()

# # 8. 一直等待
# sys.stdin.read()


app = Flask(__name__)


@app.route('/decode', methods=['POST'])  # data解密
def decode_class():
    data = request.form['data']
    key = request.form['key']
    z = request.form['z']
    # print(data)
    # print(key)
    # print(z)
    res = script.exports.decode(data, key, z)
    return res


@app.route('/encode', methods=['POST'])  # url加密
def encode_class():
    post_data = request.form['data']
    print(post_data)
    res = script.exports.encode(post_data)
    print(res)
    return res


@app.route('/sign', methods=['POST'])  # url加密
def sign_class():
    post_data = request.form['data']
    url = request.form['url']
    res = script.exports.sign(url, post_data)
    return res


if __name__ == '__main__':
    app.run()