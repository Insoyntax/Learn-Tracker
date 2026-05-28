"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDashboardStore } from "@/store/useDashboardStore";
import { MatteCard } from "@/components/ui/MatteCard";
import { Brain, Plus, Trash2, ArrowRight } from "lucide-react";
import { AddFlashcardModal } from "./AddFlashcardModal";

export default function FlashcardsPage() {
    const flashcards = useDashboardStore(s => s.flashcards);
    const reviewFlashcard = useDashboardStore(s => s.reviewFlashcard);
    const deleteFlashcard = useDashboardStore(s => s.deleteFlashcard);

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isFlipped, setIsFlipped] = useState(false);

    // Calculate due cards (nextReviewDate is in the past or today)
    const now = new Date();
    const dueCards = flashcards.filter(c => new Date(c.nextReviewDate) <= now);

    const [studyIndex, setStudyIndex] = useState(0);
    const currentCard = dueCards[studyIndex];

    const isStudyMode = dueCards.length > 0;

    const handleRating = (quality: number) => {
        if (!currentCard) return;

        // Review the card in the global global store
        reviewFlashcard(currentCard.id, quality);

        // Reset flip state and move to next card
        setIsFlipped(false);
        // Wait for flip animation to finish before snapping to next card front
        setTimeout(() => {
            // Note: because we modify the global store, dueCards will re-evaluate on next render and this card will disappear from the list if its new date is future.
            // If it's still due today (e.g. interval=0), it stays.
            // But visually to cycle through, we don't necessarily need to adjust index if the array shrinks automatically.
            // Actually, because it shrinks automatically, index 0 is always the *next* card!
            setStudyIndex(0);
        }, 300);
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent flex items-center gap-3">
                        <Brain className="w-8 h-8 text-primary" />
                        Smart Recall
                    </h1>
                    <p className="text-gray-400 text-sm">Spaced Repetition Flashcards. Earn XP by reviewing.</p>
                </div>

                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="px-5 py-2.5 rounded-xl bg-primary text-white font-bold text-sm hover:hover:bg-primary/90 transition-all flex items-center gap-2 shadow-[0_0_15px_var(--primary-glow)] hover:scale-105"
                >
                    <Plus className="w-4 h-4" />
                    New Card
                </button>
            </header>

            {isStudyMode ? (
                // --- STUDY MODE ---
                <div className="flex flex-col items-center max-w-2xl mx-auto mt-12 w-full">
                    <div className="w-full flex justify-between items-center mb-6 px-2">
                        <span className="text-xs font-bold uppercase tracking-widest text-primary">Cards to Review</span>
                        <span className="text-sm font-medium text-white px-3 py-1 bg-white/10 rounded-full">{dueCards.length} left</span>
                    </div>

                    <div className="relative w-full max-w-2xl min-h-[350px] mx-auto" style={{ perspective: "1000px" }}>
                        <motion.div
                            key={currentCard?.id}
                            style={{ transformStyle: "preserve-3d" }}
                            animate={{ rotateY: isFlipped ? 180 : 0 }}
                            transition={{ type: "spring", stiffness: 200, damping: 20 }}
                            className="w-full h-full absolute inset-0 cursor-pointer"
                            onClick={() => !isFlipped && setIsFlipped(true)}
                        >
                            {/* Front of Card */}
                            <div
                                className="absolute inset-0 w-full h-full"
                                style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
                            >
                                <MatteCard
                                    className="w-full h-full p-8 flex flex-col justify-center items-center text-center border-primary/20 shadow-[0_0_30px_var(--primary-glow)] hover:border-primary/40 transition-colors"
                                >
                                    <span className="absolute top-6 left-6 px-3 py-1 bg-white/5 rounded-full text-xs font-bold text-gray-400 border border-white/5">
                                        {currentCard?.categoryId}
                                    </span>
                                    <h3 className="text-3xl font-bold text-white mb-6 leading-relaxed px-4">
                                        {currentCard?.front}
                                    </h3>
                                    {!isFlipped && (
                                        <div className="absolute bottom-6 flex items-center gap-2 text-sm text-primary font-medium animate-pulse">
                                            Click to reveal answer <ArrowRight className="w-4 h-4" />
                                        </div>
                                    )}
                                </MatteCard>
                            </div>

                            {/* Back of Card */}
                            <div
                                className="absolute inset-0 w-full h-full"
                                style={{
                                    backfaceVisibility: "hidden",
                                    WebkitBackfaceVisibility: "hidden",
                                    transform: "rotateY(180deg)"
                                }}
                            >
                                <MatteCard
                                    className="w-full h-full p-8 flex flex-col justify-center items-center text-center border-primary/20 shadow-[0_0_30px_var(--primary-glow)]"
                                >
                                    <h3 className="text-2xl font-medium text-slate-200 leading-relaxed max-w-lg mb-8">
                                        {currentCard?.back}
                                    </h3>
                                </MatteCard>
                            </div>
                        </motion.div>
                    </div>

                    {/* SRS Rating Buttons (Outside the card, only visible when flipped) */}
                    <div className="w-full max-w-2xl mx-auto mt-8 h-[72px]">
                        <AnimatePresence>
                            {isFlipped && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="flex w-full gap-3 justify-center"
                                >
                                    <button onClick={() => handleRating(1)} className="flex-1 h-14 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 text-lg font-bold transition-all hover:-translate-y-1 hover:shadow-[0_4px_20px_rgba(239,68,68,0.2)]">
                                        Again (1)
                                    </button>
                                    <button onClick={() => handleRating(3)} className="flex-1 h-14 rounded-xl bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 border border-amber-500/20 text-lg font-bold transition-all hover:-translate-y-1 hover:shadow-[0_4px_20px_rgba(245,158,11,0.2)]">
                                        Hard (3)
                                    </button>
                                    <button onClick={() => handleRating(4)} className="flex-1 h-14 rounded-xl bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20 text-lg font-bold transition-all hover:-translate-y-1 hover:shadow-[0_4px_20px_rgba(16,185,129,0.2)]">
                                        Good (4)
                                    </button>
                                    <button onClick={() => handleRating(5)} className="flex-1 h-14 rounded-xl bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border border-blue-500/20 text-lg font-bold transition-all hover:-translate-y-1 hover:shadow-[0_4px_20px_rgba(59,130,246,0.2)]">
                                        Easy (5)
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            ) : (
                // --- DECK MODE ---
                <div className="space-y-6">
                    <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium text-center">
                        🎉 All caught up for today! Add more cards or take a break.
                    </div>

                    <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500 flex items-center gap-2 mt-8">
                        Your Deck ({flashcards.length})
                    </h2>

                    {flashcards.length === 0 ? (
                        <div className="text-center py-20 border border-dashed border-white/10 rounded-2xl px-4">
                            <p className="text-gray-400">Your deck is empty. Create some flashcards to start learning!</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {flashcards.map(card => {
                                const isOverdue = new Date(card.nextReviewDate) <= now;
                                return (
                                    <MatteCard
                                        key={card.id}
                                        className="p-6 flex flex-col items-start gap-4 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:border-primary/30 transition-all group"
                                    >
                                        <div className="w-full flex justify-between items-start gap-2">
                                            <span className="px-3 py-1 bg-white/5 border border-white/5 rounded-full text-xs font-bold text-gray-400">
                                                {card.categoryId}
                                            </span>
                                            <button
                                                onClick={() => deleteFlashcard(card.id)}
                                                className="p-2 rounded-lg hover:bg-red-500/20 text-gray-500 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                                                aria-label="Delete card"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <div className="py-4 w-full flex-1 flex items-center">
                                            <p className="text-lg font-bold text-white line-clamp-3 leading-relaxed">
                                                {card.front}
                                            </p>
                                        </div>
                                        <div className="mt-auto pt-4 border-t border-white/5 text-xs flex justify-between w-full font-medium">
                                            <span className="text-slate-400">Int: {card.interval}d</span>
                                            <span className={isOverdue ? "text-amber-400" : "text-slate-400"}>
                                                Due: {new Date(card.nextReviewDate).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </MatteCard>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}

            <AnimatePresence>
                {isAddModalOpen && <AddFlashcardModal onClose={() => setIsAddModalOpen(false)} />}
            </AnimatePresence>
        </div>
    );
}
