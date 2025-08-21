import {
  mysqlTable,
  timestamp,
  int,
  varchar,
  text,
  decimal,
  boolean,
  date,
  mysqlEnum,
} from "drizzle-orm/mysql-core";
import { getCurrentEgyptTime } from "../utils/timeZone";
import { use } from "passport";


export const admins = mysqlTable("admins", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).unique().notNull(),
  password: varchar("password", { length: 255 }).notNull(),
  phoneNumber: varchar("phone_number", { length: 255 }).notNull(),
  imagePath: varchar("image_path", { length: 255 }),
  isSuperAdmin: boolean("is_super_admin").default(false),
});

export const privileges = mysqlTable("privileges", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  action: varchar("action", { length: 255 }).notNull(),
});

export const adminPrivileges = mysqlTable("admin_privileges", {
  id: int("id").autoincrement().primaryKey(),
  adminId: int("admin_id").references(() => admins.id),
  privilegeId: int("privilege_id").references(() => privileges.id),
});

export const categories = mysqlTable("categories", {
  id: int("id").autoincrement().primaryKey(),
  imagePath: varchar("imagePath", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  status: boolean("status").default(false),
});

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).unique().notNull(),
  password: varchar("password", { length: 255 }),
  phoneNumber: varchar("phoneNumber", { length: 255 }),
  isVerified: boolean("is_verified").default(false),
  googleId: varchar("google_id", { length: 255 }).$type<string | null>(),
});

export const tours = mysqlTable("tours", {
  id: int("id").autoincrement().primaryKey(),
  categoryId: int("category_id").references(() => categories.id),
  title: varchar("title", { length: 255 }).notNull(),
  mainImage: varchar("mainImage", { length: 255 }).notNull(),
  status: boolean("status").default(false),
  featured: boolean("featured").default(false),
  describtion: text("describtion"),
  meetingPoint: boolean("meetingPoint").default(false),
  meetingPointLocation: text("meetingPointLocation"),
  meetingPointAddress: text("meetingPointAddress"),
  points: int("points").default(0),
  startDate: date("startDate").notNull(),
  endDate: date("endDate").notNull(),
  durationDays: int("duration_days").notNull(),
  durationHours: int("duration_hours").notNull(),
  country: int("country").references(() => countries.id),
  city: int("city").references(() => cites.id),
  maxUsers: int("max_users").notNull(),
});

export const tourImages = mysqlTable("tour_images", {
  id: int("id").autoincrement().primaryKey(),
  tourId: int("tour_id").references(() => tours.id),
  imagePath: varchar("image_path", { length: 255 }),
});

export const tourDiscounts = mysqlTable("tour_discounts", {
  id: int("id").autoincrement().primaryKey(),
  tourId: int("tour_id")
    .notNull()
    .references(() => tours.id, { onDelete: "cascade" }),
  targetGroup: mysqlEnum("target_group", [
    "adult",
    "child",
    "infant",
  ]).notNull(),
  type: mysqlEnum("type", ["percent", "fixed"]).notNull(),
  value: decimal("value", { precision: 5, scale: 2 }).notNull(),
  minPeople: int("min_people").default(0),
  maxPeople: int("max_people"),
  kindBy: mysqlEnum("kind_by", ["person", "total"]).notNull(),
});

export const tourDaysOfWeek = mysqlTable("tour_days_of_week", {
  id: int("id").autoincrement().primaryKey(),
  tourId: int("tour_id")
    .notNull()
    .references(() => tours.id, { onDelete: "cascade" }),

  dayOfWeek: mysqlEnum("day_of_week", [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ]).notNull(),
});

export const tourSchedules = mysqlTable("tour_schedules", {
  id: int("id").autoincrement().primaryKey(),
  tourId: int("tour_id")
    .notNull()
    .references(() => tours.id, { onDelete: "cascade" }),

  date: date("date").notNull(),
  availableSeats: int("available_seats").notNull(),
  startDate: timestamp("start_date").notNull(), 
  endDate: timestamp("end_date").notNull(),
});

