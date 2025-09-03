"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useGetContactQuery } from "@/store/api";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";

export default function About() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { data: contact, isLoading, error } = useGetContactQuery();
  const t = useTranslations("About");

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  if (isLoading) return <p>{t("loading")}</p>;
  if (error) return <p>{t("error")}</p>;

  return (
    <div className={`${theme === "dark" ? "bg-gray-900" : "bg-gray-50"} py-16`}>
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2 mb-10 lg:mb-0 lg:pr-10">
            <Image
              width={500}
              height={500}
              src="https://images.unsplash.com/photo-1551076805-e1869033e561?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2032&q=80"
              alt={t("imageAlt")}
              className="rounded-lg shadow-lg w-full"
            />
          </div>
          <div className="lg:w-1/2">
            <h2 className="text-3xl font-bold mb-6 text-blue-700">
              {t("title")}
            </h2>

            <p>{t("description1")}</p>
            <p>{t("description2")}</p>
            <p>{t("description3")}</p>
            <p>{t("description4")}</p>
            <p>{t("description5")}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-4">
              <div className="flex items-start">
                <div className="bg-blue-100 p-3 rounded-full mr-4">
                  <i className={`fas fa-user-md text-blue-600 text-xl`}></i>
                </div>
                <div>
                  <h4 className="font-bold text-blue-700">
                    {t("feature1Title")}
                  </h4>
                  <p className="text-gray-500 text-sm">
                    {t("feature1Description")}
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-blue-100 p-3 rounded-full mr-4">
                  <i className={`fas fa-flask text-blue-600 text-xl`}></i>
                </div>
                <div>
                  <h4 className="font-bold text-blue-700">
                    {t("feature2Title")}
                  </h4>
                  <p className="text-gray-500 text-sm">
                    {t("feature2Description")}
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-blue-100 p-3 rounded-full mr-4">
                  <i className={`fas fa-heart text-blue-600 text-xl`}></i>
                </div>
                <div>
                  <h4 className="font-bold text-blue-700">
                    {t("feature3Title")}
                  </h4>
                  <p className="text-gray-500 text-sm">
                    {t("feature3Description")}
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-blue-100 p-3 rounded-full mr-4">
                  <i
                    className={`fas fa-calendar-check text-blue-600 text-xl`}
                  ></i>
                </div>
                <div>
                  <h4 className="font-bold text-blue-700">
                    {t("feature4Title")}
                  </h4>
                  <p className="text-gray-500 text-sm">
                    {t("feature4Description")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
