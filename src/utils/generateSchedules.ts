import { addDays, addHours, isBefore, parseISO } from "date-fns";
import { db } from "../models/db";
import { tourSchedules } from "../models/schema";

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
  daysOfWeek: string[]; // e.g. ['monday', 'wednesday']
  maxUsers: number;
  durationDays: number;
  durationHours: number;
}) {
  const start = parseISO(startDate);
  const end = parseISO(endDate);
  const selectedDays = daysOfWeek.map((d) => d.toLowerCase());

  const schedules: {
    tourId: number;
    date: Date;
    availableSeats: number;
    startDate: Date;
    endDate: Date;
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
        date: scheduleStart,
        availableSeats: maxUsers,
        startDate: scheduleStart,
        endDate: scheduleEnd,
      });
    }

    current = addDays(current, 1);
  }

  if (schedules.length) {
    await db.insert(tourSchedules).values(schedules);
  }
}
