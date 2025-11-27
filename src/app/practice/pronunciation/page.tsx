"use client";

import { useState, useEffect } from "react";
import { Mic, Play, CheckCircle, ChevronRight, Volume2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import PronunciationRecorder from "@/components/PronunciationRecorder";
import { getDrills, updateDrillProgress } from "@/app/actions/pronunciation";

interface Drill {
    id: string;
    phoneme: string;
    label: string;
    description: string;
    words: string[];
    sentences: string[];
    userProgress: any[];
}

export default function PronunciationPage() {
    const [drills, setDrills] = useState<Drill[]>([]);
    const [selectedDrill, setSelectedDrill] = useState<Drill | null>(null);
    const [loading, setLoading] = useState(true);

    // Practice State
    const [currentStep, setCurrentStep] = useState(0); // 0=intro, 1...N=words, N+1...M=sentences
    const [practiceItems, setPracticeItems] = useState<string[]>([]);

    const [error, setError] = useState<string | null>(null);

    const [skippedCount, setSkippedCount] = useState(0);

    useEffect(() => {
        loadDrills();
    }, []);

    const loadDrills = async () => {
        try {
            const data = await getDrills();
            setDrills(data);
        } catch (error) {
            console.error("Failed to load drills", error);
            setError("Failed to load drills. Please try refreshing the page.");
        } finally {
            setLoading(false);
        }
    };

    const startDrill = (drill: Drill) => {
        setSelectedDrill(drill);
        setPracticeItems([...drill.words, ...drill.sentences]);
        setCurrentStep(0);
        setSkippedCount(0);
    };

    const handleResult = (isCorrect: boolean, transcript: string, skipped: boolean = false) => {
        if (skipped) {
            setSkippedCount(prev => prev + 1);
        }

        if (isCorrect) {
            // Auto advance after short delay
            setTimeout(() => {
                if (currentStep < practiceItems.length - 1) {
                    setCurrentStep(currentStep + 1);
                } else {
                    // Drill Complete
                    completeDrill(skipped);
                }
            }, 1500);
        }
    };

    const completeDrill = async (lastItemSkipped: boolean) => {
        if (selectedDrill) {
            // Calculate score
            // If last item was skipped, it's already counted in state update? 
            // State updates are async, so let's be careful.
            // Actually, handleResult calls setSkippedCount, but completeDrill is called in timeout.
            // The state *should* be updated by then? No, closure might capture old state?
            // Let's pass the final skipped count explicitly or use functional update if possible, 
            // but completeDrill needs the value.
            // Better: calculate final skipped count.

            const finalSkippedCount = lastItemSkipped ? skippedCount + 1 : skippedCount;
            const totalItems = practiceItems.length;
            const score = Math.round(((totalItems - finalSkippedCount) / totalItems) * 100);

            await updateDrillProgress(selectedDrill.id, score);
            loadDrills(); // Refresh progress
            setSelectedDrill(null); // Go back to list
        }
    };

    const playReference = (text: string) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.9;
        window.speechSynthesis.speak(utterance);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
            </div>
        );
    }

    if (selectedDrill) {
        const currentText = practiceItems[currentStep];
        const isSentence = currentStep >= selectedDrill.words.length;
        const progress = ((currentStep) / practiceItems.length) * 100;

        return (
            <div className="min-h-screen bg-gray-50 py-12 px-4">
                <div className="max-w-3xl mx-auto">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <Button variant="ghost" onClick={() => setSelectedDrill(null)} className="gap-2">
                            <ArrowLeft className="w-4 h-4" /> Back to Drills
                        </Button>
                        <div className="text-sm font-medium text-gray-500">
                            {currentStep + 1} / {practiceItems.length}
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-12">
                        <div
                            className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${progress}%` }}
                        />
                    </div>

                    {/* Practice Card */}
                    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                        <div className="p-12 text-center">
                            <span className="inline-block px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 text-sm font-bold uppercase tracking-wider mb-6">
                                {isSentence ? "Challenge Sentence" : "Practice Word"}
                            </span>

                            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-8 tracking-tight">
                                {currentText}
                            </h2>

                            <div className="flex justify-center mb-12">
                                <Button
                                    variant="outline"
                                    onClick={() => playReference(currentText)}
                                    className="rounded-full px-6 py-2 gap-2 hover:bg-gray-50"
                                >
                                    <Volume2 className="w-5 h-5 text-emerald-600" />
                                    Listen to Reference
                                </Button>
                            </div>

                            <PronunciationRecorder
                                targetText={currentText}
                                onResult={handleResult}
                            />
                        </div>

                        <div className="bg-gray-50 p-6 border-t border-gray-100 text-center text-sm text-gray-500">
                            Tip: {selectedDrill.description}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-12">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Pronunciation Lab</h1>
                        <p className="text-gray-500 mt-2">Master difficult sounds and improve your clarity.</p>
                    </div>
                    <Button variant="outline" onClick={() => window.location.href = '/dashboard'}>
                        Dashboard
                    </Button>
                </div>

                {error && (
                    <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600">
                        {error}
                    </div>
                )}

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {drills.map((drill) => {
                        const userProgress = drill.userProgress[0];
                        const isCompleted = userProgress?.completed;
                        const score = userProgress?.score || 0;
                        const missedWords = score < 100;

                        return (
                            <div
                                key={drill.id}
                                className={cn(
                                    "bg-white p-8 rounded-3xl border transition-all hover:shadow-lg group cursor-pointer relative overflow-hidden",
                                    isCompleted ? "border-emerald-200 bg-emerald-50/30" : "border-gray-100 hover:border-emerald-200"
                                )}
                                onClick={() => startDrill(drill)}
                            >
                                {isCompleted && (
                                    <div className="absolute top-4 right-4 text-emerald-500">
                                        <CheckCircle className="w-6 h-6" />
                                    </div>
                                )}

                                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6 text-xl font-bold group-hover:scale-110 transition-transform">
                                    {drill.phoneme.split('-')[0]}
                                </div>

                                <h3 className="text-xl font-bold text-gray-900 mb-2">{drill.label}</h3>
                                <p className="text-gray-500 text-sm mb-6 line-clamp-2">{drill.description}</p>

                                {isCompleted && missedWords && (
                                    <div className="mb-4 inline-flex items-center px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-medium">
                                        Words missed - Try Again
                                    </div>
                                )}

                                <div className="flex items-center text-emerald-600 font-medium text-sm group-hover:translate-x-1 transition-transform">
                                    {isCompleted ? "Practice Again" : "Start Practice"} <ChevronRight className="w-4 h-4 ml-1" />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
