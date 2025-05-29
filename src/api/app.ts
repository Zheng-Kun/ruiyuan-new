import { request } from '@/utils/request';

class AppApi {
  /**
   * @description: 获取应用列表
   * @param {object} data
   * @return {*}
   */
  getAppList(data: { pageNum: number; pageSize: number; name?: string; tag?: string; projectId?: number }) {
    return request.post({
      url: `/dia-business/chat/getAppList`,
      data,
    });
  }

  /**
   * @description: 获取临时的appid
   * @return {*}
   */
  getTemporaryAppId() {
    return request.get({
      url: `/dia-business/chat/getTemporaryAppId`,
    });
  }

  /**
   * @description: 保存app
   * @param {object} data
   * @return {*}
   */
  saveApp(data: { id: number; name: string; versionId: number; tags?: string[]; desc?: string }) {
    return request.post({
      url: `/dia-business/chat/saveApp`,
      data,
    });
  }

  /**
   * @description: 获取所有版本
   * @param {number} id 应用id
   * @return {*} name time id status
   */
  getVersionList(id: number) {
    return request.get({
      url: `/dia-business/chat/getVersionList/${id}`,
    });
  }

  /**
   * @description: 获取版本详情
   * @param {number} id 版本id
   * @return {*} 1. 结果url 2. Ai生成的各种描述字段 3. time 4. 版本状态
   */
  getVersionDetail(id: number) {
    return request.get({
      url: `/dia-business/chat/getVersionDetail/${id}`,
    });
  }

  /**
   * @description: 编辑版本信息，编辑ai生成的各种描述字段
   * @param {object} data
   * @return {*}
   */
  editVersion(data: { id: number; [key: string]: any }) {
    return request.post({
      url: `/dia-business/chat/editVersion`,
      data,
    });
  }
}

export default new AppApi();
