import {
  boolean,
  datetime,
  index,
  int,
  json,
  mediumtext,
  mysqlTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

export const services = mysqlTable("services", {
  id: int().autoincrement().primaryKey(),
  slug: varchar({ length: 191 }).notNull().unique(),
  titleVi: varchar({ length: 255 }).notNull(),
  titleEn: varchar({ length: 255 }).notNull().default(""),
  summaryVi: text(),
  summaryEn: text(),
  bodyVi: mediumtext(),
  bodyEn: mediumtext(),
  coverImage: varchar({ length: 500 }),
  featured: boolean().notNull().default(false),
  published: boolean().notNull().default(true),
  sortOrder: int().notNull().default(0),
  updatedAt: timestamp().defaultNow().onUpdateNow().notNull(),
});

export const projects = mysqlTable("projects", {
  id: int().autoincrement().primaryKey(),
  slug: varchar({ length: 191 }).notNull().unique(),
  titleVi: varchar({ length: 255 }).notNull(),
  titleEn: varchar({ length: 255 }).notNull().default(""),
  client: varchar({ length: 255 }),
  category: varchar({ length: 64 }).notNull().default("event"),
  kind: varchar({ length: 16 }).notNull().default("photo"),
  year: int(),
  coverImage: varchar({ length: 500 }),
  videoUrl: varchar({ length: 500 }),
  externalUrl: varchar({ length: 500 }),
  gallery: json().$type<string[]>(),
  summaryVi: text(),
  summaryEn: text(),
  bodyVi: mediumtext(),
  bodyEn: mediumtext(),
  featured: boolean().notNull().default(false),
  published: boolean().notNull().default(true),
  sortOrder: int().notNull().default(0),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().defaultNow().onUpdateNow().notNull(),
});

export const posts = mysqlTable("posts", {
  id: int().autoincrement().primaryKey(),
  slug: varchar({ length: 191 }).notNull().unique(),
  titleVi: varchar({ length: 255 }).notNull(),
  titleEn: varchar({ length: 255 }).notNull().default(""),
  excerptVi: text(),
  excerptEn: text(),
  bodyVi: mediumtext(),
  bodyEn: mediumtext(),
  coverImage: varchar({ length: 500 }),
  publishedAt: datetime().notNull(),
  published: boolean().notNull().default(true),
  updatedAt: timestamp().defaultNow().onUpdateNow().notNull(),
});

export const clients = mysqlTable("clients", {
  id: int().autoincrement().primaryKey(),
  name: varchar({ length: 255 }).notNull(),
  logo: varchar({ length: 500 }),
  url: varchar({ length: 500 }),
  sortOrder: int().notNull().default(0),
});

export const testimonials = mysqlTable("testimonials", {
  id: int().autoincrement().primaryKey(),
  authorName: varchar({ length: 255 }).notNull(),
  authorRoleVi: varchar({ length: 255 }),
  authorRoleEn: varchar({ length: 255 }),
  quoteVi: text().notNull(),
  quoteEn: text(),
  avatar: varchar({ length: 500 }),
  published: boolean().notNull().default(true),
  sortOrder: int().notNull().default(0),
});

export const leads = mysqlTable("leads", {
  id: int().autoincrement().primaryKey(),
  name: varchar({ length: 255 }).notNull(),
  phone: varchar({ length: 64 }).notNull(),
  email: varchar({ length: 255 }),
  company: varchar({ length: 255 }),
  service: varchar({ length: 255 }),
  eventDate: varchar({ length: 64 }),
  message: text(),
  locale: varchar({ length: 8 }).notNull().default("vi"),
  status: varchar({ length: 16 }).notNull().default("new"),
  note: text(),
  createdAt: timestamp().defaultNow().notNull(),
});

export const pageViews = mysqlTable(
  "page_views",
  {
    id: int().autoincrement().primaryKey(),
    createdAt: timestamp().defaultNow().notNull(),
    ip: varchar({ length: 64 }).notNull(),
    sessionId: varchar({ length: 40 }),
    path: varchar({ length: 500 }).notNull(),
    locale: varchar({ length: 8 }).notNull().default("vi"),
    referrer: varchar({ length: 500 }),
    source: varchar({ length: 100 }).notNull().default("Truy cập trực tiếp"),
    medium: varchar({ length: 16 }).notNull().default("direct"),
    utmCampaign: varchar({ length: 191 }),
    device: varchar({ length: 16 }).notNull().default("desktop"),
    browser: varchar({ length: 32 }),
    os: varchar({ length: 32 }),
    country: varchar({ length: 64 }),
    city: varchar({ length: 100 }),
    userAgent: varchar({ length: 400 }),
  },
  (t) => [index("page_views_created_idx").on(t.createdAt), index("page_views_ip_idx").on(t.ip)],
);

export const settings = mysqlTable("settings", {
  key: varchar({ length: 100 }).primaryKey(),
  value: text().notNull(),
});

export type Service = typeof services.$inferSelect;
export type Project = typeof projects.$inferSelect;
export type Post = typeof posts.$inferSelect;
export type Client = typeof clients.$inferSelect;
export type Testimonial = typeof testimonials.$inferSelect;
export type Lead = typeof leads.$inferSelect;
