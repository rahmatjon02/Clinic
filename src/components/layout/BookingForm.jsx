"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import toast from "react-hot-toast";
import { getCurrentUserId } from "@/utils/auth";

import {
  useGetDoctorsQuery,
  useGetSchedulesQuery,
  useGetAppointmentsQuery,
  useAddAppointmentMutation,
} from "@/store/api";

export default function BookingForm() {
  const { data: doctors = [] } = useGetDoctorsQuery();
  const { data: schedules = [] } = useGetSchedulesQuery();
  const { data: appointments = [] } = useGetAppointmentsQuery();
  const [addAppointment, { isLoading: aLoading }] = useAddAppointmentMutation();
  const userIdId = getCurrentUserId();

  const [form, setForm] = useState({
    specialization: "",
    doctorId: "",
    date: "",
    name: "",
    phone: "",
  });

  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { doctorId, date, name, phone } = form;
    if (!doctorId || !date || !name || !phone || !selectedSlot) {
      toast.error("Заполните все поля и выберите время");
      return;
    }

    try {
      await addAppointment({
        doctorId: Number(doctorId),
        patientId: userIdId,
        date,
        time: selectedSlot,
        status: false,
      }).unwrap();

      toast.success("Запись успешно создана!");
      setForm({
        specialization: "",
        doctorId: "",
        date: "",
        name: "",
        phone: "",
      });
      setSelectedSlot(null);
    } catch (err) {
      console.error(err);
      toast.error("Ошибка при создании записи");
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

    const start = schedule.startTime;
    const end = schedule.endTime;
    const breakStart = schedule.breakStart;
    const breakEnd = schedule.breakEnd;

    const bookedTimes = appointments
      .filter(
        (a) =>
          String(a.doctorId) === String(form.doctorId) &&
          a.date === selectedDate
      )
      .map((a) => a.time);

    const slotsArr = [];
    let current = new Date(`${selectedDate}T${start}:00`);
    const endTime = new Date(`${selectedDate}T${end}:00`);
    const now = new Date();

    while (current < endTime) {
      const hh = current.getHours().toString().padStart(2, "0");
      const mm = current.getMinutes().toString().padStart(2, "0");
      const timeStr = `${hh}:${mm}`;

      const inBreak =
        current >= new Date(`${selectedDate}T${breakStart}:00`) &&
        current < new Date(`${selectedDate}T${breakEnd}:00`);
      const isPast = current < now;

      slotsArr.push({
        time: timeStr,
        status: inBreak
          ? "break"
          : bookedTimes.includes(timeStr)
          ? "booked"
          : isPast
          ? "past"
          : "free",
      });

      current.setHours(current.getHours() + 1);
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
          } rounded-lg shadow-lg p-6 max-w-4xl mx-auto `}
        >
          <h2 className="text-2xl font-bold text-center text-blue-600">
            Записаться на прием
          </h2>
          <form
            className="grid grid-cols-1 md:grid-cols-2 gap-6 "
            onSubmit={handleSubmit}
          >
            {/* Специализация */}
            <div>
              <label className="block text-gray-500 mb-2">Специализация</label>
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
                <option value="">Выберите услугу</option>
                {specializations.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Врач */}
            <div>
              <label className="block text-gray-500 mb-2">Специалист</label>
              <select
                name="doctorId"
                value={form.doctorId}
                onChange={handleChange}
                className={`${
                  theme === "dark" ? "bg-black" : "bg-white"
                } w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200`}
              >
                <option value="">Выберите специалиста</option>
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
              <label className="block text-gray-500 mb-2">Желаемая дата</label>
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
              <label className="block text-gray-500 mb-2">Выберите время</label>
              <div className="flex flex-wrap gap-2">
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

            {/* Имя */}
            <div>
              <label className="block text-gray-500 mb-2">Ваше имя</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
              />
            </div>

            {/* Телефон */}
            <div>
              <label className="block text-gray-500 mb-2">Телефон</label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
              />
            </div>

            {/* Отправка */}
            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={aLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg smooth-transition"
              >
                {aLoading ? "Создание..." : "Подтвердить запись"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
