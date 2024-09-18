var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const audioProcessorBase64 = 'Y2xhc3MgQXVkaW9Qcm9jZXNzb3IgZXh0ZW5kcyBBdWRpb1dvcmtsZXRQcm9jZXNzb3Igew0KICAgIHByb2Nlc3MoaW5wdXRzLCBvdXRwdXRzKSB7DQogICAgICAgIGNvbnN0IGlucHV0Q2hhbm5lbHMgPSBpbnB1dHNbMF07DQogICAgICAgIGNvbnN0IGlucHV0U2FtcGxlcyA9IGlucHV0Q2hhbm5lbHNbMF07DQogICAgICAgIHRoaXMucG9ydC5wb3N0TWVzc2FnZSh0aGlzLnRyYW5zY29kZShpbnB1dFNhbXBsZXMpLmJ1ZmZlcik7DQogICAgICAgIHJldHVybiB0cnVlOw0KICAgIH0NCiAgICB0cmFuc2NvZGUoYXVkaW9EYXRhKSB7DQogICAgICAgIGxldCBvdXRwdXQgPSB0aGlzLnRvMTZrSHooYXVkaW9EYXRhKTsNCiAgICAgICAgLy9vdXRwdXQgPSB0aGlzLnRvMTZCaXRQQ00ob3V0cHV0KTsNCiAgICAgICAgcmV0dXJuIG91dHB1dDsNCiAgICB9DQogICAgdG8xNmtIeihhdWRpb0RhdGEpIHsNCiAgICAgICAgdmFyIGRhdGEgPSBuZXcgRmxvYXQzMkFycmF5KGF1ZGlvRGF0YSk7DQogICAgICAgIHZhciBmaXRDb3VudCA9IE1hdGgucm91bmQoZGF0YS5sZW5ndGggKiAoMTYwMDAgLyBzYW1wbGVSYXRlKSk7DQogICAgICAgIHZhciBuZXdEYXRhID0gbmV3IEZsb2F0MzJBcnJheShmaXRDb3VudCk7DQogICAgICAgIHZhciBzcHJpbmdGYWN0b3IgPSAoZGF0YS5sZW5ndGggLSAxKSAvIChmaXRDb3VudCAtIDEpOw0KICAgICAgICBuZXdEYXRhWzBdID0gZGF0YVswXTsNCiAgICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPCBmaXRDb3VudCAtIDE7IGkrKykgew0KICAgICAgICAgICAgdmFyIHRtcCA9IGkgKiBzcHJpbmdGYWN0b3I7DQogICAgICAgICAgICB2YXIgYmVmb3JlID0gTWF0aC5mbG9vcih0bXApLnRvRml4ZWQoKTsNCiAgICAgICAgICAgIHZhciBhZnRlciA9IE1hdGguY2VpbCh0bXApLnRvRml4ZWQoKTsNCiAgICAgICAgICAgIHZhciBhdFBvaW50ID0gdG1wIC0gYmVmb3JlOw0KICAgICAgICAgICAgbmV3RGF0YVtpXSA9IGRhdGFbYmVmb3JlXSArIChkYXRhW2FmdGVyXSAtIGRhdGFbYmVmb3JlXSkgKiBhdFBvaW50Ow0KICAgICAgICB9DQogICAgICAgIG5ld0RhdGFbZml0Q291bnQgLSAxXSA9IGRhdGFbZGF0YS5sZW5ndGggLSAxXTsNCiAgICAgICAgcmV0dXJuIG5ld0RhdGE7DQogICAgfQ0KDQogICAgdG8xNkJpdFBDTShpbnB1dCkgew0KICAgICAgICB2YXIgZGF0YUxlbmd0aCA9IGlucHV0Lmxlbmd0aCAqICgxNiAvIDgpOw0KICAgICAgICB2YXIgZGF0YUJ1ZmZlciA9IG5ldyBBcnJheUJ1ZmZlcihkYXRhTGVuZ3RoKTsNCiAgICAgICAgdmFyIGRhdGFWaWV3ID0gbmV3IERhdGFWaWV3KGRhdGFCdWZmZXIpOw0KICAgICAgICB2YXIgb2Zmc2V0ID0gMDsNCiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBpbnB1dC5sZW5ndGg7IGkrKywgb2Zmc2V0ICs9IDIpIHsNCiAgICAgICAgICAgIHZhciBzID0gTWF0aC5tYXgoLTEsIE1hdGgubWluKDEsIGlucHV0W2ldKSk7DQogICAgICAgICAgICBkYXRhVmlldy5zZXRJbnQxNihvZmZzZXQsIHMgPCAwID8gcyAqIDB4ODAwMCA6IHMgKiAweDdmZmYsIHRydWUpOw0KICAgICAgICB9DQogICAgICAgIHJldHVybiBkYXRhVmlldzsNCiAgICB9DQp9DQoNCnJlZ2lzdGVyUHJvY2Vzc29yKCJBdWRpb1Byb2Nlc3NvciIsIEF1ZGlvUHJvY2Vzc29yKTs=';
/**客户端消息类型 */
export var ClientMessageType;
(function (ClientMessageType) {
    /**tts请求 */
    ClientMessageType["TTS"] = "tts";
})(ClientMessageType || (ClientMessageType = {}));
/**服务端消息类型 */
export var ServerMessageType;
(function (ServerMessageType) {
    /**语音识别结果 */
    ServerMessageType["STT"] = "stt";
})(ServerMessageType || (ServerMessageType = {}));
/**消息工厂类 */
export class MessageBuilder {
    /**
     * 创建TTS客户端消息
     * @param data TTS请求数据
     * @returns TTS客户端消息
     */
    static build_tts(data) {
        return MessageBuilder.build(ClientMessageType.TTS, data);
    }
    /**
     * 创建客户端消息
     * @param type 客户端消息类型
     * @param data 数据
     * @returns ClientMessage
     */
    static build(type, data) {
        return { type, data };
    }
    /**
     * 解析服务端消息
     * @param msg 服务端json消息
     * @returns ServerMessage | undefined
     */
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
    constructor(wsUrl) {
        this.wsUrl = wsUrl;
        this.toPlayAudio = [];
        this.audio = new Audio();
        /**是否准备好播放音频 */
        this.isReady = true;
        /**避免重复连接 */
        this.lockReconnect = false;
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
        this.initWS();
    }
    wsOnOpen(ev) {
        console.info('ws已连接：', ev);
        if (this.heartbeatTimer) {
            clearTimeout(this.heartbeatTimer);
        }
        this.heartbeatTimer = setTimeout(() => {
            const innerWS = this.websocket;
            if (innerWS && innerWS.readyState == 1) {
                let pingData = new Uint8Array([0x9]);
                innerWS.send(pingData);
            }
        }, 20000);
    }
    wsOnMessage(ev) {
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
            const msg = MessageBuilder.parse(ev.data);
            if (msg) {
                if (msg.type == ServerMessageType.STT) {
                    const ontext = this.ontext;
                    if (ontext) {
                        ontext(msg.data);
                    }
                }
            }
        }
    }
    wsOnClose(ev) {
        console.info('ws已关闭', ev);
        // 服务器关闭，则不重连
        if (ev.code != 1006) {
            this.wsReconnect();
        }
    }
    wsReconnect() {
        if (this.lockReconnect) {
            return;
        }
        this.lockReconnect = true;
        // 没连接上会一直重连，设置延迟避免请求过多。有定时，先取消定时
        if (this.wsTimer) {
            clearTimeout(this.wsTimer);
        }
        this.wsTimer = setTimeout(() => {
            this.initWS();
            this.lockReconnect = false;
        }, 2000);
    }
    initWS() {
        try {
            this.websocket = new WebSocket(this.wsUrl);
            this.websocket.onopen = this.wsOnOpen.bind(this);
            this.websocket.onmessage = this.wsOnMessage.bind(this);
            this.websocket.onclose = this.wsOnClose.bind(this);
        }
        catch (e) {
            console.error('连接语音服务失败：', e);
            this.wsReconnect();
        }
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
            // 语音服务已经链接并且可以通讯
            if (this.websocket && this.websocket.readyState == 1) {
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
            else {
                console.error('启用语音识别失败：连接语音服务失败');
            }
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
        if (this.audioProcessorURL) {
            URL.revokeObjectURL(this.audioProcessorURL);
            this.audioProcessorURL = undefined;
        }
    }
    /**
     * 发送客户端消息
     * 可通过MessageBuilder.build_tts创建TTS消息
     * @param msg ClientMessage 客户端消息
     */
    send(msg) {
        if (!this.audioContext) {
            this.audioContext = new AudioContext();
        }
        // 语音服务已经链接并且可以通讯
        if (this.websocket && this.websocket.readyState == 1) {
            const text = JSON.stringify(msg);
            //console.info('开始发送消息：', text);
            this.websocket.send(text);
        }
        else {
            console.error('发送消息失败：连接语音服务失败');
        }
    }
    /**
     * 播放音频数据
     * @param audioData 音频数据
     * @returns
     */
    playAudio(audioData) {
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

