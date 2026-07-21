"use client";

import Link from "next/link";
import { CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function BookingHero() {

  return (

    <section className="bg-gradient-to-r from-sky-600 via-blue-700 to-indigo-700 py-24 text-white">

      <div className="mx-auto flex max-w-7xl items-center justify-between gap-20 px-6">

        <div className="max-w-2xl">

          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-2 backdrop-blur">

            <CalendarDays size={18} />

            <span>Book Your Visit</span>

          </div>

          <h1 className="text-6xl font-bold">

            Book An
            <br />

            Appointment

          </h1>

          <p className="mt-8 text-lg leading-8 text-sky-100">

            Choose your preferred doctor,
            select a suitable date,
            and confirm your appointment in seconds.

          </p>

          <div className="mt-10 flex gap-4">
            <Link href="/doctors">

  <Button className="rounded-2xl bg-white px-8 py-6 text-base font-semibold text-sky-700 hover:bg-slate-100">

    Choose Doctor

  </Button>

</Link>

<Link href="/contact">

  <Button
    variant="ghost"
    className="rounded-2xl border border-white/20 bg-white/10 px-8 py-6 text-base text-white hover:bg-white/20"
  >

    Need Help?

  </Button>

</Link>

</div>

</div>

<div className="hidden lg:flex flex-1 justify-end">

  <div className="rounded-[32px] border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur">

    <div className="grid grid-cols-2 gap-5">

      <div className="rounded-2xl bg-white/10 p-6 text-center">

        <h2 className="text-4xl font-bold">3</h2>

        <p className="mt-2 text-sky-100">
          Easy Steps
        </p>

      </div>

      <div className="rounded-2xl bg-white/10 p-6 text-center">

        <h2 className="text-4xl font-bold">120+</h2>

        <p className="mt-2 text-sky-100">
          Doctors
        </p>

      </div>

      <div className="rounded-2xl bg-white/10 p-6 text-center">

        <h2 className="text-4xl font-bold">24/7</h2>

        <p className="mt-2 text-sky-100">
          Booking
        </p>

      </div>

      <div className="rounded-2xl bg-white/10 p-6 text-center">

        <h2 className="text-4xl font-bold">100%</h2>

        <p className="mt-2 text-sky-100">
          Secure
        </p>

      </div>

    </div>

  </div>

</div>

</div>

</section>

);
}