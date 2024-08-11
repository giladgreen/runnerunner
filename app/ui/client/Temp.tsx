'use client';
import {getDayOfTheWeek} from "@/app/lib/clientDateUtils";

export function Temp() {
  return (
    <div>
      {(new Date()).getDate()}, {getDayOfTheWeek()},
      {(new Date()).getHours()}: {(new Date()).getMinutes()}
    </div>
  );
}
