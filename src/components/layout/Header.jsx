"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { Button } from "antd";
import ThemeSwitcher from "@/components/ui/ThemeSwitcher";
import Image from "next/image";
import imgLogo from "../../assets/home/i.webp";
import { usePathname } from "next/navigation";

export default function Header() {
  useEffect(() => setMounted(true), []);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("current_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  
  let pathName = usePathname();
  
  if (!mounted) return null;
  return (
    <>
      <div className="bg-blue-900 text-white py-2 px-4 text-[10px] lg:text-sm">
        <div className="container mx-auto flex  justify-between items-center">
          <div className="flex items-center space-x-4 md:mb-0">
            <div className="flex items-center">
              <i className="fas fa-map-marker-alt mr-2"></i>
              <span>Москва, ул. Лесная, д. 15</span>
            </div>

            <div className="flex items-center">
              <i className="fas fa-phone-alt mr-2"></i>
              <span>+7 (495) 123-45-67</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Link href="#" className="hover:text-blue-200">
              <i className="fab fa-vk"></i>
            </Link>
            <Link href="#" className="hover:text-blue-200">
              <i className="fab fa-telegram"></i>
            </Link>
            <Link href="#" className="hover:text-blue-200">
              <i className="fab fa-whatsapp"></i>
            </Link>
          </div>
        </div>
      </div>

      {/* Навигация */}
      <nav
        className={`${
          theme === "dark" ? "bg-black" : "bg-white"
        } shadow-md sticky top-0 z-50`}
      >
        <div className="container mx-auto px-4 py-3 flex justify-between items-center gap-2">
          {/* Лого */}
          <Link href="/" className="flex items-center">
            <Image
              src={imgLogo}
              alt="Logo"
              width={500}
              height={500}
              className="w-10 h-10 rounded-full object-cover"
            />

            <h1 className="text-xl">Клиника Будь Здоров</h1>
          </Link>

          {/* Десктоп меню */}
          <div className="hidden md:flex space-x-8 items-center">
            <Link
              href="/"
              className={`${
                pathName == "/" ? "text-blue-700" : "text-gray-500"
              }  font-medium hover:text-blue-500`}
            >
              Главная
            </Link>
            <Link
              href="/services"
              className={`${
                pathName == "/services" ? "text-blue-700" : "text-gray-500"
              }  font-medium hover:text-blue-500`}
            >
              Услуги
            </Link>
            <Link
              href="/allDoctors"
              className={`${
                pathName == "/allDoctors" ? "text-blue-700" : "text-gray-500"
              }  font-medium hover:text-blue-500`}
            >
              Врачи
            </Link>
          </div>

          {/* Тема + Логин */}
          <div className={`lg:flex items-center gap-2 hidden`}>
            {user ? (
              <Link href={"/profile"}>
                <span
                  className={`hover:text-blue-400 text-xl ${
                    theme === "dark" ? "text-white" : "text-black"
                  }`}
                >
                  {user?.userName}
                </span>
              </Link>
            ) : (
              <Link href={"/auth/login"}>
                <Button type="primary">Войти</Button>
              </Link>
            )}
            <ThemeSwitcher />
          </div>

          {/* Бургер */}
          <button
            className="md:hidden focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <i className="fas fa-bars text-2xl text-blue-900"></i>
          </button>
        </div>

        {/* Мобильное меню */}
        <div
          className={`md:hidden ${
            isMenuOpen ? "block" : "hidden"
          } w-full px-4 py-2 shadow-lg ${
            theme === "dark" ? "bg-black" : "bg-white"
          }`}
        >
          <div className="flex justify-between">
            <Link href="/" className="block py-2 text-blue-600 font-medium">
              Главная
            </Link>
            <ThemeSwitcher />
          </div>
          <Link
            href="/services"
            className="block py-2 text-gray-400 hover:text-blue-500"
          >
            Услуги
          </Link>
          <Link
            href="/allDoctors"
            className="block py-2 text-gray-400 hover:text-blue-500"
          >
            Врачи
          </Link>

          <div className="">
            {user ? (
              <Link href={"/profile"}>
                <button color="default" variant="outlined">
                  {user?.userName}
                </button>
              </Link>
            ) : (
              <Link href={"/auth/login"}>
                <button className="block py-2 text-gray-400 hover:text-blue-500">
                  Войти
                </button>
              </Link>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}
