"use client";
import { useGetDoctorsQuery } from "@/store/api";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import image from "@/assets/home/doc.png";

const serviceById = () => {
  const { id } = useParams();

  const { data: doctors = [], isLoading, isError } = useGetDoctorsQuery();

  const allDoctors = useMemo(
    () => doctors?.filter((e) => e.specializationId == id),
    [doctors]
  );

  const [search, setSearch] = useState("");

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
    <div>
      {id}

      <div className="flex justify-center m-6">
        <input
          type="text"
          placeholder="Введите имя врача"
          className="w-1/2 px-4 py-2 rounded-l-lg border border-gray-300 outline-none"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-r-lg">
          Найти
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 p-5">
        {allDoctors
          .filter((e) =>
            e.name.toLowerCase().includes(search.toLowerCase() || "")
          )
          .map((doc) => (
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
                    width={1000}
                    height={1000}
                    priority
                    className="smooth-transition object-cover"
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
                    Профиль/Записаться
                  </Link>
                  <Link
                    href={`https://t.me/rahmatjon24`} target="_blank"
                    className="border border-blue-600 text-blue-600 px-4 py-2 rounded-full text-sm smooth-transition"
                  >
                    Telegram
                  </Link>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default serviceById;
