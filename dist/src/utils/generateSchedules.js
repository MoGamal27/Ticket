"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTourSchedules = generateTourSchedules;
exports.generateTourSchedulesInTransaction = generateTourSchedulesInTransaction;
const date_fns_1 = require("date-fns");
const db_1 = require("../models/db");
const schema_1 = require("../models/schema");
// Original function for use outside transactions
function generateTourSchedules(_a) {
    return __awaiter(this, arguments, void 0, function* ({ tourId, startDate, endDate, daysOfWeek, maxUsers, durationDays, durationHours, }) {
        const start = (0, date_fns_1.parseISO)(startDate);
        const end = (0, date_fns_1.parseISO)(endDate);
        const selectedDays = daysOfWeek.map((d) => d.toLowerCase());
        const schedules = [];
        let current = start;
        while ((0, date_fns_1.isBefore)(current, (0, date_fns_1.addDays)(end, 1))) {
            const day = current
                .toLocaleDateString("en-US", { weekday: "long" })
                .toLowerCase();
            if (selectedDays.includes(day)) {
                const scheduleStart = current;
                const scheduleEnd = (0, date_fns_1.addHours)((0, date_fns_1.addDays)(scheduleStart, durationDays), durationHours);
                schedules.push({
                    tourId,
                    date: (0, date_fns_1.format)(scheduleStart, 'yyyy-MM-dd HH:mm:ss'),
                    availableSeats: maxUsers,
                    startDate: (0, date_fns_1.format)(scheduleStart, 'yyyy-MM-dd HH:mm:ss'),
                    endDate: (0, date_fns_1.format)(scheduleEnd, 'yyyy-MM-dd HH:mm:ss'),
                });
            }
            current = (0, date_fns_1.addDays)(current, 1);
        }
        if (schedules.length) {
            yield db_1.db.insert(schema_1.tourSchedules).values(schedules);
        }
    });
}
// Transaction-aware version for use within transactions
function generateTourSchedulesInTransaction(tx_1, _a) {
    return __awaiter(this, arguments, void 0, function* (tx, { tourId, startDate, endDate, daysOfWeek, maxUsers, durationDays, durationHours, }) {
        const start = (0, date_fns_1.parseISO)(startDate);
        const end = (0, date_fns_1.parseISO)(endDate);
        const selectedDays = daysOfWeek.map((d) => d.toLowerCase());
        const schedules = [];
        let current = start;
        while ((0, date_fns_1.isBefore)(current, (0, date_fns_1.addDays)(end, 1))) {
            const day = current
                .toLocaleDateString("en-US", { weekday: "long" })
                .toLowerCase();
            if (selectedDays.includes(day)) {
                const scheduleStart = current;
                const scheduleEnd = (0, date_fns_1.addHours)((0, date_fns_1.addDays)(scheduleStart, durationDays), durationHours);
                schedules.push({
                    tourId,
                    date: new Date(scheduleStart),
                    availableSeats: maxUsers,
                    startDate: new Date(scheduleStart),
                    endDate: new Date(scheduleEnd),
                });
            }
            current = (0, date_fns_1.addDays)(current, 1);
        }
        if (schedules.length) {
            yield tx.insert(schema_1.tourSchedules).values(schedules);
        }
    });
}
