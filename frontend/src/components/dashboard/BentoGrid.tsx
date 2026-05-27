"use client";

import { motion } from "framer-motion";
import { StreakWidget } from './widgets/StreakWidget';
import { RoadmapWidget } from './widgets/RoadmapWidget';
import { FocusTimerWidget } from './widgets/FocusTimerWidget';
import { QuickNoteWidget } from './widgets/QuickNoteWidget';
import { DailyGoalsWidget } from './widgets/DailyGoalsWidget';

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
};

export const BentoGrid = () => {
    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-[minmax(180px,auto)]"
        >
            <motion.div variants={item} className="md:col-span-1 md:row-span-2">
                <StreakWidget className="h-full" />
            </motion.div>

            <motion.div variants={item} className="md:col-span-2 md:row-span-2">
                <RoadmapWidget className="h-full" />
            </motion.div>

            <motion.div variants={item} className="md:col-span-1 md:row-span-1">
                <FocusTimerWidget className="h-full" />
            </motion.div>

            <motion.div variants={item} className="md:col-span-1 md:row-span-1">
                <DailyGoalsWidget className="h-full" />
            </motion.div>

            <motion.div variants={item} className="md:col-span-4 md:row-span-1">
                <QuickNoteWidget className="h-full" />
            </motion.div>
        </motion.div>
    );
};
