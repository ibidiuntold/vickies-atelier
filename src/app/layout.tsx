import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ContactWidgetLoader } from "@/components/ContactWidgetLoader";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Vickie's Atelier — bespoke. bridal. ready-to-wear.",
  description:
    "Vickie's Atelier — a contemporary fashion house for bespoke, bridal and ready-to-wear elegance.",
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' }
    ],
    apple: [
      { url: '/images/logo/logo-white.png', sizes: '180x180', type: 'image/png' }
    ]
  }
};

// Inline script to apply theme class before first paint (FOUC prevention)
// Must be a string to use with dangerouslySetInnerHTML
const themeInitScript = `
(function() {
  try {
    var theme = localStorage.getItem('theme-preference');
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (theme === 'system' || !theme) {
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark');
      }
    }
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <ThemeProvider>
          <Header />
          <main>{children}</main>
          <Footer />
          <ContactWidgetLoader />
        </ThemeProvider>
      </body>
    </html>
  );
}
