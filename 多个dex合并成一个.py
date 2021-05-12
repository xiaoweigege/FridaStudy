


import os

path = r'/Users/xiaowei/com.sogou.activity.src'  # 文件夹目录
files = os.listdir(path)  # 得到文件夹下的所有文件名称
out_path = r'/Users/xiaowei/com.sogou.activity.src1'  # 输出文件夹
# 路径上不要有中文!!!!!
s = []
for file in files:  # 遍历文件夹
    if file.find("dex") > 0:  ## 查找dex 文件
        sh = f'jadx -j 1 -r -d {out_path} {path}/{file}'
        print(sh)
        os.system(sh)
