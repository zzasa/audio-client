var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const audioProcessorBase64 = 'Y2xhc3MgQXVkaW9Qcm9jZXNzb3IgZXh0ZW5kcyBBdWRpb1dvcmtsZXRQcm9jZXNzb3Igew0KICAgIHByb2Nlc3MoaW5wdXRzLCBvdXRwdXRzKSB7DQogICAgICAgIGNvbnN0IGlucHV0Q2hhbm5lbHMgPSBpbnB1dHNbMF07DQogICAgICAgIGNvbnN0IGlucHV0U2FtcGxlcyA9IGlucHV0Q2hhbm5lbHNbMF07DQogICAgICAgIHRoaXMucG9ydC5wb3N0TWVzc2FnZSh0aGlzLnRyYW5zY29kZShpbnB1dFNhbXBsZXMpLmJ1ZmZlcik7DQogICAgICAgIHJldHVybiB0cnVlOw0KICAgIH0NCiAgICB0cmFuc2NvZGUoYXVkaW9EYXRhKSB7DQogICAgICAgIGxldCBvdXRwdXQgPSB0aGlzLnRvMTZrSHooYXVkaW9EYXRhKTsNCiAgICAgICAgb3V0cHV0ID0gdGhpcy50bzE2Qml0UENNKG91dHB1dCk7DQogICAgICAgIHJldHVybiBvdXRwdXQ7DQogICAgfQ0KICAgIHRvMTZrSHooYXVkaW9EYXRhKSB7DQogICAgICAgIHZhciBkYXRhID0gbmV3IEZsb2F0MzJBcnJheShhdWRpb0RhdGEpOw0KICAgICAgICB2YXIgZml0Q291bnQgPSBNYXRoLnJvdW5kKGRhdGEubGVuZ3RoICogKDE2MDAwIC8gc2FtcGxlUmF0ZSkpOw0KICAgICAgICB2YXIgbmV3RGF0YSA9IG5ldyBGbG9hdDMyQXJyYXkoZml0Q291bnQpOw0KICAgICAgICB2YXIgc3ByaW5nRmFjdG9yID0gKGRhdGEubGVuZ3RoIC0gMSkgLyAoZml0Q291bnQgLSAxKTsNCiAgICAgICAgbmV3RGF0YVswXSA9IGRhdGFbMF07DQogICAgICAgIGZvciAobGV0IGkgPSAxOyBpIDwgZml0Q291bnQgLSAxOyBpKyspIHsNCiAgICAgICAgICAgIHZhciB0bXAgPSBpICogc3ByaW5nRmFjdG9yOw0KICAgICAgICAgICAgdmFyIGJlZm9yZSA9IE1hdGguZmxvb3IodG1wKS50b0ZpeGVkKCk7DQogICAgICAgICAgICB2YXIgYWZ0ZXIgPSBNYXRoLmNlaWwodG1wKS50b0ZpeGVkKCk7DQogICAgICAgICAgICB2YXIgYXRQb2ludCA9IHRtcCAtIGJlZm9yZTsNCiAgICAgICAgICAgIG5ld0RhdGFbaV0gPSBkYXRhW2JlZm9yZV0gKyAoZGF0YVthZnRlcl0gLSBkYXRhW2JlZm9yZV0pICogYXRQb2ludDsNCiAgICAgICAgfQ0KICAgICAgICBuZXdEYXRhW2ZpdENvdW50IC0gMV0gPSBkYXRhW2RhdGEubGVuZ3RoIC0gMV07DQogICAgICAgIHJldHVybiBuZXdEYXRhOw0KICAgIH0NCg0KICAgIHRvMTZCaXRQQ00oaW5wdXQpIHsNCiAgICAgICAgdmFyIGRhdGFMZW5ndGggPSBpbnB1dC5sZW5ndGggKiAoMTYgLyA4KTsNCiAgICAgICAgdmFyIGRhdGFCdWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoZGF0YUxlbmd0aCk7DQogICAgICAgIHZhciBkYXRhVmlldyA9IG5ldyBEYXRhVmlldyhkYXRhQnVmZmVyKTsNCiAgICAgICAgdmFyIG9mZnNldCA9IDA7DQogICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgaW5wdXQubGVuZ3RoOyBpKyssIG9mZnNldCArPSAyKSB7DQogICAgICAgICAgICB2YXIgcyA9IE1hdGgubWF4KC0xLCBNYXRoLm1pbigxLCBpbnB1dFtpXSkpOw0KICAgICAgICAgICAgZGF0YVZpZXcuc2V0SW50MTYob2Zmc2V0LCBzIDwgMCA/IHMgKiAweDgwMDAgOiBzICogMHg3ZmZmLCB0cnVlKTsNCiAgICAgICAgfQ0KICAgICAgICByZXR1cm4gZGF0YVZpZXc7DQogICAgfQ0KfQ0KDQpyZWdpc3RlclByb2Nlc3NvcigiQXVkaW9Qcm9jZXNzb3IiLCBBdWRpb1Byb2Nlc3Nvcik7';
/**消息类型 */
export var MessageType;
(function (MessageType) {
    /**tts请求 */
    MessageType["TTS"] = "tts";
    /**语音识别结果 */
    MessageType["STT"] = "stt";
    /**是否流式识别模式 */
    MessageType["StreamingMode"] = "streaming_mode";
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
        this.toPlayAudio = [];
        /**是否禁用语音播报 */
        this.disableVolume = false;
        /**是否正在讲话 */
        this.isTalking = false;
        this.audioDataBuf = [];
        this.audio = new Audio();
        /**是否准备好播放音频 */
        this.isReady = true;
        // 是否已经调用init
        this.isInvokedInit = false;
        this.toTTS = [];
        if (!config.isStreaming) {
            config.isStreaming = false;
        }
        this.audio.autoplay = false;
        this.audio.addEventListener('ended', () => {
            if (this.audio.src) {
                URL.revokeObjectURL(this.audio.src);
            }
            const buffer = this.toPlayAudio.shift();
            if (buffer) {
                console.info('开始播放下一个缓冲区');
                let temp = new Blob([buffer], {
                    type: 'audio/wav'
                });
                this.audio.src = URL.createObjectURL(temp);
                this.audio.currentTime = 0;
                this.audio.play();
                this.isReady = false;
            }
            else { //缓冲无数据
                this.isReady = true;
                if (this.onPlayEnd) {
                    this.onPlayEnd();
                }
            }
        }, false);
    }
    /**
     * 改变识别模式
     * @param isStreaming 是否流式
     */
    setStreamingMode(isStreaming) {
        this.config.isStreaming = isStreaming;
        this.init();
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
                    if (innerWS) {
                        console.info('是否流式识别模式：', this.config.isStreaming);
                        innerWS.send(JSON.stringify({
                            type: 'streaming_mode',
                            data: this.config.isStreaming
                        }));
                    }
                    resolve(true);
                    return;
                }
                innerWS.onopen = ev => {
                    console.info('ws已连接：', ev);
                    if (innerWS) {
                        console.info('是否流式识别模式：', this.config.isStreaming);
                        innerWS.send(JSON.stringify({
                            type: 'streaming_mode',
                            data: this.config.isStreaming
                        }));
                    }
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
     * 获取音频上下文
     * @returns 内部音频上下文
     */
    getAudioContext() {
        return this.audioContext;
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
     *
     * @param customMediaStream 自定义语音输入流(可选)，若不传，则使用内置语音采集
     */
    start(customMediaStream) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.audioContext) {
                this.audioContext = new AudioContext();
            }
            this.init().then((success) => {
                if (success) {
                    if (customMediaStream) {
                        this.start_stream(customMediaStream);
                    }
                    else {
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
                    }
                }
            }, err => {
                console.log('连接音频服务失败：', err);
            });
        });
    }
    base64_to_url(base64, contentType) {
        const byteCharacters = atob(base64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: contentType });
        const blobUrl = URL.createObjectURL(blob);
        return blobUrl;
    }
    start_stream(stream) {
        return __awaiter(this, void 0, void 0, function* () {
            const context = this.audioContext;
            if (!context) {
                return;
            }
            const audioSource = context.createMediaStreamSource(stream);
            if (this.audioProcessorURL) {
                URL.revokeObjectURL(this.audioProcessorURL);
                this.audioProcessorURL = undefined;
            }
            let url = this.base64_to_url(audioProcessorBase64, 'text/javascript');
            yield context.audioWorklet.addModule(url);
            this.audioProcessorURL = url;
            const node = new AudioWorkletNode(context, "AudioProcessor");
            const ws = this.websocket;
            node.port.onmessage = event => {
                const data = event.data;
                if (ws && ws.readyState == 1) {
                    if (this.config.isStreaming) {
                        ws.send(data);
                    }
                    else {
                        if (this.isTalking) {
                            this.audioDataBuf.push(data);
                        }
                    }
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
        this.isTalking = false;
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
        if (this.audioProcessorURL) {
            URL.revokeObjectURL(this.audioProcessorURL);
            this.audioProcessorURL = undefined;
        }
    }
    mergeArrayBuffers(arrayBuffers) {
        // 计算新的ArrayBuffer的总长度
        let totalLength = 0;
        for (const buffer of arrayBuffers) {
            totalLength += buffer.byteLength;
        }
        // 创建一个新的ArrayBuffer
        const mergedBuffer = new ArrayBuffer(totalLength);
        // 创建一个Uint8Array以便操作新的ArrayBuffer
        const uint8Array = new Uint8Array(mergedBuffer);
        let offset = 0;
        // 逐个复制ArrayBuffer到新的ArrayBuffer中
        for (const buffer of arrayBuffers) {
            const sourceArray = new Uint8Array(buffer);
            uint8Array.set(sourceArray, offset);
            offset += sourceArray.length;
        }
        return mergedBuffer;
    }
    /**
     * 设置是否讲话
     *
     * 若为false, 则客户端会提交音频
     * @param isTalking 是否正在讲话
     */
    setIsTalking(isTalking) {
        this.isTalking = isTalking;
        if (!isTalking) {
            const ws = this.websocket;
            if (ws && ws.readyState == 1) {
                // 发送音频数据
                ws.send(this.mergeArrayBuffers(this.audioDataBuf));
                this.audioDataBuf = [];
            }
        }
    }
    /**
     * 发送文本消息，支持的消息类型，参见MessageType
     *
     * @param text 文本消息
     */
    send(text) {
        if (text.trim()) {
            if (!this.audioContext) {
                this.audioContext = new AudioContext();
            }
            const ws = this.websocket;
            if (ws && ws.readyState == 1) {
                console.info('开始发送消息：', text);
                ws.send(text);
            }
            else {
                this.toTTS.push(text);
                if (!this.isInvokedInit) {
                    this.isInvokedInit = true;
                    this.init().then((success) => {
                        if (success && this.websocket) {
                            let msg = this.toTTS.shift();
                            while (msg) {
                                console.info('开始发送消息：', msg);
                                this.websocket.send(msg);
                                msg = this.toTTS.shift();
                            }
                        }
                    }, err => {
                        console.log('连接音频服务失败：', err);
                    });
                }
            }
        }
    }
    /**
     * 设置发音人
     */
    setVoice(voice) {
        this.config.voice = voice;
    }
    /**
     * 设置是否禁用语音播报
     * @param disableVolume 是否禁用语音播报
     */
    setVolume(disableVolume) {
        this.disableVolume = disableVolume;
        if (disableVolume) {
            this.stopAudio();
        }
    }
    /**
     * 播放音频数据
     * @param audioData 音频数据
     * @returns
     */
    playAudio(audioData) {
        if (this.disableVolume) { // 已禁用语音播报
            return;
        }
        if (this.isReady) {
            this.isReady = false;
            if (this.audio.src) {
                URL.revokeObjectURL(this.audio.src);
            }
            let temp = new Blob([audioData], {
                type: 'audio/wav'
            });
            this.audio.src = URL.createObjectURL(temp);
            this.audio.currentTime = 0;
            this.audio.play();
        }
        else {
            this.toPlayAudio.push(audioData);
        }
    }
    /**
     * 停止播放音频
     */
    stopAudio() {
        this.audio.pause();
        this.toPlayAudio = [];
        if (this.audio.src) {
            URL.revokeObjectURL(this.audio.src);
        }
        this.isReady = true;
    }
}

