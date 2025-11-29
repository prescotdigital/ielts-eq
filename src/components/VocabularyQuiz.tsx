"use client";

import { useState, useEffect } from "react";
import { CheckCircle, XCircle, RefreshCw, Trophy, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface Word {
    id: string;
    word: string;
    definition: string;
    example: string;
    partOfSpeech: string;
}

interface VocabularyQuizProps {
    words: Word[];
    onComplete: (score: number, total: number, wordIds: string[]) => void;
}

export default function VocabularyQuiz({ words, onComplete }: VocabularyQuizProps) {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [quizCompleted, setQuizCompleted] = useState(false);

    // Generate options for current question
    const currentWord = words[currentQuestionIndex];
    const [options, setOptions] = useState<string[]>([]);

    useEffect(() => {
        if (currentWord && words.length >= 4) {
            // Get 3 random wrong definitions
            const otherWords = words.filter(w => w.id !== currentWord.id);
            const randomWrong = otherWords
                .sort(() => 0.5 - Math.random())
                .slice(0, 3)
                .map(w => w.definition);

            // Combine with correct definition and shuffle
            const allOptions = [...randomWrong, currentWord.definition]
                .sort(() => 0.5 - Math.random());

            setOptions(allOptions);
        }
    }, [currentQuestionIndex, words]);

    const handleAnswer = (option: string) => {
        if (selectedAnswer) return; // Prevent multiple clicks

        setSelectedAnswer(option);
        const correct = option === currentWord.definition;
        setIsCorrect(correct);

        if (correct) {
            setScore(score + 1);
        }

        setShowResult(true);
    };

    const nextQuestion = () => {
        setSelectedAnswer(null);
        setIsCorrect(null);
        setShowResult(false);

        if (currentQuestionIndex < words.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            setQuizCompleted(true);
            const wordIds = words.map(w => w.id);
            onComplete(score + (isCorrect ? 1 : 0), words.length, wordIds); // Add last point if correct
        }
    };

    if (quizCompleted) {
        const percentage = Math.round((score / words.length) * 100);
        return (
            <div className="text-center p-8 bg-white rounded-3xl shadow-xl border border-emerald-100 max-w-xl mx-auto">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Trophy className="w-10 h-10 text-emerald-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Quiz Complete!</h2>
                <p className="text-gray-600 mb-2">You scored <strong>{score} out of {words.length}</strong></p>
                <p className="text-lg font-semibold text-emerald-600 mb-8">{percentage}% Correct</p>

                <div className="w-full bg-gray-100 rounded-full h-4 mb-8 overflow-hidden">
                    <div
                        className="bg-emerald-500 h-full rounded-full transition-all duration-1000"
                        style={{ width: `${percentage}%` }}
                    />
                </div>

                <div className="flex gap-3">
                    <Button onClick={() => window.location.href = '/practice/vocabulary'} variant="outline" className="flex-1 py-6 text-lg">
                        Exit
                    </Button>
                    <Button onClick={() => window.location.reload()} className="flex-1 py-6 text-lg">
                        <RefreshCw className="w-5 h-5 mr-2" /> Try Again
                    </Button>
                </div>
            </div>
        );
    }

    if (!currentWord) return <div>Loading...</div>;

    return (
        <div className="max-w-2xl mx-auto">
            {/* Progress Bar */}
            <div className="mb-8 flex items-center gap-4">
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-emerald-500 transition-all duration-300"
                        style={{ width: `${((currentQuestionIndex) / words.length) * 100}%` }}
                    />
                </div>
                <span className="text-sm font-medium text-gray-500">
                    {currentQuestionIndex + 1}/{words.length}
                </span>
            </div>

            {/* Question Card */}
            <div className="bg-white rounded-3xl shadow-xl border border-emerald-100 overflow-hidden">
                <div className="p-8 text-center border-b border-gray-100 bg-emerald-50/50">
                    <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-4">
                        {currentWord.partOfSpeech}
                    </span>
                    <h2 className="text-4xl font-bold text-gray-900 mb-2">{currentWord.word}</h2>
                    <p className="text-gray-500">Select the correct definition</p>
                </div>

                <div className="p-6 space-y-3">
                    {options.map((option, idx) => (
                        <button
                            key={idx}
                            onClick={() => handleAnswer(option)}
                            disabled={!!selectedAnswer}
                            className={cn(
                                "w-full p-4 text-left rounded-xl border-2 transition-all duration-200 flex items-center justify-between group",
                                selectedAnswer === option
                                    ? option === currentWord.definition
                                        ? "border-emerald-500 bg-emerald-50 text-emerald-900"
                                        : "border-red-500 bg-red-50 text-red-900"
                                    : selectedAnswer && option === currentWord.definition
                                        ? "border-emerald-500 bg-emerald-50 text-emerald-900" // Show correct answer if wrong selected
                                        : "border-gray-100 hover:border-emerald-200 hover:bg-gray-50"
                            )}
                        >
                            <span className="text-lg">{option}</span>

                            {selectedAnswer === option && (
                                option === currentWord.definition
                                    ? <CheckCircle className="w-6 h-6 text-emerald-500" />
                                    : <XCircle className="w-6 h-6 text-red-500" />
                            )}

                            {selectedAnswer && option === currentWord.definition && selectedAnswer !== option && (
                                <CheckCircle className="w-6 h-6 text-emerald-500 opacity-50" />
                            )}
                        </button>
                    ))}
                </div>

                {/* Feedback / Next Button */}
                {showResult && (
                    <div className="p-6 bg-gray-50 border-t border-gray-100 flex items-center justify-between animate-in slide-in-from-bottom-4">
                        <div>
                            {isCorrect ? (
                                <p className="text-emerald-600 font-bold flex items-center gap-2">
                                    <CheckCircle className="w-5 h-5" /> Correct!
                                </p>
                            ) : (
                                <p className="text-red-600 font-bold flex items-center gap-2">
                                    <XCircle className="w-5 h-5" /> Incorrect
                                </p>
                            )}
                        </div>
                        <Button onClick={nextQuestion} size="lg" className="gap-2">
                            Next Word <ArrowRight className="w-4 h-4" />
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
