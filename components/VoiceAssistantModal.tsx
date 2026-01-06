
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { MicIcon, XIcon, WifiOffIcon, SparklesIcon, CameraIcon, VideoIcon } from './icons';
import { useNetworkStatus } from '../hooks/useNetworkStatus';
import { convertFloat32ToInt16, arrayBufferToBase64, pcmToAudioBuffer, base64ToArrayBuffer } from '../utils/audioUtils';
import { blobToBase64 } from '../utils/fileUtils';

interface VoiceAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AssistantState = 'idle' | 'connecting' | 'listening' | 'speaking' | 'error';

const VoiceAssistantModal: React.FC<VoiceAssistantModalProps> = ({ isOpen, onClose }) => {
    const isOnline = useNetworkStatus();
    const [state, setState] = useState<AssistantState>('idle');
    const [errorMessage, setErrorMessage] = useState('');
    const [isCameraOn, setIsCameraOn] = useState(false);
    
    // Audio Contexts
    const inputAudioContextRef = useRef<AudioContext | null>(null);
    const outputAudioContextRef = useRef<AudioContext | null>(null);
    
    // Media & Processing
    const mediaStreamRef = useRef<MediaStream | null>(null);
    const videoStreamRef = useRef<MediaStream | null>(null);
    const processorRef = useRef<ScriptProcessorNode | null>(null);
    const sourceNodeRef = useRef<MediaStreamAudioSourceNode | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    
    // Video Elements
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const visualizerCanvasRef = useRef<HTMLCanvasElement>(null);
    
    // API & State Refs
    const activeSessionRef = useRef<any>(null);
    const isConnectedRef = useRef<boolean>(false);
    const nextStartTimeRef = useRef<number>(0);
    const sourceNodesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
    const visualizerFrameRef = useRef<number | null>(null);
    const videoIntervalRef = useRef<any>(null);

    const cleanup = async () => {
        isConnectedRef.current = false;

        if (visualizerFrameRef.current) {
            cancelAnimationFrame(visualizerFrameRef.current);
            visualizerFrameRef.current = null;
        }
        if (videoIntervalRef.current) {
            clearInterval(videoIntervalRef.current);
            videoIntervalRef.current = null;
        }

        // Stop Audio Processing First
        if (processorRef.current) {
            processorRef.current.disconnect();
            processorRef.current = null;
        }
        if (sourceNodeRef.current) {
            sourceNodeRef.current.disconnect();
            sourceNodeRef.current = null;
        }

        // Stop Media Streams
        if (mediaStreamRef.current) {
            mediaStreamRef.current.getTracks().forEach(track => track.stop());
            mediaStreamRef.current = null;
        }
        if (videoStreamRef.current) {
            videoStreamRef.current.getTracks().forEach(track => track.stop());
            videoStreamRef.current = null;
        }

        // Close Audio Contexts
        if (inputAudioContextRef.current && inputAudioContextRef.current.state !== 'closed') {
            await inputAudioContextRef.current.close();
            inputAudioContextRef.current = null;
        }
        
        // Stop all playing audio
        sourceNodesRef.current.forEach(node => { 
            try { node.stop(); } catch(e){} 
        });
        sourceNodesRef.current.clear();
        
        if (outputAudioContextRef.current && outputAudioContextRef.current.state !== 'closed') {
            await outputAudioContextRef.current.close();
            outputAudioContextRef.current = null;
        }

        activeSessionRef.current = null;
        analyserRef.current = null;
        nextStartTimeRef.current = 0;
        setIsCameraOn(false);
    };

    const handleClose = async () => {
        await cleanup();
        setState('idle');
        onClose();
    };

    const toggleCamera = async () => {
        if (isCameraOn) {
            if (videoStreamRef.current) {
                videoStreamRef.current.getTracks().forEach(t => t.stop());
                videoStreamRef.current = null;
            }
            if (videoIntervalRef.current) {
                clearInterval(videoIntervalRef.current);
                videoIntervalRef.current = null;
            }
            setIsCameraOn(false);
        } else {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ 
                    video: { facingMode: 'environment', width: { ideal: 640 }, height: { ideal: 480 } } 
                });
                videoStreamRef.current = stream;
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    await videoRef.current.play();
                }
                setIsCameraOn(true);
                
                if (isConnectedRef.current) {
                    startVideoStreaming();
                }
            } catch (e) {
                console.error("Camera error:", e);
                setErrorMessage("Camera access denied.");
            }
        }
    };

    const startVideoStreaming = () => {
        if (videoIntervalRef.current) clearInterval(videoIntervalRef.current);
        
        // Send frames at 1 FPS
        videoIntervalRef.current = setInterval(async () => {
            if (!isConnectedRef.current || !activeSessionRef.current || !videoRef.current || !canvasRef.current) return;
            
            const context = canvasRef.current.getContext('2d');
            if (!context) return;

            canvasRef.current.width = videoRef.current.videoWidth;
            canvasRef.current.height = videoRef.current.videoHeight;
            context.drawImage(videoRef.current, 0, 0);

            canvasRef.current.toBlob(async (blob) => {
                if (blob && isConnectedRef.current && activeSessionRef.current) {
                    try {
                        const base64 = await blobToBase64(blob);
                        activeSessionRef.current.sendRealtimeInput({
                            media: { mimeType: 'image/jpeg', data: base64 }
                        });
                    } catch (e) {
                        console.warn("Frame skipped", e);
                    }
                }
            }, 'image/jpeg', 0.5);
        }, 1000); 
    };

    const drawVisualizer = () => {
        if (!visualizerCanvasRef.current || !analyserRef.current) return;
        
        const canvas = visualizerCanvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const bufferLength = analyserRef.current.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyserRef.current.getByteFrequencyData(dataArray);

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = 50; 
        
        let sum = 0;
        for(let i = 0; i < bufferLength; i++) sum += dataArray[i];
        const average = sum / bufferLength;
        const glowRadius = radius + (average * 0.5);

        const gradient = ctx.createRadialGradient(centerX, centerY, radius, centerX, centerY, glowRadius * 1.5);
        gradient.addColorStop(0, state === 'speaking' ? 'rgba(34, 197, 94, 0.8)' : 'rgba(59, 130, 246, 0.8)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.beginPath();
        ctx.arc(centerX, centerY, glowRadius, 0, 2 * Math.PI);
        ctx.fillStyle = gradient;
        ctx.fill();

        const bars = 40;
        const step = (Math.PI * 2) / bars;
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';

        for (let i = 0; i < bars; i++) {
            const dataIndex = Math.floor((i / bars) * (bufferLength / 2)); 
            const value = dataArray[dataIndex];
            const barHeight = (value / 255) * 60; 

            const angle = i * step;
            const x1 = centerX + Math.cos(angle) * radius;
            const y1 = centerY + Math.sin(angle) * radius;
            const x2 = centerX + Math.cos(angle) * (radius + barHeight);
            const y2 = centerY + Math.sin(angle) * (radius + barHeight);

            ctx.strokeStyle = state === 'speaking' ? '#4ade80' : '#60a5fa'; 
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
        }

        visualizerFrameRef.current = requestAnimationFrame(drawVisualizer);
    };

    const startSession = async () => {
        if (!isOnline) {
            setErrorMessage("Internet connection required.");
            setState('error');
            return;
        }

        const apiKey = process.env.API_KEY;
        if (!apiKey) {
            setErrorMessage("API Key missing.");
            setState('error');
            return;
        }

        try {
            await cleanup();
            setState('connecting');
            setErrorMessage('');

            // 1. Initialize Contexts using default system rates
            const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
            const inputCtx = new AudioContextClass();
            const outputCtx = new AudioContextClass(); // Do NOT force sampleRate here

            // Explicitly resume contexts (required by browsers)
            await inputCtx.resume();
            await outputCtx.resume();

            inputAudioContextRef.current = inputCtx;
            outputAudioContextRef.current = outputCtx;

            // Get stream
            const stream = await navigator.mediaDevices.getUserMedia({ audio: { channelCount: 1 } }); 
            mediaStreamRef.current = stream;

            const source = inputCtx.createMediaStreamSource(stream);
            sourceNodeRef.current = source;

            // 2. Connect to Gemini
            const ai = new GoogleGenAI({ apiKey });
            
            const callbacks = {
                onopen: () => {
                    console.log("Gemini WebSocket Opened");
                    isConnectedRef.current = true;
                },
                onmessage: (message: LiveServerMessage) => {
                    const serverContent = message.serverContent;
                    
                    const base64Audio = serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
                    if (base64Audio) {
                        setState('speaking');
                        const audioCtx = outputAudioContextRef.current;
                        if (audioCtx) {
                            try {
                                const audioBufferChunk = base64ToArrayBuffer(base64Audio);
                                // Tell pcmToAudioBuffer that the SOURCE is 24000Hz (Gemini default)
                                // The audioCtx (system default, e.g. 48000Hz) will resample it automatically during playback
                                const audioBuffer = pcmToAudioBuffer(audioBufferChunk, audioCtx, 24000);
                                
                                const source = audioCtx.createBufferSource();
                                source.buffer = audioBuffer;
                                source.connect(audioCtx.destination);
                                
                                const now = audioCtx.currentTime;
                                const start = Math.max(now, nextStartTimeRef.current);
                                source.start(start);
                                nextStartTimeRef.current = start + audioBuffer.duration;
                                
                                sourceNodesRef.current.add(source);
                                source.onended = () => {
                                    sourceNodesRef.current.delete(source);
                                    // Small buffer time to prevent flickering state
                                    setTimeout(() => {
                                        if (sourceNodesRef.current.size === 0 && isConnectedRef.current) {
                                            setState('listening');
                                        }
                                    }, 200);
                                };
                            } catch (err) {
                                console.error("Audio Decode Error", err);
                            }
                        }
                    }

                    if (serverContent?.interrupted) {
                        sourceNodesRef.current.forEach(node => { try { node.stop(); } catch(e){} });
                        sourceNodesRef.current.clear();
                        nextStartTimeRef.current = 0;
                        setState('listening');
                    }
                },
                onclose: () => {
                    console.log("Session closed");
                    isConnectedRef.current = false;
                    if (state !== 'error') setState('idle');
                },
                onerror: (e: any) => {
                    console.error("Gemini Error:", e);
                    isConnectedRef.current = false;
                    setErrorMessage("Connection error. Please try again.");
                    setState('error');
                    cleanup();
                }
            };

            const config = {
                model: 'gemini-2.5-flash-native-audio-preview-09-2025',
                callbacks,
                config: {
                    responseModalities: [Modality.AUDIO], 
                    speechConfig: {
                        voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Fenrir' } }
                    },
                    systemInstruction: { parts: [{ text: `You are Raitha Mitra, an expert agricultural AI assistant. 
                    You can see what the farmer shows you through their camera.
                    If the user shows a plant, crop, or pest, analyze it visually and provide specific advice.
                    Keep responses concise (under 3 sentences) unless asked for details.
                    Speak in a friendly, practical tone suitable for Indian farmers.` }] }
                }
            };

            const session = await ai.live.connect(config);
            activeSessionRef.current = session;
            setState('listening');

            // 3. Setup Audio Processor & Visualization
            const processor = inputCtx.createScriptProcessor(4096, 1, 1);
            processorRef.current = processor;

            const analyser = inputCtx.createAnalyser();
            analyser.fftSize = 256; 
            analyserRef.current = analyser;

            // Connect Mic -> Analyser -> Processor
            source.connect(analyser);
            analyser.connect(processor);
            
            // CRITICAL FIX: Connect processor to a GainNode with 0 gain before destination
            // This prevents microphone feedback loops (hearing yourself) while keeping the processor running
            const muteNode = inputCtx.createGain();
            muteNode.gain.value = 0;
            processor.connect(muteNode);
            muteNode.connect(inputCtx.destination); 

            drawVisualizer();

            processor.onaudioprocess = (e) => {
                if (!activeSessionRef.current || !isConnectedRef.current) return;
                
                const inputData = e.inputBuffer.getChannelData(0);
                const currentSampleRate = inputCtx.sampleRate;
                
                // Downsample to 16kHz for Gemini Input
                const pcmData = convertFloat32ToInt16(inputData, currentSampleRate);
                const base64Audio = arrayBufferToBase64(pcmData.buffer);
                
                try {
                    activeSessionRef.current.sendRealtimeInput({
                        media: {
                            mimeType: "audio/pcm;rate=16000",
                            data: base64Audio
                        }
                    });
                } catch (err) {
                    console.error("Send Error:", err);
                }
            };

            if (isCameraOn) startVideoStreaming();

        } catch (e: any) {
            console.error("Connection Start Error:", e);
            let msg = "Failed to start.";
            if (e.message.includes('Network')) msg = "Network connection failed.";
            setErrorMessage(msg);
            setState('error');
            cleanup();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center font-sans animate-fadeIn">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-500" onClick={handleClose}></div>
            
            {/* Modal Card */}
            <div className="relative z-10 w-full max-w-lg bg-gray-900 rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/10 flex flex-col h-[85vh]">
                
                {/* Header */}
                <div className="p-6 flex justify-between items-center bg-gray-900/50 absolute top-0 w-full z-20">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-tr from-green-400 to-emerald-600 rounded-full shadow-[0_0_15px_rgba(34,197,94,0.5)]">
                            <SparklesIcon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h3 className="font-bold text-white text-lg tracking-tight">Raitha Mitra</h3>
                            <div className="flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full ${isConnectedRef.current ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`}></span>
                                <p className="text-xs text-gray-400 font-medium">Live AI Assistant</p>
                            </div>
                        </div>
                    </div>
                    <button onClick={handleClose} className="p-3 bg-white/5 hover:bg-white/10 rounded-full transition-colors backdrop-blur-md border border-white/5">
                        <XIcon className="w-5 h-5 text-white" />
                    </button>
                </div>

                {/* Main Visual Area */}
                <div className="flex-grow relative flex flex-col items-center justify-center bg-gray-900">
                    
                    {/* Camera Layer */}
                    <div className={`absolute inset-0 transition-opacity duration-500 ${isCameraOn ? 'opacity-100' : 'opacity-0'}`}>
                        <video ref={videoRef} className="w-full h-full object-cover" autoPlay playsInline muted />
                        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80"></div>
                    </div>
                    
                    {/* Hidden canvas for frame capture */}
                    <canvas ref={canvasRef} className="hidden" />

                    {/* Content Container */}
                    <div className="relative z-10 w-full flex flex-col items-center h-full pt-20 pb-32 px-6">
                        
                        {/* Status Message (No Transcript) */}
                        <div className="w-full flex-grow flex items-center justify-center">
                            {state === 'listening' ? (
                                <p className="text-center text-gray-400 animate-pulse text-lg font-medium">Listening...</p>
                            ) : state === 'speaking' ? (
                                <p className="text-center text-green-400 animate-pulse text-lg font-medium">Speaking...</p>
                            ) : null}
                        </div>

                        {/* Error Display */}
                        {errorMessage && (
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-red-500/90 text-white px-6 py-3 rounded-xl backdrop-blur-md shadow-lg flex items-center text-center max-w-[90%]">
                                <WifiOffIcon className="w-5 h-5 mr-2 shrink-0"/> {errorMessage}
                            </div>
                        )}

                        {/* Center Visualizer (Canvas) */}
                        <div className={`transition-all duration-500 h-64 w-full flex items-center justify-center`}>
                            {state === 'idle' || state === 'error' ? (
                                <button 
                                    onClick={startSession} 
                                    className="w-24 h-24 rounded-full bg-gradient-to-br from-green-500 to-emerald-700 text-white flex items-center justify-center shadow-[0_0_30px_rgba(34,197,94,0.4)] hover:scale-110 transition-all duration-300 group"
                                >
                                    <MicIcon className="w-10 h-10 group-hover:animate-bounce" />
                                </button>
                            ) : (
                                <canvas ref={visualizerCanvasRef} width="300" height="300" className="w-full h-full object-contain" />
                            )}
                        </div>
                    </div>
                </div>

                {/* Control Dock */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-6 p-2 bg-black/40 backdrop-blur-xl rounded-full border border-white/10 shadow-2xl">
                    <button 
                        onClick={toggleCamera}
                        className={`p-4 rounded-full transition-all duration-300 ${
                            isCameraOn 
                            ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.3)]' 
                            : 'bg-white/10 text-white hover:bg-white/20'
                        }`}
                        title="Toggle Vision"
                    >
                        {isCameraOn ? <VideoIcon className="w-6 h-6"/> : <CameraIcon className="w-6 h-6"/>}
                    </button>

                    <div className="w-px h-8 bg-white/20"></div>

                    <button 
                        onClick={handleClose}
                        className="px-8 py-3 bg-red-500/80 hover:bg-red-600 text-white rounded-full font-bold transition-all shadow-lg backdrop-blur-sm flex items-center"
                    >
                        <XIcon className="w-5 h-5 mr-2"/> End
                    </button>
                </div>
            </div>
            
            <style>{`
                .mask-gradient-y {
                    mask-image: linear-gradient(to bottom, transparent, black 10%, black 90%, transparent);
                }
            `}</style>
        </div>
    );
};

export default VoiceAssistantModal;
