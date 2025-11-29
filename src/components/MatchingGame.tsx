"use client";

import { useState, useEffect } from "react";
import { CheckCircle, RefreshCw, Trophy, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface Word {
    id: string;
    word: string;
    definition: string;
}

interface MatchingGameProps {
    words: Word[];
    onComplete: (score: number, total: number, wordIds: string[]) => void;
}

interface GameCard {
    uniqueId: string; // Unique ID for the UI element
    wordId: string;   // ID of the underlying word pair
    content: string;
    type: 'word' | 'def';
}

export default function MatchingGame({ words, onComplete }: MatchingGameProps) {
    const [cards, setCards] = useState<GameCard[]>([]);
    const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
    const [matchedWordIds, setMatchedWordIds] = useState<Set<string>>(new Set());
    const [wrongPairIds, setWrongPairIds] = useState<string[]>([]); // Store uniqueIds of wrong pair
    const [mistakes, setMistakes] = useState(0);
    const [gameCompleted, setGameCompleted] = useState(false);

    useEffect(() => {
        // Initialize game
        const newCards: GameCard[] = [];
        words.forEach(w => {
            newCards.push({ uniqueId: `${w.id}-word`, wordId: w.id, content: w.word, type: 'word' });
            newCards.push({ uniqueId: `${w.id}-def`, wordId: w.id, content: w.definition, type: 'def' });
        });

        // Shuffle
        setCards(newCards.sort(() => Math.random() - 0.5));
        setMatchedWordIds(new Set());
        setMistakes(0);
        setGameCompleted(false);
        setSelectedCardId(null);
    }, [words]);

    const handleCardClick = (card: GameCard) => {
        if (matchedWordIds.has(card.wordId)) return;
        if (wrongPairIds.length > 0) return; // Block input during error animation
        if (selectedCardId === card.uniqueId) {
            setSelectedCardId(null); // Deselect
            return;
        }

        if (!selectedCardId) {
            // First selection
            setSelectedCardId(card.uniqueId);
        } else {
            // Second selection
            const firstCard = cards.find(c => c.uniqueId === selectedCardId);
            if (!firstCard) return;

            if (firstCard.wordId === card.wordId) {
                // Match!
                const newMatched = new Set(matchedWordIds);
                newMatched.add(card.wordId);
                setMatchedWordIds(newMatched);
                setSelectedCardId(null);

                // Check win condition
                if (newMatched.size === words.length) {
                    setGameCompleted(true);
                    // Calculate score: Max possible is words.length. Deduct for mistakes. Min 0.
                    const finalScore = Math.max(0, words.length - mistakes);
                    const wordIds = words.map(w => w.id);
                    setTimeout(() => onComplete(finalScore, words.length, wordIds), 1500); // Delay to show completion state
                }
            } else {
                // No match
                setWrongPairIds([selectedCardId, card.uniqueId]);
                setMistakes(prev => prev + 1);

                // Reset after delay
                setTimeout(() => {
                    setWrongPairIds([]);
                    setSelectedCardId(null);
                }, 1000);
            }
        }
    };

    if (gameCompleted) {
        const correctPairs = words.length;
        const percentage = Math.round(((correctPairs - mistakes) / correctPairs) * 100);
        return (
            <div className="text-center p-8 bg-white rounded-3xl shadow-xl border border-emerald-100 max-w-xl mx-auto animate-in zoom-in-50">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Trophy className="w-10 h-10 text-emerald-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">All Pairs Matched!</h2>
                <p className="text-gray-600 mb-2">
                    You completed <strong>{correctPairs} pairs</strong> with {mistakes === 0 ? "no mistakes!" : `${mistakes} mistake${mistakes > 1 ? 's' : ''}`}
                </p>
                <p className="text-lg font-semibold text-emerald-600 mb-8">{percentage}% Accuracy</p>

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

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-6 flex justify-between items-center">
                <p className="text-gray-500">Match the words to their definitions</p>
                <div className="text-sm font-medium text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                    Pairs found: {matchedWordIds.size} / {words.length}
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {cards.map((card) => {
                    const isMatched = matchedWordIds.has(card.wordId);
                    const isSelected = selectedCardId === card.uniqueId;
                    const isWrong = wrongPairIds.includes(card.uniqueId);

                    return (
                        <button
                            key={card.uniqueId}
                            onClick={() => handleCardClick(card)}
                            disabled={isMatched}
                            className={cn(
                                "p-4 rounded-xl border-2 text-sm font-medium transition-all duration-200 min-h-[100px] flex items-center justify-center text-center relative overflow-hidden",
                                isMatched
                                    ? "border-emerald-200 bg-emerald-50 text-emerald-800 opacity-50 scale-95"
                                    : isSelected
                                        ? "border-blue-500 bg-blue-50 text-blue-900 shadow-md scale-105 z-10"
                                        : isWrong
                                            ? "border-red-500 bg-red-50 text-red-900 animate-shake"
                                            : "border-gray-200 bg-white hover:border-blue-200 hover:bg-gray-50 hover:shadow-sm"
                            )}
                        >
                            {isMatched && (
                                <div className="absolute inset-0 flex items-center justify-center bg-emerald-100/50">
                                    <CheckCircle className="w-8 h-8 text-emerald-600" />
                                </div>
                            )}
                            {card.content}
                        </button>
                    );
                })}
            </div>

            <style jsx global>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both;
        }
      `}</style>
        </div>
    );
}
