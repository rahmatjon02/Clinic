"use client";
import React from "react";
import Link from "next/link";
import { useGetDoctorsQuery, useGetReviewsQuery } from "@/store/api";
import Image from "next/image";
import image from "@/assets/home/doc.png";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Rewind, Star } from "lucide-react";
import { useTranslations } from "next-intl";

const ReviewsPage = () => {
  const { data: reviews = [], isLoading, isError } = useGetReviewsQuery();
  const { data: doctors } = useGetDoctorsQuery();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const t = useTranslations("AllReviews");

  const getDoctorName = (doctorId) => {
    const doctor = doctors?.find(
      (d) => d.id.toString() === doctorId.toString()
    );
    return doctor ? doctor.name : t("unknownDoctor");
  };

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
          } px-4 py-2 rounded-l-lg border border-gray-300 outline-none`}
        >
          <option value="">{t("allRatings")}</option>
          <option value="5">5</option>
          <option value="4">4</option>
          <option value="3">3</option>
          <option value="2">2</option>
          <option value="1">1</option>
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
      {reviews.length != 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 p-5">
          {reviews
            .filter(
              (e) =>
                (e.comment?.toLowerCase() || "").includes(
                  search.toLowerCase()
                ) ||
                (e.patientName?.toLowerCase() || "").includes(
                  search.toLowerCase()
                )
            )
            .filter((e) => e.rating.toString().includes(status.toString()))
            .map((review) => (
              <div
                key={review.id}
                className={`${
                  theme === "dark"
                    ? "bg-black shadow-md shadow-gray-900"
                    : "bg-white shadow-md"
                } p-6 rounded-lg `}
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                    <i className="fas fa-user text-blue-600 text-xl"></i>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-bold text-blue-900">
                      {review.patientName}
                    </h4>
                    <div className="flex text-yellow-400">
                      {[...Array(Number(review.rating))].map((_, i) => (
                        <i key={i} className="fas fa-star"></i>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 italic">"{review.comment}"</p>
                <Link
                  href={`/doctors/${review.doctorId}`}
                  className="text-sm text-gray-400 mt-2 hover:text-blue-500"
                >
                  {t("doctor")}: {getDoctorName(review.doctorId)}
                </Link>
              </div>
            ))}
        </div>
      ) : (
        <div className="text-center w-full py-5">{t("noReviews")}</div>
      )}
    </div>
  );
};

export default ReviewsPage;
