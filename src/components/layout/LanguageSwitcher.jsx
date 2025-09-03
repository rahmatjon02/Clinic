"use client";

import { useState } from "react";
import { Modal, Button } from "antd";
import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Globe } from "lucide-react";

export default function LanguageSwitcher() {
  const { theme } = useTheme();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      {/* Кнопка */}
      <button
        onClick={() => setIsModalOpen(true)}
        className={`hover:text-blue-400 ${
          theme === "dark" ? "text-white" : "text-black"
        }`}
      >
        <Globe />
      </button>

      {/* Модалка */}
      <Modal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        centered
        title={
          <span className={theme === "dark" ? "text-white" : "text-black"}>
            Выберите язык
          </span>
        }
        className={theme === "dark" ? "dark-modal" : ""}
      >
        <div className="flex flex-col gap-3">
          <Link
            href={"/tj"}
            className={`flex items-center gap-2 p-2 rounded ${
              theme === "dark"
                ? "hover:bg-gray-800 text-white"
                : "hover:bg-gray-100 text-black"
            }`}
          >
            <Image
              src="https://upload.wikimedia.org/wikipedia/commons/d/d0/Flag_of_Tajikistan.svg"
              alt="TJ"
              width={24}
              height={24}
            />
            <span>Тоҷикӣ</span>
          </Link>

          <Link
            href={"/ru"}
            className={`flex items-center gap-2 p-2 rounded ${
              theme === "dark"
                ? "hover:bg-gray-800 text-white"
                : "hover:bg-gray-100 text-black"
            }`}
          >
            <Image
              src="https://upload.wikimedia.org/wikipedia/commons/f/f3/Flag_of_Russia.svg"
              alt="RU"
              width={24}
              height={24}
            />
            <span>Русский</span>
          </Link>

          <Link
            href={"/en"}
            className={`flex items-center gap-2 p-2 rounded ${
              theme === "dark"
                ? "hover:bg-gray-800 text-white"
                : "hover:bg-gray-100 text-black"
            }`}
          >
            <Image
              src="https://upload.wikimedia.org/wikipedia/commons/8/83/Flag_of_the_United_Kingdom_%283-5%29.svg"
              alt="EN"
              width={24}
              height={24}
            />
            <span>English</span>
          </Link>
        </div>
      </Modal>

      {/* Кастомный стиль для модалки в Dark Mode */}
      <style jsx global>{`
        .dark-modal .ant-modal-content {
          background-color: #000000 !important;
          color: white !important;
        }
        .dark-modal .ant-modal-header {
          background-color: #000000 !important;
          color: white !important;
        }
        .dark-modal .ant-modal-title {
          color: white !important;
        }
        .dark-modal .ant-modal-close {
          color: white !important;
        }
      `}</style>
    </>
  );
}
