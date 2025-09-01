"use client";
import Link from "next/link";
import { useGetContactQuery } from "@/store/api";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function Contact() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const { data: contact, isLoading, error } = useGetContactQuery();

  if (isLoading) return <p>Загрузка...</p>;
  if (error) return <p>Ошибка загрузки</p>;

  if (!mounted) return null;

  return (
    <div className={`${theme === "dark" ? "bg-black" : "bg-white"} py-16`}>
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row">
          {/* Левая часть */}
          <div className="lg:w-1/2 mb-10 lg:mb-0 lg:pr-10">
            <h2 className="text-3xl font-bold mb-6 text-blue-900">Контакты</h2>

            <div className="mb-8">
              {/* Адрес */}
              <div className="flex items-start mb-6">
                <div className="bg-blue-100 p-3 w-10 h-10 flex items-center justify-center rounded-full mr-4">
                  <i className="fas fa-map-marker-alt text-blue-600 text-xl"></i>
                </div>
                <div>
                  <h4 className="font-bold text-blue-900 mb-1">Адрес</h4>
                  <p className="text-gray-600">{contact.address}</p>
                </div>
              </div>

              {/* Телефон */}
              <div className="flex items-start mb-6">
                <div className="bg-blue-100 p-3 w-10 h-10 flex items-center justify-center rounded-full mr-4">
                  <i className="fas fa-phone-alt text-blue-600 text-xl"></i>
                </div>
                <div>
                  <h4 className="font-bold text-blue-900 mb-1">Телефон</h4>
                  {contact.phones.map((phone, i) => (
                    <p key={i} className="text-gray-600">
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
                  <h4 className="font-bold text-blue-900 mb-1">Email</h4>
                  <p className="text-gray-600">{contact.email}</p>
                </div>
              </div>

              {/* Режим работы */}
              <div className="flex items-start">
                <div className="bg-blue-100 p-3 w-10 h-10 flex items-center justify-center rounded-full mr-4">
                  <i className="fas fa-clock text-blue-600 text-xl"></i>
                </div>
                <div>
                  <h4 className="font-bold text-blue-900 mb-1">Режим работы</h4>
                  <p className="text-gray-600">{contact.schedule.weekdays}</p>
                  <p className="text-gray-600">{contact.schedule.weekend}</p>
                </div>
              </div>
            </div>

            {/* Соцсети */}
            <div>
              <h4 className="font-bold text-blue-900 mb-4">
                Мы в социальных сетях
              </h4>
              <div className="flex space-x-4">
                <Link
                  href={contact.socials.vk}
                  className="bg-blue-100 p-3 w-10 h-10 flex items-center justify-center rounded-full text-blue-600 hover:bg-blue-200"
                >
                  <i className="fab fa-vk text-xl"></i>
                </Link>
                <Link
                  href={contact.socials.telegram}
                  className="bg-blue-100 p-3 w-10 h-10 flex items-center justify-center rounded-full text-blue-600 hover:bg-blue-200"
                >
                  <i className="fab fa-telegram text-xl"></i>
                </Link>
                <Link
                  href={contact.socials.whatsapp}
                  className="bg-blue-100 p-3 w-10 h-10 flex items-center justify-center rounded-full text-blue-600 hover:bg-blue-200"
                >
                  <i className="fab fa-whatsapp text-xl"></i>
                </Link>
                <Link
                  href={contact.socials.instagram}
                  className="bg-blue-100 p-3 w-10 h-10 flex items-center justify-center rounded-full text-blue-600 hover:bg-blue-200"
                >
                  <i className="fab fa-instagram text-xl"></i>
                </Link>
              </div>
            </div>
          </div>

          {/* Правая часть */}
          <div className="lg:w-1/2">
            <div
              className={`${
                theme === "dark"
                  ? "bg-black shadow-md shadow-gray-800"
                  : "bg-white shadow-md"
              } p-6 rounded-lg shadow-md h-full`}
            >
              <h3 className="text-xl font-bold mb-6 text-blue-900">
                Как нас найти
              </h3>
              <div className="h-96 bg-gray-200 rounded-lg overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2955.122502045906!2d68.77387947694283!3d38.5597724717776!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38b54f7e58a2b3af%3A0x2a3fbe92b52c85ad!2z0JTQvtC80LDRgNGF0L3QsNC70YzRgdC60LjQuSDQkNC90YLQtdC60YHQutCw0Y8!5e0!3m2!1sru!2s!4v1724792469876!5m2!1sru!2s"
                  className="w-full h-full"
                  style={{ border: 0 }}
                  allowFullScreen=""
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
