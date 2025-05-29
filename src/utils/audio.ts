/* eslint-disable no-bitwise */

// 常量定义
const WAV_HEADER_SIZE = 44;

// WAV 文件头结构
interface WavHeader {
  chunkId: string;
  chunkSize: number;
  format: string;
  subChunk1Id: string;
  subChunk1Size: number;
  audioFormat: number;
  numChannels: number;
  sampleRate: number;
  byteRate: number;
  blockAlign: number;
  bitsPerSample: number;
  subChunk2Id: string;
  subChunk2Size: number;
}

// 生成 WAV 文件头
function generateWavHeader(header: WavHeader): Uint8Array {
  const buffer = new ArrayBuffer(WAV_HEADER_SIZE);
  const view = new DataView(buffer);

  const writeString = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  };

  writeString(0, header.chunkId); // ChunkID
  view.setUint32(4, header.chunkSize, true); // ChunkSize
  writeString(8, header.format); // Format
  writeString(12, header.subChunk1Id); // Subchunk1ID
  view.setUint32(16, header.subChunk1Size, true); // Subchunk1Size
  view.setUint16(20, header.audioFormat, true); // AudioFormat
  view.setUint16(22, header.numChannels, true); // NumChannels
  view.setUint32(24, header.sampleRate, true); // SampleRate
  view.setUint32(28, header.byteRate, true); // ByteRate
  view.setUint16(32, header.blockAlign, true); // BlockAlign
  view.setUint16(34, header.bitsPerSample, true); // BitsPerSample
  writeString(36, header.subChunk2Id); // Subchunk2ID
  view.setUint32(40, header.subChunk2Size, true); // Subchunk2Size

  return new Uint8Array(buffer);
}

// 重新采样音频数据
function resampleAudioData(
  audioData: Float32Array,
  originalSampleRate: number,
  targetSampleRate: number,
): Float32Array {
  const ratio = originalSampleRate / targetSampleRate;
  const newLength = Math.round(audioData.length / ratio);
  const result = new Float32Array(newLength);

  for (let i = 0; i < newLength; i++) {
    const index = Math.floor(i * ratio);
    result[i] = audioData[index];
  }

  return result;
}

// 将音频数据转换为 WAV 格式
function encodeWAV(samples: Float32Array, sampleRate: number): Uint8Array {
  const numChannels = 1; // 单声道
  const bitDepth = 16; // 16-bit
  const bytesPerSample = bitDepth / 8;
  const blockAlign = numChannels * bytesPerSample;
  const byteRate = sampleRate * blockAlign;
  const subChunk2Size = samples.length * bytesPerSample;

  const header: WavHeader = {
    chunkId: 'RIFF',
    chunkSize: 36 + subChunk2Size,
    format: 'WAVE',
    subChunk1Id: 'fmt ',
    subChunk1Size: 16,
    audioFormat: 1, // PCM
    numChannels,
    sampleRate,
    byteRate,
    blockAlign,
    bitsPerSample: bitDepth,
    subChunk2Id: 'data',
    subChunk2Size,
  };

  const headerArray = generateWavHeader(header);
  const sampleArray = new Uint8Array(samples.length * bytesPerSample);

  for (let i = 0; i < samples.length; i++) {
    const value = Math.max(-1, Math.min(1, samples[i]));
    const int16Value = Math.floor(value * 0x7fff);
    sampleArray[i * 2] = int16Value & 0xff;
    sampleArray[i * 2 + 1] = (int16Value >> 8) & 0xff;
  }

  return new Uint8Array([...headerArray, ...sampleArray]);
}

// 重新采样并生成 WAV 文件
async function resampleAndEncodeWAV(blob: Blob, targetSampleRate: number): Promise<Blob> {
  const arrayBuffer = await blob.arrayBuffer();
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

  const originalSampleRate = audioBuffer.sampleRate;
  const channelData = audioBuffer.getChannelData(0); // 假设单声道
  const resampledData = resampleAudioData(channelData, originalSampleRate, targetSampleRate);

  const wavData = encodeWAV(resampledData, targetSampleRate);
  return new Blob([wavData], { type: 'audio/wav' });
}

export { resampleAndEncodeWAV };
