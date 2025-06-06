/* eslint-disable no-underscore-dangle */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// 兼容 ES Module 下的 __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 配置项
const remoteUser = 'root';
const remoteHost = '192.168.120.167';
const remoteDir = '/var/www/ruiyuan-new';
const archiveName = 'deploy_package.tar.gz';

// 记录总用时
const totalStart = Date.now();

// 1. 打包项目（npm run build）
console.log('开始打包...');
const buildStart = Date.now();
execSync('npm run build', { stdio: 'inherit' });
const buildEnd = Date.now();
console.log(`打包完成，用时 ${(buildEnd - buildStart) / 1000}s`);

// 2. 压缩打包目录（dist 为输出目录）
console.log('开始压缩...');
const compressStart = Date.now();
const distPath = path.resolve(__dirname, '../dist');
const archivePath = path.resolve(__dirname, archiveName);
execSync(`tar -czf ${archivePath} -C ${distPath} .`, { stdio: 'inherit' });
const compressEnd = Date.now();
console.log(`压缩完成，用时 ${(compressEnd - compressStart) / 1000}s`);

// 3. 上传压缩包到远程服务器
console.log('上传压缩包到远程服务器...');
const uploadStart = Date.now();
execSync(`scp ${archivePath} ${remoteUser}@${remoteHost}:${remoteDir}/`, { stdio: 'inherit' });
const uploadEnd = Date.now();
console.log(`上传完成，用时 ${(uploadEnd - uploadStart) / 1000}s`);

// 4. 远程解压并删除压缩包
console.log('远程解压...');
const remoteStart = Date.now();
execSync(`ssh ${remoteUser}@${remoteHost} "cd ${remoteDir} && tar -xzf ${archiveName} && rm -f ${archiveName}"`, {
  stdio: 'inherit',
});
const remoteEnd = Date.now();
console.log(`远程解压完成，用时 ${(remoteEnd - remoteStart) / 1000}s`);

// 5. 删除本地压缩包
console.log('删除本地压缩包...');
const cleanStart = Date.now();
fs.unlinkSync(archivePath);
const cleanEnd = Date.now();
console.log(`本地压缩包删除完成，用时 ${(cleanEnd - cleanStart) / 1000}s`);

const totalEnd = Date.now();
console.log(`部署完成！总用时 ${(totalEnd - totalStart) / 1000}s`);
