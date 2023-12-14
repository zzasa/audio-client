var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/**消息类型 */
export var MessageType;
(function (MessageType) {
    /**tts请求 */
    MessageType["TTS"] = "tts";
    /**语音识别结果 */
    MessageType["STT"] = "stt";
})(MessageType || (MessageType = {}));
export class ClientMessageBuilder {
    /**构建客户端消息 */
    static build(type, data) {
        return { type, data };
    }
    static parse(msg) {
        const parsedMsg = JSON.parse(msg);
        if (!parsedMsg.type) {
            return undefined;
        }
        let result = {
            type: parsedMsg.type,
            data: parsedMsg.data ? parsedMsg.data : ''
        };
        return result;
    }
}
export class AudioClient {
    constructor(config) {
        this.config = config;
    }
    init() {
        let ws = this.websocket;
        if (!ws || ws.readyState == ws.CLOSED) {
            ws = new WebSocket(this.config.wsUrl);
        }
        this.websocket = ws;
        return new Promise((resolve, reject) => {
            let innerWS = this.websocket;
            if (innerWS) {
                if (innerWS.readyState == innerWS.OPEN) {
                    resolve(true);
                    return;
                }
                innerWS.onopen = ev => {
                    console.info('ws已连接：', ev);
                    setInterval(() => {
                        const innerWS2 = this.websocket;
                        if (innerWS2 && innerWS2.readyState == 1) {
                            let pingData = new Uint8Array([0x9]);
                            innerWS2.send(pingData);
                        }
                    }, 20000);
                    resolve(true);
                };
                innerWS.onmessage = ev => {
                    //console.info('ws收到数据：', ev.data);
                    if (ev.data instanceof Blob) {
                        const onaudio = this.onaudio;
                        if (onaudio) {
                            ev.data.arrayBuffer().then(buf => {
                                onaudio(buf);
                            });
                        }
                        else {
                            console.warn("收到音频数据，但未绑定回调函数：", ev);
                        }
                    }
                    else {
                        const msg = ClientMessageBuilder.parse(ev.data);
                        if (msg) {
                            if (msg.type == MessageType.STT) {
                                const ontext = this.ontext;
                                if (ontext) {
                                    ontext(msg.data);
                                }
                            }
                        }
                    }
                };
                innerWS.onclose = ev => {
                    reject('连接关闭');
                    console.info('ws已关闭', ev);
                };
            }
        });
    }
    /**
     * 启动语音识别，即语音转文本
     *
     * 调用后，浏览器会自动请求获取麦克风，受浏览器安全限制，只有在以下情况才能获取麦克风设备：
     *
     * 1. 本地地址localhost、127.0.0.1
     * 2. 网站使用https，且有合法域名
     *
     * 具体解决方案参见：https://juejin.cn/post/7241399184595058744
     */
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.audioContext) {
                this.audioContext = new AudioContext();
            }
            this.init().then((success) => {
                if (success) {
                    navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
                        this.stream = stream;
                        const tracks = stream.getAudioTracks();
                        const track = tracks[0];
                        const settings = track.getSettings();
                        console.info(`音频轨道0：采样率：${settings.sampleRate}  通道数：${settings.channelCount}  采样大小：${settings.sampleSize}位`);
                        const cap = track.getCapabilities();
                        console.info('当前音频设备能力集：', cap);
                        this.start_stream(stream);
                    }, err => {
                        alert('获取用户麦克风设备失败：' + err);
                    });
                    // const audioEle = document.getElementById('audio-test') as HTMLAudioElement;
                    // audioEle.loop = false;
                    // const stream = (audioEle as any).captureStream() as MediaStream;
                    // this.stream = stream;
                    // audioEle.currentTime = 0;
                    // audioEle.play();
                    // this.start_stream(stream);
                }
            }, err => {
                console.log('连接音频服务失败：', err);
            });
        });
    }
    start_stream(stream) {
        return __awaiter(this, void 0, void 0, function* () {
            const context = this.audioContext;
            if (!context) {
                return;
            }
            const audioSource = context.createMediaStreamSource(stream);
            let url = this.config.audioProcessorUrl || './AudioProcessor.js';
            yield context.audioWorklet.addModule(url);
            const node = new AudioWorkletNode(context, "AudioProcessor");
            const ws = this.websocket;
            node.port.onmessage = event => {
                const data = event.data;
                if (ws && ws.readyState == 1) {
                    //console.log('发送音频数据：', data);
                    ws.send(data);
                }
            };
            audioSource.connect(node);
            node.connect(context.destination);
        });
    }
    /**
     * 停止语音识别
     */
    stop() {
        const context = this.audioContext;
        if (context && context.state != "closed") {
            context.close();
        }
        this.audioContext = undefined;
        if (this.stream) {
            for (const trace of this.stream.getTracks()) {
                if (trace.readyState == 'live') {
                    trace.stop();
                }
            }
            this.stream = undefined;
        }
        const ws = this.websocket;
        if (ws && ws.readyState == 1) {
            ws.send(JSON.stringify(ClientMessageBuilder.build(MessageType.STT, "stop")));
        }
    }
    /**
     * 文本转语音(TTS)
     *
     * 发送文本消息，服务端会返回一段音频，请在onmessage回调中处理
     */
    send(text) {
        if (!text.trim()) {
            alert("请输入对话内容");
            return;
        }
        const ws = this.websocket;
        if (ws && ws.readyState == 1) {
            console.info('开始发送消息：', text);
            ws.send(JSON.stringify(ClientMessageBuilder.build(MessageType.TTS, {
                message: text,
                voice: this.config.voice || ''
            })));
        }
        else {
            this.init().then((success) => {
                if (success && this.websocket) {
                    console.info('开始发送消息：', text);
                    this.websocket.send(JSON.stringify(ClientMessageBuilder.build(MessageType.TTS, {
                        message: text,
                        voice: this.config.voice || ''
                    })));
                }
            }, err => {
                console.log('连接音频服务失败：', err);
            });
        }
    }
    /**
     * 设置发音人
     */
    setVoice(voice) {
        this.config.voice = voice;
    }
}
