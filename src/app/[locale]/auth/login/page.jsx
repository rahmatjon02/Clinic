// app/components/auth/login/page.jsx
"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, User, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useLoginMutation } from "@/store/api";
import { useTranslations } from "next-intl";

export default function LoginCard() {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const t = useTranslations("Login");

  const currentTheme = mounted ? resolvedTheme || theme : "light";
  const isDark = currentTheme === "dark";

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
      if (data.user)
        localStorage.setItem("current_user", JSON.stringify(data.user));
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
        toast.success(t("success"));
        reset();
        router.push("/");
      } else {
        toast.error(t("invalidCredentials"));
      }
    } catch (err) {
      toast.error(t("error"));
    }
  };

  const pageBg = isDark
    ? "bg-[rgb(8,8,8)] text-white"
    : "bg-[rgb(247,250,252)] text-black";
  const cardBg = isDark
    ? "bg-[rgb(12,12,12)] border border-[#222]"
    : "bg-white border border-gray-200";
  const inputBg = isDark
    ? "bg-[#0b0b0b] text-white border border-[#333]"
    : "bg-white text-black border border-gray-300";
  const hint = isDark ? "text-gray-300" : "text-gray-600";
  const buttonBg = isDark
    ? "bg-blue-700 hover:bg-blue-800"
    : "bg-blue-600 hover:bg-blue-700";

  if (!mounted) return null;
  return (
    <div
      className={`lg:min-h-[80vh]  flex items-center justify-center p-6 ${pageBg}`}
    >
      <div className="max-w-3xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="hidden md:flex items-center justify-center">
          <div
            className={`w-80 h-80 rounded-2xl shadow-lg flex items-center justify-center ${
              isDark
                ? "bg-gradient-to-br from-[#071633] to-[#0b0b0b]"
                : "bg-gradient-to-br from-blue-100 to-white"
            }`}
          >
            <div className="text-center px-4">
              <h3
                className={`text-2xl font-bold mb-2 ${
                  isDark ? "text-white" : "text-gray-800"
                }`}
              >
                {t("welcome")}
              </h3>
              <p className={`${hint} text-sm`}>{t("welcomeSubtitle")}</p>
            </div>
          </div>
        </div>

        <div className={`${cardBg} rounded-2xl p-8 shadow-md`}>
          <h2
            className={`text-xl font-semibold mb-4 ${
              isDark ? "text-white" : "text-gray-800"
            }`}
          >
            {t("title")}
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <label className="block">
              <span className={`text-xs ${hint}`}>{t("username")}</span>
              <div className="mt-1 relative rounded-md">
                <input
                  type="text"
                  placeholder={t("usernamePlaceholder")}
                  {...register("userName", { required: t("usernameRequired") })}
                  className={`w-full px-3 py-2 rounded-md focus:outline-none ${inputBg}`}
                />
                <div
                  style={{ position: "absolute", right: 12, top: 10 }}
                  className={isDark ? "text-gray-400" : "text-gray-400"}
                >
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
              <span className={`text-xs ${hint}`}>{t("password")}</span>
              <div className="mt-1 relative rounded-md">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder={t("passwordPlaceholder")}
                  {...register("password", {
                    required: t("passwordRequired"),
                    minLength: { value: 6, message: t("passwordMinLength") },
                  })}
                  className={`w-full px-3 py-2 rounded-md focus:outline-none ${inputBg}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  style={{ position: "absolute", right: 8, top: 8 }}
                  className={isDark ? "text-gray-300" : "text-gray-500"}
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
                <input type="checkbox" {...register("remember")} />
                <span className={`text-sm ${hint}`}>{t("rememberMe")}</span>
              </label>

              <Link
                href="/auth/forgot"
                className={`text-sm ${
                  isDark ? "text-blue-300" : "text-blue-600"
                }`}
              >
                {t("forgotPassword")}
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex items-center justify-center gap-2 py-2 rounded-md text-white font-medium ${buttonBg}`}
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={16} />
              ) : null}
              {t("loginButton")}
            </button>

            <div className={`text-center text-sm ${hint}`}>
              {t("noAccount")}{" "}
              <Link
                href="/auth/register"
                className={`${
                  isDark
                    ? "text-blue-300 font-semibold"
                    : "text-blue-600 font-semibold"
                }`}
              >
                {t("registerLink")}
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
