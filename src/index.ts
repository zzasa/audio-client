export interface AudioRTCConfig extends RTCConfiguration {
    /**websocket接口地址 */
    wsUrl: string

    /**
     * 发音人，用于TTS功能
     * 
     * 支持的发音人：zhitian_emo，zhiyan_emo，zhizhe_emo，zhibei_emo
     */
    voice?: string

    /**SDP格式(不用设置)，默认：unified-plan */
    sdpSemantics?: string
}

/**消息类型 */
export enum MessageType {
    Offer = "offer",
    Pranswer = "pranswer",
    Answer = "answer",
    Rollback = "rollback",
    Candidate = "candidate",
    /**tts请求 */
    TTS = "tts",
    /**语音识别结果 */
    STT = "stt"
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
    private pc?: RTCPeerConnection

    private websocket?: WebSocket

    /**
     * 收到音频数据时回调函数，如TTS返回的音频数据、大模型结果返回的音频等
     */
    onaudio?: (audioData: ArrayBuffer) => void

    /**
     * 收到文本数据时回调函数，如语音识别结果
     */
    ontext?: (text: string) => void

    constructor(private config: AudioRTCConfig) {
        if (!config.sdpSemantics) {
            config.sdpSemantics = 'unified-plan';
        }
    }

    private init(): Promise<boolean> {
        let pc = this.pc;

        if (!pc || pc.iceConnectionState == "closed") {
            pc = this.createPeerConnection();
        }
        this.pc = pc;

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
                            } else if (msg.type == MessageType.Answer) {
                                console.log('远端SDP', msg.data.sdp);
                                this.pc?.setRemoteDescription(msg.data);
                            } else if (msg.type == MessageType.Candidate) {
                                this.pc?.addIceCandidate(msg.data);
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
        this.init().then((success: boolean) => {
            if (success) {
                this.start_stream();
            }
        }, err => {
            console.log('连接音频服务失败：', err);
        });
    }

    private start_stream() {
        navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
            const tracks = stream.getAudioTracks();
            const track = tracks[0];
            const settings = track.getSettings();
            console.info(`音频轨道0：采样率：${settings.sampleRate}  通道数：${settings.channelCount}  采样大小：${settings.sampleSize}位`);

            const cap = track.getCapabilities();
            console.info('当前音频设备能力集：', cap);

            this.pc?.addTrack(track, stream);
            this.negotiate();
        }, err => {
            alert('获取用户麦克风设备失败：' + err);
        });

        // const audioEle = document.getElementById('audio-test') as HTMLAudioElement;
        // audioEle.loop = false;
        // const stream = (audioEle as any).captureStream() as MediaStream;
        // audioEle.play();
        // const tracks = stream.getAudioTracks();
        // this.pc?.addTrack(tracks[0], stream);
        // this.negotiate();
    }

    /**
     * 关闭客户端，包括与音频服务的连接
     */
    stop() {
        const pc = this.pc;
        if (pc) {
            if (typeof pc.getTransceivers) {
                pc.getTransceivers().forEach(transceiver => {
                    if (transceiver.stop) {
                        transceiver.stop();
                    }
                });
            }
            pc.getSenders().forEach(sender => {
                sender.track?.stop();
            });

            setTimeout(() => {
                pc.close();
                this.pc = undefined;
            }, 500);
        }
    }

    /**
     * 文本转语音(TTS)
     * 
     * 发送文本消息，服务端会返回一段音频，请在onmessage回调中处理
     */
    send(text: string) {
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
        } else {
            this.init().then((success: boolean) => {
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
    setVoice(voice: string) {
        this.config.voice = voice;
    }

    private createPeerConnection() {
        const pc = new RTCPeerConnection(this.config);
        pc.addEventListener('icegatheringstatechange', () => {
            console.info('icegatheringstatechange', pc.iceGatheringState);
        }, false);

        pc.addEventListener('iceconnectionstatechange', () => {
            console.info('iceconnectionstatechange', pc.iceConnectionState);
        }, false);

        pc.addEventListener('signalingstatechange', () => {
            console.info('signalingstatechange', pc.signalingState);
        }, false);

        pc.addEventListener('track', (evt) => {
            console.info('track evnt', evt);
            if (evt.track.kind == 'audio') {
                // TODO 处理服务端返回的音频
                // const [remoteStream] = evt.streams;
                // const remoteAudio = document.querySelector('#remoteAudio') as HTMLAudioElement;
                // remoteAudio.srcObject = remoteStream;

                // const context = new AudioContext();
                //const peer = context.createMediaStreamDestination();
                // const stream = context.createMediaStreamSource(remoteStream);
                // stream.connect(context.destination);

                // const audioStream = evt.streams[0]; //MediaStream
                // if (config.onaudio) {
                //     config.onaudio(audioStream);
                // } else {
                //     console.info('收到服务端音频');
                // }
            }
        });

        return pc;
    }

    /**
     * rtc协商过程
     */
    // @ts-ignore
    private negotiate() {
        const pc = this.pc;
        if (!pc) {
            console.error('RTCPeerConnection实例pc未定义');
            return;
        }
        const config = this.config;
        if (!config) {
            console.error('config未定义');
            return;
        }
        const ws = this.websocket;
        return pc.createOffer({ iceRestart: true }).then(offer => {
            return pc.setLocalDescription(offer);
        }).then(() => {
            // wait for ICE gathering to complete
            return new Promise<void>(resolve => {
                if (pc.iceGatheringState === 'complete') {
                    resolve();
                } else {
                    const checkState = () => {
                        if (pc.iceGatheringState === 'complete') {
                            pc.removeEventListener('icegatheringstatechange', checkState);
                            resolve();
                        }
                    }
                    pc.addEventListener('icegatheringstatechange', checkState);
                }
            });
        }).then(() => {
            const offer = pc.localDescription;
            if (!offer) {
                console.error('初始化本地offer失败');
                return;
            }
            const newOffer = {
                type: offer.type,
                sdp: offer.sdp
            }
            // m=audio 50869 UDP/TLS/RTP/SAVPF 111 63 9 0 8 13 110 126
            newOffer.sdp = newOffer.sdp.replace('UDP/TLS/RTP/SAVPF 111 63 9 0 8 13 110 126', 'UDP/TLS/RTP/SAVPF 0 8 111 63 9 13 110 126');
            console.info("本地SDP", newOffer.sdp);
            pc.setLocalDescription(newOffer);
            if (ws) {
                ws.send(JSON.stringify(ClientMessageBuilder.build(MessageType.Offer, newOffer)));
            }
        });
    }
}