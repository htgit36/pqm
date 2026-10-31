import "server-only";
import { cache } from "react";
import { and, asc, desc, eq, lte } from "drizzle-orm";
import { db, schema } from "./db";

const { services, posts, clients } = schema;

export const getServices = cache(() =>
  db.select().from(services).where(eq(services.published, true)).orderBy(asc(services.sortOrder), asc(services.id)),
);

export const getService = cache(async (slug: string) => {
  const [row] = await db
    .select()
    .from(services)
    .where(and(eq(services.slug, slug), eq(services.published, true)))
    .limit(1);
  return row ?? null;
});

export const getPosts = cache(() =>
  db
    .select()
    .from(posts)
    .where(and(eq(posts.published, true), lte(posts.publishedAt, new Date())))
    .orderBy(desc(posts.publishedAt)),
);

export const getPost = cache(async (slug: string) => {
  const [row] = await db
    .select()
    .from(posts)
    .where(and(eq(posts.slug, slug), eq(posts.published, true)))
    .limit(1);
  return row ?? null;
});

export const getClients = cache(() => db.select().from(clients).orderBy(asc(clients.sortOrder), asc(clients.id)));
