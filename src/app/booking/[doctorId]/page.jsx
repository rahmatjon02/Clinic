"use client";
import { getCurrentUserId } from "@/utils/auth";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  useAddAppointmentMutation,
  useGetAppointmentsQuery,
  useGetDoctorByIdQuery,
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

export default function BookingClient({ params }) {
  const { doctorId } = params;
  const router = useRouter();

  const {
    data: doctor,
    isLoading: doctorLoading,
    isError: doctorError,
  } = useGetDoctorByIdQuery(doctorId);

  const {
    data: appointments = [],
    isLoading: appointmentsLoading,
    refetch: refetchAppointments,
  } = useGetAppointmentsQuery();

  const [addAppointment, { isLoading: adding }] = useAddAppointmentMutation();

  const [selectedDate, setSelectedDate] = useState(() => {
    const d = new Date();
    const iso = d.toISOString().slice(0, 10);
    return iso;
  });
  const [slots, setSlots] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [fetchingSchedule, setFetchingSchedule] = useState(false);

  const bookedTimesSet = useMemo(() => {
    const list = appointments.filter(
      (a) =>
        String(a.doctorId) === String(doctorId) &&
        String(a.date) === String(selectedDate)
    );
    const set = new Set(list.map((a) => String(a.time)));
    return set;
  }, [appointments, doctorId, selectedDate]);

  useEffect(() => {
    let mounted = true;
    async function fetchSchedule() {
      setFetchingSchedule(true);
      try {
        const dayName = getDayOfWeekName(selectedDate);
        const res = await fetch(
          `http://localhost:5000/schedules?doctorId=${doctorId}&dayOfWeek=${dayName}`
        );
        const data = await res.json();
        if (!mounted) return;
        setSchedules(data || []);
      } catch (err) {
        console.error("Error fetching schedule:", err);
        if (mounted) setSchedules([]);
      } finally {
        if (mounted) setFetchingSchedule(false);
      }
    }
    fetchSchedule();
    return () => {
      mounted = false;
    };
  }, [doctorId, selectedDate]);

  useEffect(() => {
    if (!schedules || schedules.length === 0) {
      setSlots([]);
      setSelectedTime(null);
      return;
    }



    

    const interval = 30;
    const allSlots = [];

    for (const s of schedules) {
      const startMin = timeStringToMinutes(s.startTime);
      const endMin = timeStringToMinutes(s.endTime);
      const breakStartMin = s.breakStart
        ? timeStringToMinutes(s.breakStart)
        : null;
      const breakEndMin = s.breakEnd ? timeStringToMinutes(s.breakEnd) : null;

      for (let t = startMin; t + 0 <= endMin - 1; t += interval) {
        if (
          breakStartMin !== null &&
          breakEndMin !== null &&
          t >= breakStartMin &&
          t < breakEndMin
        ) {
          continue;
        }
        const timeStr = minutesToTimeString(t);
        const isToday =
          new Date().toISOString().slice(0, 10) === String(selectedDate);
        let isPast = false;
        if (isToday) {
          const now = new Date();
          const nowMin = now.getHours() * 60 + now.getMinutes();
          if (t <= nowMin - 1) isPast = true;
        }
        const isBooked = bookedTimesSet.has(timeStr);
        const status = isBooked ? "booked" : isPast ? "past" : "free";

        if (!allSlots.find((x) => x.time === timeStr)) {
          allSlots.push({ time: timeStr, status });
        }
      }
    }

    allSlots.sort((a, b) => (a.time > b.time ? 1 : -1));
    setSlots(allSlots);
    if (selectedTime && bookedTimesSet.has(selectedTime)) {
      setSelectedTime(null);
    }
  }, [schedules, bookedTimesSet, selectedDate]);

  if (doctorLoading)
    return <p className="py-12 text-center">Загрузка врача...</p>;
  if (doctorError || !doctor)
    return <p className="py-12 text-center text-red-500">Врач не найден</p>;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime) {
      alert("Выберите дату и время");
      return;
    }

    const userId = getCurrentUserId();
    if (!userId) {
      alert("Вам нужно войти, чтобы записаться");
      router.push("/auth/login");
      return;
    }

    const already = appointments.find(
      (a) =>
        String(a.doctorId) === String(doctorId) &&
        String(a.date) === String(selectedDate) &&
        String(a.time) === String(selectedTime) &&
        String(a.patientId) === String(userId)
    );

    if (already) {
      alert("Вы уже записаны на этот слот");
      return;
    }

    try {
      await addAppointment({
        doctorId: Number(doctorId),
        patientId: userId,
        clinicId: doctor?.clinicId ?? 1,
        date: selectedDate,
        time: selectedTime,
        status: false,
      }).unwrap();

      await refetchAppointments();

      setSelectedTime(null);

      alert("Запись успешно создана!");
      router.push("/profile/appointments");
    } catch (err) {
      console.error(err);
      alert("Ошибка при создании записи");
    }
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-4">
          <img
            src={`https://i.pravatar.cc/80?u=${doctor.id}`}
            alt={doctor.name}
            className="w-20 h-20 rounded-full object-cover"
          />
          <div>
            <h2 className="text-2xl font-semibold">{doctor.name}</h2>
            <p className="text-gray-600">{doctor.specialization}</p>
            <p className="text-sm text-gray-500">
              {doctor.experience} лет опыта
            </p>
          </div>
        </div>

        <hr className="my-4" />

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Выберите дату
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value);
                setSelectedTime(null);
              }}
              className="border rounded px-3 py-2 w-full max-w-xs"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Доступное время
            </label>

            {fetchingSchedule ? (
              <p>Загрузка расписания...</p>
            ) : slots.length === 0 ? (
              <p className="text-gray-500">
                На выбранную дату нет рабочих часов.
              </p>
            ) : (
              <div className="grid grid-cols-4 gap-3">
                {slots.map((s) => {
                  const isSelected = selectedTime === s.time;
                  const base = "text-sm px-3 py-2 rounded-lg font-medium";
                  let cls = "bg-gray-100 text-gray-700 cursor-not-allowed";
                  if (s.status === "booked")
                    cls =
                      "bg-red-100 text-red-700 cursor-not-allowed border border-red-200";
                  if (s.status === "past")
                    cls = "bg-gray-200 text-gray-400 cursor-not-allowed";
                  if (s.status === "free")
                    cls =
                      "bg-green-100 text-green-700 hover:bg-green-200 cursor-pointer";
                  if (isSelected) cls = "bg-blue-600 text-white cursor-pointer";

                  return (
                    <button
                      key={s.time}
                      type="button"
                      onClick={() => {
                        if (s.status !== "free") return;
                        setSelectedTime((t) => (t === s.time ? null : s.time));
                      }}
                      className={`${base} ${cls}`}
                      title={
                        s.status === "booked"
                          ? "Занято"
                          : s.status === "past"
                          ? "Прошло"
                          : isSelected
                          ? "Выбрано"
                          : "Свободно"
                      }
                      disabled={s.status !== "free" && !isSelected}
                    >
                      {s.time}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Контактные данные
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Ваше имя"
                name="name"
                className="border px-3 py-2 rounded"
                defaultValue={(() => {
                  try {
                    const u = JSON.parse(localStorage.getItem("current_user") || "{}");
                    return u?.userName || "";
                  } catch {
                    return "";
                  }
                })()}
                required
              />
              <input
                type="tel"
                placeholder="Телефон"
                name="phone"
                className="border px-3 py-2 rounded"
                required
              />
            </div>
          </div>

          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm text-gray-600">
                Выбрано:{" "}
                <span className="font-semibold">
                  {selectedDate} {selectedTime || "—"}
                </span>
              </p>
            </div>
            <button
              type="submit"
              disabled={!selectedTime || adding}
              className={`px-4 py-2 rounded ${
                !selectedTime
                  ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                  : "bg-blue-600 text-white"
              }`}
            >
              {adding ? "Отправка..." : "Записаться"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
