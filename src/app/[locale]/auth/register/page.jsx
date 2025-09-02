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
      if (!checkResp.ok) {
        throw new Error("Ошибка при проверке существующего пользователя");
      }

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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-6">


      <div className="max-w-3xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="hidden md:flex items-center justify-center">
          <div className="w-80 h-80 rounded-2xl bg-gradient-to-br from-green-100 to-white dark:from-green-900 dark:to-gray-800 shadow-lg flex items-center justify-center">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-2 text-gray-800 dark:text-gray-100">
                Добро пожаловать
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Создайте аккаунт, чтобы продолжить
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-8 shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
            Регистрация
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <label className="block">
              <span className="text-xs text-gray-600 dark:text-gray-300">
                Имя пользователя
              </span>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  type="text"
                  placeholder="Введите имя пользователя"
                  {...register("userName", {
                    required: "Имя пользователя обязательно",
                  })}
                  className="w-full border px-3 py-2 rounded-md bg-white dark:bg-gray-900 focus:outline-none"
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

            <label className="block">
              <span className="text-xs text-gray-600 dark:text-gray-300">
                Полное имя
              </span>
              <input
                type="text"
                placeholder="Введите имя"
                {...register("name", { required: "Имя обязательно" })}
                className="w-full border px-3 py-2 rounded-md bg-white dark:bg-gray-900 focus:outline-none"
              />
              {errors.name && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.name.message}
                </p>
              )}
            </label>

            <label className="block">
              <span className="text-xs text-gray-600 dark:text-gray-300">
                Номер телефона
              </span>
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
                  className="w-full border px-3 py-2 rounded-md bg-white dark:bg-gray-900 focus:outline-none"
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

            <label className="block">
              <span className="text-xs text-gray-600 dark:text-gray-300">
                Пароль
              </span>
              <div className="mt-1 relative rounded-md shadow-sm border">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Введите пароль"
                  {...register("password", {
                    required: "Пароль обязателен",
                    minLength: { value: 6, message: "Минимум 6 символов" },
                  })}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-900 focus:outline-none rounded-md"
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

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-2 rounded-md bg-green-600 hover:bg-green-700 text-white font-medium disabled:opacity-60"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={16} />
              ) : null}
              Зарегистрироваться
            </button>

            <div className="text-center text-sm text-gray-600 dark:text-gray-300">
              Уже есть аккаунт?{" "}
              <Link
                href="/auth/login"
                className="text-blue-600 dark:text-blue-400 font-semibold"
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
