import { lusitana } from '@/app/ui/fonts';
import Image from "next/image";

export default function RunnerLogo() {
  return (
    <div
      className={`${lusitana.className} flex flex-row items-center leading-none text-white`}
    >
      <Image
          src="/runner.png"
          width={798}
          height={738}
          alt="icon"
      />
    </div>
  );
}
