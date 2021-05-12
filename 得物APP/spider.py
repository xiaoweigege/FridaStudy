# -*- coding: utf-8 -*-

# @Time    : 2020/11/27 02:28
# @Author  : 小伟科技工作室
# @Email   : 240942649@qq.com
# @File    : spider.py
# @Software: PyCharm
# @Project : Frida-学习
import hashlib
import time

import requests
from loguru import logger


class DeWuApi(object):
    """
    得物API
    """

    def __init__(self, uuid, login_token, du_token):

        self.uuid = uuid
        self.login_token = login_token
        self.du_token = du_token

    def get_headers(self, timestamp: str) -> dict:
        """
        获取请求头
        :param timestamp:
        :return:
        """
        headers = {
            'duuuid': self.uuid,
            'duimei': '',
            'duplatform': 'android',
            'appid': 'duapp',
            'duchannel': 'pp',
            'duv': '4.50.0',
            'dulogintoken': self.login_token,
            'dudevicetrait': 'SM-G965N',
            'timestamp': timestamp,
            'oaid': '',
            'user-agent': 'duapp/4.50.0(android;7.1.2)',
            'isroot': '0',
            'emu': '0',
            'isproxy': '0',
            'accept-encoding': 'gzip',
            'cookie': f'duToken={self.du_token}'
        }
        return headers

    def get_sign(self, params: dict, timestamp: str) -> str:
        """
        生成sign参数
        :param params: 请求参数
        :param timestamp: 时间戳
        :return: sign -> str
        """
        hash_map = {
            'uuid': self.uuid,
            'timestamp': timestamp,
            'platform': 'android',
            'v': '4.50.0',
            'loginToken': self.login_token,
        }
        hash_map.update(params)
        hash_map = sorted(hash_map.items(), key=lambda x: x[0])
        data_list = []
        for k, v in hash_map:
            data_list.append(k + str(v))

        data = ''.join(data_list)
        print(data)
        data = input('输入data:')
        # data = encrypt(data)
        sign = hashlib.md5(data.encode()).hexdigest()
        return sign

    def get(self, url, **kwargs):

        response = requests.get(url, **kwargs)

        try:
            info = response.json()
            return response

        except Exception as err:
            logger.error('JSON序列化失败: {}', response.text)
            raise ValueError('json err')

    def post(self, url, **kwargs):
        response = requests.post(url, **kwargs)

        try:
            info = response.json()
            return response

        except Exception as err:
            logger.error('JSON序列化失败: {}', response.text)
            raise ValueError('json err')


    def check(self):
        """
        检测状态
        :return:
        """

        url = 'https://m.dewu.com/sns/v1/user/profile'

        timestamp = str(round(time.time()) * 1000)
        headers = self.get_headers(timestamp)
        sign = self.get_sign({}, timestamp)
        params = {
            'newSign': sign
        }
        is_login = False
        for _ in range(5):
            try:
                response = requests.get(url, params=params, headers=headers, verify=False, timeout=10)
                info = response.json()
                print(response.json())
                status = info['status']
                if status == 200:
                    is_login = True
                    break
            except Exception as err:
                print(err)
                continue

        return is_login

    def layout(self):
        url = 'https://app.dewu.com/api/v1/app/growth-app/home/layout'

        timestamp = str(round(time.time()) * 1000)
        headers = self.get_headers(timestamp)
        params = {
            'page': 'tab',
            'tabId': '8',
        }
        sign = self.get_sign(params, timestamp)
        params['newSign'] = sign

        response = requests.get(url, params=params, headers=headers, verify=False)
        print(response.text)


if __name__ == '__main__':
    spider = DeWuApi('9dd06849d06f7199', '', '')

    spider.layout()