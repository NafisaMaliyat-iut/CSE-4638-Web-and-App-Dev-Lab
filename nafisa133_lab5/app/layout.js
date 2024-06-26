import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Quiz App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <nav className="bg-white/40 flex items-center justify-center">
          <div className="p-2 text-xl">
            <Link href="/" className="hover:underline font-bold ">Quizzes</Link>
            &nbsp;|&nbsp;
            <Link href="/create-quiz" className="hover:underline font-bold ">Create Quiz</Link>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
