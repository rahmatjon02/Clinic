"use client";

import React from "react";
import { useGetReviewsQuery, useGetDoctorsQuery } from "@/store/api";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";

const Reviews = () => {
  const { data: reviews, isLoading, isError } = useGetReviewsQuery();
  const { data: doctors } = useGetDoctorsQuery();
  const t = useTranslations("Reviews");

  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  if (isLoading) return <p className="text-center">{t("loading")}</p>;
  if (isError) return <p className="text-center text-red-500">{t("error")}</p>;

  const latestReviews = reviews?.slice(-6).reverse();

  const getDoctorName = (doctorId) => {
    const doctor = doctors?.find(
      (d) => d.id.toString() === doctorId.toString()
    );
    return doctor ? doctor.name : t("unknownDoctor");
  };

  return (
    <div className={`${theme === "dark" ? "bg-black" : "bg-white"} py-16`}>
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-4 text-blue-700">
          {t("title")}
        </h2>
        <p className="text-center text-gray-400 max-w-2xl mx-auto mb-12">
          {t("subtitle")}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {latestReviews?.map((review) => (
            <div
              key={review.id}
              className={`${
                theme === "dark"
                  ? "bg-black shadow-md shadow-gray-900"
                  : "bg-white shadow-md"
              } p-6 rounded-lg`}
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                  <i className="fas fa-user text-blue-600 text-xl"></i>
                </div>
                <div>
                  <h4 className="font-bold text-blue-700">
                    {review.patientName}
                  </h4>
                  <div className="flex text-yellow-400">
                    {[...Array(review.rating || 5)].map((_, i) => (
                      <i key={i} className="fas fa-star"></i>
                    ))}
                  </div>
                </div>
              </div>
              <p className="italic">"{review.comment}"</p>
              <p className="text-sm text-gray-400 mt-2">
                {t("doctor")}: {getDoctorName(review.doctorId)}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href={"/reviews"}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full smooth-transition"
          >
            {t("allReviewsButton")}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Reviews;
