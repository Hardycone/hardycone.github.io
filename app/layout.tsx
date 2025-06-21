import type { Metadata } from "next";
import { Jost, Besley } from "next/font/google";
import "./globals.css";

import { ViewModeProvider } from "./context/ViewModeContext";
import { ActiveProjectProvider } from "./context/ActiveProjectContext";
import { ThemeProvider } from "next-themes";
import { LightingProvider } from "./context/LightingContext";

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
        className={`${jost.variable} ${besley.variable} antialiased overflow-x-hidden h-full bg-background dark:bg-dark-background text-foreground dark:text-dark-foreground transition-colors`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <ActiveProjectProvider>
            <ViewModeProvider>
              <LightingProvider>
                <MainContent>{children}</MainContent>
              </LightingProvider>
            </ViewModeProvider>
          </ActiveProjectProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
