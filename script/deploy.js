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
execSync(`tar --disable-copyfile --no-xattrs -czf ${archivePath} -C ${distPath} .`, { stdio: 'inherit' });
const compressEnd = Date.now();
console.log(`压缩完成，用时 ${(compressEnd - compressStart) / 1000}s`);

// 记录压缩包大小
const archiveStats = fs.statSync(archivePath);
console.log(`压缩包大小：${(archiveStats.size / 1024 / 1024).toFixed(2)} MB`);

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

function getDisplayWidth(str) {
  // 中文字符宽度2，英文宽度1
  return String(str).replace(/[^\u0000-\u00FF]/g, 'xx').length;
}

function padDisplay(str, len, align = 'left') {
  const width = getDisplayWidth(str);
  const padLen = Math.max(0, len - width);
  if (align === 'right') return ' '.repeat(padLen) + str;
  return str + ' '.repeat(padLen);
}

console.log('\n---------------- 部署统计信息 ----------------');
console.log(`| ${padDisplay('步骤', 14)} | ${padDisplay('用时(s)', 12)} | ${padDisplay('备注', 19)} |`);
console.log(`|${'-'.repeat(16)}|${'-'.repeat(14)}|${'-'.repeat(21)}|`);
console.log(
  `| ${padDisplay('打包', 14)} | ${padDisplay(((buildEnd - buildStart) / 1000).toFixed(2), 12, 'right')} | ${padDisplay('npm run build', 19)} |`,
);
console.log(
  `| ${padDisplay('压缩', 14)} | ${padDisplay(((compressEnd - compressStart) / 1000).toFixed(2), 12, 'right')} | ${padDisplay('tar.gz', 19)} |`,
);
console.log(
  `| ${padDisplay('上传', 14)} | ${padDisplay(((uploadEnd - uploadStart) / 1000).toFixed(2), 12, 'right')} | ${padDisplay('scp', 19)} |`,
);
console.log(
  `| ${padDisplay('远程解压', 14)} | ${padDisplay(((remoteEnd - remoteStart) / 1000).toFixed(2), 12, 'right')} | ${padDisplay('ssh tar', 19)} |`,
);
console.log(
  `| ${padDisplay('删除本地压缩包', 14)} | ${padDisplay(((cleanEnd - cleanStart) / 1000).toFixed(2), 12, 'right')} | ${padDisplay('unlink', 19)} |`,
);
console.log(
  `| ${padDisplay('总用时', 14)} | ${padDisplay(((totalEnd - totalStart) / 1000).toFixed(2), 12, 'right')} | ${padDisplay('', 19)} |`,
);
console.log(
  `| ${padDisplay('压缩包大小', 14)} | ${padDisplay('-', 12)} | ${padDisplay(`${(archiveStats.size / 1024 / 1024).toFixed(2)} MB`, 19)} |`,
);
console.log('------------------------------------------------\n');

// 统计 dist 目录下静态资源与代码文件的大小
function getSizeByExt(dir, exts) {
  let total = 0;
  function walk(current) {
    const files = fs.readdirSync(current);
    for (const file of files) {
      const fullPath = path.join(current, file);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        walk(fullPath);
      } else if (exts.some((ext) => file.toLowerCase().endsWith(ext))) {
        total += stat.size;
      }
    }
  }
  walk(dir);
  return total;
}

const codeExts = ['.js', '.css', '.html', '.json', '.map'];
const staticExts = [
  '.png',
  '.jpg',
  '.jpeg',
  '.gif',
  '.svg',
  '.webp',
  '.ico',
  '.ttf',
  '.otf',
  '.woff',
  '.woff2',
  '.eot',
  '.mp4',
  '.mp3',
];

const codeSize = getSizeByExt(distPath, codeExts);
const staticSize = getSizeByExt(distPath, staticExts);
const totalSize = codeSize + staticSize;
const codePercent = totalSize ? ((codeSize / totalSize) * 100).toFixed(2) : 0;
const staticPercent = totalSize ? ((staticSize / totalSize) * 100).toFixed(2) : 0;

console.log('\n------ 资源占比统计 ------');
console.log(`代码文件大小：${(codeSize / 1024 / 1024).toFixed(2)} MB (${codePercent}%)`);
console.log(`静态资源大小：${(staticSize / 1024 / 1024).toFixed(2)} MB (${staticPercent}%)`);
console.log('-------------------------\n');
