"use client";
import React from "react";
import Link from "next/link";
import { useGetDoctorsQuery, useGetServicesQuery } from "@/store/api";
import Image from "next/image";
import image from "@/assets/home/doc.png";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";

const AllDoctors = () => {
  const { data: doctors = [], isLoading, isError } = useGetDoctorsQuery();
  const { data: services = [], serLoading, serError } = useGetServicesQuery();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const locale = useLocale();
  const t = useTranslations("AllDoctors");

  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  if (isLoading) return <p className="text-center py-10">{t("loading")}</p>;
  if (isError)
    return <p className="text-center py-10 text-red-500">{t("error")}</p>;

  return (
    <div>
      <div className="flex justify-center m-6">
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className={`${
            theme === "dark" ? "bg-black" : "bg-white"
          } px-4 py-2 rounded-l-lg border border-gray-300 outline-none p-1.5 lg:w-30 w-22`}
        >
          <option value="">{t("allSpecialties")}</option>
          {services?.map((e) => (
            <option key={e.id} value={e.id}>
              {e.title[locale]}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder={t("searchPlaceholder")}
          className="w-1/2 px-4 py-2 border border-gray-300 outline-none"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-r-lg">
          {t("searchButton")}
        </button>
      </div>

      {doctors.length === 0 && (
        <div className="col-span-full text-center py-10">
          <p className="text-gray-500">{t("noDoctorsFound")}</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 p-5">
        {doctors
          .filter((e) =>
            e.name.toLowerCase().includes(search.toLowerCase() || "")
          )
          .filter((e) => (status == "" ? true : e.specializationId == status))
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
                    src={
                      doc.image ||
                      "https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI="
                    }
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
                  {doc.specialization[locale]}
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

export default AllDoctors;
