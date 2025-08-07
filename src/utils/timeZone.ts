import { toZonedTime, format } from "date-fns-tz";

const EGYPT_TIMEZONE = "Africa/Cairo";

export function getCurrentEgyptTime(): Date {
  const now = new Date();
  const time = toZonedTime(now, EGYPT_TIMEZONE);
  return time;
}

export function convertToEgyptTime(date: Date): Date {
  return toZonedTime(date, EGYPT_TIMEZONE);
}
