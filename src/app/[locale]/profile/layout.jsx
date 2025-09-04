"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  useEditProfileMutation,
  useGetAppointmentsQuery,
  useGetUserByIdQuery,
} from "@/store/api";
import toast from "react-hot-toast";
import { getCurrentUserId } from "@/utils/auth";
import Image from "next/image";
import Link from "next/link";
import { Input, Modal } from "antd";
import { Annoyed, Eye, EyeClosed, X } from "lucide-react";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";

export default function Layout({ children }) {
  const [aye, setaye] = useState(false);
  const router = useRouter();
  const currentUserId = getCurrentUserId();
  const { data: user, refetch } = useGetUserByIdQuery(currentUserId);
  const [editProfile] = useEditProfileMutation();
  const t = useTranslations("Profile");

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [editName, setEditName] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [editFullName, setEditFullName] = useState("");
  const [editPhoneNumber, setEditPhoneNumber] = useState("");
  const [editBio, setEditBio] = useState("");
  const [editImage, setEditImage] = useState("");

  useEffect(() => {
    if (user) {
      setEditName(user.userName || "");
      setEditPassword(user.password || "");
      setEditFullName(user.name || "");
      setEditPhoneNumber(user.phoneNumber || "");
      setEditBio(user.bio || "");
      setEditImage(user.image || "");
    }
  }, [user]);

  const showModal = () => {
    if (user) {
      setEditName(user.userName || "");
      setEditPassword(user.password || "");
      setEditFullName(user.name || "");
      setEditPhoneNumber(user.phoneNumber || "");
      setEditBio(user.bio || "");
      setEditImage(user.image || "");
    }
    setIsModalOpen(true);
  };

  async function handleEdit(e) {
    e.preventDefault();
    const updatedUser = {
      id: user?.id,
      userName: editName,
      password: editPassword,
      name: editFullName,
      phoneNumber: editPhoneNumber,
      bio: editBio,
      image: editImage,
    };

    try {
      await editProfile(updatedUser).unwrap();
      await refetch();
      toast.success(t("updateSuccess"));
    } catch (error) {
      console.error(error);
      toast.error(t("updateError"));
    }

    setIsModalOpen(false);
  }

  const {
    data: appointments = [],
    isLoading: apptsLoading,
    isError: apptsError,
  } = useGetAppointmentsQuery();

  function LogOut() {
    localStorage.removeItem("access_token");
    sessionStorage.removeItem("access_token");
    localStorage.removeItem("current_user");
    sessionStorage.removeItem("current_user");
    router.push("/");
  }

  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  if (apptsLoading) {
    return (
      <p className="text-center py-20 font-semibold">{t("loadingProfile")}</p>
    );
  }
  if (apptsError) {
    return (
      <p className="text-center py-20 text-red-500">{t("loadingError")}</p>
    );
  }

  if (!currentUserId)
    return (
      <div className="m-6 p-4 bg-yellow-50 border-l-4 border-yellow-300 text-yellow-700 rounded">
        {t("notAuthorized")}
      </div>
    );

  return (
    <div className="container mx-auto p-4">
      <div className="md:col-span-2 shadow-md rounded-xl p-2 lg:p-6 my-5">
        <div className="flex items-center gap-6 relative">
          <Image
            src={
              user?.image && user?.image.trim() !== ""
                ? user.image
                : "https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI="
            }
            alt={user?.name || "user"}
            sizes="100vw"
            width={500}
            height={500}
            priority
            style={{ objectFit: "cover" }}
            className="smooth-transition lg:w-25 lg:h-25 w-20 h-20 rounded-full shadow"
          />

          <div>
            <p className="text-xs font-semibold">{user?.userName}</p>
            <h1 className="text-xl font-bold">{user?.name}</h1>
            <p className="mt-2 text-sm font-semibold text-blue-600">
              {user?.phoneNumber}
            </p>
            <p className="text-gray-600">{user?.bio || t("noBio")}</p>
          </div>

          <div className="absolute right-2 top-2 flex flex-col lg:flex-row gap-2 items-end">
            <button
              onClick={showModal}
              className="text-blue-500 font-bold text-xs lg:text-[16px] cursor-pointer hover:text-blue-600"
            >
              {t("edit")}
            </button>

            <button
              onClick={() => LogOut()}
              className="text-red-500 font-bold text-xs lg:text-[16px] cursor-pointer hover:text-red-600"
            >
              {t("logout")}
            </button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div
          style={{ backdropFilter: "blur(6px)" }}
          className={`fixed z-60 inset-0 flex items-center justify-center  ${
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
              <h1 className="text-xl font-medium">{t("editProfile")}</h1>
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
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder={t("usernamePlaceholder")}
              />
              <label htmlFor="" className="relative">
                <input
                  type={`${aye ? "text" : "password"}`}
                  className="border rounded p-1.5 w-full"
                  value={editPassword}
                  onChange={(e) => setEditPassword(e.target.value)}
                  placeholder={t("passwordPlaceholder")}
                />
                <button
                  className="absolute right-2 top-2"
                  type="button"
                  onClick={() => setaye((e) => !e)}
                >
                  {aye ? <Eye /> : <EyeClosed />}
                </button>
              </label>
              <input
                type="text"
                className="border rounded p-1.5"
                value={editFullName}
                onChange={(e) => setEditFullName(e.target.value)}
                placeholder={t("fullnamePlaceholder")}
              />
              <input
                type="text"
                className="border rounded p-1.5"
                value={editPhoneNumber}
                onChange={(e) => setEditPhoneNumber(e.target.value)}
                placeholder={t("phonePlaceholder")}
              />
              <input
                type="text"
                className="border rounded p-1.5"
                value={editBio}
                onChange={(e) => setEditBio(e.target.value)}
                placeholder={t("bioPlaceholder")}
              />
              <input
                className="border rounded p-1.5"
                value={editImage}
                onChange={(e) => setEditImage(e.target.value)}
                placeholder={t("imagePlaceholder")}
              />

              {editImage && (
                <div className="flex justify-center">
                  <Image
                    src={editImage}
                    alt="Preview"
                    width={500}
                    height={500}
                    className="w-32 h-32 object-cover rounded-full mt-2"
                  />
                </div>
              )}
            </div>
            <div className="flex items-center justify-end gap-3">
              <button
                className="border px-3 rounded hover:text-blue-400"
                type="button"
                onClick={() => setIsModalOpen(false)}
              >
                {t("cancel")}
              </button>
              <button
                className="border px-3 rounded hover:bg-blue-500 bg-blue-600 text-white border-blue-600"
                type="submit"
              >
                {t("ok")}
              </button>
            </div>
          </form>
        </div>
      )}
      <div className="flex items-center gap-4">
        <Link href={"/profile"} className="text-2xl font-semibold mb-6">
          {t("myAppointments")}
        </Link>
        <Link
          href={"/profile/myReviews"}
          className="text-2xl font-semibold mb-6"
        >
          {t("myReviews")}
        </Link>
      </div>
      {children}
    </div>
  );
}
