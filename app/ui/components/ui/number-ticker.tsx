"use client";

import { useEffect, useRef } from "react";
import { useInView, useMotionValue, useSpring } from "framer-motion";
import { cn } from "../lib/utils";
import {formatCurrency} from "@/app/lib/utils";


export default function NumberTicker({
  value,
  className,
  useCurrency
}: {
  value: number;
  direction?: "up" | "down";
  className?: string;
  useCurrency?: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    damping: 70,
    stiffness: 350,
  });
  const isInView = useInView(ref, { once: true, margin: "0px" });

  useEffect(() => {
    isInView &&
      setTimeout(() => {
        motionValue.set(value);
      }, 0);
  }, [motionValue, isInView, value]);

  useEffect(
    () =>
      springValue.on("change", (latest) => {
        if (ref.current) {


          if (useCurrency){
            ref.current.textContent = formatCurrency(latest);
          }else{
            ref.current.textContent = Intl.NumberFormat("en-US", {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            }).format(Number(latest.toFixed(0)));
          }

        }
      }),
    [springValue],
  );

  return (
    <span
      className={cn(
        "inline-block tabular-nums text-black dark:text-white tracking-wider",
        className,
      )}
      ref={ref}
    />
  );
}
