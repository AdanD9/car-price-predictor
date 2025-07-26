import Image from "next/image";
import TestimonialsAvatars from "./TestimonialsAvatars";
import config from "@/config";

const Hero = () => {
  return (
    <section className="max-w-7xl mx-auto bg-base-100 flex flex-col lg:flex-row items-center justify-center gap-16 lg:gap-20 px-8 py-8 lg:py-20">
      <div className="flex flex-col gap-10 lg:gap-14 items-center justify-center text-center lg:text-left lg:items-start">
        <h1 className="font-extrabold text-4xl lg:text-6xl tracking-tight">
          Get Your Car's True Value with AI Precision
        </h1>
        <p className="text-lg opacity-80 leading-relaxed">
          Our advanced machine learning model analyzes thousands of data points
          to provide you with the most accurate car price prediction in seconds.
          Whether you're buying, selling, or just curious about your car's worth,
          get instant, reliable valuations powered by cutting-edge AI technology.
        </p>
        <a
          href="#car-predictor"
          className="btn btn-primary btn-wide"
        >
          Get Price Prediction
        </a>

        <TestimonialsAvatars priority={true} />
      </div>
      <div className="lg:w-full">
        <Image
          src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2070&auto=format&fit=crop"
          alt="Modern car dashboard with AI technology"
          className="w-full rounded-2xl shadow-2xl"
          priority={true}
          width={500}
          height={500}
        />
      </div>
    </section>
  );
};

export default Hero;
