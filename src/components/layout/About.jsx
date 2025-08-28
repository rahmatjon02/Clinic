"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function About() {
  const features = [
    {
      icon: "fas fa-user-md",
      title: "Опытные врачи",
      description: "Высококвалифицированные специалисты",
    },
    {
      icon: "fas fa-flask",
      title: "Современное оборудование",
      description: "Точная диагностика",
    },
    {
      icon: "fas fa-heart",
      title: "Индивидуальный подход",
      description: "Персональное внимание",
    },
    {
      icon: "fas fa-calendar-check",
      title: "Удобное время",
      description: "Запись на удобное время",
    },
  ];

  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div className={`${theme === "dark" ? "bg-gray-950" : "bg-gray-50"} py-16`}>
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2 mb-10 lg:mb-0 lg:pr-10">
            <img
              src="https://images.unsplash.com/photo-1551076805-e1869033e561?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2032&q=80"
              alt="О клинике"
              className="rounded-lg shadow-lg w-full"
            />
          </div>
          <div className="lg:w-1/2">
            <h2 className="text-3xl font-bold mb-6 text-blue-900">
              О нашей клинике
            </h2>
            <p className="text-gray-600 mb-4">
              Клиника "Будь Здоров" - это современный медицинский центр, где
              работают высококвалифицированные специалисты с многолетним опытом.
            </p>
            <p className="text-gray-600 mb-6">
              Мы используем передовые методы диагностики и лечения, чтобы
              обеспечить нашим пациентам качественную медицинскую помощь в
              комфортных условиях.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start">
                  <div className="bg-blue-100 p-3 rounded-full mr-4">
                    <i className={`${feature.icon} text-blue-600 text-xl`}></i>
                  </div>
                  <div>
                    <h4 className="font-bold text-blue-900">{feature.title}</h4>
                    <p className="text-gray-600 text-sm">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full smooth-transition">
              Подробнее о клинике
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
