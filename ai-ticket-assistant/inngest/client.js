import { Inngest } from "inngest";

export const inngest = new Inngest({ id: "ticketing-system" , eventKey: process.env.INNGEST_EVENT_KEY || undefined, });
