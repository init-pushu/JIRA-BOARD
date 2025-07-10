import { createAgent, gemini } from "@inngest/agent-kit";

const matchBestModerator = async (relatedSkills, moderators) => {
  const matchAgent = createAgent({
    model: gemini({
      model: "gemini-1.5-flash-8b",
      apiKey: process.env.GEMINI_API_KEY,
    }),
    name: "Moderator Matcher AI",
    system: `You are an AI assistant that matches support tickets to the most suitable moderators based on skill relevance.

You will be given:
- A list of skills required for a ticket.
- A list of moderators with their email and skills.

Your task:
1. Analyze which moderator's skill set best matches the required ticket skills.
2. Consider both direct overlap and semantic similarity (e.g., "Linux" matches "Operating Systems").
3. Weigh how well-rounded and relevant each moderator is.

Respond ONLY with the *email address* of the most suitable moderator — no explanations or formatting.`,
  });

  const prompt = `Ticket requires the following skills: [${relatedSkills.join(", ")}]

List of moderators:
${moderators.map((mod, i) => 
  `Moderator ${i + 1}:
Email: ${mod.email}
Skills: [${mod.skills?.join(", ") || "None"}]`
).join("\n\n")}

Which moderator is the best match? Reply with only their email.`

  const response = await matchAgent.run(prompt);
  return response.output?.[0]?.content?.trim();
};

export default matchBestModerator;
