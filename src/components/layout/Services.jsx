"use client";
import { useGetServicesQuery } from "@/store/api";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";

export default function Services() {
  const { data } = useGetServicesQuery();
  const t = useTranslations("Services");
  let services = data?.slice(0, 3);
  const pathName = usePathname();
  console.log(pathName);

  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div className={`${theme === "dark" ? "bg-black" : "bg-white"} py-16`}>
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-4 text-blue-700">
          {t("title")}
        </h2>
        <p className="text-center text-gray-500 max-w-2xl mx-auto mb-12">
          {t("description")}
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
              <Image
                src={service.image}
                alt={service.title}
                className="w-full h-48 object-cover"
                width={1000}
                height={1000}
                priority
              />
              <div className="p-6">
                <h3 className="text-xl font-bold mb-3 text-blue-700">
                  {service.title}
                </h3>
                {pathName == "/tj" && (
                  <p className="text-gray-500 mb-4">{service.description.tj}</p>
                )}
                {pathName == "/ru" && (
                  <p className="text-gray-500 mb-4">{service.description.ru}</p>
                )}
                {pathName == "/en" && (
                  <p className="text-gray-500 mb-4">{service.description.en}</p>
                )}
                <Link
                  href={`/services/${service.id}`}
                  className="text-blue-600 font-medium hover:text-blue-800 flex items-center"
                >
                  {t("details")}
                  <i className="fas fa-arrow-right ml-2"></i>
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
            {t("allServices")}
          </Link>
        </div>
      </div>
    </div>
  );
}
