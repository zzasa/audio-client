
# 语音服务前端SDK

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
    const client = new AudioClient({ wsUrl: 'ws://ai-server:3000/' });
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
    }

    // 发送TTS消息
    sendBtn['onclick'] = function () {
        // 设置发音人
        client.setVoice(voice.value);

        const text = prompt("请输入文本：");
        // 调用发送TTS
        client.send(text);
    }
   ```

### 一般JS项目

1. 下载源码，把`dist/index.js`文件放到项目中，参考`dist/index.html`使用即可。
