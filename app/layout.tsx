import type { Metadata } from "next";
import { Jost, Merriweather, Roboto_Mono } from "next/font/google";
import "./globals.css";

import { ViewModeProvider } from "./context/ViewModeContext";
import { ActiveProjectProvider } from "./context/ActiveProjectContext";
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

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
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
    <html lang="en">
      <body
        className={`${jost.variable} ${merriweather.variable} ${robotoMono.variable} antialiased overflow-x-hidden bg-background text-foreground h-full`}
      >
        <ActiveProjectProvider>
          <ViewModeProvider>
            <Main>{children}</Main>
          </ViewModeProvider>
        </ActiveProjectProvider>
      </body>
    </html>
  );
}
