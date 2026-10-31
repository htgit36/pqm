import {
  boolean,
  datetime,
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

export const settings = mysqlTable("settings", {
  key: varchar({ length: 100 }).primaryKey(),
  value: text().notNull(),
});

export type Service = typeof services.$inferSelect;
export type Project = typeof projects.$inferSelect;
export type Post = typeof posts.$inferSelect;
export type Client = typeof clients.$inferSelect;
export type Lead = typeof leads.$inferSelect;