export const tourPrice = mysqlTable("tour_price", {
  id: int("id").autoincrement().primaryKey(),
  adult: decimal("adult").notNull(),
  child: decimal("child").notNull(),
  infant: decimal("infant").notNull(),
  currencyId: int("currency_id")
    .notNull()
    .references(() => currencies.id),
  tourId: int("tour_id")
    .notNull()
    .references(() => tours.id),
});

export const tourHighlight = mysqlTable("tour_highlight", {
  id: int("id").autoincrement().primaryKey(),
  tourId: int("tour_id").references(() => tours.id),
  content: varchar("content", { length: 255 }).notNull(),
});

export const tourIncludes = mysqlTable("tour_includes", {
  id: int("id").autoincrement().primaryKey(),
  tourId: int("tour_id").references(() => tours.id),
  content: varchar("content", { length: 255 }).notNull(),
});

export const tourExcludes = mysqlTable("tour_excludes", {
  id: int("id").autoincrement().primaryKey(),
  tourId: int("tour_id").references(() => tours.id),
  content: varchar("content", { length: 255 }).notNull(),
});

export const tourItinerary = mysqlTable("tour_itinerary", {
  id: int("id").autoincrement().primaryKey(),
  tourId: int("tour_id").references(() => tours.id),
  title: varchar("title", { length: 255 }).notNull(),
  imagePath: varchar("image_path", { length: 255 }),
  describtion: text("describtion"),
});

export const tourFAQ = mysqlTable("tour_faq", {
  id: int("id").autoincrement().primaryKey(),
  tourId: int("tour_id").references(() => tours.id),
  question: varchar("question", { length: 255 }),
  answer: varchar("answer", { length: 255 }),
});

export const currencies = mysqlTable("currencies", {
  id: int("id").autoincrement().primaryKey(),
  code: varchar("code", { length: 3 }).notNull(),
  name: varchar("name", { length: 50 }),
  symbol: varchar("symbol", { length: 5 }),
});

export const promoCode = mysqlTable("promo_code", {
  id: int("id").autoincrement().primaryKey(),
  code: varchar("code", { length: 20 }).notNull(),
  discountType: mysqlEnum("discount_type", ["percentage", "amount"]).notNull(),
  discountValue: int("discount_value").notNull(),
  usageLimit: int("usade_limit").notNull(),
  status: boolean("status").default(false),
  startDate: date("startDate").notNull(),
  endDate: date("endDate").notNull(),
});

export const tourPromoCode = mysqlTable("tour_promo_code", {
  id: int("id").autoincrement().primaryKey(),
  tourId: int("tour_id").notNull().references(() => tours.id),
  promoCodeId: int("promo_code_id").notNull().references(() => promoCode.id),
})

export const promoCodeUsers = mysqlTable("promo_code_users", {
  id: int("id").autoincrement().primaryKey(),
  promoCodeId: int("promo_code_id").references(() => promoCode.id),
  userId: int("user_id").references(() => users.id),
});

export const emailVerifications = mysqlTable("email_verifications", {
  userId: int("user_id").primaryKey(),
  code: varchar("code", { length: 6 }).notNull(),
  createdAt: date("created_at").default(getCurrentEgyptTime()),
});

export const extras = mysqlTable("extras", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
});

export const tourExtras = mysqlTable("tour_extras", {
  id: int("id").autoincrement().primaryKey(),
  tourId: int("tour_id").references(() => tours.id),
  extraId: int("extra_id").references(() => extras.id),
  priceId: int("price_id").references(() => tourPrice.id),
});

export const bookings = mysqlTable("bookings", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").references(() => users.id),
  tourId: int("tour_id").references(() => tourSchedules.id),
  status: mysqlEnum("status", ["pending", "confirmed", "cancelled"]),
  //discount
  discountNumber: decimal("discount_number", { precision: 10, scale: 2 }),
  location: varchar("location", { length: 255 }),
  address: varchar("address", { length: 255 }),
 createdAt: timestamp("created_at").default(getCurrentEgyptTime()), 
});

