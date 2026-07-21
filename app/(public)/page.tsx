"use client";

import Hero from "@/components/home/Hero";
import Stats from "@/components/home/Stats";
import Services from "@/components/home/Services";
import FeaturedDoctors from "@/components/home/FeaturedDoctors";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import Testimonials from "@/components/home/Testimonials";
import CTA from "@/components/home/CTA";

export default function PublicHomePage() {
  return (
    <>
      <Hero />
      <Stats />
      <Services />
      <FeaturedDoctors />
      <WhyChooseUs />
      <Testimonials />
      <CTA />
    </>
  );
}