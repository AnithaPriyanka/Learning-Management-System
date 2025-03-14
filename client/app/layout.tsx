'use client';
import type { Metadata } from "next";
import "./globals.css";
import { Poppins } from "next/font/google";
import { Josefin_Sans } from "next/font/google";
import { ThemeProvider } from "./utils/theme-provider";
import { Toaster } from "react-hot-toast";
import { Providers } from "./Provider";
import { SessionProvider } from "next-auth/react";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";
import Loader from "./components/Loader/Loader"
import socketIO from "socket.io-client";
import { useEffect } from "react";
const ENDPOINT = process.env.NEXT_PUBLIC_SOCKET_SERVER_URI || "";
const socketId = socketIO(ENDPOINT,{ transports:["websocket"]});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-Poppins",
});

const josefin = Josefin_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-Josefin",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${poppins.variable} ${josefin.variable} !bg-light-background dark:bg-dark-background duration-300`} suppressHydrationWarning
      >
        <Providers>
          <SessionProvider>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            <Custom>
              {children}
            </Custom>
            <Toaster position="top-center" reverseOrder={false} />
          </ThemeProvider>
          </SessionProvider>
        </Providers>
      </body>
    </html>
  );
}


const Custom : React.FC<{children:React.ReactNode}> = ({children}) =>{
  const {isLoading} = useLoadUserQuery({});
  useEffect(()=>{
    socketId.on("connection",()=>{})
  })
  return (
    <>
    {isLoading?<Loader/>:<>{children}</>}
    </>
  )
}
