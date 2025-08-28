"use client";
import Link from "next/link";
import { useGetDoctorsQuery } from "@/store/api";
import Image from "next/image";
import image from "../../assets/home/doc.png";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function Contact() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div className={`${theme === "dark" ? "bg-black" : "bg-white"} py-16`}>
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row">
          <div className="lg:w-1/2 mb-10 lg:mb-0 lg:pr-10">
            <h2 className="text-3xl font-bold mb-6 text-blue-900">Контакты</h2>

            <div className="mb-8">
              <div className="flex items-start mb-6">
                <div className="bg-blue-100 p-3 rounded-full mr-4">
                  <i className="fas fa-map-marker-alt text-blue-600 text-xl"></i>
                </div>
                <div>
                  <h4 className="font-bold text-blue-900 mb-1">Адрес</h4>
                  <p className="text-gray-600">Москва, ул. Лесная, д. 15</p>
                </div>
              </div>

              <div className="flex items-start mb-6">
                <div className="bg-blue-100 p-3 rounded-full mr-4">
                  <i className="fas fa-phone-alt text-blue-600 text-xl"></i>
                </div>
                <div>
                  <h4 className="font-bold text-blue-900 mb-1">Телефон</h4>
                  <p className="text-gray-600">+7 (495) 123-45-67</p>
                  <p className="text-gray-600">+7 (495) 765-43-21</p>
                </div>
              </div>

              <div className="flex items-start mb-6">
                <div className="bg-blue-100 p-3 rounded-full mr-4">
                  <i className="fas fa-envelope text-blue-600 text-xl"></i>
                </div>
                <div>
                  <h4 className="font-bold text-blue-900 mb-1">Email</h4>
                  <p className="text-gray-600">info@klinikabudzdorov.ru</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-blue-100 p-3 rounded-full mr-4">
                  <i className="fas fa-clock text-blue-600 text-xl"></i>
                </div>
                <div>
                  <h4 className="font-bold text-blue-900 mb-1">Режим работы</h4>
                  <p className="text-gray-600">Пн-Пт: 8:00 - 20:00</p>
                  <p className="text-gray-600">Сб-Вс: 9:00 - 18:00</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-blue-900 mb-4">
                Мы в социальных сетях
              </h4>
              <div className="flex space-x-4">
                <Link
                  href="#"
                  className="bg-blue-100 p-3 rounded-full text-blue-600 hover:bg-blue-200 smooth-transition"
                >
                  <i className="fab fa-vk text-xl"></i>
                </Link>
                <Link
                  href="#"
                  className="bg-blue-100 p-3 rounded-full text-blue-600 hover:bg-blue-200 smooth-transition"
                >
                  <i className="fab fa-telegram text-xl"></i>
                </Link>
                <Link
                  href="#"
                  className="bg-blue-100 p-3 rounded-full text-blue-600 hover:bg-blue-200 smooth-transition"
                >
                  <i className="fab fa-whatsapp text-xl"></i>
                </Link>
                <Link
                  href="#"
                  className="bg-blue-100 p-3 rounded-full text-blue-600 hover:bg-blue-200 smooth-transition"
                >
                  <i className="fab fa-instagram text-xl"></i>
                </Link>
              </div>
            </div>
          </div>

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
