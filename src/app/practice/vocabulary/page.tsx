"use client";

import { useState, useEffect } from "react";
import MatchingGame from "@/components/MatchingGame";
import { Book, Brain, Trophy, Flame, ChevronRight, LayoutGrid, Layers, Shuffle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Flashcard from "@/components/Flashcard";
import VocabularyQuiz from "@/components/VocabularyQuiz";
import { getWords, updateProgress, getUserStats, getSublistProgress, updateGameProgress } from "@/app/actions/vocabulary";

export default function VocabularyPage() {
    const [mode, setMode] = useState<"dashboard" | "flashcards" | "quiz" | "matching">("dashboard");
    const [sublist, setSublist] = useState(1);
    const [words, setWords] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState({ totalReviewed: 0, mastered: 0, learning: 0 });
    const [currentIndex, setCurrentIndex] = useState(0);
    const [sublistProgress, setSublistProgress] = useState<Record<number, { total: number, reviewed: number, mastered: number }>>({});

    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadStats();
        loadSublistProgress();
    }, []);

    const loadStats = async () => {
        const data = await getUserStats();
        if (data) setStats(data);
    };

    const loadSublistProgress = async () => {
        const data = await getSublistProgress();
        setSublistProgress(data);
    };

    const startSession = async (selectedMode: "flashcards" | "quiz" | "matching", selectedSublist: number) => {
        setLoading(true);
        setError(null);
        setSublist(selectedSublist);
        try {
            // For matching game, we might want fewer words or specific logic, but 10-12 is good for a grid
            const limit = selectedMode === "matching" ? 12 : 20;
            const fetchedWords = await getWords(selectedSublist, limit);
            if (fetchedWords.length === 0) {
                setError("No words found for this level yet. Please try another level.");
                return;
            }
            setWords(fetchedWords);
            setMode(selectedMode);
            setCurrentIndex(0);
        } catch (error) {
            console.error("Failed to load words", error);
            setError("Failed to load words. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleFlashcardResult = async (familiarity: number) => {
        const currentWord = words[currentIndex];
        await updateProgress(currentWord.id, familiarity);

        if (currentIndex < words.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            // Session complete
            loadStats();
            setMode("dashboard");
        }
    };

    const handleQuizComplete = async (score: number, total: number, wordIds: string[]) => {
        await updateGameProgress(wordIds);
        loadStats();
        loadSublistProgress();
        // Could show a summary modal here before going back to dashboard
        // For now, let the Quiz component handle the "Play Again" or we reset
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <a href="/dashboard" className="text-sm text-gray-500 hover:text-emerald-600 flex items-center gap-1 transition-colors">
                                <ChevronRight className="w-4 h-4 rotate-180" /> Back to Dashboard
                            </a>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900">Vocabulary Builder</h1>
                        <p className="text-gray-500 mt-1">Master the Academic Word List for IELTS</p>
                    </div>
                    {mode !== "dashboard" && (
                        <Button variant="outline" onClick={() => setMode("dashboard")}>
                            Exit Session
                        </Button>
                    )}
                </div>

                {error && (
                    <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 flex items-center gap-2">
                        <span className="font-bold">Error:</span> {error}
                        <button onClick={() => setError(null)} className="ml-auto text-sm underline">Dismiss</button>
                    </div>
                )}

                {mode === "dashboard" && (
                    <div className="space-y-8">
                        {/* Stats Overview */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                                    <Book className="w-8 h-8" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 font-medium">Words Reviewed</p>
                                    <p className="text-2xl font-bold text-gray-900">{stats.totalReviewed}</p>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                                    <Trophy className="w-8 h-8" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 font-medium">Mastered</p>
                                    <p className="text-2xl font-bold text-gray-900">{stats.mastered}</p>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                                <div className="p-3 bg-orange-50 text-orange-600 rounded-xl">
                                    <Flame className="w-8 h-8" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 font-medium">Learning</p>
                                    <p className="text-2xl font-bold text-gray-900">{stats.learning}</p>
                                </div>
                            </div>
                        </div>

                        {/* Sublist Selection */}
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {/* Flashcards Card */}
                            <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 hover:border-emerald-200 transition-all group">
                                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <Layers className="w-8 h-8" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">Flashcards</h2>
                                <p className="text-gray-500 mb-8">Learn new words with definitions, examples, and audio pronunciation.</p>

                                <div className="space-y-3">
                                    <p className="text-sm font-medium text-gray-700">Select Difficulty (Sublist):</p>
                                    <div className="flex flex-wrap gap-2">
                                        {[1, 2, 3, 4, 5].map((num) => {
                                            const hasProgress = sublistProgress[num]?.reviewed > 0;
                                            return (
                                                <button
                                                    key={num}
                                                    onClick={() => startSession("flashcards", num)}
                                                    className="px-4 py-2 rounded-lg border border-gray-200 hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-700 transition-all text-sm font-medium flex items-center gap-1.5"
                                                >
                                                    Level {num}
                                                    {hasProgress && <span className="text-emerald-600">✓</span>}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            {/* Quiz Card */}
                            <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 hover:border-purple-200 transition-all group">
                                <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <Brain className="w-8 h-8" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">Quiz Challenge</h2>
                                <p className="text-gray-500 mb-8">Test your knowledge with multiple-choice questions and track your score.</p>

                                <div className="space-y-3">
                                    <p className="text-sm font-medium text-gray-700">Select Difficulty (Sublist):</p>
                                    <div className="flex flex-wrap gap-2">
                                        {[1, 2, 3, 4, 5].map((num) => {
                                            const hasProgress = sublistProgress[num]?.reviewed > 0;
                                            return (
                                                <button
                                                    key={num}
                                                    onClick={() => startSession("quiz", num)}
                                                    className="px-4 py-2 rounded-lg border border-gray-200 hover:border-purple-500 hover:bg-purple-50 hover:text-purple-700 transition-all text-sm font-medium flex items-center gap-1.5"
                                                >
                                                    Level {num}
                                                    {hasProgress && <span className="text-purple-600">✓</span>}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            {/* Matching Game Card */}
                            <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 hover:border-blue-200 transition-all group">
                                <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <Shuffle className="w-8 h-8" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">Matching Game</h2>
                                <p className="text-gray-500 mb-8">Match words to their definitions in this memory-style game.</p>

                                <div className="space-y-3">
                                    <p className="text-sm font-medium text-gray-700">Select Difficulty (Sublist):</p>
                                    <div className="flex flex-wrap gap-2">
                                        {[1, 2, 3, 4, 5].map((num) => {
                                            const hasProgress = sublistProgress[num]?.reviewed > 0;
                                            return (
                                                <button
                                                    key={num}
                                                    onClick={() => startSession("matching", num)}
                                                    className="px-4 py-2 rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-700 transition-all text-sm font-medium flex items-center gap-1.5"
                                                >
                                                    Level {num}
                                                    {hasProgress && <span className="text-blue-600">✓</span>}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {mode === "flashcards" && (
                    <div className="max-w-2xl mx-auto">
                        <div className="mb-8 flex items-center justify-between text-sm text-gray-500">
                            <span>Sublist {sublist}</span>
                            <span>{currentIndex + 1} / {words.length}</span>
                        </div>

                        {words[currentIndex] ? (
                            <Flashcard
                                key={words[currentIndex].id}
                                {...words[currentIndex]}
                                onResult={handleFlashcardResult}
                            />
                        ) : (
                            <div className="text-center p-8">
                                <p>No words available.</p>
                                <Button onClick={() => setMode("dashboard")} className="mt-4">Go Back</Button>
                            </div>
                        )}
                    </div>
                )}

                {mode === "quiz" && (
                    <VocabularyQuiz
                        words={words}
                        onComplete={handleQuizComplete}
                    />
                )}

                {mode === "matching" && (
                    <MatchingGame
                        words={words}
                        onComplete={handleQuizComplete}
                    />
                )}
            </div>
        </div>
    );
}
