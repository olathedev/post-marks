import Image from "next/image";
import { signInWithGoogle } from "./actions";

const Auth = () => {
  return (
    <main className="relative mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center overflow-hidden px-6 sm:px-10">

      <div className="flex">
        <Image src="/logo.svg" alt="" height={50} width={50} className="size-10 sm:size-[50px]" />
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:gap-6">
        <h1 className="flex items-center gap-3 text-center font-hemis text-5xl leading-[0.80] sm:gap-6 sm:text-8xl">
          Words as
          <span className="size-10 starburst shrink-0 sm:size-16"></span>
        </h1>
        <h1 className="flex items-center gap-3 text-center font-hemis text-5xl leading-[0.80] sm:gap-6 sm:text-8xl">
          <span className="size-10 starburst shrink-0 sm:size-16"></span>
          Memories.
        </h1>
      </div>

      <form action={signInWithGoogle} className="mt-8 w-full sm:mt-10">
        <button
          type="submit"
          className="flex w-full items-center justify-center gap-3 rounded-full bg-black px-6 py-3.5 text-sm font-medium text-white transition-colors hover:bg-gray-900 active:bg-gray-800 sm:py-4 sm:text-base"
        >
          <svg viewBox="0 0 24 24" width="20" height="20">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          Continue with Google
        </button>
      </form>

      <p className="mt-6 max-w-xs text-center text-[11px] text-gray-400 sm:mt-8 sm:text-xs">
        By continuing, you agree to our{" "}
        <a href="/terms" className="underline hover:text-gray-600">Terms of Service</a>{" "}
        and{" "}
        <a href="/privacy" className="underline hover:text-gray-600">Privacy Policy</a>.
      </p>
    </main>
  );
};

export default Auth;
