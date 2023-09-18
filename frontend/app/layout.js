import "./globals.css";
import { Mulish } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AuthProvider from "@/store/AuthProvider";
import { Toaster } from "react-hot-toast";

const mulish = Mulish({ subsets: ["latin"] });

export const metadata = {
  title: "Notes App",
  description: "This is a general purpose notes app created by Abhishek Singh",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={mulish.className}>
        <AuthProvider>
          <Toaster position="top-center" reverseOrder={false} />
          <Navbar />
          <main>{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
