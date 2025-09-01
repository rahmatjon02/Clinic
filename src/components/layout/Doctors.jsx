// components/layout/Doctors.jsx
"use client";
import Link from "next/link";
import { useGetDoctorsQuery } from "@/store/api";
import Image from "next/image";
import image from "../../assets/home/doc.png";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function Doctors() {
  const { data: doctors = [], isLoading, isError } = useGetDoctorsQuery();

  const doctorSlice = doctors?.slice(0, 3) || [];

  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  if (isLoading) return <p className="text-center py-10">Загрузка врачей...</p>;
  if (isError)
    return (
      <p className="text-center py-10 text-red-500">Ошибка загрузки врачей</p>
    );

  return (
    <div className={`${theme === "dark" ? "bg-black" : "bg-white"} py-16`}>
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-4 text-blue-900">
          Наши врачи
        </h2>
        <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
          Профессионалы с большим опытом работы
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
                    sizes="100vw"
                    style={{ objectFit: "cover" }}
                    className="smooth-transition"
                  />
                </div>
              </div>
              <div className="p-6 text-center">
                <h3 className="text-xl font-bold mb-1 text-blue-900">
                  {doc.name}
                </h3>
                <p className="text-gray-600 mb-3">{doc.specialization}</p>
                <p className="text-sm text-gray-500 mb-4">
                  {doc.experience} лет опыта
                </p>
                <div className="flex justify-center gap-3">
                  <Link
                    href={`/doctors/${doc.id}`}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full text-sm smooth-transition"
                  >
                    Профиль
                  </Link>
                  <Link
                    href={`/booking/${doc.id}`}
                    className="border border-blue-600 text-blue-600 px-4 py-2 rounded-full text-sm smooth-transition"
                  >
                    Записаться
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
            Все врачи
          </Link>
        </div>
      </div>
    </div>
  );
}
