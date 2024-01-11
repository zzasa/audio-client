const audioProcessorBase64 = '';

type VoiceType = 'zhitian_emo' | 'zhiyan_emo' | 'zhizhe_emo' | 'zhibei_emo'

export interface AudioConfig {
    /**websocket接口地址 */
    wsUrl: string

    /**是否流式，默认非流式 */
    isStreaming?: boolean

    /**
     * 发音人，用于TTS功能
     * 
     * 支持的发音人：zhitian_emo，zhiyan_emo，zhizhe_emo，zhibei_emo
     */
    voice?: VoiceType
}

/**消息类型 */
export enum MessageType {
    /**tts请求 */
    TTS = "tts",
    /**语音识别结果 */
    STT = "stt",
    /**说话开始 */
    TALK_START = "talk_start",
    /**说话结束 */
    TALK_STOP = "talk_stop",
    /**是否流式识别模式 */
    StreamingMode = "streaming_mode"
}

/**客户端消息 */
export interface ClientMessage<T> {
    type: MessageType,
    data?: T
}

export class ClientMessageBuilder {
    /**构建客户端消息 */
    static build<T>(type: MessageType, data?: T): ClientMessage<T> {
        return { type, data }
    }

    static parse(msg: string): ClientMessage<any> | undefined {
        const parsedMsg = JSON.parse(msg);
        if (!parsedMsg.type) {
            return undefined;
        }
        let result: ClientMessage<any> = {
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
    /**是否禁用语音播报 */
    private disableVolume = false
    /**是否正在讲话 */
    private isTalking = false

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

    constructor(public config: AudioConfig) {
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
            } else { //缓冲无数据
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
    setStreamingMode(isStreaming: boolean) {
        this.config.isStreaming = isStreaming;
        this.init();
    }

    private init(): Promise<boolean> {
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
                }

                innerWS.onmessage = ev => {
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

                }
                innerWS.onclose = ev => {
                    reject('连接关闭');
                    console.info('ws已关闭', ev);
                }
            }
        });
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
     */
    async start(customMediaStream?: MediaStream) {
        if (!this.audioContext) {
            this.audioContext = new AudioContext();
        }
        this.init().then((success: boolean) => {
            if (success) {
                if (customMediaStream) {
                    this.start_stream(customMediaStream);
                } else {
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

    private async start_stream(stream: MediaStream) {
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
        await context.audioWorklet.addModule(url);
        this.audioProcessorURL = url;

        const node = new AudioWorkletNode(context, "AudioProcessor");
        const ws = this.websocket;
        node.port.onmessage = event => {
            const data = event.data;
            if (ws && ws.readyState == 1) {
                if (this.config.isStreaming) {
                    ws.send(data);
                } else {
                    if (this.isTalking) {
                        ws.send(data);
                    }
                }
            }
        }
        audioSource.connect(node);
        node.connect(context.destination);
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

        if (this.audioProcessorURL) {
            URL.revokeObjectURL(this.audioProcessorURL);
            this.audioProcessorURL = undefined;
        }
    }

    /**
     * 设置是否讲话
     * 
     * 若为false, 则客户端会提交音频
     * @param isTalking 是否正在讲话
     */
    setIsTalking(isTalking: boolean) {
        this.isTalking = isTalking;
    }

    // 是否已经调用init
    private isInvokedInit = false;

    private toTTS: string[] = [];

    /**
     * 发送文本消息，支持的消息类型，参见MessageType
     * 
     * @param text 文本消息
     */
    send(text: string) {
        if (text.trim()) {
            if (!this.audioContext) {
                this.audioContext = new AudioContext();
            }
            const ws = this.websocket;
            if (ws && ws.readyState == 1) {
                console.info('开始发送消息：', text);
                ws.send(text);
            } else {
                this.toTTS.push(text);
                if (!this.isInvokedInit) {
                    this.isInvokedInit = true;
                    this.init().then((success: boolean) => {
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
    setVoice(voice: VoiceType) {
        this.config.voice = voice;
    }

    /**
     * 设置是否禁用语音播报
     * @param disableVolume 是否禁用语音播报 
     */
    setVolume(disableVolume: boolean) {
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
    playAudio(audioData: ArrayBuffer) {
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