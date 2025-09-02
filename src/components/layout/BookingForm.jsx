"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import toast from "react-hot-toast";
import { getCurrentUser, getCurrentUserId } from "@/utils/auth";
import {
  useGetDoctorsQuery,
  useGetSchedulesQuery,
  useGetAppointmentsQuery,
  useAddAppointmentMutation,
} from "@/store/api";
import { useTranslations } from 'next-intl';

function timeStringToMinutes(t) {
  const [hh, mm] = t.split(":").map(Number);
  return hh * 60 + mm;
}
function minutesToTimeString(m) {
  const hh = Math.floor(m / 60);
  const mm = m % 60;
  return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
}
function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export default function BookingForm() {
  const { data: doctors = [] } = useGetDoctorsQuery();
  const { data: schedules = [] } = useGetSchedulesQuery();
  const { data: appointments = [] } = useGetAppointmentsQuery();
  const [addAppointment, { isLoading: aLoading }] = useAddAppointmentMutation();
  const userId = getCurrentUserId();
  const user = getCurrentUser();
  const t = useTranslations('BookingForm');

  const [form, setForm] = useState({
    specialization: "",
    doctorId: "",
    date: todayISO(),
  });

  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { doctorId, date } = form;
    if (!doctorId || !date || !selectedSlot) {
      toast.error(t('fillAllFields'));
      return;
    }
    if (!userId) {
      toast.error(t('loginRequired'));
      return;
    }
    try {
      const payload = {
        doctorId: Number(doctorId),
        patientId: userId,
        patientName: user?.name || "",
        patientPhone: user?.phoneNumber || "",
        date,
        time: selectedSlot,
        status: false,
      };
      await addAppointment(payload).unwrap();
      toast.success(t('success'));
      setSelectedSlot(null);
    } catch (err) {
      console.error(err);
      toast.error(t('error'));
    }
  };

  const schedule = schedules.find(
    (s) => String(s.doctorId) === String(form.doctorId)
  );
  const selectedDate = form.date;

  useEffect(() => {
    if (!schedule || !selectedDate || !appointments) {
      setSlots([]);
      return;
    }

    const interval = schedule.intervalMinutes || 30;
    const startMin = timeStringToMinutes(schedule.startTime);
    const endMin = timeStringToMinutes(schedule.endTime);
    const breakStartMin = schedule.breakStart
      ? timeStringToMinutes(schedule.breakStart)
      : null;
    const breakEndMin = schedule.breakEnd
      ? timeStringToMinutes(schedule.breakEnd)
      : null;

    const bookedTimes = appointments
      .filter(
        (a) =>
          String(a.doctorId) === String(form.doctorId) &&
          a.date === selectedDate
      )
      .map((a) => a.time);

    const slotsArr = [];
    const now = new Date();

    for (let t = startMin; t + interval <= endMin; t += interval) {
      const timeStr = minutesToTimeString(t);
      const slotDateTime = new Date(`${selectedDate}T${timeStr}:00`);
      const isPast = slotDateTime <= now;
      const inBreak =
        breakStartMin !== null &&
        breakEndMin !== null &&
        t >= breakStartMin &&
        t < breakEndMin;
      const status = inBreak
        ? "break"
        : bookedTimes.includes(timeStr)
        ? "booked"
        : isPast
        ? "past"
        : "free";
      slotsArr.push({ time: timeStr, status });
    }

    setSlots(slotsArr);
  }, [schedule, appointments, selectedDate, form.doctorId]);

  const specializations = [...new Set(doctors.map((d) => d.specialization))];

  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div className={`${theme === "dark" ? "bg-gray-700" : "bg-blue-50"} py-20`}>
      <div className="container mx-auto px-4">
        <div
          className={`${
            theme === "dark" ? "bg-black" : "bg-white"
          } rounded-lg shadow-lg p-6 max-w-4xl mx-auto`}
        >
          <h2 className="text-2xl font-bold text-center text-blue-600">
            {t('title')}
          </h2>
          <form
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            onSubmit={handleSubmit}
          >
            {/* Специализация */}
            <div>
              <label className="block text-gray-400 mb-2">{t('specialization')}</label>
              <select
                name="specialization"
                value={form.specialization}
                onChange={(e) => {
                  setForm({
                    ...form,
                    specialization: e.target.value,
                    doctorId: "",
                  });
                  setSlots([]);
                }}
                className={`${
                  theme === "dark" ? "bg-black" : "bg-white"
                } w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200`}
              >
                <option value="">{t('selectService')}</option>
                {specializations.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Врач */}
            <div>
              <label className="block text-gray-400 mb-2">{t('doctor')}</label>
              <select
                name="doctorId"
                value={form.doctorId}
                onChange={handleChange}
                className={`${
                  theme === "dark" ? "bg-black" : "bg-white"
                } w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200`}
              >
                <option value="">{t('selectDoctor')}</option>
                {doctors
                  .filter(
                    (d) =>
                      !form.specialization ||
                      d.specialization === form.specialization
                  )
                  .map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
              </select>
            </div>

            {/* Дата */}
            <div className="lg:col-span-2">
              <label className="block text-gray-400 mb-2">{t('date')}</label>
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
              />
            </div>

            {/* Время */}
            <div className="md:col-span-2">
              <label className="block text-gray-400 mb-2">{t('time')}</label>
              <div className="grid grid-cols-4 lg:grid-cols-8 gap-2">
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
            </div>

            {/* Отправка */}
            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={aLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg smooth-transition"
              >
                {aLoading ? t('creating') : t('confirmButton')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}