export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;
  if (process.env.NEXT_PHASE === "phase-production-build") return;
  if (!process.env.DATABASE_URL) {
    console.warn("[db] Thiếu DATABASE_URL — bỏ qua migrate.");
    return;
  }
  try {
    const { runMigrations } = await import("./lib/db/migrate");
    await runMigrations();
  } catch (err) {
    console.error("[db] Migrate thất bại:", err);
  }
}
