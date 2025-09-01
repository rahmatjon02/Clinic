"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Button } from "antd";
import ThemeSwitcher from "@/components/ui/ThemeSwitcher";
import Image from "next/image";
import imgLogo from "../../assets/home/i.webp";
import { usePathname, useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useGetContactQuery } from "@/store/api";
import { getCurrentUser } from "@/utils/auth";

export default function Header() {
  const { data: contact, isLoading, error } = useGetContactQuery();
  useEffect(() => setMounted(true), []);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const user = getCurrentUser();

  let pathName = usePathname();
  const router = useRouter();

  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (isLoading) {
    return (
      <footer className="bg-blue-900 text-white py-12 text-center">
        <p>Загрузка...</p>
      </footer>
    );
  }

  if (error) {
    return (
      <footer className="bg-blue-900 text-white py-12 text-center">
        <p>Ошибка при загрузке контактов</p>
      </footer>
    );
  }

  if (!mounted) return null;
  return (
    <>
      <div className="bg-blue-900 text-white py-2 px-4 text-[10px] lg:text-sm">
        <div className="container mx-auto flex  justify-between items-center">
          <div className="flex items-center space-x-4 md:mb-0 text-[10px]">
            <div className="lg:flex items-center hidden ">
              <i className="fas fa-map-marker-alt mr-2"></i>
              <span>{contact.address}</span>
            </div>

            <div className="flex items-center">
              <i className="fas fa-phone-alt mr-2"></i>
              <span>{contact.phones?.[0]}</span>
            </div>
          </div>

          <div className="flex items-center space-x-4 text-sm">
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
        <div className="container mx-auto pl-2 pr-4 py-3 flex justify-between items-center gap-2">
          <div className="flex items-center gap-2">
            {pathName !== "/" && (
              <button onClick={() => router.back()} className=" cursor-pointer">
                <ArrowLeft />
              </button>
            )}

            {/* Лого */}
            <Link href="/" className="flex items-center">
              <Image
                src={contact.logo}
                alt="Logo"
                width={500}
                height={500}
                className="w-10 h-10 rounded-full object-cover"
              />

              <h1 className="lg:text-xl text-sm">{contact.nameClinic}</h1>
            </Link>
          </div>

          {/* Десктоп меню */}
          <div className="hidden md:flex space-x-8 items-center w-2/6">
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
            <Link
              href="/reviews"
              className={`${
                pathName == "/reviews" ? "text-blue-700" : "text-gray-500"
              }  font-medium hover:text-blue-500`}
            >
              Отзывы
            </Link>
            <Link
              href="/about"
              className={`${
                pathName == "/about" ? "text-blue-700" : "text-gray-500"
              }  font-medium hover:text-blue-500`}
            >
              О нас
            </Link>
          </div>

          {/* Тема + Логин */}
          <div className={`lg:flex items-center gap-2 hidden `}>
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
            <Link
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              href="/"
              className={`${
                pathName == "/" ? "text-blue-700" : "text-gray-500"
              }  font-medium hover:text-blue-500`}
            >
              Главная
            </Link>
            <ThemeSwitcher />
          </div>

          <Link
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            href="/services"
            className={`${
              pathName == "/services" ? "text-blue-700" : "text-gray-500"
            }  font-medium hover:text-blue-500 block py-2`}
          >
            Услуги
          </Link>

          <Link
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            href="/allDoctors"
            className={`${
              pathName == "/allDoctors" ? "text-blue-700" : "text-gray-500"
            }  font-medium hover:text-blue-500 block py-2`}
          >
            Врачи
          </Link>

          <Link
            href="/reviews"
            className={`${
              pathName == "/services" ? "text-blue-700" : "text-gray-500"
            }  font-medium hover:text-blue-500`}
          >
            Отзывы
          </Link>
          <Link
            href="/about"
            className={`${
              pathName == "/about" ? "text-blue-700" : "text-gray-500"
            }  font-medium hover:text-blue-500`}
          >
            О нас
          </Link>

          <div className="">
            {user ? (
              <Link
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                href={"/profile"}
              >
                <button className=" py-2 text-gray-500 hover:text-blue-500">
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
