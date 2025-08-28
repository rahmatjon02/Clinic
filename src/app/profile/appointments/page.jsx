// app/profile/appointments/page.jsx
"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  useGetAppointmentsQuery,
  useGetDoctorsQuery,
  useGetClinicsQuery,
} from "@/store/api";

function getStoredUserObject() {
  const keys = ["current_user", "currentUser", "user", "authUser", "me"];
  try {
    for (const key of keys) {
      const raw = sessionStorage.getItem(key);
      if (!raw) continue;
      try {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === "object") return parsed;
      } catch {
        return raw;
      }
    }
  } catch (e) {}

  try {
    for (const key of keys) {
      const raw = localStorage.getItem(key);
      if (!raw) continue;
      try {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === "object") return parsed;
      } catch {
        return raw;
      }
    }
  } catch (e) {}

  return null;
}

function getCurrentUserId() {
  const u = getStoredUserObject();
  if (!u) return null;
  if (typeof u === "string" || typeof u === "number") return String(u);
  if (u.id) return String(u.id);
  if (u._id) return String(u._id);
  if (u.userId) return String(u.userId);
  if (u.user && (u.user.id || u.user._id))
    return String(u.user.id || u.user._id);
  return null;
}

export default function AppointmentsPage() {
  const router = useRouter();

  const {
    data: appointments = [],
    isLoading: apptsLoading,
    isError: apptsError,
    refetch: refetchAppointments,
  } = useGetAppointmentsQuery();

  const { data: doctors = [] } = useGetDoctorsQuery();
  const { data: clinics = [] } = useGetClinicsQuery();

  // определяем id текущего пользователя
  const currentUserId = getCurrentUserId();

  useEffect(() => {
    // если нет пользователя — можно перенаправить на логин
    // но оставляем страницу видимой, просто показываем подсказку
  }, [currentUserId]);

  const myAppointments = useMemo(() => {
    if (!appointments || !currentUserId) return [];
    return appointments
      .filter((a) => String(a.patientId) === String(currentUserId))
      .sort((a, b) => (a.date > b.date ? 1 : -1) || (a.time > b.time ? 1 : -1));
  }, [appointments, currentUserId]);

  const findDoctor = (id) => doctors?.find((d) => String(d.id) === String(id));
  const findClinic = (id) => clinics?.find((c) => String(c.id) === String(id));

  async function handleCancel(appointmentId) {
    const ok = confirm("Вы действительно хотите отменить эту запись?");
    if (!ok) return;

    try {
      const res = await fetch(
        `http://localhost:5000/appointments/${appointmentId}`,
        {
          method: "DELETE",
        }
      );
      if (!res.ok) throw new Error("Ошибка удаления");
      await refetchAppointments();
      alert("Запись отменена");
    } catch (err) {
      console.error(err);
      alert("Не удалось отменить запись");
    }
  }

  if (apptsLoading) {
    return (
      <p className="text-center py-20 font-semibold">Загрузка записей...</p>
    );
  }
  if (apptsError) {
    return (
      <p className="text-center py-20 text-red-500">Ошибка загрузки записей.</p>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-2xl font-semibold mb-6">Мои записи</h1>

      {!currentUserId && (
        <div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-300 text-yellow-700 rounded">
          Вы не авторизованы. Для записи и управления записями войдите в
          аккаунт.
        </div>
      )}

      {myAppointments.length === 0 ? (
        <div className="bg-white p-6 rounded shadow text-center">
          <p className="text-gray-600 mb-4">У вас пока нет записей.</p>
          <button
            onClick={() => router.push("/")}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Найти специалиста
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {myAppointments.map((a) => {
            const doctor = findDoctor(a.doctorId);
            const clinic = findClinic(a.clinicId);
            const statusLabel = a.status
              ? "Подтверждена"
              : "Ожидает подтверждения";
            const canCancel = !a.status;
            return (
              <div
                key={a.id}
                className="bg-white p-4 rounded shadow flex flex-col md:flex-row md:items-center md:justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={`https://i.pravatar.cc/64?u=${a.doctorId}`}
                    alt={doctor?.name || "Доктор"}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <div className="text-lg font-medium">
                      {doctor?.name || "Доктор"}
                    </div>
                    <div className="text-sm text-gray-500">
                      {doctor?.specialization || ""}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {clinic ? `${clinic.name}` : ""}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-start md:items-end gap-2">
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Дата:</span> {a.date}
                  </div>
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Время:</span> {a.time}
                  </div>
                  <div className="text-sm">
                    <span
                      className={`px-2 py-1 rounded text-sm ${
                        a.status
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {statusLabel}
                    </span>
                  </div>

                  <div className="mt-2 flex gap-2">
                    <button
                      onClick={() => router.push(`/doctors/${a.doctorId}`)}
                      className="text-sm px-3 py-1 border rounded hover:bg-gray-50"
                    >
                      Профиль врача
                    </button>

                    <button
                      onClick={() => router.push(`/booking/${a.doctorId}`)}
                      className="text-sm px-3 py-1 border rounded hover:bg-gray-50"
                    >
                      Перенести / повторно записаться
                    </button>

                    <button
                      onClick={() => handleCancel(a.id)}
                      disabled={!canCancel}
                      className={`text-sm px-3 py-1 rounded ${
                        canCancel
                          ? "bg-red-500 text-white hover:bg-red-600"
                          : "bg-gray-200 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      Отменить
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
