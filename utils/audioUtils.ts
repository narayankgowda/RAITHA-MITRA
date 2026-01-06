
export function base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
}

export function arrayBufferToBase64(buffer: ArrayBuffer): string {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    const chunkSize = 0x8000; // 32KB chunks to prevent stack overflow
    for (let i = 0; i < len; i += chunkSize) {
        // @ts-ignore
        binary += String.fromCharCode.apply(null, bytes.subarray(i, i + chunkSize));
    }
    return window.btoa(binary);
}

/**
 * Resamples and converts Float32 audio to Int16 PCM at 16kHz.
 */
export function convertFloat32ToInt16(input: Float32Array, currentSampleRate: number): Int16Array {
    const targetSampleRate = 16000;
    
    if (currentSampleRate === targetSampleRate) {
        const int16 = new Int16Array(input.length);
        for (let i = 0; i < input.length; i++) {
            const s = Math.max(-1, Math.min(1, input[i]));
            int16[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
        }
        return int16;
    }

    // Downsampling
    const ratio = currentSampleRate / targetSampleRate;
    const newLength = Math.ceil(input.length / ratio);
    const int16 = new Int16Array(newLength);
    
    for (let i = 0; i < newLength; i++) {
        const offset = Math.floor(i * ratio);
        // Clamp bounds just in case
        const val = input[Math.min(offset, input.length - 1)];
        const s = Math.max(-1, Math.min(1, val));
        int16[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
    }
    return int16;
}

/**
 * Converts raw Int16 PCM audio from Gemini to an AudioBuffer for playback.
 * We specifically tell createBuffer that the data is 24kHz, and the context (running at 48k or 44.1k) will handle resampling during playback.
 */
export function pcmToAudioBuffer(
    buffer: ArrayBuffer,
    ctx: AudioContext,
    sourceSampleRate: number = 24000 
): AudioBuffer {
    const int16Array = new Int16Array(buffer);
    const float32Array = new Float32Array(int16Array.length);
    
    for (let i = 0; i < int16Array.length; i++) {
        float32Array[i] = int16Array[i] / 32768.0;
    }

    // Create a buffer with the SOURCE sample rate (24000)
    const audioBuffer = ctx.createBuffer(1, float32Array.length, sourceSampleRate);
    audioBuffer.copyToChannel(float32Array, 0);
    return audioBuffer;
}
