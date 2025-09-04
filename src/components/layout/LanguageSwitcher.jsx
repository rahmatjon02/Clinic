"use client";

import { useState } from "react";
import { Modal } from "antd";
import Image from "next/image";
import { useTheme } from "next-themes";
import { Globe } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function LanguageSwitcher() {
  const { theme } = useTheme();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const pathname = usePathname();

  const locales = [
    {
      code: "tj",
      label: "Тоҷикӣ",
      flag: "https://upload.wikimedia.org/wikipedia/commons/d/d0/Flag_of_Tajikistan.svg",
    },
    {
      code: "ru",
      label: "Русский",
      flag: "https://upload.wikimedia.org/wikipedia/commons/f/f3/Flag_of_Russia.svg",
    },
    {
      code: "en",
      label: "English",
      flag: "https://upload.wikimedia.org/wikipedia/commons/8/83/Flag_of_the_United_Kingdom_%283-5%29.svg",
    },
  ];

  // Функция для подстановки локали в URL
  function getLocalizedPath(locale) {
    const segments = pathname.split("/");
    segments[1] = locale; // заменяем локаль в пути
    return segments.join("/") || "/";
  }

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className={`hover:text-blue-400 ${
          theme === "dark" ? "text-white" : "text-black"
        }`}
      >
        <Globe />
      </button>

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
          {locales.map(({ code, label, flag }) => (
            <Link
              key={code}
              href={getLocalizedPath(code)}
              onClick={() => setIsModalOpen(false)}
              className={`flex items-center gap-2 p-2 rounded ${
                theme === "dark"
                  ? "hover:bg-gray-800 text-white"
                  : "hover:bg-gray-100 text-black"
              }`}
            >
              <Image src={flag} alt={code} width={24} height={24} />
              <span>{label}</span>
            </Link>
          ))}
        </div>
      </Modal>

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
