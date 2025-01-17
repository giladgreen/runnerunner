import Image from 'next/image';
import SignUpButton from '@/app/ui/client/SignUpButton';
import { fetchFeatureFlags } from '@/app/lib/data';
import SignInForm from '@/app/ui/SignInForm';

export default async function HomePage() {
  const { usePhoneValidation } = await fetchFeatureFlags();

  return (
    <main className="rtl flex min-h-screen flex-col p-6 general-page">
      <div className="mt-4 flex grow flex-col gap-4 md:flex-row">

        <div
          className="flex flex-col justify-center gap-6 px-6 py-10 md:w-2/5 md:px-20 general-form-wrapper"
        >
          <Image
            src="/logo.png"
            width={400}
            height={400}
            className="block md:hidden general-form-logo"
            alt="runner"
          />
          <SignInForm usePhoneValidation={usePhoneValidation} />
        </div>
        <div className="flex items-center justify-center p-6 md:w-3/5 md:px-28 md:py-12">
        </div>
      </div>
    </main>
  );
}