export const bookingDetails = mysqlTable("booking_details", {
  id: int("id").autoincrement().primaryKey(),
  bookingId: int("booking_id").references(() => bookings.id),
  fullName: varchar("full_name", { length: 255 }),
  email: varchar("email", { length: 255 }),
  phone: varchar("phone", { length: 20 }),
  notes: text("notes"),
  adultsCount: int("adults_count").default(0),
  childrenCount: int("children_count").default(0),
  infantsCount: int("infants_count").default(0),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }),
  createdAt: timestamp("created_at")
});


export const bookingExtras = mysqlTable("booking_extras", {
  id: int("id").autoincrement().primaryKey(),
  bookingId: int("booking_id").references(() => bookings.id),
  extraId: int("extra_id").references(() => extras.id),
  adultCount: int("adult_count").default(0),
  childCount: int("child_count").default(0),
  infantCount: int("infant_count").default(0),
  createdAt: timestamp("created_at").default(getCurrentEgyptTime()),
});


export const payments = mysqlTable("payments", {
  id: int("id").autoincrement().primaryKey(),
  bookingId: int("booking_id").references(() => bookings.id),
  method: mysqlEnum("method", ["manual", "auto"]),
  status: mysqlEnum("status", ["pending", "confirmed", "cancelled"]),
  amount: decimal("amount"),
  transactionId: varchar("transaction_id", { length: 255 }),
  createdAt: date("created_at").default(getCurrentEgyptTime()),
  rejectionReason: varchar("rejection_reason", { length: 255 }),
});

export const manualPaymentMethod = mysqlTable("manual_payment_method", {
  id: int("id").autoincrement().primaryKey(),
  paymentId: int("payment_id").references(() => payments.id),
  manualPaymentTypeId: int("manual_payment_type_id").references(
    () => manualPaymentTypes.id
  ),
  proofImage: varchar("proof_image", { length: 255 }),
  prooftext: varchar("proof_text", { length: 255 }),
  uploadedAt: date().default(getCurrentEgyptTime()),
});

export const manualPaymentTypes = mysqlTable("manual_payment_types", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  describtion: varchar("describtion", { length: 255 }),
  logoPath: varchar("logo_path", { length: 255 }),
  status: boolean("status").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const homePageCover = mysqlTable("home_page_cover", {
  id: int("id").autoincrement().primaryKey(),
  imagePath: varchar("image_path", { length: 255 }).notNull(),
  status: boolean("status").default(false).notNull(),
});

export const homePageFAQ = mysqlTable("home_page_faq", {
  id: int("id").autoincrement().primaryKey(),
  question: varchar("question", { length: 255 }).notNull(),
  answer: text("answer").notNull(),
  status: boolean("status").default(false),
});

export const countries = mysqlTable("countries", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  imagePath: varchar("image_path", { length: 255 }),
});

export const cites = mysqlTable("cities", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  countryId: int("country_id").references(() => countries.id),
});

export const categoryMedical = mysqlTable("category_medical", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
});


export const Medicals = mysqlTable("medicals", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").references(() => users.id),
  fullName: varchar("full_name", { length: 255 }), 
  phoneNumber: varchar("phone_number", { length: 20 }), 
  describtion: text("describtion").notNull(),
  status: mysqlEnum("status", ["pending", "accepted", "rejected"]).default("pending"),
  rejectionReason: text("rejection_reason"),
  price: decimal("price", { precision: 10, scale: 2 }),
  documentUrl: varchar("document_url", { length: 512 }),
  documentType: mysqlEnum("document_type", ["image", "file"]),
});


export const medicalCategories = mysqlTable("medical_categories", {
  id: int("id").autoincrement().primaryKey(),
  medicalId: int("medical_id").references(() => Medicals.id),
  categoryId: int("category_id").references(() => categoryMedical.id),
  createdAt: timestamp("created_at").default(getCurrentEgyptTime()),
});

export const MedicalImages = mysqlTable("medical_images", {
  id: int("id").autoincrement().primaryKey(),
  medicalId: int("medical_id").references(() => Medicals.id),
  imagePath: varchar("image_path", { length: 255 }).notNull(),
});

