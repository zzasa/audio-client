
# 语音服务前端SDK

## SDK功能说明

1. 语音识别模式1：非流式(默认)，如下示例：

   ```ts
   import { AudioClient, MessageType, ClientMessageBuilder } from "audio-client";
   // 非流式
   const client = new AudioClient({ wsUrl: 'ws://ai-server:3000/', isStreaming: false });
   // 设置开始讲话，客户端开始音频发送到服务端
   client.setIsTalking(true);
   
   ...
   ...
   // 设置停止讲话， 客户端会提交音频
   client.setIsTalking(false);

2. 语音识别模式2：流式，如下示例：

   ```ts
   import { AudioClient } from "audio-client";
   // 流式，该模式下不需要调用setIsTalking方法、也不需要通知音频服务，
   // 但该模式会消耗不必要的流量，请客户端自行做好没说话时，停止识别，参见使用教程中ontext回调示例
   const client = new AudioClient({ wsUrl: 'ws://ai-server:3000/', isStreaming: true });

   // 或者使用setStreamingMode改变模式
   client.setStreamingMode(true);
   ```

3. 获取语音识别结果，如下示例：

   ```ts
   import { AudioClient } from "audio-client";
   const client = new AudioClient({ wsUrl: 'ws://ai-server:3000/'});
   client.ontext = text => {
    console.log('语音识别结果：', text);
   };
   ```

4. TTS发音人切换：zhitian_emo，zhiyan_emo，zhizhe_emo，zhibei_emo，如下示例：

   ```ts
   import { AudioClient } from "audio-client";
   // 通过创建客户端时指定
   const client = new AudioClient({ wsUrl: 'ws://ai-server:3000/', isStreaming: false, voice: 'zhitian_emo' });
   // 或调用setVoice方法指定
   client.setVoice('zhitian_emo');
   ```

5. 播放TTS返回的音频、语音播报控制，如下示例：

   ```ts
   import { AudioClient } from "audio-client";
   const client = new AudioClient({ wsUrl: 'ws://ai-server:3000/'});
   // onaudio收到音频数据时，audioData: ArrayBuffer
   client.onaudio = audioData => {
    client.playAudio(audioData);
   };
   
   client.onPlayEnd = () => {
    // 音频播放完成，在这里做处理
   };

   // 是否禁用语音播报
   const disableVolume = true;
   client.setVolume(disableVolume);

   // 停止播报
   client.stopAudio();
   ```

6. 开始、停止语音识别，如下示例：

   ```ts
   import { AudioClient } from "audio-client";
   const client = new AudioClient({ wsUrl: 'ws://ai-server:3000/'});
   // 开始语音识别
   client.start();
   ...
   ...
   // 停止语音识别
   client.stop();
   ```

## 使用教程

### Node、Vue项目

1. 在项目package.json，添加项目依赖，执行如下命令：

   ```cmd
   yarn add https://github.com/zzasa/audio-client.git
   或
   npm install https://github.com/zzasa/audio-client.git
   ```

2. 在项目代码中使用，参考如下示例：

   ```ts
    import { AudioClient } from "audio-client";

    // wsUrl为音频服务IP，请填写实际的IP和端口，如：ws://192.168.100.10:3000/
    const client = new AudioClient({ wsUrl: 'ws://ai-server:3000/', voice: 'zhitian_emo', isStreaming: false });
    let times = undefined;
    // 收到文本消息时回调
    client.ontext = text => {
        console.log('收到消息：', text);
        // 5秒钟内没有说话，就自动关闭
        if (text) {
            clearTimeout(times);
            times = setTimeout(() => {
                // 停止客户端
                client.stop();
                resultEle.innerHTML = '';
                recognizeBtn.className = '';
                recognizeBtn.innerHTML = '开始识别';
                recognizeBtn.disabled = false;
            }, 5000);
        };
    };

    // 收到语音消息时回调
    client.onaudio = audioData => {
        console.info('收到音频数据：', audioData);
        const audioContext = new AudioContext();
        const audioSource = audioContext.createBufferSource();
        audioContext.decodeAudioData(audioData, (buffer) => {
            audioSource.buffer = buffer;
            audioSource.connect(audioContext.destination);
            // 播放音频数据
            audioSource.start();
        });
    };

    // 启动语音识别
    recognizeBtn['onclick'] = function () {
        // 调用客户端的启动API
        client.start();
        recognizeBtn.className = 'recognizeing';
        recognizeBtn.innerHTML = '正在识别';
        recognizeBtn.disabled = true;
    };

    // 发送TTS消息
    sendBtn['onclick'] = function () {
        // 设置发音人
        client.setVoice(voice.value);

        const text = prompt("请输入文本：");
        // 调用发送TTS
        client.send(text);
    };
   ```

### 一般JS项目

1. 下载源码，把`dist/index.js`文件放到项目中，参考`dist/index.html`使用即可。
