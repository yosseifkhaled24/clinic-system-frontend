"use client";

import { UserRound } from "lucide-react";

type ProfileHeroProps = {
  name?: string;
};

export default function ProfileHero({
  name,
}: ProfileHeroProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-sky-600 via-blue-700 to-indigo-700 py-24 text-white">

      <div className="mx-auto flex max-w-7xl items-center justify-between gap-20 px-6">

        <div className="max-w-2xl">

          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-2 backdrop-blur">

            <UserRound size={18} />

            <span>My Profile</span>

          </div>

          <h1 className="text-6xl font-bold leading-tight">
            Welcome Back
            <br />
            {name || "Patient"}
          </h1>

          <p className="mt-8 text-lg leading-8 text-sky-100">
            Manage your profile, appointments and explore our doctors
            from one place.
          </p>

        </div>

        <div className="hidden lg:flex flex-1 justify-end">

          <div className="rounded-[32px] border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur">

            <div className="grid grid-cols-2 gap-5">

              <div className="rounded-2xl bg-white/10 p-6 text-center">

                <h2 className="text-4xl font-bold">
                  👤
                </h2>

                <p className="mt-2 text-sky-100">
                  Profile
                </p>

              </div>

              <div className="rounded-2xl bg-white/10 p-6 text-center">

                <h2 className="text-4xl font-bold">
                  📅
                </h2>

                <p className="mt-2 text-sky-100">
                  Appointments
                </p>

              </div>

              <div className="rounded-2xl bg-white/10 p-6 text-center">

                <h2 className="text-4xl font-bold">
                  👨‍⚕️
                </h2>

                <p className="mt-2 text-sky-100">
                  Doctors
                </p>

              </div>

              <div className="rounded-2xl bg-white/10 p-6 text-center">

                <h2 className="text-4xl font-bold">
                  💬
                </h2>

                <p className="mt-2 text-sky-100">
                  Messages
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}