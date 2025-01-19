import React, { ReactNode } from "react";

import { cn } from "../lib/utils";


export function AnimatedGradientText({
                                         children,
                                         className,
                                     }: {
    children: ReactNode;
    className?: string;
}) {
    const color1 = '#8fdfff1f';
    const color2 = '#8fdfff3f';
    const color3 = '#ffaa40';
    const color4 = '#9c40ff';

    return (
        <div
            className={cn(
                `group relative mx-auto flex max-w-fit flex-row items-center justify-center rounded-2xl bg-white/40 px-4 py-1.5  font-medium shadow-[inset_0_-8px_10px_${color1}] backdrop-blur-sm transition-shadow duration-500 ease-out [--bg-size:300%] hover:shadow-[inset_0_-5px_10px_${color2}] dark:bg-black/40`,
                className,
            )}>
            <div
                className={`absolute inset-0 block h-full w-full animate-gradient bg-gradient-to-r from-[${color3}]/50 via-[${color4}]/50 to-[${color3}]/50 bg-[length:var(--bg-size)_100%] p-[1px] ![mask-composite:subtract] [border-radius:inherit] [mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)]`}
            />
            <span
                className={cn(
                    `inline animate-gradient bg-gradient-to-r from-[${color3}] via-[${color4}] to-[${color3}] bg-[length:var(--bg-size)_100%] bg-clip-text text-transparent`,
                )}
            >
             {children}
            </span>
        </div>
    );
}
