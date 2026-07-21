"use client";

import Link from "next/link";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function ContactHero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-sky-600 via-blue-700 to-indigo-700 py-24 text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-20 px-6">

        <div className="max-w-2xl">

          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-2 backdrop-blur">
            <Mail size={18} />
            <span>Contact Our Medical Team</span>
          </div>

          <h1 className="text-6xl font-bold leading-tight">
            We're Here
            <br />
            To Help You
          </h1>

          <p className="mt-8 text-lg leading-8 text-sky-100">
            Whether you need medical assistance, have questions about our
            services, or want to book an appointment, our team is always
            ready to help.
          </p>

          <div className="mt-10 flex gap-4">

            <Link href="/booking">
              <Button className="rounded-2xl bg-white px-8 py-6 text-base font-semibold text-sky-700 hover:bg-slate-100">
                Book Appointment
              </Button>
            </Link>

            <Link href="/doctors">
              <Button
                variant="ghost"
                className="rounded-2xl border border-white/20 bg-white/10 px-8 py-6 text-base text-white hover:bg-white/20"
              >
                View Doctors
              </Button>
            </Link>

          </div>

        </div>

        <div className="hidden flex-1 lg:flex justify-end">

          <div className="rounded-[32px] border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur">

            <div className="grid grid-cols-2 gap-5">

              <div className="rounded-2xl bg-white/10 p-6 text-center">
                <Phone className="mx-auto mb-3" size={30} />
                <h3 className="font-bold">Phone</h3>
                <p className="mt-2 text-sky-100">
                  01000000000
                </p>
              </div>

              <div className="rounded-2xl bg-white/10 p-6 text-center">
                <Mail className="mx-auto mb-3" size={30} />
                <h3 className="font-bold">Email</h3>
                <p className="mt-2 text-sky-100">
                  support@medicare.com
                </p>
              </div>

              <div className="rounded-2xl bg-white/10 p-6 text-center">
                <MapPin className="mx-auto mb-3" size={30} />
                <h3 className="font-bold">Address</h3>
                <p className="mt-2 text-sky-100">
                  Cairo, Egypt
                </p>
              </div>

              <div className="rounded-2xl bg-white/10 p-6 text-center">
                <Clock className="mx-auto mb-3" size={30} />
                <h3 className="font-bold">Working Hours</h3>
                <p className="mt-2 text-sky-100">
                  Sat - Thu
                  <br />
                  8:00 AM - 8:00 PM
                </p>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}