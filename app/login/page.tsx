"use client";

import { useActionState, useState, useEffect } from "react";
import { loginAction, loginWithGoogleAction } from "./actions";
import { Button } from "@/components/ui/button";
import { Lock, ArrowRight } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { signInWithPopup, signInWithRedirect, getRedirectResult } from "firebase/auth";
import { auth, googleProvider, isFirebaseConfigured } from "@/lib/firebase/config";
import { toast } from "sonner";

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, null);
  const [googleError, setGoogleError] = useState<string | null>(null);
  const [isGooglePending, setIsGooglePending] = useState(false);

  const handleGoogleSignIn = async () => {
    if (!isFirebaseConfigured || !auth) {
      setGoogleError("Firebase nie je nakonfigurovaná. Pridajte premenné prostredia.");
      return;
    }

    setIsGooglePending(true);
    setGoogleError(null);

    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      const { code } = err as { code?: string };
      // If popup blocked or unsupported, fall back to redirect
      if (code === "auth/popup-blocked" || code === "auth/operation-not-supported-in-this-environment") {
        await signInWithRedirect(auth, googleProvider);
        setIsGooglePending(false);
        return; // redirect will reload the page
      }
      console.error("Google sign-in error (popup)", err);
      const firebaseError = err as { code?: string; message?: string };
      if (firebaseError.code !== "auth/popup-closed-by-user") {
        setGoogleError(firebaseError.message || "Nebolo možné prihlásiť sa cez Google.");
      }
    } finally {
      setIsGooglePending(false);
    }
  };

  // Handle redirect result (if any)
  useEffect(() => {
    if (!auth) return;
    getRedirectResult(auth)
      .then(async (result) => {
        const email = result?.user?.email;
        if (email) {
          const res = await loginWithGoogleAction(email);
          if (res.error) setGoogleError(res.error);
          else {
            toast.success("Prihlásenie úspešné!");
            window.location.href = "/crm";
          }
        }
      })
      .catch((err) => {
        console.error("Google sign-in error (redirect)", err);
        const firebaseError = err as { code?: string; message?: string };
        setGoogleError(firebaseError.message || "Prihlásenie zlyhalo.");
      });
  }, [auth]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Ambientné AMOLED podsvietenie */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="w-full max-w-sm card-lift p-8 rounded-2xl bg-card border border-border relative z-10">
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
            <Lock className="w-8 h-8 text-muted-foreground" />
          </div>
        </div>
        
        <h1 className="text-3xl font-display text-center mb-2">Autorizácia</h1>
        <p className="text-muted-foreground text-center mb-8 text-sm">
          Vyberte spôsob prihlásenia pre prístup do internej zóny.
        </p>

        {/* Google Sign-in Option */}
        <div className="space-y-4 mb-6">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isGooglePending || isPending}
            className="w-full h-12 px-4 bg-white hover:bg-white/90 text-black font-semibold rounded-xl flex items-center justify-center gap-3 transition-all cursor-pointer disabled:opacity-50"
          >
            {isGooglePending ? (
              <Spinner className="h-4 w-4 border-black/30 border-t-black" />
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
            )}
            <span>Prihlásiť sa cez Google</span>
          </button>

          {googleError && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-xs text-center font-medium">
              {googleError}
            </div>
          )}
        </div>

        <div className="relative flex items-center justify-center my-6">
          <div className="border-t border-white/10 w-full" />
          <span className="absolute bg-[#1D1D1F] px-3 text-xs text-muted-foreground uppercase font-mono">alebo kód</span>
        </div>

        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <input
              type="password"
              name="password"
              placeholder="• • • • • • • •"
              required
              disabled={isPending || isGooglePending}
              className="w-full h-12 px-4 bg-background border border-border rounded-xl focus:ring-2 focus:ring-ring outline-none transition-all input-glow text-center tracking-[0.5em] text-lg disabled:opacity-50"
            />
          </div>

          {state?.error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm text-center font-medium animate-in fade-in slide-in-from-top-2">
              {state.error}
            </div>
          )}

          <Button 
            type="submit" 
            disabled={isPending || isGooglePending}
            className="w-full h-12 mt-4 btn-micro group"
          >
            {isPending ? (
              <Spinner className="mr-2 h-4 w-4" />
            ) : null}
            {isPending ? "Overujem..." : "Odomknúť prístup"}
            {!isPending && (
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
