"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  useDeleteReviewMutation,
  useGetAppointmentsQuery,
  useGetDoctorsQuery,
  useGetReviewsQuery,
  useUpdateReviewMutation,
} from "@/store/api";
import toast from "react-hot-toast";
import { getCurrentUser, getCurrentUserId } from "@/utils/auth";
import Image from "next/image";
import image from "@/assets/home/doc.png";
import { useTheme } from "next-themes";
import { Input, Modal } from "antd";
import { X } from "lucide-react";
import Link from "next/link";
import { useTranslations } from 'next-intl';

export default function MyReviews() {
  const router = useRouter();
  const user = getCurrentUser();
  const userId = getCurrentUserId();
  const t = useTranslations('MyReviews');

  const {
    data: reviews,
    isLoading: revLoading,
    isError: revError,
    refetch,
  } = useGetReviewsQuery();
  const [updateReview] = useUpdateReviewMutation();
  const [deleteReview] = useDeleteReviewMutation();

  const { data: doctors } = useGetDoctorsQuery();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const myReviews = reviews?.filter((e) => e.patientId == userId);

  const getDoctorName = (doctorId) => {
    const doctor = doctors?.find(
      (d) => d.id.toString() === doctorId.toString()
    );
    return doctor ? doctor.name : t('unknownDoctor');
  };

  function delMyReview(id) {
    deleteReview(id);
    refetch();
  }

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [editReting, setEditReting] = useState("");
  const [editReview, setEditReview] = useState("");
  const [idx, setIdx] = useState(null);
  const [doctorId, setDoctorId] = useState(null);

  const showModal = (e) => {
    setEditReview(e.comment || "");
    setEditReting(e.rating || 5);
    setIdx(e.id);
    setDoctorId(e.doctorId);
    setIsModalOpen(true);
  };

  async function handleEdit(event) {
    event.preventDefault();
    const updated = {
      id: idx,
      doctorId: doctorId,
      patientName: user.name,
      patientId: userId,
      patientPhoneNumber: user.phoneNumber,
      rating: editReting,
      comment: editReview,
    };

    try {
      await updateReview(updated).unwrap();
      await refetch();
      toast.success(t('updateSuccess'));
    } catch (error) {
      console.error(error);
      toast.error(t('updateError'));
    }

    setIsModalOpen(false);
  }

  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  if (revLoading) {
    return (
      <p className="text-center py-20 font-semibold">{t('loading')}</p>
    );
  }
  if (revError) {
    return (
      <p className="text-center py-20 text-red-500">{t('loadingError')}</p>
    );
  }

  return (
    <div className="container mx-auto py-2 px-4">
      {myReviews?.length !== 0 && (
        <div className="flex justify-center">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className={`${
              theme === "dark" ? "bg-black" : "bg-white"
            } px-4 py-2 rounded-l-lg border border-gray-300 outline-none`}
          >
            <option value="">{t('all')}</option>
            <option value="5">5</option>
            <option value="4">4</option>
            <option value="3">3</option>
            <option value="2">2</option>
            <option value="1">1</option>
          </select>
          <input
            type="text"
            placeholder={t('searchPlaceholder')}
            className="w-1/2 px-4 py-2 border border-gray-300 outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-r-lg">
            {t('searchButton')}
          </button>
        </div>
      )}
      <div className="space-y-4">
        {myReviews?.length != 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 p-5">
            {myReviews
              ?.filter(
                (e) =>
                  e.comment
                    .toLowerCase()
                    .includes(search.toLowerCase() || "") ||
                  e.patientName.toLowerCase().includes(search.toLowerCase())
              )
              .filter((e) => e.rating.toString().includes(status.toString()))
              .map((review) => (
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
                    className="text-sm text-gray-500 mt-2 hover:text-blue-500"
                  >
                    {t('doctor')}: {getDoctorName(review.doctorId)}
                  </Link>

                  <div className="text-sm pt-5 flex items-center justify-between">
                    <button
                      className="cursor-pointer"
                      onClick={() => delMyReview(review.id)}
                    >
                      {t('delete')}
                    </button>

                    <button
                      className="cursor-pointer"
                      onClick={() => showModal(review)}
                    >
                      {t('edit')}
                    </button>
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <div className="text-center w-full py-5">{t('noReviews')}</div>
        )}
      </div>
      {isModalOpen && (
        <div
          style={{ backdropFilter: "blur(6px)" }}
          className={`fixed inset-0 flex items-center justify-center  ${
            theme === "dark"
              ? "bg-[rgba(0,0,0,0.3)]"
              : "bg-[rgba(255,255,255,0.5)]"
          }`}
        >
          <form
            onSubmit={handleEdit}
            className={`w-[250px] lg:w-[400px] ${
              theme === "dark" ? "bg-black" : "bg-white"
            } rounded-2xl shadow p-5`}
          >
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-medium">{t('editReview')}</h1>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="cursor-pointer"
              >
                <X />
              </button>
            </div>

            <div className="flex flex-col gap-2 py-5">
              <input
                type="text"
                className="border rounded p-1.5"
                value={editReview}
                onChange={(e) => setEditReview(e.target.value)}
                placeholder={t('reviewPlaceholder')}
              />
              <select
                value={editReting}
                onChange={(e) => setEditReting(e.target.value)}
                className={`${
                  theme === "dark" ? "bg-black" : "bg-white"
                } px-4 py-2 rounded-l-lg border border-gray-300 outline-none p-1.5`}
              >
                <option value="5">5</option>
                <option value="4">4</option>
                <option value="3">3</option>
                <option value="2">2</option>
                <option value="1">1</option>
              </select>
            </div>
            <div className="flex items-center justify-end gap-3">
              <button
                className="border px-3 rounded hover:text-blue-400"
                type="button"
                onClick={() => setIsModalOpen(false)}
              >
                {t('cancel')}
              </button>
              <button
                className="border px-3 rounded hover:bg-blue-500 bg-blue-600 text-white border-blue-600"
                type="submit"
              >
                {t('ok')}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}