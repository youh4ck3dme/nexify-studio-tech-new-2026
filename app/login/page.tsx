"use client";

import { useActionState } from "react";
import { loginAction } from "./actions";
import { Button } from "@/components/ui/button";
import { Lock, ArrowRight } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, null);

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
          Zadajte bezpečnostný kód pre prístup do internej zóny.
        </p>

        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <input
              type="password"
              name="password"
              placeholder="• • • • • • • •"
              required
              disabled={isPending}
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
            disabled={isPending}
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
