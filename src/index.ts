const audioProcessorBase64 = '';

/**客户端消息类型 */
export enum ClientMessageType {
    /**tts请求 */
    TTS = "tts"
}

/**服务端消息类型 */
export enum ServerMessageType {
    /**语音识别结果 */
    STT = "stt"
}

/**客户端消息 */
export interface ClientMessage<T> {
    type: ClientMessageType,
    data?: T
}

export interface ServerMessage<T> {
    type: ServerMessageType,
    data?: T
}

/**TTS请求数据 */
export interface TtsRequestData {
    /**要合成的文本 */
    text: string,
    /**发音人ID */
    sid: number,
    /**语速：0.5(表示0.5倍数) 1.0(表示1倍数)，2.0(表示2倍数) */
    speed: number
}

/**消息工厂类 */
export class MessageBuilder {
    /**
     * 创建TTS客户端消息
     * @param data TTS请求数据
     * @returns TTS客户端消息
     */
    static build_tts(data: TtsRequestData): ClientMessage<TtsRequestData> {
        return MessageBuilder.build(ClientMessageType.TTS, data)
    }

    /**
     * 创建客户端消息
     * @param type 客户端消息类型
     * @param data 数据
     * @returns ClientMessage
     */
    static build<T>(type: ClientMessageType, data?: T): ClientMessage<T> {
        return { type, data }
    }

    /**
     * 解析服务端消息 
     * @param msg 服务端json消息
     * @returns ServerMessage | undefined
     */
    static parse(msg: string): ServerMessage<any> | undefined {
        const parsedMsg = JSON.parse(msg);
        if (!parsedMsg.type) {
            return undefined;
        }
        let result: ServerMessage<any> = {
            type: parsedMsg.type,
            data: parsedMsg.data ? parsedMsg.data : ''
        }
        return result;
    }
}

export class AudioClient {
    private websocket?: WebSocket
    private audioContext?: AudioContext
    private stream?: MediaStream
    private audioProcessorURL?: string
    private toPlayAudio: ArrayBuffer[] = []
    private audio: HTMLAudioElement = new Audio()
    /**是否准备好播放音频 */
    private isReady = true

    /**
     * 收到音频数据时回调函数，如TTS返回的音频数据、大模型结果返回的音频等
     */
    onaudio?: (audioData: ArrayBuffer) => void

    /**
     * 收到文本数据时回调函数，如语音识别结果
     */
    ontext?: (text: string) => void

    /**
     * 音频播放完成时回调
     */
    onPlayEnd?: () => void

    constructor(private wsUrl: string) {
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
            } else { //缓冲无数据
                this.isReady = true;
                if (this.onPlayEnd) {
                    this.onPlayEnd();
                }
            }
        }, false);

        this.initWS();
    }

    private heartbeatTimer?: number;

    private wsOnOpen(ev: Event) {
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

    private wsOnMessage(ev: MessageEvent<any>) {
        //console.info('ws收到数据：', ev.data);
        if (ev.data instanceof Blob) {
            const onaudio = this.onaudio;
            if (onaudio) {
                ev.data.arrayBuffer().then(buf => {
                    onaudio(buf);
                });
            } else {
                console.warn("收到音频数据，但未绑定回调函数：", ev);
            }
        } else {
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

    private wsOnClose(ev: CloseEvent) {
        console.info('ws已关闭', ev);
        // 服务器关闭，则不重连
        if (ev.code != 1006) {
            this.wsReconnect();
        }
    }

    /**避免重复连接 */
    private lockReconnect = false;
    private wsTimer?: number;

    private wsReconnect() {
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

    private initWS() {
        try {
            this.websocket = new WebSocket(this.wsUrl);
            this.websocket.onopen = this.wsOnOpen.bind(this);
            this.websocket.onmessage = this.wsOnMessage.bind(this);
            this.websocket.onclose = this.wsOnClose.bind(this);
        } catch (e) {
            console.error('连接语音服务失败：', e);
            this.wsReconnect();
        }
    }

    /**
     * 获取音频上下文
     * @returns 内部音频上下文
     */
    getAudioContext() {
        return this.audioContext
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
     * @param sampleRate 采样率，若不传，则默认48000
     */
    async start(customMediaStream?: MediaStream, sampleRate?: number) {
        if (!this.audioContext) {
            this.audioContext = new AudioContext();
        }
        // 语音服务已经链接并且可以通讯
        if (this.websocket && this.websocket.readyState == 1) {
            if (customMediaStream) {
                this.start_stream(customMediaStream, sampleRate);
            } else {
                navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
                    this.stream = stream;
                    const tracks = stream.getAudioTracks();
                    const track = tracks[0];
                    const settings = track.getSettings();
                    console.info(`音频轨道0：采样率：${settings.sampleRate}  通道数：${settings.channelCount}  采样大小：${settings.sampleSize}位`);

                    const cap = track.getCapabilities();
                    console.info('当前音频设备能力集：', cap);

                    this.start_stream(stream, settings.sampleRate);
                }, err => {
                    alert('获取用户麦克风设备失败：' + err);
                });
            }
        } else {
            console.error('启用语音识别失败：连接语音服务失败');
        }
    }

    private base64_to_url(base64: string, contentType: string): string {
        const byteCharacters = atob(base64);
        const byteNumbers: number[] = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: contentType });
        const blobUrl = URL.createObjectURL(blob);
        return blobUrl;
    }

    private async start_stream(stream: MediaStream, sampleRate?: number) {
        let context = this.audioContext;
        if (!context) {
            return;
        }
        // 获取worker脚本URL
        if (this.audioProcessorURL) {
            URL.revokeObjectURL(this.audioProcessorURL);
            this.audioProcessorURL = undefined;
        }
        let url = this.base64_to_url(audioProcessorBase64, 'text/javascript');
        this.audioProcessorURL = url;

        // ws客户端
        const ws = this.websocket;

        // 音频源
        const audioSource = context.createMediaStreamSource(stream);
        if (typeof AudioWorkletNode == 'function') {
            console.info('使用AudioWorkletNode采集音频');
            await context.audioWorklet.addModule(url);

            const node = new AudioWorkletNode(context, "AudioProcessor");
            node.port.onmessage = event => {
                const data = event.data;
                if (ws && ws.readyState == 1) {
                    ws.send(data);
                }
            }
            audioSource.connect(node);
            node.connect(context.destination);
        } else {
            console.info('使用ScriptProcessorNode采集音频');
            //创建worker
            const webWorker = new Worker(url);
            webWorker.onmessage = event => {
                const data = event.data;
                if (ws && ws.readyState == 1) {
                    ws.send(data);
                }
            }
            // 创建音频处理节点
            const node = context.createScriptProcessor(0, 1, 1);
            node.onaudioprocess = event => {
                const data = event.inputBuffer.getChannelData(0);
                webWorker.postMessage({
                    data,
                    sampleRate: sampleRate ? sampleRate : 48000
                });
            };

            audioSource.connect(node);
            node.connect(context.destination);
        }
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
    send<T>(msg: ClientMessage<T>) {
        if (!this.audioContext) {
            this.audioContext = new AudioContext();
        }
        // 语音服务已经链接并且可以通讯
        if (this.websocket && this.websocket.readyState == 1) {
            const text = JSON.stringify(msg);
            //console.info('开始发送消息：', text);
            this.websocket.send(text);
        } else {
            console.error('发送消息失败：连接语音服务失败');
        }
    }

    /**
     * 播放音频数据
     * @param audioData 音频数据
     * @returns 
     */
    playAudio(audioData: ArrayBuffer) {
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
        } else {
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