import type { Metadata } from "next";
import { Jost, Besley } from "next/font/google";
import "./globals.css";

import { ViewModeProvider } from "./context/ViewModeContext";
import { ActiveProjectProvider } from "./context/ActiveProjectContext";
import { ThemeProvider } from "next-themes";

import MainContent from "./components/MainContent";

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

const besley = Besley({
  variable: "--font-besley",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Haichao Wang, Product Designer",
  description:
    "Haichao Wang is a Product Designer with a diverse background in research, management, and entrepreneurship",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${jost.variable} ${besley.variable} overflow-x-hidden bg-background font-serif text-foreground antialiased transition-colors dark:bg-dark-background dark:text-dark-foreground`}
      >
        {/* <svg
          viewBox="0 0 2000 2000"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute inset-0 z-10"
        >
          <filter id="noiseFilter">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.65"
              numOctaves="3"
              stitchTiles="stitch"
            />
          </filter>

          <rect width="100%" height="100%" filter="url(#noiseFilter)" />
        </svg> */}
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <ActiveProjectProvider>
            <ViewModeProvider>
              <MainContent>{children}</MainContent>
            </ViewModeProvider>
          </ActiveProjectProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
