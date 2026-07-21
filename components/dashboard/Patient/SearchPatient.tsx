"use client";

interface SearchPatientProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchPatient({
  value,
  onChange,
}: SearchPatientProps) {
  return (
    <div className="mb-6">

      <input
        type="text"
        placeholder="Search patient by name or phone..."
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