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


    return (<div className="pe_signin_button" style={{ borderRadius: 8, backgroundColor: "rgb(37, 137, 254)" }} data-client-id="17886847141747406972"></div>
    );
}
