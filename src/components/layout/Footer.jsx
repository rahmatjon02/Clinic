"use client";
import Link from "next/link";
import Image from "next/image";
import { useGetContactQuery } from "@/store/api";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useLocale, useTranslations } from 'next-intl';
import img from "@/assets/home/logoClinic.png";


export default function Footer() {
  const { data: contact, isLoading, error } = useGetContactQuery();
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const t = useTranslations('Footer');
  const locale = useLocale();

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  if (isLoading) {
    return (
      <footer className="bg-blue-900 text-white py-12 text-center">
        <p>{t('loading')}</p>
      </footer>
    );
  }

  if (error) {
    return (
      <footer className="bg-blue-900 text-white py-12 text-center">
        <p>{t('error')}</p>
      </footer>
    );
  }

  return (
    <footer
      className={`${theme === "dark" ? "bg-gray-900" : "bg-blue-900 text-white"} py-12`}
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Логотип и соцсети */}
          <div className="md:col-span-1 col-span-2">
            <Image
              src={img}
              alt={t('clinicName')}
              width={500}
              height={500}
              priority
              className="w-50 h-20 mb-4 object-cover rounded-full"
            />
            <p className="text-blue-200 mb-4">
              {t('description')}
            </p>
            {contact?.socials && (
              <div className="flex space-x-4">
                <Link
                  href={contact.socials.vk}
                  className="text-blue-200 hover:text-white"
                >
                  <i className="fab fa-vk"></i>
                </Link>
                <Link
                  href={contact.socials.telegram}
                  className="text-blue-200 hover:text-white"
                >
                  <i className="fab fa-telegram"></i>
                </Link>
                <Link
                  href={contact.socials.whatsapp}
                  className="text-blue-200 hover:text-white"
                >
                  <i className="fab fa-whatsapp"></i>
                </Link>
                <Link
                  href={contact.socials.instagram}
                  className="text-blue-200 hover:text-white"
                >
                  <i className="fab fa-instagram"></i>
                </Link>
              </div>
            )}
          </div>

          {/* Услуги */}
          <div>
            <h4 className="font-bold text-xl mb-4">{t('services')}</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-blue-200 hover:text-white">
                  {t('therapy')}
                </Link>
              </li>
              <li>
                <Link href="#" className="text-blue-200 hover:text-white">
                  {t('cardiology')}
                </Link>
              </li>
              <li>
                <Link href="#" className="text-blue-200 hover:text-white">
                  {t('neurology')}
                </Link>
              </li>
              <li>
                <Link href="#" className="text-blue-200 hover:text-white">
                  {t('ophthalmology')}
                </Link>
              </li>
              <li>
                <Link href="#" className="text-blue-200 hover:text-white">
                  {t('ultrasound')}
                </Link>
              </li>
            </ul>
          </div>

          {/* О клинике */}
          <div>
            <h4 className="font-bold text-xl mb-4">{t('aboutClinic')}</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-blue-200 hover:text-white">
                  {t('aboutUs')}
                </Link>
              </li>
              <li>
                <Link href="#" className="text-blue-200 hover:text-white">
                  {t('doctors')}
                </Link>
              </li>
              <li>
                <Link href="#" className="text-blue-200 hover:text-white">
                  {t('licenses')}
                </Link>
              </li>
              <li>
                <Link href="#" className="text-blue-200 hover:text-white">
                  {t('reviews')}
                </Link>
              </li>
              <li>
                <Link href="#" className="text-blue-200 hover:text-white">
                  {t('vacancies')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Контакты */}
          <div>
            <h4 className="font-bold text-xl mb-4">{t('contacts')}</h4>
            {contact && (
              <ul className="space-y-2">
                <li className="flex items-start">
                  <i className="fas fa-map-marker-alt mt-1 mr-2 text-blue-200"></i>
                  <span className="text-blue-200">{t('street')} {contact.address[locale]}</span>
                </li>

                {/* Несколько телефонов */}
                {contact.phones?.map((phone, idx) => (
                  <li key={idx} className="flex items-start">
                    <i className="fas fa-phone-alt mt-1 mr-2 text-blue-200"></i>
                    <span className="text-blue-200">{phone}</span>
                  </li>
                ))}

                <li className="flex items-start">
                  <i className="fas fa-envelope mt-1 mr-2 text-blue-200"></i>
                  <span className="text-blue-200">{contact.email}</span>
                </li>

                {/* Расписание */}
                {contact.schedule && (
                  <>
                    <li className="flex items-start">
                      <i className="fas fa-clock mt-1 mr-2 text-blue-200"></i>
                      <span className="text-blue-200">
                        {contact.schedule.weekdays}
                      </span>
                    </li>
                    <li className="flex items-start">
                      <i className="fas fa-clock mt-1 mr-2 text-blue-200"></i>
                      <span className="text-blue-200">
                        {contact.schedule.weekend}
                      </span>
                    </li>
                  </>
                )}
              </ul>
            )}
          </div>
        </div>

        <div className="border-t border-blue-800 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-blue-200 mb-4 md:mb-0">
            {t('copyright', { year: 2023, clinicName: t('clinicName') })}
          </p>
          <div className="flex space-x-6">
            <Link href="#" className="text-blue-200 hover:text-white">
              {t('privacyPolicy')}
            </Link>
            <Link href="#" className="text-blue-200 hover:text-white">
              {t('termsOfUse')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}