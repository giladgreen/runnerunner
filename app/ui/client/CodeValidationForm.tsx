'use client';
import React, { useEffect, useState } from 'react';
// @ts-ignore
import { Circle as SpinningChip } from 'react-awesome-spinners'
import { useFormState } from 'react-dom';
import { validateCode } from '@/app/lib/actions';
import { RedButton } from '@/app/ui/client/Button';
import { useSearchParams } from 'next/navigation';
import ReactInputVerificationCode from 'react-input-verification-code';

export default function CodeValidationForm() {
  const searchParams = useSearchParams();
  const phone_number = searchParams.get('phone_number') as string;
  const [_errorMessage, dispatch] = useFormState(
    validateCode.bind(null),
    undefined,
  );
  const [pending, setPending] = useState(false);
  const [code, setCode] = useState("");


  useEffect(() => {
    if ('OTPCredential' in window) {
      const ac = new AbortController();

      navigator.credentials.get({
        // @ts-ignore
        otp: { transport: ['sms'] },
        signal: ac.signal
      }).then((otp) => {
        // @ts-ignore
        if (otp && otp.code) {
          // @ts-ignore
          setCode(otp.code);

          setTimeout(()=>{
            // @ts-ignore
            document.getElementById('send-button').click();
          }, 1200)
        }
      }).catch(err => {
        console.error(err);
      });

      return () => {
        ac.abort();
      };
    }
  }, []);

  return (
    <div className="login-form">
      <form
        action={dispatch}
        className="rtl space-y-3"
      >
        <div className="flex-1">
          <label
            className="login-form-label mb-3 mt-5 block text-xs font-medium"
            htmlFor="code"
          >
            <b>אימות קוד</b>
          </label>
          <div className="w-full">
            <div className="mt-4">
              <div className="relative ltr">
                <ReactInputVerificationCode
                  onChange={setCode}
                  value={code}
                  autoFocus
                  onCompleted={(innerCode) => {
                    if (innerCode.length === 4 && !pending && innerCode.match(/^\d{4}$/)) {
                      console.log('##### full code is:', innerCode);
                      setCode(innerCode);
                      setTimeout(()=>{
                        // @ts-ignore
                        document.getElementById('send-button').click();
                      }, 500)

                    }
                  }}
                />

                <input
                  className="login-input peer block w-full rounded-md border  py-[9px] pl-10  outline-2 hidden"
                  id="code"
                  type="text"
                  name="code"
                  placeholder="הכנס קוד בעל 4 ספרות"
                  required
                  value={code}
                  // autoComplete="one-time-code"
                />
                {/*<KeyIcon />*/}

              </div>
            </div>
            <input
              className="hidden"
              id="phone_number"
              type="text"
              name="phone_number"
              value={phone_number}
            />
          </div>
          <RedButton id="send-button" className="mt-4 w-full" aria-disabled={pending} onClick={()=>{
            setPending(true);
            setTimeout(() => {
              setPending(false);
            },2000);
          }}>
            {pending ? <SpinningChip color="var(--white)"  size={20} /> : 'שלח'}
          </RedButton>
        </div>
      </form>
    </div>
      );
      }
