"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, User, Loader2 } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useLoginMutation } from "@/store/api";

export default function LoginCard() {
  const { theme } = useTheme();
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: { userName: "", password: "", remember: false },
  });

  const [showPassword, setShowPassword] = useState(false);
  const [login, { isLoading, data }] = useLoginMutation();
  const router = useRouter();

  const remember = watch("remember");

  useEffect(() => {
    if (data?.accessToken && remember) {
      localStorage.setItem("access_token", data.accessToken);
      if (data.user) {
        localStorage.setItem("current_user", JSON.stringify(data.user));
      }
    }
  }, [data, remember]);

  const onSubmit = async (values) => {
    try {
      const users = await login({
        userName: values.userName,
        password: values.password,
      }).unwrap();
      if (users.length > 0) {
        const user = users[0];
        const token = `fake-token-${Date.now()}`;
        sessionStorage.setItem("current_user", JSON.stringify(user));
        sessionStorage.setItem("access_token", token);

        if (values.remember) {
          localStorage.setItem("current_user", JSON.stringify(user));
          localStorage.setItem("access_token", token);
        }
        toast.success("Вход успешен");
        reset();
        router.push("/");
      } else {
        toast.error("Неверный логин или пароль");
      }
    } catch (err) {
      toast.error("Ошибка входа");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-6">
      <Toaster />

      <div className="max-w-3xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="hidden md:flex items-center justify-center">
          <div className="w-80 h-80 rounded-2xl bg-gradient-to-br from-blue-100 to-white dark:from-blue-900 dark:to-gray-800 shadow-lg flex items-center justify-center">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-2 text-gray-800 dark:text-gray-100">
                Добро пожаловать
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Войдите, чтобы записаться на приём
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-8 shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
            Вход в аккаунт
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

            <div className="flex items-center justify-between">
              <label className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  {...register("remember")}
                  className="form-checkbox"
                />
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  Запомнить меня
                </span>
              </label>

              <Link
                href="/auth/forgot"
                className="text-sm text-blue-600 dark:text-blue-400"
              >
                Забыли пароль?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-medium disabled:opacity-60"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={16} />
              ) : null}
              Войти
            </button>

            <div className="text-center text-sm text-gray-600 dark:text-gray-300">
              Нет аккаунта?{" "}
              <Link
                href="/auth/register"
                className="text-blue-600 dark:text-blue-400 font-semibold"
              >
                Зарегистрироваться
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
