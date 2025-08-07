"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentEgyptTime = getCurrentEgyptTime;
exports.convertToEgyptTime = convertToEgyptTime;
const date_fns_tz_1 = require("date-fns-tz");
const EGYPT_TIMEZONE = "Africa/Cairo";
function getCurrentEgyptTime() {
    const now = new Date();
    const time = (0, date_fns_tz_1.toZonedTime)(now, EGYPT_TIMEZONE);
    return time;
}
function convertToEgyptTime(date) {
    return (0, date_fns_tz_1.toZonedTime)(date, EGYPT_TIMEZONE);
}
