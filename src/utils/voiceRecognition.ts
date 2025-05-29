import recognitionApi from '@/api/voiceRecognition';

import { resampleAndEncodeWAV } from './audio';

type RecognitionResponse = string;

type RecognitionError = string;

type RecognitionCallback = (text: string | null, error: RecognitionError | null) => void;
type RecordingEndCallback = (reason: 'timeout' | 'manual') => void;

export default class VoiceRecognition {
  private onResponse: RecognitionCallback;

  private onRecordingEnd: RecordingEndCallback | null = null;

  private audioChunks: BlobPart[] = [];

  private mediaRecorder: MediaRecorder | null = null;

  private stream: MediaStream | null = null;

  private maxRecordingTime: number = 60000; // 最大录音时长，单位为毫秒

  private sampleRate: number = 16000;

  private recordingTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(onResponse: RecognitionCallback) {
    this.onResponse = onResponse;
  }

  setOnRecordingEndCallback(callback: RecordingEndCallback): void {
    this.onRecordingEnd = callback;
  }

  async start(): Promise<void> {
    try {
      const audioConstraints = {
        audio: {
          sampleRate: 16000,
          channelCount: 1, // 设置声道数量为 1（单声道）
          echoCancellation: true, // 启用回声消除
        },
      };
      // this.stream = await navigator.mediaDevices.getUserMedia(audioConstraints);
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // this.stream = await undefined.getUserMedia({ audio: true });
      this.mediaRecorder = new MediaRecorder(this.stream);

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      this.mediaRecorder.start();

      // 设置定时器，限制录音时长为60秒
      this.recordingTimer = setTimeout(() => {
        if (this.mediaRecorder) {
          this.mediaRecorder.stop();
          this.onRecordingEnd?.('timeout');
          this.processRecording();
        }
      }, this.maxRecordingTime);
    } catch (error) {
      console.error('麦克风权限未开启，请授权', error);
      this.onResponse(null, '麦克风权限未开启，请授权');
    }
  }

  async stop(): Promise<void> {
    if (this.mediaRecorder) {
      this.mediaRecorder.stop();
      this.onRecordingEnd?.('manual');
      this.processRecording();
    }

    // Todo 待测试 清楚录音轨道
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
    }

    // 清除定时器
    if (this.recordingTimer) {
      clearTimeout(this.recordingTimer);
      this.recordingTimer = null;
    }
  }

  async processRecording(): Promise<void> {
    if (this.mediaRecorder) {
      // this.mediaRecorder.stop();
      this.mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
        try {
          // 重新采样并生成 WAV 文件，降低采样率以适应后端接口
          const newSampleBlob = await resampleAndEncodeWAV(audioBlob, this.sampleRate);

          // 下载录音文件以测试
          // this.downloadAudio(audioBlob, `${+new Date()}-default-sample.wav`);
          // this.downloadAudio(newSampleBlob, `${+new Date()}-${this.sampleRate}-sample.wav`);
          // 将 Blob 转换为 Base64 编码
          // const audioBase64 = await this.blobToBase64(audioBlob);

          // 将文件编码发送到后端接口
          const response = await recognitionApi.voiceRecognitionFile(newSampleBlob).then((res) => {
            const result: RecognitionResponse = res;
            return result;
          });
          this.onResponse(response, null);
        } catch (error) {
          console.error('语音识别失败', error);
          this.onResponse(null, '语音识别失败');
        } finally {
          if (this.stream) {
            this.mediaRecorder.onstop = null;
            this.stream.getTracks().forEach((track) => track.stop());
          }
        }
      };
    }
  }

  destroy(): void {
    // 清理音频流和媒体记录器
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
      this.stream = null;
    }

    if (this.mediaRecorder) {
      this.mediaRecorder.ondataavailable = null;
      this.mediaRecorder.onstop = null;
      this.mediaRecorder = null;
    }

    // 清空音频块
    this.audioChunks = [];

    console.log('语音识别资源已销毁');
  }

  private async blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('Failed to read Blob as Base64'));
        }
      };
      reader.onerror = (error) => {
        reject(error);
      };
      reader.readAsDataURL(blob);
    });
  }

  private downloadAudio(blob: Blob, name = 'recording.wav'): void {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = name; // 设置下载文件名
    a.click();
    a.remove();
    URL.revokeObjectURL(url); // 释放对象 URL
  }
}
