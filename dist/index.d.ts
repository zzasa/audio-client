type VoiceType = 'zhitian_emo' | 'zhiyan_emo' | 'zhizhe_emo' | 'zhibei_emo';
export interface AudioConfig {
    /**websocket接口地址 */
    wsUrl: string;
    /**是否流式，默认非流式 */
    isStreaming?: boolean;
    /**
     * 发音人，用于TTS功能
     *
     * 支持的发音人：zhitian_emo，zhiyan_emo，zhizhe_emo，zhibei_emo
     */
    voice?: VoiceType;
}
/**消息类型 */
export declare enum MessageType {
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
    type: MessageType;
    data?: T;
}
export declare class ClientMessageBuilder {
    /**构建客户端消息 */
    static build<T>(type: MessageType, data?: T): ClientMessage<T>;
    static parse(msg: string): ClientMessage<any> | undefined;
}
export declare class AudioClient {
    config: AudioConfig;
    private websocket?;
    private audioContext?;
    private stream?;
    private audioProcessorURL?;
    private toPlayAudio;
    /**是否禁用语音播报 */
    private disableVolume;
    /**是否正在讲话 */
    private isTalking;
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
    constructor(config: AudioConfig);
    /**
     * 改变识别模式
     * @param isStreaming 是否流式
     */
    setStreamingMode(isStreaming: boolean): void;
    private init;
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
     * 设置是否讲话
     *
     * 若为false, 则客户端会提交音频
     * @param isTalking 是否正在讲话
     */
    setIsTalking(isTalking: boolean): void;
    private isInvokedInit;
    private toTTS;
    /**
     * 发送文本消息，支持的消息类型，参见MessageType
     *
     * @param text 文本消息
     */
    send(text: string): void;
    /**
     * 设置发音人
     */
    setVoice(voice: VoiceType): void;
    /**
     * 设置是否禁用语音播报
     * @param disableVolume 是否禁用语音播报
     */
    setVolume(disableVolume: boolean): void;
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
export {};
