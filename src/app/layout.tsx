import type { Metadata } from "next";
import "./globals.css";
import { Roboto_Serif } from "next/font/google";
import { cn } from "@/utils/cn";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const robotoSerif = Roboto_Serif({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Todo List",
  description: "Todo List",
  icons: {
    icon: "/next.svg",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background antialiased",
          robotoSerif.className
        )}
      >
        <ToastContainer />
        {children}
      </body>
    </html>
  );
}