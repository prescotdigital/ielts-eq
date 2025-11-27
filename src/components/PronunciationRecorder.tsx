"use client";

import { useState, useEffect, useRef } from "react";
import { Mic, Square, Play, RotateCcw, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PronunciationRecorderProps {
    targetText: string;
    onResult: (isCorrect: boolean, transcript: string, skipped?: boolean) => void;
}

export default function PronunciationRecorder({ targetText, onResult }: PronunciationRecorderProps) {
    const [isRecording, setIsRecording] = useState(false);
    const [transcript, setTranscript] = useState("");
    const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [failureCount, setFailureCount] = useState(0);

    // Web Speech API references
    const recognitionRef = useRef<any>(null);

    // Reset state when target text changes
    useEffect(() => {
        setFeedback(null);
        setTranscript("");
        setError(null);
        setFailureCount(0);
        setIsRecording(false);
    }, [targetText]);

    useEffect(() => {
        if (typeof window !== "undefined" && (window as any).webkitSpeechRecognition) {
            const SpeechRecognition = (window as any).webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.lang = "en-US";
            recognitionRef.current.interimResults = false;
            recognitionRef.current.maxAlternatives = 1;

            recognitionRef.current.onresult = (event: any) => {
                const result = event.results[0][0].transcript;
                setTranscript(result);
                analyzePronunciation(result);
                setIsRecording(false);
            };

            recognitionRef.current.onerror = (event: any) => {
                console.error("Speech recognition error", event.error);
                setError("Could not hear you. Please try again.");
                setIsRecording(false);
            };

            recognitionRef.current.onend = () => {
                setIsRecording(false);
            };
        } else {
            setError("Your browser does not support speech recognition.");
        }
    }, [targetText]);

    const startRecording = () => {
        setFeedback(null);
        setTranscript("");
        setError(null);
        if (recognitionRef.current) {
            try {
                recognitionRef.current.start();
                setIsRecording(true);
            } catch (e) {
                console.error("Error starting recognition", e);
            }
        }
    };

    const stopRecording = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }
    };

    const analyzePronunciation = (spokenText: string) => {
        // Simple normalization: remove punctuation and lowercase
        const normalizedSpoken = spokenText.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").trim();
        const normalizedTarget = targetText.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").trim();

        // Check for exact match or if the target is contained in the spoken text (for longer sentences)
        // For single words, we want strict matching.
        const isCorrect = normalizedSpoken === normalizedTarget;

        if (isCorrect) {
            setFeedback("correct");
            onResult(true, spokenText, false);
        } else {
            setFeedback("incorrect");
            setFailureCount(prev => prev + 1);
            onResult(false, spokenText, false);
        }
    };

    const handleSkip = () => {
        onResult(true, "skipped", true);
    };

    const handleResetDrill = () => {
        setFailureCount(0);
        setFeedback(null);
        setTranscript("");
    };

    return (
        <div className="flex flex-col items-center gap-6 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm relative">

            {/* Skip/Retry Modal */}
            {failureCount >= 5 && feedback !== "correct" && (
                <div className="absolute inset-0 bg-white/95 backdrop-blur-sm z-10 flex flex-col items-center justify-center rounded-2xl p-6 text-center animate-in fade-in zoom-in duration-300">
                    <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mb-4">
                        <RotateCcw className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Having trouble?</h3>
                    <p className="text-gray-500 mb-6">You've tried 5 times. Would you like to skip this word or keep trying?</p>
                    <div className="flex gap-3">
                        <Button variant="outline" onClick={handleResetDrill}>
                            Keep Trying
                        </Button>
                        <Button onClick={handleSkip} className="bg-emerald-600 hover:bg-emerald-700">
                            Skip Word
                        </Button>
                    </div>
                </div>
            )}

            {/* Visualizer / Status Area */}
            <div className={cn(
                "w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300 relative",
                isRecording ? "bg-red-50 scale-110" : "bg-gray-50",
                feedback === "correct" && "bg-emerald-50",
                feedback === "incorrect" && "bg-orange-50"
            )}>
                {isRecording && (
                    <div className="absolute inset-0 rounded-full border-4 border-red-100 animate-ping"></div>
                )}

                {isRecording ? (
                    <Mic className="w-12 h-12 text-red-500 animate-pulse" />
                ) : feedback === "correct" ? (
                    <CheckCircle className="w-12 h-12 text-emerald-500" />
                ) : feedback === "incorrect" ? (
                    <XCircle className="w-12 h-12 text-orange-500" />
                ) : (
                    <Mic className="w-12 h-12 text-gray-400" />
                )}
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4">
                {!isRecording ? (
                    <Button
                        onClick={startRecording}
                        size="lg"
                        className={cn(
                            "rounded-full px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all hover:-translate-y-1",
                            feedback === "correct" ? "bg-emerald-600 hover:bg-emerald-700" : "bg-primary hover:bg-primary/90"
                        )}
                        disabled={feedback === "correct"} // Disable if already correct to prevent re-recording before auto-advance
                    >
                        {feedback === "correct" ? (
                            <>
                                <CheckCircle className="w-5 h-5 mr-2" />
                                Correct
                            </>
                        ) : feedback === "incorrect" ? (
                            <>
                                <RotateCcw className="w-5 h-5 mr-2" />
                                Try Again
                            </>
                        ) : (
                            <>
                                <Mic className="w-5 h-5 mr-2" />
                                Record
                            </>
                        )}
                    </Button>
                ) : (
                    <Button
                        onClick={stopRecording}
                        variant="destructive"
                        size="lg"
                        className="rounded-full px-8 py-6 text-lg animate-pulse"
                    >
                        <Square className="w-5 h-5 mr-2 fill-current" /> Stop
                    </Button>
                )}
            </div>

            {/* Feedback Text */}
            <div className="text-center min-h-[3rem]">
                {isRecording && (
                    <p className="text-gray-500 animate-pulse">Listening...</p>
                )}
                {error && (
                    <p className="text-red-500 font-medium">{error}</p>
                )}
                {transcript && !isRecording && (
                    <div className="space-y-1">
                        <p className="text-sm text-gray-400 uppercase tracking-wide font-semibold">We heard:</p>
                        <p className={cn(
                            "text-xl font-medium",
                            feedback === "correct" ? "text-emerald-600" : "text-orange-600"
                        )}>
                            "{transcript}"
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
