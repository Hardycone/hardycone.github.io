import type { Metadata } from "next";
import { Jost, Merriweather } from "next/font/google";
import "./globals.css";

import { ViewModeProvider } from "./context/ViewModeContext";
import { ActiveProjectProvider } from "./context/ActiveProjectContext";
import { ThemeProvider } from "next-themes";
import Main from "./components/Main";

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

const merriweather = Merriweather({
  variable: "--font-merriweather",
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
        className={`${jost.variable} ${merriweather.variable} antialiased overflow-x-hidden h-full bg-background dark:bg-dark-background text-foreground transition-colors`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <ActiveProjectProvider>
            <ViewModeProvider>
              <Main>{children}</Main>
            </ViewModeProvider>
          </ActiveProjectProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
