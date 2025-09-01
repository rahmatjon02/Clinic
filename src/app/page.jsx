import Hero from "@/components/layout/Hero";
import Services from "@/components/layout/Services";
import Doctors from "@/components/layout/Doctors";
import BookingForm from "@/components/layout/BookingForm";
import FAQ from "@/components/layout/FAQ";
import Reviews from "@/components/layout/Reviews";
import About from "@/components/layout/About";
import Contact from "@/components/layout/Contact";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <Hero />
      <Services />
      <About />
      <Doctors />
      <Reviews />
      <BookingForm />
      <FAQ />
      <Contact />

      <div className="fixed bottom-6 right-6 z-50">
        <div className="flex flex-col space-y-3">
          <Link
            href="https://api.whatsapp.com/send?phone=992948773399"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Написать в WhatsApp"
            className="bg-green-500 hover:bg-green-600 text-white w-12 h-12 rounded-full shadow-lg transition duration-300 flex items-center justify-center"
          >
            <i className="fab fa-whatsapp text-2xl"></i>
          </Link>

          <Link
            href="tel:+992948773399"
            aria-label="Позвонить"
            className="bg-blue-500 hover:bg-blue-600 text-white w-12 h-12 rounded-full shadow-lg transition duration-300 flex items-center justify-center"
          >
            <i className="fas fa-phone-alt text-xl"></i>
          </Link>
        </div>
      </div>
    </div>
  );
}
