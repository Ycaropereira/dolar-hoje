import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
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
  metadataBase: new URL("https://dolar-hoje.vercel.app"),
  title: "Dólar Hoje (USD/BRL) - Cotação em Tempo Real",
  description:
    "Veja o dólar hoje (USD/BRL), variação, máxima e mínima. Use o conversor USD ⇄ BRL e confira outras moedas como euro e libra.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Dólar Hoje (USD/BRL)",
    description:
      "Cotação do dólar hoje (USD/BRL) com variação, máxima e mínima, além de conversor e outras moedas.",
    type: "website",
    locale: "pt_BR",
    url: "/",
  },
  twitter: {
    card: "summary",
    title: "Dólar Hoje (USD/BRL)",
    description:
      "Cotação do dólar hoje (USD/BRL) com variação, máxima e mínima, além de conversor e outras moedas.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <footer className="mt-auto border-t border-black/5 bg-white">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-zinc-600">© {new Date().getFullYear()} Dólar Hoje</p>
            <nav className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
              <Link className="text-zinc-700 hover:underline" href="/privacidade">
                Privacidade
              </Link>
              <Link className="text-zinc-700 hover:underline" href="/termos">
                Termos
              </Link>
              <Link className="text-zinc-700 hover:underline" href="/contato">
                Contato
              </Link>
            </nav>
          </div>
        </footer>
      </body>
    </html>
  );
}
