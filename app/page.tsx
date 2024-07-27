import Image from 'next/image';
import SignUpButton from '@/app/ui/client/SignUpButton';
import { fetchFeatureFlags } from '@/app/lib/data';
import SignInForm from '@/app/ui/SignInForm';

export default async function HomePage() {
  const { usePhoneValidation } = await fetchFeatureFlags();

  return (
    <main className="flex min-h-screen flex-col p-6">
      <div className="mt-4 flex grow flex-col gap-4 md:flex-row">
        <div
          className="rtl flex flex-col justify-center gap-6 rounded-lg bg-gray-50 px-6 py-10 md:w-2/5 md:px-20"
          style={{ textAlign: 'right' }}
        >
          <Image
            src="/runner-big.png"
            width={1000}
            height={760}
            className="block md:hidden"
            alt="runner"
          />
          <div>
            <SignInForm />
          </div>
          <div style={{ marginTop: 20 }}>{`עוד אין לך חשבון?`}</div>
          <div>
            <SignUpButton usePhoneValidation={usePhoneValidation} />
          </div>
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
