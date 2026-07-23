"use client";

import { useActionState } from "react";
import { loginAction } from "./actions";
import { ArrowRight } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, null);

  return (
    <div className="min-h-screen w-full bg-white flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[720px] bg-gradient-to-br from-neutral-100 via-white to-neutral-50 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-sm relative z-10">
        <div className="flex flex-col items-center mb-10">
          <div className="w-20 h-20 rounded-[22px] bg-black flex items-center justify-center shadow-xl shadow-black/10 mb-6">
            <span className="text-white text-3xl font-semibold tracking-tight">KE</span>
          </div>
          <h1 className="text-2xl font-semibold text-neutral-900 tracking-tight">KEstudio</h1>
          <p className="text-neutral-500 text-sm mt-1">Interná administrácia</p>
        </div>

        <div className="backdrop-blur-xl bg-white/70 border border-black/5 rounded-3xl shadow-[0_8px_40px_rgba(0,0,0,0.08)] p-8">
          <form action={formAction} className="space-y-4" noValidate>
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-xs font-medium text-neutral-500 pl-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                name="email"
                autoComplete="email"
                placeholder="admin@kestudio.sk"
                required
                disabled={isPending}
                className="w-full h-12 px-4 bg-white border border-neutral-200 rounded-xl outline-none transition-all text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10 disabled:opacity-50"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="password" className="text-xs font-medium text-neutral-500 pl-1">
                Heslo
              </label>
              <input
                id="password"
                type="password"
                name="password"
                autoComplete="current-password"
                placeholder="••••••••"
                required
                disabled={isPending}
                className="w-full h-12 px-4 bg-white border border-neutral-200 rounded-xl outline-none transition-all text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10 disabled:opacity-50"
              />
            </div>

            {state?.error && (
              <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-red-600 text-sm text-center font-medium animate-in fade-in slide-in-from-top-2">
                {state.error}
              </div>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="w-full h-12 mt-2 bg-black hover:bg-neutral-800 text-white rounded-xl flex items-center justify-center gap-2 font-medium transition-all disabled:opacity-60 cursor-pointer"
            >
              {isPending ? <Spinner className="h-4 w-4" /> : null}
              {isPending ? "Prihlasovanie..." : "Sign In"}
              {!isPending && <ArrowRight className="w-4 h-4" />}
            </button>

            <div className="text-center pt-1">
              <button
                type="button"
                disabled
                aria-disabled="true"
                title="Momentálne nedostupné"
                className="text-xs text-neutral-300 cursor-not-allowed select-none"
              >
                Zabudnuté heslo?
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
