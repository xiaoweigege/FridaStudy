# -*- coding: utf-8 -*-

# @Time    : 2020/12/20 18:00
# @Author  : 小伟科技工作室
# @Email   : 240942649@qq.com
# @File    : spider.py
# @Software: PyCharm
# @Project : Frida-学习
import base64
import hashlib
import json
import random
import re
import time
import warnings

import requests
from retry import retry

warnings.filterwarnings('ignore')


class PhoneMessageApi(object):
    """
    手机号
    """

    def __init__(self, user, password):
        self.user = user
        self.password = password
        self.token = self.login()

    @retry(tries=5, delay=5)
    def login(self):
        """
        登录
        :return:
        """
        url = f'http://125.77.159.211:8000/api/sign/username={self.user}&password={self.password}'

        response = requests.get(url)

        info = response.content.decode('gbk')
        code, message = info.split('|')
        if code == '1':
            print('卡商登录成功')
            return message
        print(message)
        raise ValueError(message)

    @retry(tries=5, delay=3)
    def get_phone(self):
        """
        获取手机号
        :return:
        """
        url = f'http://125.77.159.211:8000/api/yh_qh/id=30646&operator=0&Region=0&card=0&phone=&loop=1&filer=&token={self.token}'

        response = requests.get(url)

        info = response.content.decode('gbk')

        code, phone = info.split('|')
        if code == '1':
            print(f'获取手机号 {phone}')
            return phone
        print(phone)
        raise ValueError(phone)

    @retry(tries=10, delay=5)
    def get_auto_code(self, phone):
        """
        获取验证码
        :param phone:
        :return:
        """
        url = f'http://125.77.159.211:8000/api/yh_qm/id=30646&phone={phone}&t={self.user}&token={self.token}'
        print(f'{phone} 开始获取验证码!')
        response = requests.get(url)
        info = response.content.decode('utf-8')
        code, message = info.split('|')
        if code == '1':
            code = re.findall(r'(\d{4})', message)
            if code:
                print(f'获取到验证 {code[0]}')
                self.release(phone)
                return code[0]
        else:
            print(message)
            raise ValueError(message)

    def release(self, phone):
        """
        释放
        :param phone:
        :return:
        """
        url = f'http://125.77.159.211:8000/api/yh_sf/id=30646&phone={phone}&token={self.token}'
        response = requests.get(url)


