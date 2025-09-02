"use client";

import { useTheme } from "next-themes";
import toast from "react-hot-toast";
import { getCurrentUser, getCurrentUserId } from "@/utils/auth";
import image from "@/assets/home/doc.png";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import {
  useGetDoctorByIdQuery,
  useGetReviewsQuery,
  useAddReviewMutation,
  useAddAppointmentMutation,
  useGetSchedulesQuery,
  useGetAppointmentsQuery,
} from "@/store/api";

function timeStringToMinutes(t) {
  const [hh, mm] = t.split(":").map(Number);
  return hh * 60 + mm;
}
function minutesToTimeString(m) {
  const hh = Math.floor(m / 60);
  const mm = m % 60;
  return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
}
function getDayOfWeekName(date) {
  return [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ][new Date(date).getDay()];
}
function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export default function DoctorPage() {
  const { id: doctorId } = useParams();
  const router = useRouter();
  const user = getCurrentUser();

  const {
    data: doctor,
    isLoading: dLoading,
    isError: dError,
  } = useGetDoctorByIdQuery(doctorId);

  const { data: allReviews = [] } = useGetReviewsQuery();
  const reviews = useMemo(
    () => allReviews.filter((r) => String(r.doctorId) === String(doctorId)),
    [allReviews, doctorId]
  );

  const [addReview, { isLoading: addReviewLoading }] = useAddReviewMutation();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const handleAddReview = async (e) => {
    e.preventDefault();
    try {
      await addReview({
        doctorId: Number(doctorId),
        patientName: user?.name || "",
        patientId: user?.id || getCurrentUserId(),
        patientPhoneNumber: user?.phoneNumber || "",
        rating: String(rating),
        comment,
      }).unwrap();
      setComment("");
      setRating(5);
      toast.success("Спасибо за отзыв!");
    } catch (err) {
      console.error(err);
      toast.error("Ошибка при отправке отзыва");
    }
  };

  const { data: appointments = [], refetch: refetchAppointments } =
    useGetAppointmentsQuery();
  const { data: schedulesData = [] } = useGetSchedulesQuery();
  const [addAppointment, { isLoading: adding }] = useAddAppointmentMutation();

  const [selectedDate, setSelectedDate] = useState(todayISO());
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const bookedTimesSet = useMemo(() => {
    const list = appointments.filter(
      (a) =>
        String(a.doctorId) === String(doctorId) &&
        String(a.date) === String(selectedDate)
    );
    return new Set(list.map((a) => String(a.time)));
  }, [appointments, doctorId, selectedDate]);

  const schedulesForDoctor = useMemo(
    () => schedulesData.filter((s) => String(s.doctorId) === String(doctorId)),
    [schedulesData, doctorId]
  );

  const schedulesForSelectedDay = useMemo(() => {
    const byDate = schedulesForDoctor.filter((s) => s.date === selectedDate);
    if (byDate.length) return byDate;
    const dayName = getDayOfWeekName(selectedDate);
    const byDay = schedulesForDoctor.filter((s) => {
      if (!s.dayOfWeek) return false;
      return (
        String(s.dayOfWeek).toLowerCase() === dayName.toLowerCase() ||
        String(s.dayOfWeek)
          .toLowerCase()
          .startsWith(dayName.toLowerCase().slice(0, 3))
      );
    });
    if (byDay.length) return byDay;
    return schedulesForDoctor.length ? [schedulesForDoctor[0]] : [];
  }, [schedulesForDoctor, selectedDate]);

  useEffect(() => {
    setSelectedSlot(null);

    if (!schedulesForSelectedDay || schedulesForSelectedDay.length === 0) {
      setSlots([]);
      return;
    }

    const interval = schedulesForSelectedDay[0].intervalMinutes || 30;
    const allSlots = [];
    const now = new Date();

    for (const s of schedulesForSelectedDay) {
      if (!s.startTime || !s.endTime) continue;

      const startMin = timeStringToMinutes(s.startTime);
      const endMin = timeStringToMinutes(s.endTime);
      const breakStartMin = s.breakStart
        ? timeStringToMinutes(s.breakStart)
        : null;
      const breakEndMin = s.breakEnd ? timeStringToMinutes(s.breakEnd) : null;

      for (let t = startMin; t + interval <= endMin; t += interval) {
        const timeStr = minutesToTimeString(t);
        const slotDateTime = new Date(`${selectedDate}T${timeStr}:00`);
        const isPast = slotDateTime <= now;
        const inBreak =
          breakStartMin !== null &&
          breakEndMin !== null &&
          t >= breakStartMin &&
          t < breakEndMin;
        const isBooked = bookedTimesSet.has(timeStr);
        const status = inBreak
          ? "break"
          : isBooked
          ? "booked"
          : isPast
          ? "past"
          : "free";

        if (!allSlots.find((x) => x.time === timeStr)) {
          allSlots.push({ time: timeStr, status });
        }
      }
    }

    allSlots.sort((a, b) => (a.time > b.time ? 1 : -1));
    setSlots(allSlots);
  }, [schedulesForSelectedDay, bookedTimesSet, selectedDate]);

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!selectedDate || !selectedSlot) {
      toast.error("Выберите дату и время");
      return;
    }
    const userId = user?.id || getCurrentUserId();
    console.log(userId);

    if (!userId) {
      toast.error("Вам нужно войти, чтобы записаться");
      router.push("/auth/login");
      return;
    }

    try {
      toast.success("Запись успешно создана!");
      const payload = {
        doctorId: Number(doctorId),
        patientId: userId,
        patientName: user?.name || "",
        patientPhone: user?.phoneNumber || "",
        date: selectedDate,
        time: selectedSlot,
        status: false,
      };
      await addAppointment(payload).unwrap();
      await refetchAppointments();
      setSelectedSlot(null);
      router.push("/profile");
    } catch (err) {
      console.error(err);
      toast.error("Ошибка при создании записи");
    }
  };

  const [moreReview, setmoreReview] = useState(1);

  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  if (dLoading) return <p className="text-center py-20">Загрузка профиля...</p>;
  if (dError || !doctor)
    return <p className="text-center py-20 text-red-500">Доктор не найден</p>;

  return (
    <div className="container mx-auto py-12 px-6">
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2  shadow-md rounded-xl p-6">
          <div className="flex items-center gap-6">
            <Image
              src={doctor.image || image}
              alt={doctor.name}
              sizes="100vw"
              width={500}
              height={500}
              priority
              style={{ objectFit: "cover" }}
              className="smooth-transition w-40 h-40 rounded-full"
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

          <div className="mt-6">
            <h3 className="font-semibold mb-2">Описание</h3>
            <p className="text-gray-600">
              {doctor.bio ||
                "Профессионал в своей области. Запись по удобному расписанию."}
            </p>
          </div>

          <div className="mt-6">
            <h3 className="font-semibold mb-2">Отзывы ({reviews.length})</h3>
            <div className="space-y-4">
              {reviews.length === 0 && (
                <p className="text-gray-500">Пока нет отзывов.</p>
              )}
              {reviews.slice(0, moreReview).map((r) => (
                <div
                  key={r.id}
                  className={`border rounded p-3 ${
                    theme == "dark" ? "bg-gray-900" : "bg-gray-100"
                  }`}
                >
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
                    <p className="mt-2 text-gray-500">{r.comment}</p>
                  )}
                </div>
              ))}

              {reviews.length !== 0 && (
                <div className="flex justify-center items-start gap-5">
                  <button
                    onClick={() => setmoreReview((e) => e + 3)}
                    className=" bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded-lg smooth-transition"
                  >
                    Больше
                  </button>
                  {moreReview !== 1 && (
                    <button
                      onClick={() => setmoreReview((e) => (e = 1))}
                      className=" bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-2 rounded-lg smooth-transition"
                    >
                      Меньше
                    </button>
                  )}
                </div>
              )}
            </div>

            <form onSubmit={handleAddReview} className="mt-4 space-y-2">
              <div className="flex items-center gap-2">
                <label className="text-sm">Оценка:</label>
                <select
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                  className="border px-2 py-1 rounded"
                >
                  <option value="5">5</option>
                  <option value="4">4</option>
                  <option value="3">3</option>
                  <option value="2">2</option>
                  <option value="1">1</option>
                </select>
              </div>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full border rounded px-3 py-2"
                placeholder="Ваш отзыв"
              />
              <button
                type="submit"
                disabled={addReviewLoading}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Отправить отзыв
              </button>
            </form>
          </div>
        </div>

        <aside className=" shadow-md rounded-xl p-6">
          <h4 className="font-semibold mb-3">Запись на приём</h4>
          <form onSubmit={handleBooking} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-2">
                Выберите дату
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  setSelectedSlot(null);
                }}
                className="border rounded px-3 py-2 w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-2">
                Доступное время
              </label>
              {slots.length === 0 ? (
                <p className="text-gray-500">
                  На выбранную дату нет рабочих часов.
                </p>
              ) : (
                <div className="grid grid-cols-4 gap-2">
                  {slots.map((s) => {
                    let bg = "bg-gray-300 cursor-not-allowed";
                    if (s.status === "free")
                      bg =
                        selectedSlot === s.time
                          ? "bg-red-500 cursor-pointer"
                          : "bg-green-500 cursor-pointer";
                    if (s.status === "booked")
                      bg = "bg-red-500 cursor-not-allowed";
                    if (s.status === "break")
                      bg = "bg-gray-400 cursor-not-allowed";
                    if (s.status === "past")
                      bg = "bg-gray-400 cursor-not-allowed";

                    return (
                      <button
                        type="button"
                        key={s.time}
                        className={`${bg} text-white px-3 py-1 rounded`}
                        onClick={() =>
                          s.status === "free" && setSelectedSlot(s.time)
                        }
                        disabled={s.status !== "free"}
                      >
                        {s.time}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={!selectedSlot || adding}
              className={`w-full py-2 rounded ${
                !selectedSlot
                  ? "bg-gray-300 text-gray-600"
                  : "bg-blue-600 text-white"
              }`}
            >
              {adding ? "Отправка..." : "Записаться"}
            </button>
          </form>
        </aside>
      </div>
    </div>
  );
}
