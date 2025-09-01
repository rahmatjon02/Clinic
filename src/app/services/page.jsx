"use client";
import { useGetServicesQuery } from "@/store/api";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export default function Services() {
  const { data } = useGetServicesQuery();

  const [search, setSearch] = useState("");

  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div className={`${theme === "dark" ? "bg-black" : "bg-white"}`}>
      <div className="flex justify-center m-6">
        <input
          type="text"
          placeholder="Введите имя услугу"
          className="w-1/2 px-4 py-2 rounded-l-lg border border-gray-300 outline-none"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-r-lg">
          Найти
        </button>
      </div>
      <div className="container mx-auto p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {data
          ?.filter((e) =>
            e.title.toLowerCase().includes(search.toLowerCase() || "")
          )
          .map((service) => (
            <div
              key={service.id}
              className={`${
                theme === "dark" ? "bg-black" : "bg-white"
              } rounded-lg shadow-md overflow-hidden service-card smooth-transition`}
            >
              <Image
                src={service.image}
                width={500}
                height={500}
                
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
                  Врачи <i className="fas fa-arrow-right ml-2"></i>
                </Link>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
