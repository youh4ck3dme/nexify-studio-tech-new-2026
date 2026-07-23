import React from "react"
import type { Metadata, Viewport } from 'next'
import { CookieConsent } from '@/components/legal/cookie-consent'
import { RouteProgress } from '@/components/navigation/route-progress'
import { AppToaster } from '@/components/pwa/app-toaster'
import { CustomInstallPrompt } from '@/components/pwa/custom-install-prompt'
import { ServiceWorkerRegistrar } from '@/components/pwa/service-worker-registrar'
import { ThemeProvider, ThemeScript } from '@/components/theme-provider'
import { CustomCursor } from '@/components/ui/custom-cursor'
import './globals.css'


const APP_NAME = "KEstudio";
const APP_DESCRIPTION =
  "Digitálne riešenia pre rast podnikania. Weby, značka a online prítomnosť.";

export const metadata: Metadata = {
  metadataBase: new URL("https://kestudio.sk"),
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
    title: 'KEstudio',
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: 'website',
    siteName: APP_NAME,
    title: APP_NAME,
    description: APP_DESCRIPTION,
    url: 'https://kestudio.sk',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'KEstudio',
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "SoftwareApplication",
                "name": "KEstudio",
                "applicationCategory": "BusinessApplication",
                "operatingSystem": "All",
                "offers": {
                  "@type": "Offer",
                  "price": "0",
                  "priceCurrency": "EUR"
                },
                "description": "Digitálne riešenia a autonómne AI platformy pre rast podnikania."
              },
              {
                "@context": "https://schema.org",
                "@type": "Organization",
                "name": "KEstudio",
                "url": "https://kestudio.sk",
                "logo": "https://kestudio.sk/icon.png",
                "sameAs": [
                  "https://github.com/erikbabcan",
                  "https://cyber-weave-craft.lovable.app"
                ]
              }
            ])
          }}
        />
      </head>
      <body
        className="font-sans antialiased min-h-screen bg-background text-foreground pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] px-[env(safe-area-inset-left)] selection:bg-[#2997FF]/30 selection:text-white"
        suppressHydrationWarning
      >
        <ThemeProvider attribute="class" defaultTheme="dark" disableTransitionOnChange>
          <RouteProgress />
          <CustomCursor />
          {children}
          <CookieConsent />
          <ServiceWorkerRegistrar />
          <AppToaster />
          <CustomInstallPrompt />
        </ThemeProvider>
      </body>
    </html>
  )
}
