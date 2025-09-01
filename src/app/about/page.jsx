"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useGetContactQuery } from "@/store/api";
import Image from "next/image";

export default function About() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { data: contact, isLoading, error } = useGetContactQuery();

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  if (isLoading) return <p>Загрузка...</p>;
  if (error) return <p>Ошибка загрузки</p>;

  return (
    <div className={`${theme === "dark" ? "bg-gray-950" : "bg-gray-50"} py-16`}>
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2 mb-10 lg:mb-0 lg:pr-10">
            <Image
              width={500}
              height={500}
              src={contact.logo}
              alt={contact.nameClinic}
              className="rounded-lg shadow-lg w-full"
            />
          </div>
          <div className="lg:w-1/2">
            <h2 className="text-3xl font-bold mb-6 text-blue-900">
              {contact.about.title}
            </h2>

            {contact.about.paragraphs?.map((text, idx) => (
              <p key={idx} className="text-gray-600 mb-4">
                {text}
              </p>
            ))}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              {contact.features?.map((feature, index) => (
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
          </div>
        </div>
      </div>
    </div>
  );
}
