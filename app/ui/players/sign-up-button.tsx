'use client';

import {useEffect} from "react";

export default function SignUpButton() {
    const goTo = (jsonLocation:string)=>{
        window.location.href = `/signup?user_json_url=${jsonLocation}`;
    }
    useEffect(() => {
        // Load the external script
        const script = document.createElement('script');
        script.src = "https://www.phone.email/sign_in_button_v1.js";
        script.async = true;
        // @ts-ignore
        document.querySelector('.pe_signin_button').appendChild(script);
        // @ts-ignore
        window.phoneEmailListener = function(userObj) {
            goTo(userObj.user_json_url);
        };

        return () => {
            // @ts-ignore
            window.phoneEmailListener = null;
        };
    }, []);

    setTimeout(()=>{
        try {
            if (document) {
                // @ts-ignore
                document.querySelector('.pe_signin_button > button').innerHTML = "Sign Up";
                // @ts-ignore
                document.querySelector('.pe_signin_button > button').style.backgroundColor = "rgb(37, 137, 254)";
                // @ts-ignore
                document.querySelector('.pe_signin_button > button').style.borderRedius = 4;

            }
        } catch (e) {
            console.log(e)
        }

    },2000);

    return (<div className="pe_signin_button" data-client-id="17886847141747406972"></div>
    );
}
