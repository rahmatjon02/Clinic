"use client";
import Link from "next/link";
import imageLogo from "../../assets/home/i.webp";
import Image from "next/image";
import { useGetContactQuery } from "@/store/api";

export default function Footer() {
  const { data: contact, isLoading, error } = useGetContactQuery();

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

  return (
    <footer className="bg-blue-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Логотип и соцсети */}
          <div className="md:col-span-1 col-span-2">
            <Image
              src={contact.logo}
              alt="Клиника Будь Здоров"
              width={100}
              height={100}
              className="w-25 h-25 mb-4 object-cover rounded-full"
            />
            <p className="text-blue-200 mb-4">
              Современная клиника с профессиональным подходом к вашему здоровью.
            </p>
            {contact?.socials && (
              <div className="flex space-x-4">
                <Link
                  href={contact.socials.vk}
                  className="text-blue-200 hover:text-white"
                >
                  <i className="fab fa-vk"></i>
                </Link>
                <Link
                  href={contact.socials.telegram}
                  className="text-blue-200 hover:text-white"
                >
                  <i className="fab fa-telegram"></i>
                </Link>
                <Link
                  href={contact.socials.whatsapp}
                  className="text-blue-200 hover:text-white"
                >
                  <i className="fab fa-whatsapp"></i>
                </Link>
                <Link
                  href={contact.socials.instagram}
                  className="text-blue-200 hover:text-white"
                >
                  <i className="fab fa-instagram"></i>
                </Link>
              </div>
            )}
          </div>

          {/* Услуги */}
          <div>
            <h4 className="font-bold text-xl mb-4">Услуги</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-blue-200 hover:text-white">
                  Терапия
                </Link>
              </li>
              <li>
                <Link href="#" className="text-blue-200 hover:text-white">
                  Кардиология
                </Link>
              </li>
              <li>
                <Link href="#" className="text-blue-200 hover:text-white">
                  Неврология
                </Link>
              </li>
              <li>
                <Link href="#" className="text-blue-200 hover:text-white">
                  Офтальмология
                </Link>
              </li>
              <li>
                <Link href="#" className="text-blue-200 hover:text-white">
                  УЗИ диагностика
                </Link>
              </li>
            </ul>
          </div>

          {/* О клинике */}
          <div>
            <h4 className="font-bold text-xl mb-4">О клинике</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-blue-200 hover:text-white">
                  О нас
                </Link>
              </li>
              <li>
                <Link href="#" className="text-blue-200 hover:text-white">
                  Врачи
                </Link>
              </li>
              <li>
                <Link href="#" className="text-blue-200 hover:text-white">
                  Лицензии
                </Link>
              </li>
              <li>
                <Link href="#" className="text-blue-200 hover:text-white">
                  Отзывы
                </Link>
              </li>
              <li>
                <Link href="#" className="text-blue-200 hover:text-white">
                  Вакансии
                </Link>
              </li>
            </ul>
          </div>

          {/* Контакты */}
          <div>
            <h4 className="font-bold text-xl mb-4">Контакты</h4>
            {contact && (
              <ul className="space-y-2">
                <li className="flex items-start">
                  <i className="fas fa-map-marker-alt mt-1 mr-2 text-blue-200"></i>
                  <span className="text-blue-200">{contact.address}</span>
                </li>

                {/* Несколько телефонов */}
                {contact.phones?.map((phone, idx) => (
                  <li key={idx} className="flex items-start">
                    <i className="fas fa-phone-alt mt-1 mr-2 text-blue-200"></i>
                    <span className="text-blue-200">{phone}</span>
                  </li>
                ))}

                <li className="flex items-start">
                  <i className="fas fa-envelope mt-1 mr-2 text-blue-200"></i>
                  <span className="text-blue-200">{contact.email}</span>
                </li>

                {/* Расписание */}
                {contact.schedule && (
                  <>
                    <li className="flex items-start">
                      <i className="fas fa-clock mt-1 mr-2 text-blue-200"></i>
                      <span className="text-blue-200">
                        {contact.schedule.weekdays}
                      </span>
                    </li>
                    <li className="flex items-start">
                      <i className="fas fa-clock mt-1 mr-2 text-blue-200"></i>
                      <span className="text-blue-200">
                        {contact.schedule.weekend}
                      </span>
                    </li>
                  </>
                )}
              </ul>
            )}
          </div>
        </div>

        <div className="border-t border-blue-800 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-blue-200 mb-4 md:mb-0">
            © 2023 Клиника "Будь Здоров". Все права защищены.
          </p>
          <div className="flex space-x-6">
            <Link href="#" className="text-blue-200 hover:text-white">
              Политика конфиденциальности
            </Link>
            <Link href="#" className="text-blue-200 hover:text-white">
              Пользовательское соглашение
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
