"use client";
import Link from "next/link";
import { useGetDoctorsQuery } from "@/store/api";
import Image from "next/image";
import image from "@/assets/home/doc.png";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useLocale, useTranslations } from 'next-intl';

export default function Doctors() {
  const { data: doctors = [], isLoading, isError } = useGetDoctorsQuery();
  const t = useTranslations('Doctors');
  const doctorSlice = doctors?.slice(0, 3) || [];
  const locale = useLocale()
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  
  if (isLoading) return <p className="text-center py-10">{t('loading')}</p>;
  if (isError)
    return (
      <p className="text-center py-10 text-red-500">{t('error')}</p>
    );

  return (
    <div className={`${theme === "dark" ? "bg-black" : "bg-white"} py-16`}>
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-4 text-blue-700">
          {t('title')}
        </h2>
        <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
          {t('subtitle')}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {doctorSlice.map((doc) => (
            <div
              key={doc.id}
              className={`${
                theme === "dark"
                  ? "bg-black shadow-md shadow-gray-900"
                  : "bg-white shadow-md"
              } rounded-lg overflow-hidden shadow-md doctor-card`}
            >
              <div className="overflow-hidden h-64">
                <div className="relative w-full h-full">
                  <Image
                    src={doc.image || image}
                    alt={doc.name}
                    fill
                    sizes="500px"
                    style={{ objectFit: "cover" }}
                    priority
                    className="smooth-transition"
                  />
                </div>
              </div>
              <div className="p-6 text-center">
                <h3 className="text-xl font-bold mb-1 text-blue-700">
                  {doc.name}
                </h3>
                <p className="mb-3">{doc.specialization[locale]}</p>
                <p className="text-sm text-gray-500 mb-4">
                  {doc.experience} {t('experience')}
                </p>
                <div className="flex justify-center gap-3">
                  <Link
                    href={`/doctors/${doc.id}`}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full text-sm smooth-transition"
                  >
                    {t('profileButton')}
                  </Link>
                  <Link
                    href={`https://t.me/rahmatjon24`}
                    target="_blank"
                    className="border border-blue-600 text-blue-600 px-4 py-2 rounded-full text-sm smooth-transition"
                  >
                    Telegram
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/allDoctors"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full smooth-transition"
          >
            {t('allDoctorsButton')}
          </Link>
        </div>
      </div>
    </div>
  );
}