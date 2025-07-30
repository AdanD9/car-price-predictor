'use client';

import { useRouter } from 'next/navigation';

interface GoBackButtonProps {
  className?: string;
  text?: string;
}

const GoBackButton: React.FC<GoBackButtonProps> = ({ 
  className = '', 
  text = 'Go Back' 
}) => {
  const router = useRouter();

  const handleGoBack = () => {
    // Try to go back in history first
    if (window.history.length > 1) {
      router.back();
    } else {
      // Fallback to home page if no history
      router.push('/');
    }
  };

  return (
    <button
      onClick={handleGoBack}
      className={`btn btn-ghost btn-sm gap-2 ${className}`}
      aria-label="Go back to previous page"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className="w-4 h-4"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
        />
      </svg>
      {text}
    </button>
  );
};

export default GoBackButton;
