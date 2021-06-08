# -*- coding: utf-8 -*-

from binascii import a2b_hex, b2a_hex

# @Time    : 2021/5/23 18:26
# @Author  : 小伟
# @Email   : 240942649@qq.com
# @File    : 2.decode_r.py
# @Software: PyCharm
# @Project : FridaStudy
import z3


# a2b_hex  ascii编码的十六进制 转  二进制
# b2a_hex  二进制 转  ascii编码的十六进制


def main():
    r = '0064736c707d6f510020646b73247c4d0068202b4159516700502a214d24675100'

    r_result = bytearray(a2b_hex(r))
    print(r_result)

    for i in range(len(r_result) // 2):
        c = r_result[i]
        r_result[i] = r_result[len(r_result) - i - 1]
        r_result[len(r_result) - i - 1] = c

    print(b2a_hex(r_result))
    # 这是一个求解器
    s = z3.Solver()
    # 创造多个求解单位
    x = [z3.BitVec(f'x{i}', 32) for i in range(len(r_result))]
    for i in range(len(r_result)):
        # c = r_result[i]
        # 根据原有算法, 这个就相当于求方程嘛。

        s.add(((x[i] >> (i % 8)) ^ x[i]) == r_result[i])

    # 求解成功
    if s.check() == z3.sat:

        model = s.model()
        # print(model)
        flag = ''
        for i in range(len(r_result)):
            # print(model[x[i]])
            # if model[x[i]]:
            try:
                flag += chr(model[x[i]].as_long().real)
            except Exception as err:
                flag += ' '

        print([flag])
    else:
        print('???')

    # [' ay I *P EASE* h ve the  assword ']
    #    ay I *P EASE* h ve the  assword


if __name__ == '__main__':
    main()

"""

 private String b(String str) {
        char[] charArray = str.toCharArray();
        for (int i = 0; i < charArray.length; i++) {
            charArray[i] = (char) ((charArray[i] >> (i % 8)) ^ charArray[i]);
        }
        for (int i2 = 0; i2 < charArray.length / 2; i2++) {
            char c = charArray[i2];
            charArray[i2] = charArray[(charArray.length - i2) - 1];
            charArray[(charArray.length - i2) - 1] = c;
        }
        return new String(charArray);
    }

"""
