"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, User, Loader2, Mail } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useRegisterUserMutation } from "@/store/api";

export default function RegisterCard() {
  const { theme } = useTheme();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: { userName: "", password: "", name: "", email: "" },
  });

  const [showPassword, setShowPassword] = useState(false);
  const [registerUser, { isLoading }] = useRegisterUserMutation();

  const onSubmit = async (values) => {
    try {
      const checkUrl = `http://localhost:5000/users?userName=${encodeURIComponent(
        values.userName
      )}`;
      const checkResp = await fetch(checkUrl);
      if (!checkResp.ok) throw new Error("Ошибка при проверке пользователя");

      const found = await checkResp.json();
      if (found.length > 0) {
        toast.error("Пользователь с таким именем уже существует");
        return;
      }

      const created = await registerUser({
        userName: values.userName,
        password: values.password,
        name: values.name,
        phoneNumber: values.phoneNumber,
        role: "user",
      }).unwrap();

      if (created && created.id) {
        toast.success("Регистрация успешна");
        reset();
        router.push("/auth/login");
      } else {
        toast.error("Не удалось зарегистрировать");
      }
    } catch (err) {
      const message =
        err?.data || err?.message || err?.error || "Ошибка регистрации";
      toast.error(String(message));
    }
  };

  const bgPage = theme === "dark" ? "bg-black" : "bg-white";
  const bgCard = theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200";
  const textMain = theme === "dark" ? "text-gray-100" : "text-gray-800";
  const textMuted = theme === "dark" ? "text-gray-300" : "text-gray-600";
  const inputBg = theme === "dark" ? "bg-gray-900" : "bg-white";

  return (
    <div className={`min-h-screen flex items-center justify-center ${bgPage} p-6`}>
      <div className="max-w-3xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="hidden md:flex items-center justify-center">
          <div
            className={`w-80 h-80 rounded-2xl shadow-lg flex items-center justify-center
            ${theme === "dark" ? "bg-gradient-to-br from-green-900 to-gray-800" : "bg-gradient-to-br from-green-100 to-white"}`}
          >
            <div className="text-center">
              <h3 className={`text-2xl font-bold mb-2 ${textMain}`}>
                Добро пожаловать
              </h3>
              <p className={`text-sm ${textMuted}`}>
                Создайте аккаунт, чтобы продолжить
              </p>
            </div>
          </div>
        </div>

        <div className={`${bgCard} border rounded-2xl p-8 shadow-md`}>
          <h2 className={`text-xl font-semibold mb-4 ${textMain}`}>
            Регистрация
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Username */}
            <label className="block">
              <span className={`text-xs ${textMuted}`}>Имя пользователя</span>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  type="text"
                  placeholder="Введите имя пользователя"
                  {...register("userName", {
                    required: "Имя пользователя обязательно",
                  })}
                  className={`w-full border px-3 py-2 rounded-md focus:outline-none ${inputBg}`}
                />
                <div className="absolute right-3 top-2.5 text-gray-400 pointer-events-none">
                  <User size={16} />
                </div>
              </div>
              {errors.userName && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.userName.message}
                </p>
              )}
            </label>

            {/* Full name */}
            <label className="block">
              <span className={`text-xs ${textMuted}`}>Полное имя</span>
              <input
                type="text"
                placeholder="Введите имя"
                {...register("name", { required: "Имя обязательно" })}
                className={`w-full border px-3 py-2 rounded-md focus:outline-none ${inputBg}`}
              />
              {errors.name && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.name.message}
                </p>
              )}
            </label>

            {/* Phone */}
            <label className="block">
              <span className={`text-xs ${textMuted}`}>Номер телефона</span>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  type="tel"
                  placeholder="Введите номер телефона"
                  {...register("phoneNumber", {
                    required: "Номер обязателен",
                    pattern: {
                      value: /^\+?\d{9,15}$/,
                      message: "Неверный формат номера",
                    },
                  })}
                  className={`w-full border px-3 py-2 rounded-md focus:outline-none ${inputBg}`}
                />
                <div className="absolute right-3 top-2.5 text-gray-400 pointer-events-none">
                  <Mail size={16} />
                </div>
              </div>
              {errors.phoneNumber && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.phoneNumber.message}
                </p>
              )}
            </label>

            {/* Password */}
            <label className="block">
              <span className={`text-xs ${textMuted}`}>Пароль</span>
              <div className="mt-1 relative rounded-md shadow-sm border">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Введите пароль"
                  {...register("password", {
                    required: "Пароль обязателен",
                    minLength: { value: 6, message: "Минимум 6 символов" },
                  })}
                  className={`w-full px-3 py-2 focus:outline-none rounded-md ${inputBg}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-2.5 text-gray-500"
                >
                  {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.password.message}
                </p>
              )}
            </label>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-2 rounded-md bg-green-600 hover:bg-green-700 text-white font-medium disabled:opacity-60"
            >
              {isLoading && <Loader2 className="animate-spin" size={16} />}
              Зарегистрироваться
            </button>

            <div className={`text-center text-sm ${textMuted}`}>
              Уже есть аккаунт?{" "}
              <Link
                href="/auth/login"
                className="text-blue-600 font-semibold"
              >
                Войти
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
