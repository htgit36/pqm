import "server-only";
import { cache } from "react";
import { and, asc, desc, eq, lte, ne } from "drizzle-orm";
import { db, schema } from "./db";

const { services, projects, posts, clients, testimonials } = schema;

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

export const getProjects = cache(() =>
  db.select().from(projects).where(eq(projects.published, true)).orderBy(asc(projects.sortOrder), desc(projects.id)),
);

export const getProject = cache(async (slug: string) => {
  const [row] = await db
    .select()
    .from(projects)
    .where(and(eq(projects.slug, slug), eq(projects.published, true)))
    .limit(1);
  return row ?? null;
});

export async function getRelatedProjects(category: string, excludeId: number, limit = 3) {
  return db
    .select()
    .from(projects)
    .where(and(eq(projects.published, true), eq(projects.category, category), ne(projects.id, excludeId)))
    .orderBy(asc(projects.sortOrder))
    .limit(limit);
}

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

export const getTestimonials = cache(() =>
  db.select().from(testimonials).where(eq(testimonials.published, true)).orderBy(asc(testimonials.sortOrder), asc(testimonials.id)),
);
