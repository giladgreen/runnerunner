type ErrorType = "AccessDenied" | "AdapterError" | "CallbackRouteError" | "ErrorPageLoop" | "EventError" | "InvalidCallbackUrl" | "CredentialsSignin" | "InvalidEndpoints" | "InvalidCheck" | "JWTSessionError" | "MissingAdapter" | "MissingAdapterMethods" | "MissingAuthorize" | "MissingSecret" | "OAuthAccountNotLinked" | "OAuthCallbackError" | "OAuthProfileParseError" | "SessionTokenError" | "OAuthSignInError" | "EmailSignInError" | "SignOutError" | "UnknownAction" | "UnsupportedStrategy" | "InvalidProvider" | "UntrustedHost" | "Verification" | "MissingCSRF" | "AccountNotLinked" | "DuplicateConditionalUI" | "MissingWebAuthnAutocomplete" | "WebAuthnVerificationError" | "ExperimentalFeatureNotEnabled";

export declare class AuthError extends Error {
    /** The error type. Used to identify the error in the logs. */
    type: ErrorType;
    cause?: Record<string, unknown> & {
        err?: Error;
    };
    constructor(message?: string | Error | ErrorOptions, errorOptions?: ErrorOptions);
}

export default function NextAuth() {
    return{
        auth: ()=>{},
        signIn: ()=>{},
        signOut: ()=>{}

    }
}


