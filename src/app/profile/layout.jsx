// app/profile/appointments/page.jsx
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

export default function Layout({ children }) {
  const router = useRouter();
  const currentUserId = getCurrentUserId();
  const { data: user, refetch } = useGetUserByIdQuery(currentUserId);
  const [editProfile] = useEditProfileMutation();

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

  async function handleEdit() {
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
      toast.success("Профиль обновлен");
    } catch (error) {
      console.error(error);
      toast.error("Ошибка");
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

  if (apptsLoading) {
    return (
      <p className="text-center py-20 font-semibold">Загрузка профиля...</p>
    );
  }
  if (apptsError) {
    return (
      <p className="text-center py-20 text-red-500">Ошибка загрузки профиля.</p>
    );
  }

  if (!currentUserId)
    return (
      <div className="m-6 p-4 bg-yellow-50 border-l-4 border-yellow-300 text-yellow-700 rounded">
        Вы не авторизованы. Для записи и управления профиля войдите в аккаунт.
      </div>
    );

  return (
    <div className="container mx-auto p-4">
      <div className="md:col-span-2 bg-white shadow-md rounded-xl p-2 lg:p-6 my-5">
        <div className="flex items-center gap-6 relative">
          <Image
            src={
              user?.image && user?.image.trim() !== ""
                ? user.image
                : "https://www.transparentpng.com/download/user/gray-user-profile-icon-png-fP8Q1P.png"
            }
            alt={user?.name || "user"}
            sizes="100vw"
            width={500}
            height={500}
            priority
            style={{ objectFit: "cover" }}
            className="smooth-transition w-25 h-25 rounded-full shadow"
          />

          <div>
            <p className="text-xs font-semibold">{user?.userName}</p>
            <h1 className="text-xl font-bold">{user?.name}</h1>
            <p className="mt-2 text-sm font-semibold text-blue-600">
              {user?.phoneNumber}
            </p>
            <p className="text-gray-600">{user?.bio || "Нет био"}</p>
          </div>

          <div className="absolute right-2 top-2 space-x-3">
            <button
              onClick={showModal}
              className="text-blue-500 font-bold text-xs lg:text-[16px] cursor-pointer hover:text-blue-600"
            >
              Редактировать
            </button>

            <button
              onClick={() => LogOut()}
              className="text-red-500 font-bold text-xs lg:text-[16px] cursor-pointer hover:text-red-600"
            >
              Выход
            </button>
          </div>
        </div>
      </div>

      <Modal
        title="Редактировать"
        open={isModalOpen}
        onOk={handleEdit}
        onCancel={() => setIsModalOpen(false)}
      >
        <div className="flex flex-col gap-2">
          <Input
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            placeholder="User Name"
          />
          <Input.Password
            value={editPassword}
            onChange={(e) => setEditPassword(e.target.value)}
            placeholder="Password"
          />
          <Input
            value={editFullName}
            onChange={(e) => setEditFullName(e.target.value)}
            placeholder="Name Full"
          />
          <Input
            value={editPhoneNumber}
            onChange={(e) => setEditPhoneNumber(e.target.value)}
            placeholder="Phone Number"
          />
          <Input
            value={editBio}
            onChange={(e) => setEditBio(e.target.value)}
            placeholder="Bio"
          />
          <Input
            value={editImage}
            onChange={(e) => setEditImage(e.target.value)}
            placeholder="Image URL (https://...)"
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
      </Modal>

      <div className="flex items-center gap-4">
        <Link href={"/profile"} className="text-2xl font-semibold mb-6">
          Мои записи
        </Link>
        <Link
          href={"/profile/myReviews"}
          className="text-2xl font-semibold mb-6"
        >
          Мои отзывы
        </Link>
      </div>
      {children}
    </div>
  );
}
