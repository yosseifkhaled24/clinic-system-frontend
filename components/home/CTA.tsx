"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function CTA() {

  return (

    <section className="py-24">

      <div className="mx-auto max-w-7xl px-6">

        <div className="overflow-hidden rounded-[40px] bg-gradient-to-r from-sky-600 via-blue-700 to-indigo-700 px-10 py-20 text-center text-white shadow-2xl">

          <span className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur">

            Ready To Get Started?

          </span>

          <h2 className="mt-8 text-5xl font-bold">

            Book Your Appointment Today

          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-sky-100">

            Connect with our experienced doctors and receive
            professional healthcare whenever you need it.

          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
                        <Link href="/booking">

              <Button className="rounded-2xl bg-sky-500 px-8 py-6 text-base font-semibold text-white hover:bg-sky-600">
  Book Appointment
</Button>

            </Link>

            <Link href="/contact">

              <Button
                variant="ghost"
                className="rounded-2xl border border-white/20 bg-white/10 px-8 py-6 text-base text-white hover:bg-white/20"
              >

                Contact Us

              </Button>

            </Link>

          </div>

        </div>

      </div>

    </section>

  );
}