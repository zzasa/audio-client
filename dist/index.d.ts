/**客户端消息类型 */
export declare enum ClientMessageType {
    /**tts请求 */
    TTS = "tts"
}
/**服务端消息类型 */
export declare enum ServerMessageType {
    /**语音识别结果 */
    STT = "stt"
}
/**客户端消息 */
export interface ClientMessage<T> {
    type: ClientMessageType;
    data?: T;
}
export interface ServerMessage<T> {
    type: ServerMessageType;
    data?: T;
}
/**TTS请求数据 */
export interface TtsRequestData {
    /**要合成的文本 */
    text: string;
    /**发音人ID */
    sid: number;
    /**语速：0.5(表示0.5倍数) 1.0(表示1倍数)，2.0(表示2倍数) */
    speed: number;
}
/**消息工厂类 */
export declare class MessageBuilder {
    /**
     * 创建TTS客户端消息
     * @param data TTS请求数据
     * @returns TTS客户端消息
     */
    static build_tts(data: TtsRequestData): ClientMessage<TtsRequestData>;
    /**
     * 创建客户端消息
     * @param type 客户端消息类型
     * @param data 数据
     * @returns ClientMessage
     */
    static build<T>(type: ClientMessageType, data?: T): ClientMessage<T>;
    /**
     * 解析服务端消息
     * @param msg 服务端json消息
     * @returns ServerMessage | undefined
     */
    static parse(msg: string): ServerMessage<any> | undefined;
}
export declare class AudioClient {
    private wsUrl;
    private websocket?;
    private audioContext?;
    private stream?;
    private audioProcessorURL?;
    private toPlayAudio;
    private audio;
    /**是否准备好播放音频 */
    private isReady;
    /**
     * 收到音频数据时回调函数，如TTS返回的音频数据、大模型结果返回的音频等
     */
    onaudio?: (audioData: ArrayBuffer) => void;
    /**
     * 收到文本数据时回调函数，如语音识别结果
     */
    ontext?: (text: string) => void;
    /**
     * 音频播放完成时回调
     */
    onPlayEnd?: () => void;
    constructor(wsUrl: string);
    private heartbeatTimer?;
    private wsOnOpen;
    private wsOnMessage;
    private wsOnClose;
    /**避免重复连接 */
    private lockReconnect;
    private wsTimer?;
    private wsReconnect;
    private initWS;
    /**
     * 获取音频上下文
     * @returns 内部音频上下文
     */
    getAudioContext(): AudioContext | undefined;
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
    start(customMediaStream?: MediaStream): Promise<void>;
    private base64_to_url;
    private start_stream;
    /**
     * 停止语音识别
     */
    stop(): void;
    /**
     * 发送客户端消息
     * 可通过MessageBuilder.build_tts创建TTS消息
     * @param msg ClientMessage 客户端消息
     */
    send<T>(msg: ClientMessage<T>): void;
    /**
     * 播放音频数据
     * @param audioData 音频数据
     * @returns
     */
    playAudio(audioData: ArrayBuffer): void;
    /**
     * 停止播放音频
     */
    stopAudio(): void;
}
