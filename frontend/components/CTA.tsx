import Image from "next/image";
import config from "@/config";

const CTA = () => {
  return (
    <section className="relative hero overflow-hidden min-h-screen">
      <Image
        src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2070&auto=format&fit=crop"
        alt="Car Background"
        className="object-cover w-full"
        fill
      />
      <div className="relative hero-overlay bg-neutral bg-opacity-70"></div>
      <div className="relative hero-content text-center text-neutral-content p-8">
        <div className="flex flex-col items-center max-w-xl p-8 md:p-0">
          <h2 className="font-bold text-3xl md:text-5xl tracking-tight mb-8 md:mb-12">
            Ready to Know Your Car's True Value?
          </h2>
          <p className="text-lg opacity-80 mb-12 md:mb-16">
            Get an instant, AI-powered price prediction in seconds. No registration required, completely free, and incredibly accurate.
          </p>

          <a href="#car-predictor" className="btn btn-primary btn-wide">
            Get Your Car's Value Now
          </a>
        </div>
      </div>
    </section>
  );
};

export default CTA;
