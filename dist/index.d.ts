export interface AudioRTCConfig extends RTCConfiguration {
    /**websocket接口地址 */
    wsUrl: string;
    /**
     * 发音人，用于TTS功能
     *
     * 支持的发音人：zhitian_emo，zhiyan_emo，zhizhe_emo，zhibei_emo
     */
    voice?: string;
    /**SDP格式(不用设置)，默认：unified-plan */
    sdpSemantics?: string;
}
/**消息类型 */
export declare enum MessageType {
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
    type: MessageType;
    data?: T;
}
export declare class ClientMessageBuilder {
    /**构建客户端消息 */
    static build<T>(type: MessageType, data?: T): ClientMessage<T>;
    static parse(msg: string): ClientMessage<any> | undefined;
}
export declare class AudioClient {
    private config;
    private pc?;
    private websocket?;
    /**
     * 收到音频数据时回调函数，如TTS返回的音频数据、大模型结果返回的音频等
     */
    onaudio?: (audioData: ArrayBuffer) => void;
    /**
     * 收到文本数据时回调函数，如语音识别结果
     */
    ontext?: (text: string) => void;
    constructor(config: AudioRTCConfig);
    private init;
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
    start(): void;
    private start_stream;
    /**
     * 关闭客户端，包括与音频服务的连接
     */
    stop(): void;
    /**
     * 文本转语音(TTS)
     *
     * 发送文本消息，服务端会返回一段音频，请在onmessage回调中处理
     */
    send(text: string): void;
    /**
     * 设置发音人
     */
    setVoice(voice: string): void;
    private createPeerConnection;
    /**
     * rtc协商过程
     */
    private negotiate;
}
