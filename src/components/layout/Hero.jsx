"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function Hero() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div
      className={`hero-image text-white  min-h-[85vh] flex items-center justify-center ${
        theme === "dark" ? "bg-gray-700" : "bg-blue-50"
      }`}
    >
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-3xl md:text-5xl font-bold mb-6">
          Клиника современной медицины
        </h1>
        <p className="text-xl md:text-2xl mb-8">
          Профессиональная забота о вашем здоровье
        </p>
      </div>
    </div>
  );
}
