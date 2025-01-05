import { exec } from "node:child_process";

// 定义远程服务器的详细信息和目录
const REMOTE_USER = "root";
const REMOTE_HOST = "172.18.1.75";
const REMOTE_PORT = "22";
const REMOTE_PASS = process.env.RTZH_PASS_146; // 从环境变量中加载密码
const REMOTE_DIR = "/usr/local/nginx/html";
const BUILD_DIR = "dist";

// SSH 命令，用于检查并删除远程目录（如果存在）
const sshCommand = `
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
`;

// Rsync 命令，用于将本地构建目录同步到远程服务器
const syncCommand = `sshpass -p "${REMOTE_PASS}" rsync -avz -e "ssh -p ${REMOTE_PORT}" --progress ${BUILD_DIR} ${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_DIR}`;

// 执行 SSH 命令
exec(
  `sshpass -p "${REMOTE_PASS}" ssh -p ${REMOTE_PORT} ${REMOTE_USER}@${REMOTE_HOST} '${sshCommand}'`,
  (error, stdout, stderr) => {
    if (error) {
      console.error(`执行SSH命令失败: ${error}`); // 如果 SSH 命令失败，记录错误
      return;
    }
    console.log(stdout); // 记录 SSH 命令的输出

    console.log(
      `开始同步本地目录 ${BUILD_DIR} 到远程服务器 ${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_DIR} ...`
    );
    // 执行 Rsync 命令
    exec(syncCommand, (error, stdout, stderr) => {
      if (error) {
        console.error(`同步失败: ${error}`); // 如果 Rsync 命令失败，记录错误
        return;
      }
      console.log(stdout); // 记录 Rsync 命令的输出
      console.log("同步成功"); // 记录同步成功信息
      console.log("操作完成"); // 记录操作完成信息
    });
  }
);
