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

import { useVisibilityPoll } from "@/hooks/useVisibilityPoll";

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

  // Background refresh (same cadence as /appointments): keeps status,
  // payment and review eligibility current when a payment lands or the
  // admin completes an appointment while the tab is open. Failures keep
  // the currently displayed list untouched. Phase 1: paused while the
  // tab is hidden (one catch-up refresh on return) and skipped entirely
  // while logged out — the same no-request behavior the old
  // `if (!user) return` guard produced.
  const refreshAppointments = () => {
    if (!user) return;

    return appointmentsService
      .getAll()
      .then(setAppointments)
      .catch(() => {
        // Preserve current appointments while the refresh fails.
      });
  };

  useVisibilityPoll(refreshAppointments, 15000);

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