class ZuiYouLogin(object):
    """
    最右登录
    """

    def __init__(self):
        self.android = self.random_android()
        self.brand = self.random_brand()
        self.version = self.random_version()
        self.os_id = self.random_os()
        self.hemera = self.get_hemera()
        self.mid = 0
        self.token = None

        self.phone_api = PhoneMessageApi('cc9495', 'cc9495')

        proxyHost = "http-pro.abuyun.com"
        proxyPort = "9010"

        # 账号密码
        proxyUser = "HH67036HFBH6D99P"
        proxyPass = "A5CB9A44DCC7DE58"
        proxyMeta = "http://%(user)s:%(pass)s@%(host)s:%(port)s" % {
            "host": proxyHost,
            "port": proxyPort,
            "user": proxyUser,
            "pass": proxyPass,
        }
        self.proxies = {
            'http': proxyMeta,
            'https': proxyMeta,
        }

        # self.proxies = None

    @staticmethod
    def sign(link, post_body):

        post_data = base64.b64encode(post_body).decode()

        url = 'http://127.0.0.1:5000/sign'
        data = {
            'url': link,
            'data': post_data
        }
        # print(data)
        response = requests.post(url, data=data)
        info = response.json()
        sign = info['result']
        # print(sign)
        return sign

    @staticmethod
    def encode(post_json):
        """
        加密请求参数
        :param post_json:
        :return:
        """
        post_data = json.dumps(post_json, ensure_ascii=False)
        post_data = base64.b64encode(post_data.encode()).decode()

        url = 'http://127.0.0.1:5000/encode'
        data = {
            'data': post_data
        }
        response = requests.post(url, data=data)
        # print(response.text)
        info = response.json()
        key = info['key']
        data = info['result']
        data = base64.b64decode(data.encode())
        return key, data

    @staticmethod
    def decode(data, key, z):
        """
        解密
        :param data:
        :param key:
        :param z:
        :return:
        """
        post_data = base64.b64encode(data).decode()

        url = 'http://127.0.0.1:5000/decode'
        data = {
            'data': post_data,
            'key': key,
            'z': z
        }
        response = requests.post(url, data=data)
        # print(response.text)
        info = response.json()
        data = info['result']
        data = base64.b64decode(data.encode()).decode()
        return data

    @staticmethod
    def get_time():
        """
        获取时间戳
        :return:
        """
        return int(time.time() * 1000)

    @staticmethod
    def random_version():
        """
        随机系统版本
        :return:
        """
        versions = f'5.{random.randint(4, 6)}.{random.randint(0, 20)}'
        return versions

    @staticmethod
    def random_brand():
        """
        随机品牌
        :return:
        """

        brands = ['Pixel 2', 'Pixel 1', 'huawei', 'xiaomi 5', 'vivo', 'oppo', '1+', '360', 'meitu', 'meizu', 'chuizi']
        return random.choice(brands)

    @staticmethod
    def random_android():
        """
        随机安卓ID
        :return:
        """
        chars = 'abcdrfghimnopqrstuvwxyz'
        chars = random.choices(chars, k=random.randint(1, len(chars)))
        chars = ''.join(chars)
        a_id = hashlib.md5(chars.encode()).hexdigest()
        a_id = a_id[:16]
        return a_id

    @staticmethod
    def random_os():
        return random.randint(20, 28)

    @staticmethod
    def get_h_ids():
        data = {
            "meid": "35753708126051",
            "imei1": "357537081260515",
            "imei": "357537081260515"
        }
        return data

    def get_headers(self, key):
        """
        获取headers
        :return:
        """
        headers = {
            'ZYP': f'mid={self.mid}',
            'X-Xc-Agent': 'av=5.5.9,dt=0',
            'User-Agent': f'okhttp/3.12.2 Zuiyou/{self.version} (Android/{self.os_id})',
            'X-Xc-Proto-Req': key,
            'Request-Type': 'text/json',
            'Content-Type': 'application/xcp',
            'Host': 'api.izuiyou.com',
            'Connection': 'Keep-Alive',
            'Accept-Encoding': 'gzip',
        }
        return headers

    def get_token(self):
        """
        获取token
        :return:
        """
        url = 'https://api.izuiyou.com/account/register_guest'
        uuid = f"X+Ngegougk{random.randint(0,9)}DAAAAAAC{random.randint(0,9)}\/\/vp"
        # uuid = 'X+iOnwA0ni4DAAAAAAD1j60e'
        post_json = {
            # "uuid": "X+Ngegougk4DAAAAAAC8\/\/vp",
            "uuid": uuid,
            "hemera": "unknown",
            "h_av": self.version,
            "h_dt": 0,
            "h_os": self.os_id,
            "h_app": "zuiyou",
            "h_model": self.brand,
            "h_did": self.android,
            "h_nt": 1,
            "h_m": 0,
            "h_ch": "zx-lingxin-1",
            "h_ts": self.get_time(),
            "android_id": self.android,
            "h_ids": {},
            "h_newbee": 1
        }

        key, post_body = self.encode(post_json)

        headers = self.get_headers(key)

        sign = self.sign(url, post_body)

        response = requests.post(url, params={'sign': sign}, data=post_body, headers=headers, verify=False)

        key = response.headers['X-Xc-Proto-Res']
        z = True if response.headers['Content-Type'] == 'application/xcp' else False
        data = self.decode(response.content, key, z)
        # print(data)
        info = json.loads(data)
        data = info['data']
        mid = data['mid']
        token = data['token']
        self.mid = mid
        self.token = token

        # self.token = 'TfKeNk11dd14Kpc2gi1y6gHwVTELyng9A0Lms4NKKZDOuQHn9CURHwZsJVrgx_Gozp-O9'
        # self.mid = 243224089
        return mid, token

    def random_all(self):
        """
        随机所有
        :return:
        """
        self.android = self.random_android()
        self.brand = self.random_brand()
        self.version = self.random_version()
        self.os_id = self.random_os()
        self.hemera = self.get_hemera()
        self.get_token()

    @retry(tries=5)
    def send_message(self, phone):
        url = 'https://api.izuiyou.com/verifycode/login'
        post_json = {
            "phone": phone,
            "region_code": 86,
            "no_hash_code": 1,
            "h_sm": self.hemera,
            "hemera": self.hemera,
            "h_av": self.version,
            "h_dt": 0,
            "h_os": self.os_id,
            "h_app": "zuiyou",
            "h_model": self.brand,
            "h_did": self.android,
            "h_nt": 1,
            "h_m": self.mid,
            "h_ch": "ppzhushou",
            "h_ts": self.get_time(),
            "token": self.token,
            "android_id": self.android,
            "h_ids": self.get_h_ids()
        }

        key, post_body = self.encode(post_json)

        headers = self.get_headers(key)

        sign = self.sign(url, post_body)

        response = requests.post(url, params={'sign': sign}, data=post_body, headers=headers, verify=False,
                                 proxies=self.proxies)

        key = response.headers['X-Xc-Proto-Res']
        z = True if response.headers['Content-Type'] == 'application/xcp' else False
        data = self.decode(response.content, key, z)
        print(data)
        info = json.loads(data)
        ret = info['ret']
        if ret == 1:
            print(f'{phone} 短息发送成功')
            # 判断是否注册
            is_reg = info['data'].get('is_phone_reg')
            if is_reg:
                print('该账号已注册')
                return False
            else:
                # print(data)
                return True
        else:
            print(data)
            return False

    @staticmethod
    def get_hemera():

        return f"BWilSBEV{random.randint(0,9)}Hv{random.randint(0,9)}CrhF{random.randint(0,9)}UKIaVydjYLUxILlvsd3NqjuDn{random.randint(0, 9)}VwP1tcsUI2VRIXY8yeZaTre0N{random.randint(0, 9)}t7RwpxWOC8nbstYUw=="

    @retry(tries=5)
    def login(self, phone, code):
        """
        登录
        :param phone:
        :param code:
        :return:
        """
        url = 'https://api.izuiyou.com/account/verifycode_login'

        post_json = {
            "phone": phone,
            "code": code,
            "region_code": 86,
            "gender": 1,
            "birth": 978278400,

            "hemera": self.hemera,
            "h_av": self.version,
            "h_dt": 0,
            "h_os": self.os_id,
            "h_app": "zuiyou",
            "h_model": self.brand,
            "h_did": self.android,
            "h_nt": 1,
            "h_m": self.mid,
            "h_ch": "zx-lingxin-1",
            "h_ts": self.get_time(),
            "token": self.token,
            "android_id": self.android,
            "h_ids": self.get_h_ids(),
            "h_newbee": 1
        }

        key, post_body = self.encode(post_json)

        headers = self.get_headers(key)

        sign = self.sign(url, post_body)
        response = requests.post(url, params={'sign': sign}, data=post_body, headers=headers, verify=False,
                                 proxies=self.proxies)
        key = response.headers['X-Xc-Proto-Res']
        z = True if response.headers['Content-Type'] == 'application/xcp' else False
        data = self.decode(response.content, key, z)

        return data

    def like(self, mid, token, a_id):
        """
        点赞
        :return:
        """
        url = 'https://api.izuiyou.com/post/like'
        self.mid = mid
        if a_id:
            self.android = a_id
        else:
            self.android = self.random_android()
        post_json = {
            "pid": 209293155,
            "from": "index-imgtxt",
            "h_av": self.version,
            "h_dt": 0,
            "h_os": self.os_id,
            "h_app": "zuiyou",
            "h_model": self.brand,
            "h_did": self.android,
            "h_nt": 1,
            "h_m": self.mid,
            "h_ch": "zx-lingxin-1",
            "h_ts": self.get_time(),
            "token": token,
            "android_id": self.android,
            "h_ids": self.get_h_ids()
        }

        key, post_body = self.encode(post_json)

        headers = self.get_headers(key)

        sign = self.sign(url, post_body)

        response = requests.post(url, params={'sign': sign}, data=post_body, headers=headers, verify=False,
                                 proxies=self.proxies)

        key = response.headers['X-Xc-Proto-Res']
        z = True if response.headers['Content-Type'] == 'application/xcp' else False
        data = self.decode(response.content, key, z)
        print(data)
        info = json.loads(data)

    def like_all(self):
        """点赞所有"""
        with open('zuiyou_login.txt', 'r') as file:
            lines = file.readlines()

        for line in lines:
            line = line.strip()
            data = json.loads(line)
            # data = data['data']
            mid = data['mid']
            token = data['token']
            a_id = data.get('android')
            self.like(mid, token, a_id)

    def run(self):
        phone = '17059171364'
        is_ok = self.send_message(phone)
        if is_ok:
            code = input('请输入验证码:')
            self.login(phone, code)

    def run_task(self):
        number = 0
        while True:
            self.random_all()
            # self.android = '97ad6822d32fd923'

            try:
                phone = self.phone_api.get_phone()
            except Exception as err:
                print('手机号获取失败下一个')
                continue
            is_ok = self.send_message(phone)
            if is_ok:
                try:
                    code = self.phone_api.get_auto_code(phone)
                except Exception as err:
                    print('验证码获取失败下一个')
                    continue
                data = self.login(phone, code)

                if '"ret":1' in data:
                    print(f'{phone} 注册成功')

                    with open('zuiyou_login.txt', 'a+') as file:
                        data = json.loads(data)
                        data = data['data']
                        data['android'] = self.android
                        data = json.dumps(data, ensure_ascii=False)
                        file.write(data + '\n')
                        number += 1
                else:
                    print(data)
            if number >= 10:
                break
            # break


if __name__ == '__main__':
    spider = ZuiYouLogin()

    spider.run_task()
    # spider.like_all()

