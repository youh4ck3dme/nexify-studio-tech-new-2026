import React from "react"
import type { Metadata, Viewport } from 'next'
import { Instrument_Sans, Instrument_Serif, JetBrains_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { CookieConsent } from '@/components/legal/cookie-consent'
import { RouteProgress } from '@/components/navigation/route-progress'
import { AppToaster } from '@/components/pwa/app-toaster'
import { CustomInstallPrompt } from '@/components/pwa/custom-install-prompt'
import { ServiceWorkerRegistrar } from '@/components/pwa/service-worker-registrar'
import { ThemeProvider, ThemeScript } from '@/components/theme-provider'
import './globals.css'

const instrumentSans = Instrument_Sans({ 
  subsets: ["latin"],
  variable: '--font-instrument'
});

const instrumentSerif = Instrument_Serif({ 
  subsets: ["latin"],
  weight: "400",
  variable: '--font-instrument-serif'
});

const jetbrainsMono = JetBrains_Mono({ 
  subsets: ["latin"],
  variable: '--font-jetbrains'
});

const APP_NAME = "Nexify Studio";
const APP_DESCRIPTION =
  "Digitálne riešenia pre rast podnikania. Weby, značka a online prítomnosť.";

export const metadata: Metadata = {
  metadataBase: new URL("https://nexify-studio.tech"),
  applicationName: APP_NAME,
  title: {
    default: APP_NAME,
    template: `%s | ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Nexify',
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: 'website',
    siteName: APP_NAME,
    title: APP_NAME,
    description: APP_DESCRIPTION,
    url: 'https://nexify-studio.tech',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Nexify Studio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: APP_NAME,
    description: APP_DESCRIPTION,
    images: ['/og-image.png'],
  },
}

export const viewport: Viewport = {
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="sk" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body
        className={`${instrumentSans.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable} font-sans antialiased min-h-screen pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] px-[env(safe-area-inset-left)]`}
        suppressHydrationWarning
      >
        <ThemeProvider attribute="class" defaultTheme="dark" forcedTheme="dark" disableTransitionOnChange>
          <RouteProgress />
          {children}
          <CookieConsent />
          <ServiceWorkerRegistrar />
          <AppToaster />
          <CustomInstallPrompt />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  )
}
