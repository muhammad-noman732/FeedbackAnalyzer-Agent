'use client';
import { motion, Variants } from 'framer-motion';
import React from 'react';
import { cn } from '@/lib/utils';
type AnimatedGroupProps = {
    children: React.ReactNode;
    className?: string;
    variants?: {
        container?: Variants;
        item?: Variants;
    };
};

export const AnimatedGroup = ({ children, className, variants }: AnimatedGroupProps) => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
        ...variants?.container,
    };
    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
        ...variants?.item,
    };
    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className={cn(className)}
        >
            {React.Children.map(children, (child) => {
                if (!React.isValidElement(child)) return child;
                return (
                    <motion.div variants={itemVariants}>
                        {child}
                    </motion.div>
                );
            })}
        </motion.div>
    );
};
