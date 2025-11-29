'use client';

import { useState, useRef, useEffect } from 'react';
import { Mic, Square, ChevronRight, Loader2, Play, CheckCircle2, ArrowLeft, Volume2, Timer, AlertCircle } from 'lucide-react';
import Link from 'next/link';

type TestPart = 1 | 2 | 3;
type TestStep = 'mic-check' | 'instructions' | 'test' | 'part2-prep' | 'completed';

export default function TestPage() {
    const [testStep, setTestStep] = useState<TestStep>('mic-check');
    const [currentPart, setCurrentPart] = useState<TestPart>(1);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Recording State
    const [isRecording, setIsRecording] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [transcript, setTranscript] = useState('');

    // Mic Check State
    const [micPermission, setMicPermission] = useState<boolean | null>(null);
    const [audioLevel, setAudioLevel] = useState(0);

    // Part 2 Timer State
    const [prepTimeLeft, setPrepTimeLeft] = useState(60); // 1 minute prep
    const [isPrepping, setIsPrepping] = useState(false);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const animationFrameRef = useRef<number | null>(null);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const [questions, setQuestions] = useState<any>({
        1: [],
        2: [],
        3: []
    });

    // Fetch questions on mount
    useEffect(() => {
        fetch('/api/questions')
            .then(async res => {
                if (!res.ok) {
                    const data = await res.json().catch(() => ({}));
                    if (res.status === 401 || res.status === 404) {
                        alert(data.error || "Authentication required. Please sign in again.");
                        // Force sign out to clear invalid session
                        window.location.href = '/api/auth/signout?callbackUrl=/dashboard';
                        return null;
                    }
                    throw new Error("Failed to load questions");
                }
                return res.json();
            })
            .then(data => {
                if (data) setQuestions(data);
            })
            .catch(err => console.error('Failed to load questions:', err));
    }, []);

    const currentQuestionsList = questions[currentPart] || [];
    const currentQuestion = currentQuestionsList[currentQuestionIndex];

    // Cleanup
    useEffect(() => {
        return () => {
            if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, []);

    // --- Session Management ---
    const startTest = async () => {
        setIsSubmitting(true);
        try {
            const res = await fetch('/api/test-session', { method: 'POST' });
            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.error || "Failed to start session");
            }
            const data = await res.json();
            setSessionId(data.sessionId);
            setTestStep('test');
        } catch (err: any) {
            console.error(err);
            alert(`Could not start test session: ${err.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const finishTest = async () => {
        if (!sessionId) return;
        setIsSubmitting(true);
        try {
            const res = await fetch('/api/analyze-test', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sessionId }),
            });
            if (!res.ok) throw new Error("Final analysis failed");

            setTestStep('completed');
        } catch (err) {
            console.error(err);
            alert("Failed to generate final report.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // --- Mic Check Logic ---
    const checkMic = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            setMicPermission(true);

            const audioContext = new AudioContext();
            const analyser = audioContext.createAnalyser();
            const source = audioContext.createMediaStreamSource(stream);
            source.connect(analyser);
            analyser.fftSize = 256;
            const dataArray = new Uint8Array(analyser.frequencyBinCount);

            const updateLevel = () => {
                analyser.getByteFrequencyData(dataArray);
                const avg = dataArray.reduce((a, b) => a + b) / dataArray.length;
                setAudioLevel(avg);
                animationFrameRef.current = requestAnimationFrame(updateLevel);
            };
            updateLevel();
        } catch (err) {
            console.error("Mic check failed:", err);
            setMicPermission(false);
        }
    };

    // --- Part 2 Timer Logic ---
    useEffect(() => {
        if (isPrepping && prepTimeLeft > 0) {
            timerRef.current = setInterval(() => {
                setPrepTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (prepTimeLeft === 0 && isPrepping) {
            setIsPrepping(false);
            if (timerRef.current) clearInterval(timerRef.current);
            // Auto-start recording or prompt user?
            alert("Preparation time is over! Please start speaking.");
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isPrepping, prepTimeLeft]);

    const startPart2Prep = () => {
        setTestStep('part2-prep');
        setIsPrepping(true);
    };

    // --- Navigation Logic ---
    const nextStep = async () => {
        // Reset state for next question
        setTranscript('');

        if (currentQuestionIndex < currentQuestionsList.length - 1) {
            // Next question in same part
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            // End of part
            if (currentPart === 1) {
                setCurrentPart(2);
                setCurrentQuestionIndex(0);
                setTestStep('part2-prep'); // Go to prep screen
                setIsPrepping(true);
            } else if (currentPart === 2) {
                setCurrentPart(3);
                setCurrentQuestionIndex(0);
                setTestStep('test');
            } else {
                await finishTest();
            }
        }
    };

    // --- Recording Logic ---
    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            chunksRef.current = [];

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) chunksRef.current.push(e.data);
            };

            mediaRecorder.onstop = async () => {
                const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
                await handleUploadAndAnalyze(audioBlob);
            };

            mediaRecorder.start();
            setIsRecording(true);

            // If Part 2, maybe stop prep timer if running
            if (isPrepping) setIsPrepping(false);

        } catch (err) {
            console.error("Error accessing microphone:", err);
            alert("Could not access microphone.");
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
        }
    };

    const handleUploadAndAnalyze = async (audioBlob: Blob) => {
        if (!sessionId) {
            alert("Session ID missing. Please restart.");
            return;
        }
        setIsAnalyzing(true);

        try {
            // 1. Upload
            const formData = new FormData();
            formData.append('file', audioBlob, 'recording.webm');
            const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData });
            if (!uploadRes.ok) throw new Error('Upload failed');
            const { url } = await uploadRes.json();

            // 2. Transcribe only (analysis happens at the end)
            const analyzeRes = await fetch('/api/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    audioUrl: url,
                    questionId: currentQuestion.id,
                    sessionId: sessionId,
                }),
            });

            if (!analyzeRes.ok) throw new Error('Transcription failed');
            const data = await analyzeRes.json();

            setTranscript(data.transcript);

        } catch (error: any) {
            console.error(error);
            alert(`Error processing response: ${error.message}`);
        } finally {
            setIsAnalyzing(false);
        }
    };

    // --- Renders ---

    if (testStep === 'mic-check') {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
                <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full text-center space-y-8">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto text-purple-600">
                        <Mic className="w-8 h-8" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold mb-2">Microphone Check</h2>
                        <p className="text-gray-500">Let's make sure we can hear you clearly.</p>
                    </div>
                    <div className="h-24 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100 relative overflow-hidden">
                        {micPermission === true ? (
                            <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="w-3 bg-primary rounded-full transition-all duration-75"
                                        style={{ height: `${Math.max(10, Math.min(100, audioLevel * (i + 1) * 0.5))}px`, opacity: audioLevel > 5 ? 1 : 0.3 }} />
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-400">Click "Test Microphone"</p>
                        )}
                    </div>
                    <div className="space-y-3">
                        {!micPermission ? (
                            <div className="space-y-3">
                                <button onClick={checkMic} className="w-full py-3 bg-gray-900 text-white rounded-full font-bold hover:bg-gray-800 transition-colors">Test Microphone</button>
                                <button onClick={startTest} disabled={isSubmitting} className="w-full py-3 text-gray-500 font-medium hover:text-gray-900 transition-colors">
                                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Skip Microphone Check"}
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                <button
                                    onClick={startTest}
                                    disabled={isSubmitting}
                                    className="w-full py-3 bg-primary text-white rounded-full font-bold hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-200 flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" /> Starting...
                                        </>
                                    ) : (
                                        "Start Test"
                                    )}
                                </button>
                            </div>
                        )}
                        <Link href="/dashboard" className="block text-sm text-gray-500 hover:text-gray-900 mt-4">Cancel</Link>
                    </div>
                </div>
            </div>
        );
    }

    if (testStep === 'part2-prep') {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
                <div className="bg-white p-8 rounded-3xl shadow-xl max-w-2xl w-full space-y-8 border-t-4 border-purple-500">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold text-purple-600 uppercase tracking-wider">Part 2: Cue Card</h2>
                        <div className="flex items-center gap-2 text-red-500 font-mono text-xl font-bold bg-red-50 px-4 py-2 rounded-lg">
                            <Timer className="w-5 h-5" />
                            00:{prepTimeLeft.toString().padStart(2, '0')}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-2xl font-bold text-gray-900">{currentQuestion.text}</h3>
                        <p className="text-gray-500">You should say:</p>
                        <ul className="list-disc list-inside space-y-2 text-gray-700 bg-gray-50 p-6 rounded-xl">
                            {/* @ts-ignore */}
                            {currentQuestion.bullets?.map((bullet, i) => (
                                <li key={i}>{bullet}</li>
                            ))}
                        </ul>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-xl flex items-start gap-3 text-blue-700 text-sm">
                        <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                        <p>You have 1 minute to prepare. You can take notes if you wish. The recording will start automatically or you can start early.</p>
                    </div>

                    <button
                        onClick={() => { setIsPrepping(false); setTestStep('test'); }}
                        className="w-full py-4 bg-primary text-white rounded-full font-bold hover:bg-emerald-600 transition-colors shadow-lg"
                    >
                        I'm Ready, Start Speaking
                    </button>
                </div>
            </div>
        );
    }

    if (testStep === 'completed') {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
                <div className="bg-white p-12 rounded-3xl shadow-xl max-w-lg w-full space-y-6">
                    <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
                        <CheckCircle2 className="w-10 h-10" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900">Test Completed!</h2>
                    <p className="text-gray-500">Your holistic analysis is ready.</p>
                    <Link href={`/results/${sessionId}`} className="block w-full py-4 bg-gray-900 text-white rounded-full font-bold hover:bg-gray-800 transition-colors">
                        View Full Report
                    </Link>
                </div>
            </div>
        );
    }

    if (isSubmitting) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
                <Loader2 className="w-16 h-16 animate-spin text-primary mb-6" />
                <h2 className="text-2xl font-bold text-gray-900">Generating Your Examiner Report...</h2>
                <p className="text-gray-500 mt-2">Analyzing your fluency, vocabulary, grammar, and pronunciation.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col font-sans">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 p-6 flex justify-between items-center shadow-sm sticky top-0 z-10">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard" className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">EQ</div>
                        <span className="font-bold text-gray-900 hidden sm:inline">IELTS EQ Mock Test</span>
                    </div>
                </div>
                <div className="bg-purple-100 text-purple-700 px-4 py-1.5 rounded-full text-sm font-bold">
                    Part {currentPart}
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 container mx-auto px-6 py-12 max-w-4xl flex flex-col items-center justify-center text-center">
                <div className="mb-12 max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight text-gray-900">
                        {currentQuestion.text}
                    </h2>
                    {!isRecording && !transcript && (
                        <p className="text-gray-500 text-lg">Click the microphone to start recording your answer.</p>
                    )}
                </div>

                {/* Recording Controls */}
                <div className="mb-12 relative">
                    {/* Analysis Loading */}
                    {isAnalyzing && (
                        <div className="flex flex-col items-center justify-center py-12 space-y-4">
                            <Loader2 className="w-12 h-12 animate-spin text-primary" />
                            <p className="text-gray-500 font-medium">Processing your response...</p>
                        </div>
                    )}

                    {/* Recording Button - Show when not recording and no transcript */}
                    {!isRecording && !transcript && !isAnalyzing && (
                        <button
                            onClick={startRecording}
                            className="w-24 h-24 rounded-full bg-primary hover:bg-emerald-600 flex items-center justify-center transition-all hover:scale-110 shadow-xl shadow-emerald-200 disabled:opacity-50 disabled:cursor-not-allowed group mx-auto"
                        >
                            <Mic className="w-10 h-10 text-white group-hover:scale-110 transition-transform" />
                        </button>
                    )}

                    {isRecording && (
                        <div className="relative">
                            <div className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-75"></div>
                            <button
                                onClick={stopRecording}
                                className="relative w-24 h-24 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center transition-all shadow-xl shadow-red-200 mx-auto"
                            >
                                <Square className="w-8 h-8 text-white" />
                            </button>
                        </div>
                    )}
                </div>
                <div className="mt-6 font-medium text-primary h-6">
                    {isRecording ? "Recording..." : ""}
                </div>

                {/* Transcript Display */}
                {transcript && (
                    <div className="w-full bg-white border border-gray-100 rounded-3xl p-8 text-left mb-8 animate-in fade-in slide-in-from-bottom-4 shadow-lg shadow-gray-100">
                        <div className="space-y-6">
                            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                                <h4 className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Transcript</h4>
                                <p className="text-gray-800 leading-relaxed">{transcript}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Navigation */}
                {transcript && (
                    <button
                        onClick={nextStep}
                        className="flex items-center gap-2 bg-gray-900 text-white px-8 py-4 rounded-full font-bold hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl"
                    >
                        {currentQuestionIndex < currentQuestionsList.length - 1 ? "Next Question" : "Next Part"}
                        <ChevronRight className="w-5 h-5" />
                    </button>
                )}
            </main>
        </div>
    );
}
