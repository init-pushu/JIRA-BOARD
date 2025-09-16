import { Inngest } from "inngest";

export const inngest = new Inngest({
  name: "Ticketing System",
  eventKey: process.env.INNGEST_EVENT_KEY || undefined, // ✅ use key if available
});
