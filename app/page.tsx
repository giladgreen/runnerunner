import { ArrowRightIcon } from '@heroicons/react/24/outline';

import Link from 'next/link';
import Image from 'next/image';
import SignUpButton from "@/app/ui/players/sign-up-button";
import {fetchFeatureFlags} from "@/app/lib/data";

export default async function HomePage() {
    const {  usePhoneValidation} = await fetchFeatureFlags();

  return (
    <main className="flex min-h-screen flex-col p-6">
      <div className="rounded-lg bg-blue-500 p-4 md:h-32 top-header homepage-top-header">
         Runner Runner
      </div>
      <div className="mt-4 flex grow flex-col gap-4 md:flex-row">
          <div className="flex flex-col justify-center gap-6 rounded-lg bg-gray-50 px-6 py-10 md:w-2/5 md:px-20">
              <Image
                  src="/runner-big.png"
                  width={1000}
                  height={760}
                  className="block md:hidden"
                  alt="runner"
              />
              <div className={`text-xl text-gray-800 md:text-3xl md:leading-normal homepage-welcome`}>
                  <strong>Welcome </strong>
              </div>
              <div>
                  <Link
                      href="/signin"
                      className="flex items-center gap-5 self-start rounded-lg bg-blue-400 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700 md:text-base"
                  >
                      <span>Sign In</span><ArrowRightIcon className="w-5 md:w-6"/>
                  </Link>
              </div>
              <div  className="block md:hidden" style={{ marginTop:20}}>
                  {`Don't have an account yet?`}
              </div>
              <div >
                  <SignUpButton usePhoneValidation={usePhoneValidation}/>
              </div>
              <Image
                  src="/runner-exp.png"
                  width={1000}
                  height={760}
                  className="block md:hidden"
                  alt="runner"
              />
          </div>
          <div className="flex items-center justify-center p-6 md:w-3/5 md:px-28 md:py-12">
              <Image
                  src="/runner-big.png"
                  width={1000}
                  height={760}
                  className="hidden md:block"
                  alt="runner"
              />

        </div>
      </div>
    </main>
  );
}
