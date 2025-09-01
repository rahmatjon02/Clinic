// app/profile/appointments/page.jsx
"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useGetAppointmentsQuery, useGetDoctorsQuery } from "@/store/api";
import toast from "react-hot-toast";
import { getCurrentUser, getCurrentUserId } from "@/utils/auth";
import Image from "next/image";
import image from "../../assets/home/doc.png";

export default function AppointmentsPage() {
  const router = useRouter();
  const user = getCurrentUser();

  const {
    data: appointments = [],
    isLoading: apptsLoading,
    isError: apptsError,
    refetch: refetchAppointments,
  } = useGetAppointmentsQuery();

  const { data: doctors = [] } = useGetDoctorsQuery();

  const currentUserId = getCurrentUserId();

  useEffect(() => {}, [currentUserId]);

  const myAppointments = useMemo(() => {
    if (!appointments || !currentUserId) return [];
    return appointments
      .filter((a) => String(a.patientId) === String(currentUserId))
      .sort((a, b) => (a.date > b.date ? 1 : -1) || (a.time > b.time ? 1 : -1));
  }, [appointments, currentUserId]);

  const findDoctor = (id) => doctors?.find((d) => String(d.id) === String(id));

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
      toast.success("Запись отменена");
    } catch (err) {
      console.error(err);
      toast.error("Не удалось отменить запись");
    }
  }

  function LogOut() {
    localStorage.removeItem("access_token");
    sessionStorage.removeItem("access_token");
    localStorage.removeItem("current_user");
    sessionStorage.removeItem("current_user");
    router.push("/");
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

  if (!currentUserId)
    return (
      <div className="m-6 p-4 bg-yellow-50 border-l-4 border-yellow-300 text-yellow-700 rounded">
        Вы не авторизованы. Для записи и управления профиля войдите в аккаунт.
      </div>
    );

  return (
    <div className="container mx-auto py-10 px-4">
      {myAppointments.length === 0 ? (
        <div className="bg-white p-6 text-center">
          <p className="text-gray-600 mb-4">У вас пока нет записей.</p>
          <button
            onClick={() => router.push("/allDoctors")}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Найти специалиста
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {myAppointments.map((a) => {
            const doctor = findDoctor(a.doctorId);
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
                  <Image
                    src={doctor?.image || image}
                    alt={"Foto Profil"}
                    width={1000}
                    height={1000}
                    priority
                    className="smooth-transition object-cover w-30 h-30 rounded-2xl"
                  />
                  <div>
                    <div className="text-lg font-medium">
                      {doctor?.name || "Доктор"}
                    </div>
                    <div className="text-sm text-gray-500">
                      {doctor?.specialization || ""}
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
