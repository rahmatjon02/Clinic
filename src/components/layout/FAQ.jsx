"use client";
import React, { useState } from "react";
import { useGetFaqQuery } from "@/store/api";
import { ChevronDown } from "lucide-react";
import { useTranslations } from 'next-intl';

const FAQ = () => {
  const { data: faq, isLoading, isError } = useGetFaqQuery();
  const [openId, setOpenId] = useState(null);
  const t = useTranslations('FAQ');

  if (isLoading)
    return (
      <p className="text-center text-gray-500 animate-pulse">{t('loading')}</p>
    );
  if (isError)
    return <p className="text-center text-red-500">{t('error')}</p>;
  if (!faq || faq.length === 0)
    return <p className="text-center text-gray-500">{t('noQuestions')}</p>;

  const toggle = (id) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold mb-8 text-center text-blue-700">
        {t('title')}
      </h2>
      <div className="space-y-4">
        {faq.map((item) => (
          <div
            key={item.id}
            className="border border-gray-200 rounded-lg shadow-sm overflow-hidden"
          >
            <button
              onClick={() => toggle(item.id)}
              className="w-full flex justify-between items-center px-4 py-3 text-left font-semibold text-blue-600 hover:bg-blue-50 transition-colors"
            >
              {item.question}
              <ChevronDown
                className={`w-5 h-5 transform transition-transform ${
                  openId === item.id ? "rotate-180" : ""
                }`}
              />
            </button>
            {openId === item.id && (
              <div className="px-4 pb-4 text-gray-400 animate-fadeIn">
                {item.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;