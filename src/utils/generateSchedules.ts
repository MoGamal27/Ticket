import { addDays, addHours, isBefore, parseISO, format } from "date-fns";
import { db } from "../models/db";
import { tourSchedules } from "../models/schema";

// Original function for use outside transactions
export async function generateTourSchedules({
  tourId,
  startDate,
  endDate,
  daysOfWeek,
  maxUsers,
  durationDays,
  durationHours,
}: {
  tourId: number;
  startDate: string;
  endDate: string;
  daysOfWeek: string[];
  maxUsers: number;
  durationDays: number;
  durationHours: number;
}) {
  const start = parseISO(startDate);
  const end = parseISO(endDate);
  const selectedDays = daysOfWeek.map((d) => d.toLowerCase());

  const schedules: {
    tourId: number;
    date: string;
    availableSeats: number;
    startDate: string;
    endDate: string;
  }[] = [];

  let current = start;
  while (isBefore(current, addDays(end, 1))) {
    const day = current
      .toLocaleDateString("en-US", { weekday: "long" })
      .toLowerCase();

    if (selectedDays.includes(day)) {
      const scheduleStart = current;
      const scheduleEnd = addHours(
        addDays(scheduleStart, durationDays),
        durationHours
      );

      schedules.push({
        tourId,
        date: format(scheduleStart, 'yyyy-MM-dd HH:mm:ss'),
        availableSeats: maxUsers,
        startDate: format(scheduleStart, 'yyyy-MM-dd HH:mm:ss'),
        endDate: format(scheduleEnd, 'yyyy-MM-dd HH:mm:ss'),
      });
    }

    current = addDays(current, 1);
  }

  if (schedules.length) {
    await db.insert(tourSchedules).values(schedules);
  }
}

// Transaction-aware version for use within transactions
export async function generateTourSchedulesInTransaction(tx: any, {
  tourId,
  startDate,
  endDate,
  daysOfWeek,
  maxUsers,
  durationDays,
  durationHours,
}: {
  tourId: number;
  startDate: string;
  endDate: string;
  daysOfWeek: string[];
  maxUsers: number;
  durationDays: number;
  durationHours: number;
}) {
  const start = parseISO(startDate);
  const end = parseISO(endDate);
  const selectedDays = daysOfWeek.map((d) => d.toLowerCase());

  const schedules: {
    tourId: number;
    date: string;
    availableSeats: number;
    startDate: string;
    endDate: string;
  }[] = [];

  let current = start;
  while (isBefore(current, addDays(end, 1))) {
    const day = current
      .toLocaleDateString("en-US", { weekday: "long" })
      .toLowerCase();

    if (selectedDays.includes(day)) {
      const scheduleStart = current;
      const scheduleEnd = addHours(
        addDays(scheduleStart, durationDays),
        durationHours
      );

    schedules.push({
  tourId,
  date: new Date(scheduleStart),
  availableSeats: maxUsers,
  startDate: new Date(scheduleStart),
  endDate: new Date(scheduleEnd),
});
    }

    current = addDays(current, 1);
  }

  if (schedules.length) {
    await tx.insert(tourSchedules).values(schedules);
  }
}