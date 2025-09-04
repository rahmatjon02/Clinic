"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useGetContactQuery } from "@/store/api";
import Image from "next/image";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import img from "@/assets/home/logoClinic.png";

export default function About() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { data: contact, isLoading, error } = useGetContactQuery();
  const t = useTranslations("About");
  const tc = useTranslations("Contact"); // для переводов блока контактов
  const locale = useLocale();

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  if (isLoading) return <p>{t("loading")}</p>;
  if (error) return <p>{t("error")}</p>;

  return (
    <div className={`${theme === "dark" ? "bg-gray-800" : "bg-gray-50"} py-16`}>
      <div className="container mx-auto px-4">
        {/* about секция */}
        <div className="flex flex-col lg:flex-row items-center mb-16">
          <div className="lg:w-1/2 mb-10 lg:mb-0 lg:pr-10">
            <Image
              width={500}
              height={500}
              src={img}
              alt={t("imageAlt")}
              className="rounded-lg shadow-lg w-full"
            />
          </div>
          <div className="lg:w-1/2">
            <h2 className="text-3xl font-bold mb-6 text-blue-700">
              {t("title")}
            </h2>

            <p>{t("description1")}</p>
            <p>{t("description2")}</p>
            <p>{t("description3")}</p>
            <p>{t("description4")}</p>
            <p>{t("description5")}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-4">
              {/* features */}
              {/* ... твои 4 блока как были ... */}
            </div>
          </div>
        </div>

        {/* contact секция */}
        <div className="flex flex-col lg:flex-row">
          {/* Левая часть */}
          <div className="lg:w-1/2 mb-10 lg:mb-0 lg:pr-10">
            <h2 className="text-3xl font-bold mb-6 text-blue-700">
              {tc("title")}
            </h2>

            <div className="mb-8">
              {/* Адрес */}
              <div className="flex items-start mb-6">
                <div className="bg-blue-100 p-3 w-10 h-10 flex items-center justify-center rounded-full mr-4">
                  <i className="fas fa-map-marker-alt text-blue-600 text-xl"></i>
                </div>
                <div>
                  <h4 className="font-bold text-blue-700 mb-1">
                    {tc("address")}
                  </h4>
                  <p className="text-gray-400">
                    {tc("street")} {contact.address[locale]}
                  </p>
                </div>
              </div>

              {/* Телефон */}
              <div className="flex items-start mb-6">
                <div className="bg-blue-100 p-3 w-10 h-10 flex items-center justify-center rounded-full mr-4">
                  <i className="fas fa-phone-alt text-blue-600 text-xl"></i>
                </div>
                <div>
                  <h4 className="font-bold text-blue-700 mb-1">
                    {tc("phone")}
                  </h4>
                  {contact.phones.map((phone, i) => (
                    <p key={i} className="text-gray-400">
                      {phone}
                    </p>
                  ))}
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start mb-6">
                <div className="bg-blue-100 p-3 w-10 h-10 flex items-center justify-center rounded-full mr-4">
                  <i className="fas fa-envelope text-blue-600 text-xl"></i>
                </div>
                <div>
                  <h4 className="font-bold text-blue-700 mb-1">Email</h4>
                  <p className="text-gray-400">{contact.email}</p>
                </div>
              </div>

              {/* Режим работы */}
              <div className="flex items-start">
                <div className="bg-blue-100 p-3 w-10 h-10 flex items-center justify-center rounded-full mr-4">
                  <i className="fas fa-clock text-blue-600 text-xl"></i>
                </div>
                <div>
                  <h4 className="font-bold text-blue-700 mb-1">
                    {tc("workingHours")}
                  </h4>
                  <p className="text-gray-400">
                    {tc("weekdays")}: {contact.schedule.weekdays}
                  </p>
                  <p className="text-gray-400">
                    {tc("weekend")}: {contact.schedule.weekend}
                  </p>
                </div>
              </div>
            </div>

            {/* Соцсети */}
            <div>
              <h4 className="font-bold text-blue-700 mb-4">
                {tc("socialMedia")}
              </h4>
              <div className="flex space-x-4">
                <Link href={contact.socials.vk} className="social-link">
                  <i className="fab fa-vk text-xl"></i>
                </Link>
                <Link href={contact.socials.telegram} className="social-link">
                  <i className="fab fa-telegram text-xl"></i>
                </Link>
                <Link href={contact.socials.whatsapp} className="social-link">
                  <i className="fab fa-whatsapp text-xl"></i>
                </Link>
                <Link href={contact.socials.instagram} className="social-link">
                  <i className="fab fa-instagram text-xl"></i>
                </Link>
              </div>
            </div>
          </div>

          {/* Правая часть (карта) */}
          <div className="lg:w-1/2">
            <div
              className={`${
                theme === "dark"
                  ? "bg-black shadow-md shadow-gray-800"
                  : "bg-white shadow-md"
              } p-6 rounded-lg shadow-md h-full`}
            >
              <h3 className="text-xl font-bold mb-6 text-blue-700">
                {tc("findUs")}
              </h3>
              <div className="h-96 bg-gray-200 rounded-lg overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2955.122502045906!2d68.77387947694283!3d38.5597724717776!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38b54f7e58a2b3af%3A0x2a3fbe92b52c85ad!2z0JTQvtC80LDRgNGF0L3QsNC70YzRgdC60LjQuSDQkNC90YLQtdC60YHQutCw0Y8!5e0!3m2!1sru!2s!4v1724792469876!5m2!1sru!2s"
                  className="w-full h-full"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
