#!/bin/bash

# 从环境变量中读取变量
REMOTE_PASS=${RTZH_PASS_146}

# 远程服务器信息
REMOTE_USER="root"
REMOTE_HOST="172.18.8.146"
REMOTE_PORT="22"
REMOTE_DIR="/usr/local/nginx/html"
BUILD_DIR="dist"

# 步骤1: 登录到远程服务器（这里用ssh执行远程命令）
sshpass -p "${REMOTE_PASS}" ssh -p ${REMOTE_PORT} ${REMOTE_USER}@${REMOTE_HOST} << EOF

# 步骤2: 检查远程服务器是否存在指定目录，如果存在需删除指定目录
if [ -d "${REMOTE_DIR}/${BUILD_DIR}" ]; then
    echo "远程目录 ${REMOTE_DIR}/${BUILD_DIR} 存在，删除中..."
    rm -rf ${REMOTE_DIR}/${BUILD_DIR}
    if [ $? -ne 0 ]; then
        echo "删除目录 ${REMOTE_DIR}/${BUILD_DIR} 失败"
        exit 1
    else
        echo "目录 ${REMOTE_DIR}/${BUILD_DIR} 删除成功"
    fi
else
    echo "远程目录 ${REMOTE_DIR}/${BUILD_DIR} 不存在"
fi
EOF

# 步骤3: 同步本地指定目录到远程服务器的指定目录
echo "开始同步本地目录 ${BUILD_DIR} 到远程服务器 ${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_DIR} ..."
sshpass -p "${REMOTE_PASS}" rsync -avz -e "ssh -p ${REMOTE_PORT}" --progress ${BUILD_DIR} ${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_DIR}
if [ $? -ne 0 ]; then
    echo "同步失败"
    exit 1
else
    echo "同步成功"
fi

# 步骤4: 同步完成后退出服务器（ssh连接会在EOF后自动退出）
echo "操作完成"
