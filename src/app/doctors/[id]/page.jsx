// app/doctors/[id]/page.jsx
"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import {
  useGetDoctorByIdQuery,
  useGetClinicByIdQuery,
  useGetReviewsQuery,
  useAddReviewMutation,
} from "@/store/api";
import useUser from "@/hooks/useUser";

export default function DoctorPage({ params }) {
  const { id: doctorId } = use(params);
  let user = useUser();

  const {
    data: doctor,
    isLoading: dLoading,
    isError: dError,
  } = useGetDoctorByIdQuery(doctorId);

  const clinicId = doctor?.clinicId;
  const { data: clinic } = useGetClinicByIdQuery(clinicId, { skip: !clinicId });

  const { data: allReviews = [] } = useGetReviewsQuery();

  useEffect(() => {
    reviews;
  }, [allReviews]);

  const reviews = allReviews.filter(
    (r) => String(r.doctorId) === String(doctorId)
  );

  const [addReview, { isLoading: addReviewLoading }] = useAddReviewMutation();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  if (dLoading) return <p className="text-center py-20">Загрузка профиля...</p>;
  if (dError || !doctor)
    return <p className="text-center py-20 text-red-500">Доктор не найден</p>;

  const handleAddReview = async (e) => {
    e.preventDefault();
    try {
      await addReview({
        doctorId: Number(doctorId),
        patientName: user.userName,
        patientId: user.id,
        rating: rating,
        comment,
      }).unwrap();
      setComment("");
      setRating(5);
      alert("Спасибо за отзыв!");
    } catch (err) {
      console.error(err);
      alert("Ошибка при отправке отзыва");
    }
  };

  return (
    <div className="container mx-auto py-12 px-6">
      <div className="grid md:grid-cols-3 gap-8">
        {/* Левый блок: основная карточка */}
        <div className="md:col-span-2 bg-white shadow-md rounded-xl p-6">
          <div className="flex items-center gap-6">
            <img
              src={`https://i.pravatar.cc/120?u=${doctor.id}`}
              alt={doctor.name}
              className="w-28 h-28 rounded-full object-cover"
            />
            <div>
              <h1 className="text-2xl font-bold">{doctor.name}</h1>
              <p className="text-gray-600">{doctor.specialization}</p>
              <p className="text-sm text-gray-400">
                {doctor.experience} лет опыта
              </p>
              <p className="mt-2 text-lg font-semibold text-blue-600">
                {doctor.price} TJS
              </p>
            </div>
          </div>

          {/* Описание */}
          <div className="mt-6">
            <h3 className="font-semibold mb-2">Описание</h3>
            <p className="text-gray-600">
              {doctor.bio ||
                "Профессионал в своей области. Запись по удобному расписанию."}
            </p>
          </div>

          {/* Клиника */}
          {clinic && (
            <div className="mt-6">
              <h3 className="font-semibold mb-2">Клиника</h3>
              <p className="text-gray-700">{clinic.name}</p>
              <p className="text-gray-500 text-sm">{clinic.address}</p>
              <p className="text-gray-500 text-sm">{clinic.phone}</p>
              <Link
                href={`/clinics/${clinic.id}`}
                className="text-blue-600 mt-2 inline-block"
              >
                Смотреть клинику →
              </Link>
            </div>
          )}

          {/* Отзывы */}
          <div className="mt-6">
            <h3 className="font-semibold mb-2">Отзывы ({reviews.length})</h3>
            <div className="space-y-4">
              {reviews.length === 0 && (
                <p className="text-gray-500">Пока нет отзывов.</p>
              )}
              {reviews.map((r) => (
                <div key={r.id} className="border rounded p-3 bg-gray-50">
                  <div className="flex justify-between">
                    <div className="text-sm font-medium">
                      Пользователь{" "}
                      <span className="font-bold">{r.patientName}</span>
                    </div>
                    <div className="text-yellow-500">
                      {"★".repeat(r.rating)}
                    </div>
                  </div>
                  {r.comment && (
                    <p className="mt-2 text-gray-700">{r.comment}</p>
                  )}
                </div>
              ))}
            </div>

            {/* Форма отзыва */}
            <form onSubmit={handleAddReview} className="mt-4 space-y-2">
              <div className="flex items-center gap-2">
                <label className="text-sm">Оценка:</label>
                <select
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                  className="border px-2 py-1 rounded"
                >
                  <option value={5}>5</option>
                  <option value={4}>4</option>
                  <option value={3}>3</option>
                  <option value={2}>2</option>
                  <option value={1}>1</option>
                </select>
              </div>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full border rounded px-3 py-2"
                placeholder="Ваш отзыв"
              />
              <div>
                <button
                  type="submit"
                  disabled={addReviewLoading}
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Отправить отзыв
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Правый блок: расписание и кнопка записи */}
        <aside className="bg-white shadow-md rounded-xl p-6">
          <h4 className="font-semibold mb-3">Запись на приём</h4>
          <p className="text-gray-600 mb-4">
            Выберите дату и время в форме записи
          </p>
          <Link
            href={`/booking/${doctor.id}`}
            className="block w-full text-center bg-green-600 text-white px-4 py-3 rounded-lg"
          >
            Записаться к {doctor.name}
          </Link>

          {/* Небольшой блок доступных времён (пример) */}
          <div className="mt-6">
            <h5 className="font-medium mb-2">Популярные слоты</h5>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-gray-100 rounded">09:00</span>
              <span className="px-3 py-1 bg-gray-100 rounded">10:00</span>
              <span className="px-3 py-1 bg-gray-100 rounded">11:00</span>
              <span className="px-3 py-1 bg-gray-100 rounded">14:00</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
