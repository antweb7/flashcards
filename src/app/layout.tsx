import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Spanish Flashcards",
  description: "Learn Spanish vocabulary by topic with multiple-choice quizzes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-[#121212]">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex min-h-screen`}
      >
        <header className="fixed top-0 left-0 right-0 z-40 flex sm:hidden h-14 items-center border-b border-[#333] bg-[#000] px-4">
          <a
            href="/topics"
            className="text-base font-bold text-white"
          >
            Flashcards
          </a>
        </header>
        <aside className="hidden sm:flex w-[240px] shrink-0 flex-col border-r border-[#333] bg-[#000] p-4">
          <a
            href="/topics"
            className="text-xl font-bold text-white hover:text-[#1db954] transition-colors"
          >
            Flashcards
          </a>
          <nav className="mt-8 space-y-2">
            <a
              href="/topics"
              className="block rounded-md px-3 py-2 text-[#b3b3b3] hover:bg-[#282828] hover:text-white transition-colors"
            >
              Topics
            </a>
          </nav>
        </aside>
        <main className="flex-1 min-w-0 pt-14 sm:pt-0">{children}</main>
      </body>
    </html>
  );
}
