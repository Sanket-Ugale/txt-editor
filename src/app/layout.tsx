import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "TextEditor Pro - Modern Rich Text Editing",
  description: "A modern rich text editor with advanced formatting, theme switching, and multiple export formats",
  keywords: ["text editor", "rich text", "document editor", "notes", "writing", "markdown", "formatting"],
  authors: [{ name: "TextEditor Team" }],
  viewport: "width=device-width, initial-scale=1",
  openGraph: {
    title: "TextEditor Pro",
    description: "A modern rich text editor with advanced formatting and export options",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TextEditor Pro",
    description: "A modern rich text editor with advanced formatting and export options",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning className={inter.variable}>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
