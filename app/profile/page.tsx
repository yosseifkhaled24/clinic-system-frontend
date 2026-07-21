"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import ProfileHero from "@/components/profile/ProfileHero";
import ProfileContent from "@/components/profile/ProfileContent";

import { useAuth } from "@/context/AuthContext";
import { getErrorMessage } from "@/lib/errors";

import { profileService } from "@/services/profile.service";
import { doctorsService } from "@/services/doctors.service";
import { appointmentsService } from "@/services/appointments.service";

import type { AuthUser } from "@/types/auth";
import type { Doctor } from "@/types/doctor";
import type { Appointment } from "@/types/appointment";

export default function ProfilePage() {
  const { user, isLoading: authLoading } = useAuth();

  const router = useRouter();

  const [profile, setProfile] =
    useState<AuthUser | null>(null);

  const [doctors, setDoctors] =
    useState<Doctor[]>([]);

  const [appointments, setAppointments] =
    useState<Appointment[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    if (!user && !authLoading) {
      router.replace("/login");
      return;
    }

    if (!user) return;

    Promise.all([
      profileService.getProfile(),
      doctorsService.getAll(),
      appointmentsService.getAll(),
    ])
      .then(([profile, doctors, appointments]) => {
        setProfile(profile);
        setDoctors(doctors);
        setAppointments(appointments);
      })
      .catch((error) => {
        setError(
          getErrorMessage(
            error,
            "Unable to load profile."
          )
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, [user, authLoading, router]);

  if (loading) {
    return (
      <div className="py-40 text-center text-slate-500">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-40 text-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <>
      <ProfileHero
        name={profile?.name}
      />

      <ProfileContent
        profile={profile}
        doctors={doctors}
        appointments={appointments}
      />
    </>
  );
}