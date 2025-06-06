import type { AxiosResponse } from 'axios';
import { MessagePlugin } from 'tdesign-vue-next';
/**
 * @description: 通过URL下载文件
 * @param {object} item.url 下载链接 item.name 下载文件名
 * @return {*}
 */
export async function downloadResource(item: { url: string; name: string }) {
  try {
    // 使用fetch获取资源
    const response = await fetch(item.url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // 读取资源内容
    const blob = await response.blob();

    // 创建一个链接，指向下载的资源
    const downloadUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = item.name; // 下载文件名

    // 点击链接，触发下载
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // 释放对象URL
    URL.revokeObjectURL(downloadUrl);
  } catch (error) {
    console.error('Download failed:', error);
  }
}

/**
 * @description: 通过axios的响应体下载，一般用于post接口直接返回二进制流的场景
 * @param {AxiosResponse} res
 * @return {*}
 */
export function downloadByAxiosResponse(res: AxiosResponse): any {
  try {
    const fileName = decodeURIComponent(
      res.headers['content-disposition'].split(';')[1].split('=')[1].split('.').slice(0, -1).join(''),
    ); // 根据接口返回情况拿到文件名
    const suffix = res.headers['content-disposition'].split(';')[1].split('=')[1].split('.').slice(-1)[0];
    const blob = new Blob([res.data], {
      type: res.headers['content-type'],
    }); // 通过返回的流数据 手动构建blob 流

    const a = document.createElement('a');
    a.download = `${fileName}.${suffix}`;
    a.href = URL.createObjectURL(blob);
    a.click();
    URL.revokeObjectURL(a.href);
    return null;
  } catch (err) {
    MessagePlugin.error('下载出错');
    return new Error('下载出错');
  }
}
