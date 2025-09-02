import { Inter } from "next/font/google";
import "../globals.css";
import { Providers } from "@/components/layout/Providers";
import { ThemeProvider } from "next-themes";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import "@ant-design/v5-patch-for-react-19";
import { Toaster } from "react-hot-toast";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { useTranslations } from 'next-intl';

const inter = Inter({
  subsets: ["latin", "cyrillic"],
});

export async function generateMetadata({ params: { locale } }) {
  const messages = (await import(`../../../messages/${locale}.json`)).default;
  const t = messages.Layout;

  return {
    title: t.title,
    description: t.description
  };
}

export default async function RootLayout({ children, params: { locale } }) {
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
      </head>
      <body className={`${inter.className} antialiased`}>
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <Providers>
              <div className="flex flex-col justify-between min-h-[100vh]">
                <div>
                  <Toaster />
                  <Header />
                  <main className="">{children}</main>
                </div>
                <Footer />
              </div>
            </Providers>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}