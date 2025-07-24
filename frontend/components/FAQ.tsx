"use client";

import { useRef, useState } from "react";
import type { JSX } from "react";

// <FAQ> component is a lsit of <Item> component
// Just import the FAQ & add your FAQ content to the const faqList arrayy below.

interface FAQItemProps {
  question: string;
  answer: JSX.Element;
}

const faqList: FAQItemProps[] = [
  {
    question: "How accurate are the price predictions?",
    answer: (
      <div className="space-y-2 leading-relaxed">
        <p>Our AI model achieves 98.3% accuracy with an average error of just $1,146. The model analyzes 87+ features including vehicle specifications, market trends, condition factors, and regional pricing data to provide highly reliable predictions.</p>
      </div>
    ),
  },
  {
    question: "What information do I need to provide?",
    answer: (
      <div className="space-y-2 leading-relaxed">
        <p>At minimum, you need the car's make, model, year, and mileage. For more accurate predictions, you can also provide details about engine specifications, fuel economy, condition, accident history, and other features.</p>
        <p>The more information you provide, the more accurate your prediction will be.</p>
      </div>
    ),
  },
  {
    question: "Is this service free to use?",
    answer: (
      <p>
        Yes! Our car price prediction service is completely free. Simply enter your car's details and get an instant AI-powered valuation with no hidden fees or registration required.
      </p>
    ),
  },
  {
    question: "How current is the market data?",
    answer: (
      <div className="space-y-2 leading-relaxed">
        <p>Our model is trained on the most recent market data and includes real-time factors like seasonal trends, regional pricing variations, and current market conditions.</p>
        <p>The predictions reflect current market values, not historical data.</p>
      </div>
    ),
  },
  {
    question: "Can I use this for insurance or official purposes?",
    answer: (
      <div className="space-y-2 leading-relaxed">
        <p>Our predictions are for informational purposes and provide excellent market estimates. However, for official purposes like insurance claims or legal matters, you should consult with certified appraisers.</p>
        <p>Our tool is perfect for getting a quick, accurate estimate before buying, selling, or trading your vehicle.</p>
      </div>
    ),
  },
  {
    question: "What types of vehicles are supported?",
    answer: (
      <p>
        Our model supports cars from 2001 onwards, including sedans, SUVs, trucks, coupes, and other common vehicle types. The model works best with mainstream makes and models that have sufficient market data.
      </p>
    ),
  },
];

const FaqItem = ({ item }: { item: FAQItemProps }) => {
  const accordion = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <li>
      <button
        className="relative flex gap-2 items-center w-full py-5 text-base font-semibold text-left border-t md:text-lg border-base-content/10"
        onClick={(e) => {
          e.preventDefault();
          setIsOpen(!isOpen);
        }}
        aria-expanded={isOpen}
      >
        <span
          className={`flex-1 text-base-content ${isOpen ? "text-primary" : ""}`}
        >
          {item?.question}
        </span>
        <svg
          className={`flex-shrink-0 w-4 h-4 ml-auto fill-current`}
          viewBox="0 0 16 16"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            y="7"
            width="16"
            height="2"
            rx="1"
            className={`transform origin-center transition duration-200 ease-out ${
              isOpen && "rotate-180"
            }`}
          />
          <rect
            y="7"
            width="16"
            height="2"
            rx="1"
            className={`transform origin-center rotate-90 transition duration-200 ease-out ${
              isOpen && "rotate-180 hidden"
            }`}
          />
        </svg>
      </button>

      <div
        ref={accordion}
        className={`transition-all duration-300 ease-in-out opacity-80 overflow-hidden`}
        style={
          isOpen
            ? { maxHeight: accordion?.current?.scrollHeight, opacity: 1 }
            : { maxHeight: 0, opacity: 0 }
        }
      >
        <div className="pb-5 leading-relaxed">{item?.answer}</div>
      </div>
    </li>
  );
};

const FAQ = () => {
  return (
    <section className="bg-base-200" id="faq">
      <div className="py-24 px-8 max-w-7xl mx-auto flex flex-col md:flex-row gap-12">
        <div className="flex flex-col text-left basis-1/2">
          <p className="inline-block font-semibold text-primary mb-4">FAQ</p>
          <p className="sm:text-4xl text-3xl font-extrabold text-base-content">
            Frequently Asked Questions
          </p>
        </div>

        <ul className="basis-1/2">
          {faqList.map((item, i) => (
            <FaqItem key={i} item={item} />
          ))}
        </ul>
      </div>
    </section>
  );
};

export default FAQ;
