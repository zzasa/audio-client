export interface AudioConfig {
    /**websocket接口地址 */
    wsUrl: string;
    /**音频处理url，默认：./AudioProcessor.js */
    audioProcessorUrl?: string;
    /**
     * 发音人，用于TTS功能
     *
     * 支持的发音人：zhitian_emo，zhiyan_emo，zhizhe_emo，zhibei_emo
     */
    voice?: string;
}
/**消息类型 */
export declare enum MessageType {
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
    private websocket?;
    private audioContext?;
    private stream?;
    /**
     * 收到音频数据时回调函数，如TTS返回的音频数据、大模型结果返回的音频等
     */
    onaudio?: (audioData: ArrayBuffer) => void;
    /**
     * 收到文本数据时回调函数，如语音识别结果
     */
    ontext?: (text: string) => void;
    constructor(config: AudioConfig);
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
    start(): Promise<void>;
    private start_stream;
    /**
     * 停止语音识别
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
}
