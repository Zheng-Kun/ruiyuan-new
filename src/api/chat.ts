import { request } from '@/utils/request';

class ChatApi {
  /**
   * @description: 获取所有历史对话
   * @param {string} type
   * @return {*}
   */
  getSessionList(type: string) {
    return new Promise((resolve) => {
      resolve({
        data: [
          { id: 1, title: 'duihua--8-8--8-8-1', time: '2025-05-28 20:12:10' },
          { id: 11, title: 'duihua--8-8--8-8-1', time: '2025-05-28 20:12:10' },
          { id: 12, title: 'duihua--8-8--8-8-1', time: '2025-05-28 20:12:10' },
          { id: 13, title: 'duihua--8-8--8-8-1', time: '2025-05-28 20:12:10' },
          { id: 2, title: 'duihua--8-8--8-8-2', time: '2025-05-27 20:12:10' },
          { id: 21, title: 'duihua--8-8--8-8-2', time: '2025-05-27 20:12:10' },
          { id: 22, title: 'duihua--8-8--8-8-2', time: '2025-05-27 20:12:10' },
          { id: 23, title: 'duihua--8-8--8-8-2', time: '2025-05-27 20:12:10' },
          { id: 24, title: 'duihua--8-8--8-8-2', time: '2025-05-27 20:12:10' },
          { id: 31, title: 'duihua--8-8--8-8-3', time: '2025-05-20 20:12:10' },
          { id: 32, title: 'duihua--8-8--8-8-3', time: '2025-05-20 20:12:10' },
          { id: 33, title: 'duihua--8-8--8-8-3', time: '2025-05-20 20:12:10' },
          { id: 34, title: 'duihua--8-8--8-8-3', time: '2025-05-20 20:12:10' },
          { id: 4, title: 'duihua--8-8--8-8-4', time: '2024-04-01 20:12:10' },
          { id: 5, title: 'duihua--8-8--8-8-5', time: '2024-01-01 20:12:10', pinned: true },
          { id: 6, title: 'duihua--8-8--8-8-5', time: '2025-01-01 20:12:10', pinned: true },
          { id: 6, title: 'duihua--8-8--8-8-5', time: '2024-7-01 20:12:10', pinned: true },
        ],
      });
    });
    console.log('getSessionList', type);
    /* return request.get({
      url: `/dia-business/chat/getChatList/${type}`,
    }); */
  }

  /**
   * @description: 删除对话
   * @param {number} id
   * @param {string} type
   * @return {*}
   */
  deleteSession(id: number, type: string) {
    return request.post({
      url: `/dia-business/chat/deleteChat/${type}`,
      data: { id },
    });
  }

  /**
   * @description: 编辑对话名称
   * @param {object} data
   * @return {*}
   */
  editSessionName(data: { id: number; name: string }, type: string) {
    return request.post({
      url: `/dia-business/chat/editChatName/${type}`,
      data,
    });
  }

  pinSession(data: { id: number; pinned: boolean }, type: string) {
    return request.post({
      url: `/dia-business/chat/pinChat/${type}`,
      data,
    });
  }

  /**
   * @description: 获取会话详情
   * @param {number} id
   * @param {string} type
   * @return {*} 1. 对话历史 2. 对话环境
   */
  getSessionDetail(id: number, type: string) {
    return request.get({
      url: `/dia-business/chat/getChatDetail/${type}/${id}`,
    });
  }

  /**
   * @description: 对话
   * @param {object} data // 对话入参数
   * @param {string} type 对话类型
   * @return {*} { sessionId: number  ;sessionName: string ; answer: string; messageId: number; hasVersion: 0 | 1 }
   */
  chat(
    data: {
      sessionId?: string; // 如果为空或0，则创建新会话
      question: string; // 对话内容
      files?: string[]; // 文件ids
      context: {
        // 本次消息的上下文
        projectId: string;
        appId: string;
        versionId: string;
        dataSourceIds: string[];
        templateId: string;
      };
    },
    type: string,
  ) {
    return request.post({
      url: `/dia-business/chat/${type}`,
      data,
    });
  }

  /**
   * @description: 优化提示词，入餐与chat接口一致
   * @return {*} 出参随意
   */
  preferPrompt(
    data: {
      sessionId?: string;
      question: string; // 对话内容
      files?: string[]; // 文件ids
      context: {
        // 本次消息的上下文
        projectId: string;
        appId: string;
        versionId: string;
        dataSourceIds: string[];
        templateId: string;
      };
    },
    type: string,
  ) {
    return request.post({
      url: `/dia-business/chat/preferPrompt/${type}`,
      data,
    });
  }
}

export default new ChatApi();
