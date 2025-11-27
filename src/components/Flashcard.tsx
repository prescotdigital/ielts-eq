"use client";

import { useState, useEffect } from "react";
import { Volume2, RotateCw, Check, X, BookOpen, GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";

interface FlashcardProps {
    id: string;
    word: string;
    definition: string;
    example: string;
    partOfSpeech: string;
    onResult: (familiarity: number) => void;
    className?: string;
}

export default function Flashcard({
    id,
    word,
    definition,
    example,
    partOfSpeech,
    onResult,
    className,
}: FlashcardProps) {
    const [isFlipped, setIsFlipped] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);

    const speak = (e: React.MouseEvent) => {
        e.stopPropagation();
        if ('speechSynthesis' in window) {
            setIsSpeaking(true);
            const utterance = new SpeechSynthesisUtterance(word);
            utterance.rate = 0.8;
            utterance.lang = 'en-US';
            utterance.onend = () => setIsSpeaking(false);
            window.speechSynthesis.speak(utterance);
        }
    };

    const handleFlip = () => {
        setIsFlipped(!isFlipped);
    };

    const handleResult = (e: React.MouseEvent, familiarity: number) => {
        e.stopPropagation();
        onResult(familiarity);
        setIsFlipped(false); // Reset for next card if needed, though parent usually handles switching
    };

    return (
        <div
            className={cn("perspective-1000 w-full max-w-xl mx-auto h-96 cursor-pointer group", className)}
            onClick={handleFlip}
        >
            <div className={cn(
                "relative w-full h-full transition-all duration-500 transform-style-3d shadow-xl rounded-3xl",
                isFlipped ? "rotate-y-180" : ""
            )}>

                {/* Front of Card */}
                <div className="absolute inset-0 w-full h-full backface-hidden bg-white rounded-3xl p-8 flex flex-col items-center justify-center border-2 border-emerald-100 hover:border-emerald-300 transition-colors">
                    <div className="absolute top-6 right-6">
                        <button
                            onClick={speak}
                            className={cn(
                                "p-3 rounded-full bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-all",
                                isSpeaking && "animate-pulse ring-2 ring-emerald-400"
                            )}
                        >
                            <Volume2 className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="text-sm font-medium text-emerald-600 mb-4 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full">
                        {partOfSpeech}
                    </div>

                    <h2 className="text-5xl font-bold text-gray-900 mb-8 text-center">
                        {word}
                    </h2>

                    <div className="text-gray-400 text-sm flex items-center gap-2 mt-auto">
                        <RotateCw className="w-4 h-4" />
                        Click to flip
                    </div>
                </div>

                {/* Back of Card */}
                <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 bg-gradient-to-br from-emerald-50 to-white rounded-3xl p-8 flex flex-col border-2 border-emerald-200">
                    <div className="flex-1 flex flex-col justify-center">
                        <div className="mb-6">
                            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                                <BookOpen className="w-4 h-4" /> Definition
                            </h3>
                            <p className="text-xl text-gray-900 font-medium leading-relaxed">
                                {definition}
                            </p>
                        </div>

                        <div>
                            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                                <GraduationCap className="w-4 h-4" /> Example
                            </h3>
                            <p className="text-lg text-gray-700 italic leading-relaxed">
                                "{example}"
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-4 gap-2 mt-6 pt-6 border-t border-emerald-100">
                        <button
                            onClick={(e) => handleResult(e, 0)}
                            className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-red-50 text-red-400 hover:text-red-600 transition-colors"
                        >
                            <X className="w-6 h-6" />
                            <span className="text-xs font-medium">Again</span>
                        </button>
                        <button
                            onClick={(e) => handleResult(e, 1)}
                            className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-orange-50 text-orange-400 hover:text-orange-600 transition-colors"
                        >
                            <div className="w-6 h-6 font-bold flex items-center justify-center border-2 border-current rounded-full text-xs">Hd</div>
                            <span className="text-xs font-medium">Hard</span>
                        </button>
                        <button
                            onClick={(e) => handleResult(e, 2)}
                            className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-blue-50 text-blue-400 hover:text-blue-600 transition-colors"
                        >
                            <div className="w-6 h-6 font-bold flex items-center justify-center border-2 border-current rounded-full text-xs">Gd</div>
                            <span className="text-xs font-medium">Good</span>
                        </button>
                        <button
                            onClick={(e) => handleResult(e, 3)}
                            className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-emerald-50 text-emerald-400 hover:text-emerald-600 transition-colors"
                        >
                            <Check className="w-6 h-6" />
                            <span className="text-xs font-medium">Easy</span>
                        </button>
                    </div>
                </div>
            </div>

            <style jsx global>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
        </div>
    );
}
