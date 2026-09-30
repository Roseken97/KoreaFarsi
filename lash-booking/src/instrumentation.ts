// Starts the reminder scheduler once per server process.
// Every 5 minutes it sends the SMS reminders that have come due (see lib/notify.ts).
export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs" || process.env.SMS_SCHEDULER === "off") return;
  const { runReminders } = await import("./lib/notify");
  const tick = () =>
    runReminders()
      .then((r) => r.sent + r.failed > 0 && console.info(`[reminders] sent ${r.sent}, failed ${r.failed}`))
      .catch((e) => console.error("[reminders] tick failed", e));
  setTimeout(tick, 15_000).unref();
  setInterval(tick, 5 * 60_000).unref();
}
