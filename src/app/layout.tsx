import type { Metadata } from "next";
import { Inter, Poppins, Roboto_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import "../styles/animations.css"; // Add import for animations.css

// Load multiple fonts for better typography
const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter',
  display: 'swap',
});

const poppins = Poppins({
  weight: ['400', '500', '600', '700'],
  subsets: ["latin"],
  variable: '--font-poppins',
  display: 'swap',
});

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  variable: '--font-roboto-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Turbo Text Editor - Modern Rich Text Editing",
  description: "A modern rich text editor with advanced formatting, theme switching, and multiple export formats",
  keywords: ["text editor", "rich text", "document editor", "notes", "writing", "markdown", "formatting"],
  authors: [{ name: "Turbo Text Editor Team" }],
  viewport: "width=device-width, initial-scale=1",
  openGraph: {
    title: "Turbo Text Editor",
    description: "A modern rich text editor with advanced formatting and export options",
    type: "website",
    images: [{ url: "/og-image.png" }]
  },
  twitter: {
    card: "summary_large_image",
    title: "Turbo Text Editor",
    description: "A modern rich text editor with advanced formatting and export options",
    images: ["/twitter-image.png"]
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning className={`${inter.variable} ${poppins.variable} ${robotoMono.variable} scroll-smooth`}>
      <body className={`${inter.className} antialiased`}>
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
