import { request } from '@/utils/request';

class RecognitionApi {
  /**
   * @description: 语音识别base64
   * @param {string} data
   * @return {*}
   */
  voiceRecognitionByBase64(data: string) {
    return request.post({
      url: '/dia-business/speech/speechToTextByBase64',
      data,
    });
  }

  /**
   * @description: 语音识别文件
   * @param {File} file
   * @return {*}
   */
  voiceRecognitionFile(file: any) {
    const formData = new FormData();
    formData.append('file', file);
    return request.post({
      url: '/dia-business/speech/speechToTextByFile',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }
}

export default new RecognitionApi();
