import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/layout/Providers";
import { ThemeProvider } from "next-themes";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import "@ant-design/v5-patch-for-react-19";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
});

export const metadata = {
  title: "Клиника Будь Здоров - Медицинский центр",
  description: "Профессиональная забота о вашем здоровье",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
      </head>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Providers>
            <div className="flex flex-col justify-between min-h-[100vh]">
              <div>
                <Header />
                <main className="">{children}</main>
              </div>

              <Footer />
            </div>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
