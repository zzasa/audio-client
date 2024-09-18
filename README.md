
# 语音服务前端SDK

## SDK功能说明

1. 创建语音客户端：

   ```ts
   import { AudioClient, MessageBuilder } from 'audio-client';
   // 地址改成实际的
   const client = new AudioClient('ws://localhost:3000/ws');
   ```

2. 启动语音识别：

   ```ts
   // 启动语音识别
   client.start();
   ```

3. 获取语音识别结果：
   
   ```ts
   // 语音识别结果回调
   client.ontext = text => {
      console.log('语音识别结果：', text);
   };
   ```

4. 停止语音识别：
   ```ts
   //停止语音识别
   client.stop();
   ```

5. 获取语音合成(TTS)结果：

   ```ts
   // onaudio收到音频数据时，audioData: ArrayBuffer
   client.onaudio = audioData => {
    // 播放音频
    client.playAudio(audioData);
   };
   
   client.onPlayEnd = () => {
    // 音频播放完成，在这里做处理
   };
   ```

6. 发送语音合成消息：
   ```ts
   let msg = MessageBuilder.build_tts({
      text: '要合成的文本',
      sid: 0, // 发音人ID，范围参见http://localhost:3000/api/speakers接口
      speed: 1.0 // 发音速率，如0.5表示0.5倍速、2.0表示2倍速
   });
   // 发送TTS消息
   client.send(msg);
   ```

7. 播放音频：

   ```ts
   // onaudio收到音频数据时，audioData: ArrayBuffer
   client.onaudio = audioData => {
    // 播放音频
    client.playAudio(audioData);
   };
   ```

8. 停止播放音频：

   ```ts
   // 停止播放音频
   client.stopAudio();
   ```
9. 获取TTS发音人数量API，任意http客户端发送get请求到：/api/speakers
   如下示例仅供参考：
   ```ts
   // 地址改成实际的
   fetch('http://localhost:3000/api/speakers').then(resp => {
      resp.json().then(result => {
         console.log(result);
         if (result.code == 0) {
            // 发音人数量
            const num = result.data;
            console.log('发音人数量：', num);
         }
      });
   });
   ```
## 使用教程

### Node、Vue项目

1. 在项目package.json，添加项目依赖，执行如下命令：

   ```cmd
   yarn add https://github.com/zzasa/audio-client.git
   或
   npm install https://github.com/zzasa/audio-client.git
   ```
2. 若SDK版本更新，可参考如下命令本地更新SDK
   ```
   yarn upgrade audio-client
   或
   npm update audio-client
   ```

3. 使用参考上面SDK说明，或参考SDK源码目录`dist/index.html`使用即可。
   
### 一般JS项目

1. 下载源码，把`dist/index.js`文件放到项目中，参考`dist/index.html`使用即可。
