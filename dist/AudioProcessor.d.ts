declare class AudioProcessor {
    process(inputs: any, outputs: any): boolean;
    transcode(audioData: any): Float32Array;
    to16kHz(audioData: any): Float32Array;
    to16BitPCM(input: any): DataView;
}
