"use client";
import { useGetDoctorsQuery } from "@/store/api";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import image from "@/assets/home/doc.png";
import { useLocale, useTranslations } from "next-intl";

const ServiceById = () => {
  const { id } = useParams();
  const { data: doctors = [], isLoading, isError } = useGetDoctorsQuery();
  const [search, setSearch] = useState("");
  const locale = useLocale();
  const t = useTranslations("ServiceDoctors");
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const allDoctors = useMemo(
    () => doctors?.filter((e) => e.specializationId == id),
    [doctors, id]
  );

  if (!mounted) return null;
  if (isLoading) return <p className="text-center py-10">{t("loading")}</p>;
  if (isError)
    return <p className="text-center py-10 text-red-500">{t("error")}</p>;

  return (
    <div>
      <div className="flex justify-center m-6">
        <input
          type="text"
          placeholder={t("searchPlaceholder")}
          className="w-1/2 px-4 py-2 rounded-l-lg border border-gray-300 outline-none"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-r-lg">
          {t("searchButton")}
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
                <p className="text-gray-600 mb-3">
                  {doc.specialization?.[locale] || doc.specialization?.ru || ""}
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  {doc.experience} {t("yearsExperience")}
                </p>
                <div className="flex justify-center gap-3">
                  <Link
                    href={`/doctors/${doc.id}`}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full text-sm smooth-transition"
                  >
                    {t("profileButton")}
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
    </div>
  );
};

export default ServiceById;
