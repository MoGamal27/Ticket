"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cites = exports.countries = exports.homePageFAQ = exports.homePageCover = exports.manualPaymentTypes = exports.manualPaymentMethod = exports.payments = exports.bookingExtras = exports.bookingDetails = exports.bookings = exports.tourExtras = exports.extras = exports.emailVerifications = exports.promoCodeUsers = exports.promoCode = exports.currencies = exports.tourFAQ = exports.tourItinerary = exports.tourExcludes = exports.tourIncludes = exports.tourHighlight = exports.tourPrice = exports.tourSchedules = exports.tourDaysOfWeek = exports.tourDiscounts = exports.tourImages = exports.tours = exports.users = exports.categories = exports.adminPrivileges = exports.privileges = exports.admins = void 0;
const mysql_core_1 = require("drizzle-orm/mysql-core");
const timeZone_1 = require("../utils/timeZone");
exports.admins = (0, mysql_core_1.mysqlTable)("admins", {
    id: (0, mysql_core_1.int)("id").autoincrement().primaryKey(),
    name: (0, mysql_core_1.varchar)("name", { length: 255 }).notNull(),
    email: (0, mysql_core_1.varchar)("email", { length: 255 }).unique().notNull(),
    password: (0, mysql_core_1.varchar)("password", { length: 255 }).notNull(),
    phoneNumber: (0, mysql_core_1.varchar)("phone_number", { length: 255 }).notNull(),
    imagePath: (0, mysql_core_1.varchar)("image_path", { length: 255 }),
    isSuperAdmin: (0, mysql_core_1.boolean)("is_super_admin").default(false),
});
exports.privileges = (0, mysql_core_1.mysqlTable)("privileges", {
    id: (0, mysql_core_1.int)("id").autoincrement().primaryKey(),
    name: (0, mysql_core_1.varchar)("name", { length: 100 }).notNull(),
    action: (0, mysql_core_1.varchar)("action", { length: 255 }).notNull(),
});
exports.adminPrivileges = (0, mysql_core_1.mysqlTable)("admin_privileges", {
    id: (0, mysql_core_1.int)("id").autoincrement().primaryKey(),
    adminId: (0, mysql_core_1.int)("admin_id").references(() => exports.admins.id),
    privilegeId: (0, mysql_core_1.int)("privilege_id").references(() => exports.privileges.id),
});
exports.categories = (0, mysql_core_1.mysqlTable)("categories", {
    id: (0, mysql_core_1.int)("id").autoincrement().primaryKey(),
    imagePath: (0, mysql_core_1.varchar)("imagePath", { length: 255 }).notNull(),
    name: (0, mysql_core_1.varchar)("name", { length: 255 }).notNull(),
    status: (0, mysql_core_1.boolean)("status").default(false),
});
exports.users = (0, mysql_core_1.mysqlTable)("users", {
    id: (0, mysql_core_1.int)("id").autoincrement().primaryKey(),
    name: (0, mysql_core_1.varchar)("name", { length: 255 }).notNull(),
    email: (0, mysql_core_1.varchar)("email", { length: 255 }).unique().notNull(),
    password: (0, mysql_core_1.varchar)("password", { length: 255 }),
    phoneNumber: (0, mysql_core_1.varchar)("phoneNumber", { length: 255 }),
    isVerified: (0, mysql_core_1.boolean)("is_verified").default(false),
});
exports.tours = (0, mysql_core_1.mysqlTable)("tours", {
    id: (0, mysql_core_1.int)("id").autoincrement().primaryKey(),
    categoryId: (0, mysql_core_1.int)("category_id").references(() => exports.categories.id),
    title: (0, mysql_core_1.varchar)("title", { length: 255 }).notNull(),
    mainImage: (0, mysql_core_1.varchar)("mainImage", { length: 255 }).notNull(),
    status: (0, mysql_core_1.boolean)("status").default(false),
    featured: (0, mysql_core_1.boolean)("featured").default(false),
    describtion: (0, mysql_core_1.text)("describtion"),
    meetingPoint: (0, mysql_core_1.boolean)("meetingPoint").default(false),
    meetingPointLocation: (0, mysql_core_1.text)("meetingPointLocation"),
    meetingPointAddress: (0, mysql_core_1.text)("meetingPointAddress"),
    points: (0, mysql_core_1.int)("points").default(0),
    startDate: (0, mysql_core_1.timestamp)("startDate").notNull(),
    endDate: (0, mysql_core_1.timestamp)("endDate").notNull(),
    durationDays: (0, mysql_core_1.int)("duration_days").notNull(),
    durationHours: (0, mysql_core_1.int)("duration_hours").notNull(),
    country: (0, mysql_core_1.int)("country").references(() => exports.countries.id),
    city: (0, mysql_core_1.int)("city").references(() => exports.cites.id),
    maxUsers: (0, mysql_core_1.int)("max_users").notNull(),
});
exports.tourImages = (0, mysql_core_1.mysqlTable)("tour_images", {
    id: (0, mysql_core_1.int)("id").autoincrement().primaryKey(),
    tourId: (0, mysql_core_1.int)("tour_id").references(() => exports.tours.id),
    imagePath: (0, mysql_core_1.varchar)("image_path", { length: 255 }),
});
exports.tourDiscounts = (0, mysql_core_1.mysqlTable)("tour_discounts", {
    id: (0, mysql_core_1.int)("id").autoincrement().primaryKey(),
    tourId: (0, mysql_core_1.int)("tour_id")
        .notNull()
        .references(() => exports.tours.id, { onDelete: "cascade" }),
    targetGroup: (0, mysql_core_1.mysqlEnum)("target_group", [
        "adult",
        "child",
        "infant",
    ]).notNull(),
    type: (0, mysql_core_1.mysqlEnum)("type", ["percent", "fixed"]).notNull(),
    value: (0, mysql_core_1.decimal)("value", { precision: 5, scale: 2 }).notNull(),
    minPeople: (0, mysql_core_1.int)("min_people").default(0),
    maxPeople: (0, mysql_core_1.int)("max_people"),
    kindBy: (0, mysql_core_1.mysqlEnum)("kind_by", ["person", "total"]).notNull(),
});
exports.tourDaysOfWeek = (0, mysql_core_1.mysqlTable)("tour_days_of_week", {
    id: (0, mysql_core_1.int)("id").autoincrement().primaryKey(),
    tourId: (0, mysql_core_1.int)("tour_id")
        .notNull()
        .references(() => exports.tours.id, { onDelete: "cascade" }),
    dayOfWeek: (0, mysql_core_1.mysqlEnum)("day_of_week", [
        "sunday",
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
    ]).notNull(),
});
exports.tourSchedules = (0, mysql_core_1.mysqlTable)("tour_schedules", {
    id: (0, mysql_core_1.int)("id").autoincrement().primaryKey(),
    tourId: (0, mysql_core_1.int)("tour_id")
        .notNull()
        .references(() => exports.tours.id, { onDelete: "cascade" }),
    date: (0, mysql_core_1.date)("date").notNull(),
    availableSeats: (0, mysql_core_1.int)("available_seats").notNull(),
    startDate: (0, mysql_core_1.timestamp)("start_date").notNull(), // Optional if your logic needs range per schedule
    endDate: (0, mysql_core_1.timestamp)("end_date").notNull(),
});
exports.tourPrice = (0, mysql_core_1.mysqlTable)("tour_price", {
    id: (0, mysql_core_1.int)("id").autoincrement().primaryKey(),
    adult: (0, mysql_core_1.decimal)("adult").notNull(),
    child: (0, mysql_core_1.decimal)("child").notNull(),
    infant: (0, mysql_core_1.decimal)("infant").notNull(),
    currencyId: (0, mysql_core_1.int)("currency_id")
        .notNull()
        .references(() => exports.currencies.id),
    tourId: (0, mysql_core_1.int)("tour_id")
        .notNull()
        .references(() => exports.tours.id),
});
exports.tourHighlight = (0, mysql_core_1.mysqlTable)("tour_highlight", {
    id: (0, mysql_core_1.int)("id").autoincrement().primaryKey(),
    tourId: (0, mysql_core_1.int)("tour_id").references(() => exports.tours.id),
    content: (0, mysql_core_1.varchar)("content", { length: 255 }).notNull(),
});
exports.tourIncludes = (0, mysql_core_1.mysqlTable)("tour_includes", {
    id: (0, mysql_core_1.int)("id").autoincrement().primaryKey(),
    tourId: (0, mysql_core_1.int)("tour_id").references(() => exports.tours.id),
    content: (0, mysql_core_1.varchar)("content", { length: 255 }).notNull(),
});
exports.tourExcludes = (0, mysql_core_1.mysqlTable)("tour_excludes", {
    id: (0, mysql_core_1.int)("id").autoincrement().primaryKey(),
    tourId: (0, mysql_core_1.int)("tour_id").references(() => exports.tours.id),
    content: (0, mysql_core_1.varchar)("content", { length: 255 }).notNull(),
});
exports.tourItinerary = (0, mysql_core_1.mysqlTable)("tour_itinerary", {
    id: (0, mysql_core_1.int)("id").autoincrement().primaryKey(),
    tourId: (0, mysql_core_1.int)("tour_id").references(() => exports.tours.id),
    title: (0, mysql_core_1.varchar)("title", { length: 255 }).notNull(),
    imagePath: (0, mysql_core_1.varchar)("image_path", { length: 255 }),
    describtion: (0, mysql_core_1.text)("describtion"),
});
exports.tourFAQ = (0, mysql_core_1.mysqlTable)("tour_faq", {
    id: (0, mysql_core_1.int)("id").autoincrement().primaryKey(),
    tourId: (0, mysql_core_1.int)("tour_id").references(() => exports.tours.id),
    question: (0, mysql_core_1.varchar)("question", { length: 255 }),
    answer: (0, mysql_core_1.varchar)("answer", { length: 255 }),
});
exports.currencies = (0, mysql_core_1.mysqlTable)("currencies", {
    id: (0, mysql_core_1.int)("id").autoincrement().primaryKey(),
    code: (0, mysql_core_1.varchar)("code", { length: 3 }).notNull(),
    name: (0, mysql_core_1.varchar)("name", { length: 50 }),
    symbol: (0, mysql_core_1.varchar)("symbol", { length: 5 }),
});
exports.promoCode = (0, mysql_core_1.mysqlTable)("promo_code", {
    id: (0, mysql_core_1.int)("id").autoincrement().primaryKey(),
    code: (0, mysql_core_1.varchar)("code", { length: 20 }).notNull(),
    discountType: (0, mysql_core_1.mysqlEnum)("discount_type", ["percentage", "amount"]).notNull(),
    discountValue: (0, mysql_core_1.int)("discount_value").notNull(),
    usageLimit: (0, mysql_core_1.int)("usade_limit").notNull(),
    status: (0, mysql_core_1.boolean)("status").default(false),
    startDate: (0, mysql_core_1.date)("startDate").notNull(),
    endDate: (0, mysql_core_1.date)("endDate").notNull(),
});
exports.promoCodeUsers = (0, mysql_core_1.mysqlTable)("promo_code_users", {
    id: (0, mysql_core_1.int)("id").autoincrement().primaryKey(),
    promoCodeId: (0, mysql_core_1.int)("promo_code_id").references(() => exports.promoCode.id),
    userId: (0, mysql_core_1.int)("user_id").references(() => exports.users.id),
});
exports.emailVerifications = (0, mysql_core_1.mysqlTable)("email_verifications", {
    userId: (0, mysql_core_1.int)("user_id").primaryKey(),
    code: (0, mysql_core_1.varchar)("code", { length: 6 }).notNull(),
    createdAt: (0, mysql_core_1.date)("created_at").default((0, timeZone_1.getCurrentEgyptTime)()),
});
exports.extras = (0, mysql_core_1.mysqlTable)("extras", {
    id: (0, mysql_core_1.int)("id").autoincrement().primaryKey(),
    name: (0, mysql_core_1.varchar)("name", { length: 255 }).notNull(),
});
exports.tourExtras = (0, mysql_core_1.mysqlTable)("tour_extras", {
    id: (0, mysql_core_1.int)("id").autoincrement().primaryKey(),
    tourId: (0, mysql_core_1.int)("tour_id").references(() => exports.tours.id),
    extraId: (0, mysql_core_1.int)("extra_id").references(() => exports.extras.id),
    priceId: (0, mysql_core_1.int)("price_id").references(() => exports.tourPrice.id),
});
exports.bookings = (0, mysql_core_1.mysqlTable)("bookings", {
    id: (0, mysql_core_1.int)("id").autoincrement().primaryKey(),
    userId: (0, mysql_core_1.int)("user_id").references(() => exports.users.id),
    tourId: (0, mysql_core_1.int)("tour_id").references(() => exports.tourSchedules.id),
    status: (0, mysql_core_1.mysqlEnum)("status", ["pending", "confirmed", "cancelled"]),
    createdAt: (0, mysql_core_1.timestamp)("created_at").defaultNow()
});
exports.bookingDetails = (0, mysql_core_1.mysqlTable)("booking_details", {
    id: (0, mysql_core_1.int)("id").autoincrement().primaryKey(),
    bookingId: (0, mysql_core_1.int)("booking_id").references(() => exports.bookings.id),
    fullName: (0, mysql_core_1.varchar)("full_name", { length: 255 }),
    email: (0, mysql_core_1.varchar)("email", { length: 255 }),
    phone: (0, mysql_core_1.varchar)("phone", { length: 20 }),
    notes: (0, mysql_core_1.text)("notes"),
    adultsCount: (0, mysql_core_1.int)("adults_count").default(0),
    childrenCount: (0, mysql_core_1.int)("children_count").default(0),
    infantsCount: (0, mysql_core_1.int)("infants_count").default(0),
    totalAmount: (0, mysql_core_1.decimal)("total_amount", { precision: 10, scale: 2 }),
    createdAt: (0, mysql_core_1.timestamp)("created_at")
});
exports.bookingExtras = (0, mysql_core_1.mysqlTable)("booking_extras", {
    id: (0, mysql_core_1.int)("id").autoincrement().primaryKey(),
    bookingId: (0, mysql_core_1.int)("booking_id").references(() => exports.bookings.id),
    extraId: (0, mysql_core_1.int)("extra_id"),
    adultCount: (0, mysql_core_1.int)("adult_count").default(0),
    childCount: (0, mysql_core_1.int)("child_count").default(0),
    infantCount: (0, mysql_core_1.int)("infant_count").default(0),
    createdAt: (0, mysql_core_1.timestamp)("created_at").default((0, timeZone_1.getCurrentEgyptTime)()),
});
exports.payments = (0, mysql_core_1.mysqlTable)("payments", {
    id: (0, mysql_core_1.int)("id").autoincrement().primaryKey(),
    bookingId: (0, mysql_core_1.int)("booking_id").references(() => exports.bookings.id),
    method: (0, mysql_core_1.mysqlEnum)("method", ["manual", "auto"]),
    status: (0, mysql_core_1.mysqlEnum)("status", ["pending", "confirmed", "cancelled"]),
    amount: (0, mysql_core_1.decimal)("amount"),
    transactionId: (0, mysql_core_1.varchar)("transaction_id", { length: 255 }),
    createdAt: (0, mysql_core_1.date)("created_at").default((0, timeZone_1.getCurrentEgyptTime)()),
    rejectionReason: (0, mysql_core_1.varchar)("rejection_reason", { length: 255 }),
});
exports.manualPaymentMethod = (0, mysql_core_1.mysqlTable)("manual_payment_method", {
    id: (0, mysql_core_1.int)("id").autoincrement().primaryKey(),
    paymentId: (0, mysql_core_1.int)("payment_id").references(() => exports.payments.id),
    manualPaymentTypeId: (0, mysql_core_1.int)("manual_payment_type_id").references(() => exports.manualPaymentTypes.id),
    proofImage: (0, mysql_core_1.varchar)("proof_image", { length: 255 }),
    prooftext: (0, mysql_core_1.varchar)("proof_text", { length: 255 }),
    uploadedAt: (0, mysql_core_1.date)().default((0, timeZone_1.getCurrentEgyptTime)()),
});
exports.manualPaymentTypes = (0, mysql_core_1.mysqlTable)("manual_payment_types", {
    id: (0, mysql_core_1.int)("id").autoincrement().primaryKey(),
    name: (0, mysql_core_1.varchar)("name", { length: 100 }).notNull(),
    describtion: (0, mysql_core_1.varchar)("describtion", { length: 255 }),
    logoPath: (0, mysql_core_1.varchar)("logo_path", { length: 255 }),
    status: (0, mysql_core_1.boolean)("status").default(true),
    createdAt: (0, mysql_core_1.timestamp)("created_at").defaultNow(),
});
exports.homePageCover = (0, mysql_core_1.mysqlTable)("home_page_cover", {
    id: (0, mysql_core_1.int)("id").autoincrement().primaryKey(),
    imagePath: (0, mysql_core_1.varchar)("image_path", { length: 255 }).notNull(),
    status: (0, mysql_core_1.boolean)("status").default(false).notNull(),
});
exports.homePageFAQ = (0, mysql_core_1.mysqlTable)("home_page_faq", {
    id: (0, mysql_core_1.int)("id").autoincrement().primaryKey(),
    question: (0, mysql_core_1.varchar)("question", { length: 255 }).notNull(),
    answer: (0, mysql_core_1.text)("answer").notNull(),
    status: (0, mysql_core_1.boolean)("status").default(false),
});
exports.countries = (0, mysql_core_1.mysqlTable)("countries", {
    id: (0, mysql_core_1.int)("id").autoincrement().primaryKey(),
    name: (0, mysql_core_1.varchar)("name", { length: 255 }).notNull(),
    imagePath: (0, mysql_core_1.varchar)("image_path", { length: 255 }),
});
exports.cites = (0, mysql_core_1.mysqlTable)("cities", {
    id: (0, mysql_core_1.int)("id").autoincrement().primaryKey(),
    name: (0, mysql_core_1.varchar)("name", { length: 255 }).notNull(),
    countryId: (0, mysql_core_1.int)("country_id").references(() => exports.countries.id),
});
