// app/profile/appointments/page.jsx
"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  useDeleteAppointmentMutation,
  useGetAppointmentsQuery,
  useGetDoctorsQuery,
} from "@/store/api";
import toast from "react-hot-toast";
import { getCurrentUser, getCurrentUserId } from "@/utils/auth";
import Image from "next/image";
import image from "@/assets/home/doc.png";
import { useLocale, useTranslations } from "next-intl";

export default function AppointmentsPage() {
  const router = useRouter();
  const user = getCurrentUser();
  const locale = useLocale();
  const t = useTranslations("Appointments");

  const {
    data: appointments = [],
    isLoading: apptsLoading,
    isError: apptsError,
    refetch: refetchAppointments,
  } = useGetAppointmentsQuery();

  const [deleteAppointment] = useDeleteAppointmentMutation();

  const { data: doctors = [] } = useGetDoctorsQuery();

  const currentUserId = getCurrentUserId();

  useEffect(() => {}, [currentUserId]);

  const myAppointments = useMemo(() => {
    if (!appointments || !currentUserId) return [];

    return appointments
      .filter((a) => String(a.patientId) === String(currentUserId))
      .sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.time}`);
        const dateB = new Date(`${b.date}T${b.time}`);
        return dateA.getTime() - dateB.getTime();
      });
  }, [appointments, currentUserId]);

  const findDoctor = (id) => doctors?.find((d) => String(d.id) === String(id));

  async function handleCancel(appointmentId) {
    toast(
      (e) => (
        <div className="flex flex-col gap-2">
          <span>{t("cancelConfirmation")}</span>
          <div className="flex gap-2">
            <button
              className="bg-red-500 text-white px-3 py-1 rounded"
              onClick={async () => {
                try {
                  await deleteAppointment(appointmentId).unwrap;
                  await refetchAppointments();
                  toast.success(t("cancelSuccess"));
                } catch (err) {
                  toast.error(t("cancelError"));
                }
                toast.dismiss(e.id);
              }}
            >
              {t("yes")}
            </button>
            <button
              className="bg-gray-300 px-3 py-1 rounded"
              onClick={() => toast.dismiss(e.id)}
            >
              {t("no")}
            </button>
          </div>
        </div>
      ),
      { duration: Infinity }
    );
  }

  if (apptsLoading) {
    return <p className="text-center py-20 font-semibold">{t("loading")}</p>;
  }
  if (apptsError) {
    return <p className="text-center py-20 text-red-500">{t("error")}</p>;
  }

  if (!currentUserId)
    return (
      <div className="m-6 p-4 bg-yellow-50 border-l-4 border-yellow-300 text-yellow-700 rounded">
        {t("notAuthorized")}
      </div>
    );

  return (
    <div className="container mx-auto py-10 px-4">
      {myAppointments.length === 0 ? (
        <div className=" p-6 text-center">
          <p className="text-gray-600 mb-4">{t("noAppointments")}</p>
          <button
            onClick={() => router.push("/allDoctors")}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {t("findSpecialist")}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {myAppointments.map((a) => {
            const doctor = findDoctor(a.doctorId);
            const statusLabel =
              a.status == "confirmed"
                ? t("confirmed")
                : a.status == "cancelled"
                ? t("cancelled")
                : t("pending");
            const canCancel = !a.status;
            return (
              <div
                key={a.id}
                className="p-4 rounded shadow flex flex-col md:flex-row md:items-center md:justify-between gap-4"
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
                      {doctor?.name || t("doctor")}
                    </div>
                    <div className="text-sm text-gray-500">
                      {doctor?.specialization?.[locale] || ""}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-start md:items-end gap-2">
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">{t("date")}:</span> {a.date}
                  </div>
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">{t("time")}:</span> {a.time}
                  </div>
                  <div className="text-sm">
                    <span
                      className={`px-2 py-1 rounded text-sm ${
                        a.status == "confirmed"
                          ? "bg-green-100 text-green-700"
                          : a.status == "cancelled"
                          ? "bg-red-100 text-red-700"
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
                      {t("doctorProfile")}
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
                      {t("cancel")}
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
