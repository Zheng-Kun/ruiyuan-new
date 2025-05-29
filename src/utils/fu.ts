// 定义请求函数的类型
type RequestFunction = () => Promise<any>;

// 定义判断函数的类型
type ShouldStopFunction = (response: any) => boolean;

/**
 * 封装轮询功能
 * @param requestFn - 请求接口的函数，返回 Promise
 * @param shouldStopFn - 判断是否停止轮询的函数，入参为 response，返回布尔值
 * @param interval - 轮询间隔时间（毫秒）
 * @param maxAttempts - 最大尝试次数（可选）
 * @returns {Promise<any>} - 返回最终的响应结果
 */
/* eslint-disable no-await-in-loop */
async function pollRequest(
  requestFn: RequestFunction,
  shouldStopFn: ShouldStopFunction,
  interval: number,
  maxAttempts: number = Infinity,
): Promise<any> {
  let attempts = 0;

  while (attempts < maxAttempts) {
    try {
      const response = await requestFn(); // 调用接口请求函数
      if (shouldStopFn(response)) {
        // 如果回调函数返回 true，停止轮询
        return response; // 返回最终结果
      }
    } catch (error) {
      console.error('轮询请求失败:', error);
    }

    attempts++;
    await new Promise((resolve) => {
      setTimeout(resolve, interval);
    }); // 等待指定的间隔时间
  }

  throw new Error('轮询超时，未达到预期状态');
}

// 示例：使用 fetch 请求接口
async function fetchStatus(): Promise<{ status: number }> {
  const response = await fetch('/api/status');
  const data = await response.json();
  return data; // 假设接口返回 { status: number }
}

// 示例：定义判断是否停止轮询的函数
function shouldStop(response: { status: number }): boolean {
  return response.status === 1; // 如果状态为 1，停止轮询
}

// 调用轮询函数
pollRequest(fetchStatus, shouldStop, 2000, 10) // 每 2 秒轮询一次，最多尝试 10 次
  .then((result) => {
    console.log('轮询成功，接口返回:', result);
  })
  .catch((error) => {
    console.error('轮询失败:', error);
  });
