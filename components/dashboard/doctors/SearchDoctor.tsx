"use client";

interface SearchDoctorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchDoctor({
  value,
  onChange,
}: SearchDoctorProps) {
  return (
    <div className="mb-6">

      <input
        type="text"
        placeholder="Search doctor by name..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="
          w-full
          rounded-2xl
          border
          border-slate-300
          bg-white
          px-5
          py-3
          text-sm
          outline-none
          transition
          focus:border-sky-500
          focus:ring-4
          focus:ring-sky-100
        "
      />

    </div>
  );
}