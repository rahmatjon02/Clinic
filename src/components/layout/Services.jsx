"use client";
import { useGetServicesQuery } from "@/store/api";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function Services() {
  const { data } = useGetServicesQuery();

  let services = data?.slice(0, 3);

  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div className={`${theme === "dark" ? "bg-black" : "bg-white"} py-16`}>
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-4 text-blue-900">
          Наши услуги
        </h2>
        <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
          Мы предлагаем широкий спектр медицинских услуг для всей семьи
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services?.map((service) => (
            <div
              key={service.id}
              className={`${
                theme === "dark"
                  ? "bg-black shadow-md shadow-gray-900"
                  : "bg-white shadow-md"
              } rounded-lg shadow-md overflow-hidden service-card smooth-transition`}
            >
              <img
                src={service.image}
                alt={service.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold mb-3 text-blue-900">
                  {service.title}
                </h3>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <Link
                  href="#"
                  className="text-blue-600 font-medium hover:text-blue-800 flex items-center"
                >
                  Подробнее <i className="fas fa-arrow-right ml-2"></i>
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/services"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full smooth-transition"
          >
            Все услуги
          </Link>
        </div>
      </div>
    </div>
  );
}
