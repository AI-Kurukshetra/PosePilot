"use client";

import { useId, useState, type InputHTMLAttributes } from "react";

type PasswordFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label: string;
  wrapperClassName?: string;
};

function EyeIcon({ open }: { open: boolean }) {
  if (open) {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 sm:h-[17px] sm:w-[17px]">
        <path
          d="M2.25 12s3.75-6 9.75-6 9.75 6 9.75 6-3.75 6-9.75 6S2.25 12 2.25 12Z"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
        />
        <circle
          cx="12"
          cy="12"
          r="3.25"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 sm:h-[17px] sm:w-[17px]">
      <path
        d="M3 3l18 18"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.5"
      />
      <path
        d="M10.58 10.58A3.25 3.25 0 0013.42 13.42"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.5"
      />
      <path
        d="M9.88 5.9A10.6 10.6 0 0112 5.63c6 0 9.75 6.37 9.75 6.37a16.7 16.7 0 01-4.18 4.57"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <path
        d="M6.41 6.42C4.16 7.78 2.75 10 2.25 12c0 0 3.75 6 9.75 6 1.1 0 2.12-.15 3.07-.42"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

export default function PasswordField({
  label,
  className,
  wrapperClassName,
  id,
  ...props
}: PasswordFieldProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const [isVisible, setIsVisible] = useState(false);

  return (
    <label className={wrapperClassName ?? "block"}>
      <span className="mb-2 block text-sm text-white/70">{label}</span>
      <div className="relative">
        <input
          {...props}
          id={inputId}
          type={isVisible ? "text" : "password"}
          className={
            className ??
            "w-full min-h-14 rounded-2xl border border-white/14 bg-white/[0.04] px-4 py-3 pr-16 text-base leading-6 text-[#F5F5F5] outline-none placeholder:text-white/36 focus:border-[#D4AF37]/55 focus:bg-white/[0.06]"
          }
        />
        <button
          type="button"
          aria-label={isVisible ? "Hide password" : "Show password"}
          aria-pressed={isVisible}
          onClick={() => setIsVisible((value) => !value)}
          className="absolute right-2 top-1/2 z-10 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/12 bg-black/45 text-white/78 transition hover:border-[#D4AF37]/35 hover:text-[#F5F5F5]"
        >
          <EyeIcon open={isVisible} />
        </button>
      </div>
    </label>
  );
}
