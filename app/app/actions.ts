"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import OpenAI from "openai";
import { createClient } from "@/lib/supabase/server";
import { BOLD_PROMPT, SOFT_PROMPT, QUOTE_PROMPT } from "@/lib/prompts";

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

// ---------------------------------------------------------------------------
// Carousel generation (Task 6)
// ---------------------------------------------------------------------------

// Input contract — must match the payload locked by creator.test.tsx.
const InputSchema = z.object({
  text: z.string().min(1),
  template: z.enum(["bold", "soft", "quote"]),
  slideCount: z.union([z.literal(5), z.literal(7), z.literal(10)]),
});

export type GenerateInput = z.infer<typeof InputSchema>;

// Per-template response schemas — the model must return exactly these shapes.
const boldSlide = z.object({ slide_number: z.number(), statement: z.string() });
const softSlide = z.object({
  slide_number: z.number(),
  title: z.string(),
  body: z.string(),
});
const quoteSlide = z.object({
  slide_number: z.number(),
  quote: z.string(),
  attribution: z.string(),
});

const boldResponse = z.object({ slides: z.array(boldSlide) });
const softResponse = z.object({ slides: z.array(softSlide) });
const quoteResponse = z.object({ slides: z.array(quoteSlide) });

export type BoldSlide = z.infer<typeof boldSlide>;
export type SoftSlide = z.infer<typeof softSlide>;
export type QuoteSlide = z.infer<typeof quoteSlide>;
export type Slide = BoldSlide | SoftSlide | QuoteSlide;

export type GenerateResult =
  | { ok: true; slides: Slide[] }
  | { ok: false; error: string };

const PROMPTS = {
  bold: BOLD_PROMPT,
  soft: SOFT_PROMPT,
  quote: QUOTE_PROMPT,
} as const;

// Educational tone benefits from slightly lower variance.
const TEMPERATURE = { bold: 0.7, soft: 0.5, quote: 0.7 } as const;

function buildPrompt(template: GenerateInput["template"], n: number, text: string) {
  // Use a replacer function for {TEXT} so a "$" in the source can't be read as
  // a special replacement pattern. {N} is a number, so it's safe to inline.
  return PROMPTS[template]
    .replace(/\{N\}/g, String(n))
    .replace("{TEXT}", () => text);
}

function validateSlides(
  template: GenerateInput["template"],
  json: unknown
): Slide[] | null {
  const schema =
    template === "bold"
      ? boldResponse
      : template === "soft"
        ? softResponse
        : quoteResponse;
  const parsed = schema.safeParse(json);
  return parsed.success ? parsed.data.slides : null;
}

export async function generateSlides(input: GenerateInput): Promise<GenerateResult> {
  // 1. Validate the input contract.
  const parsed = InputSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Invalid input. Please check your text and settings." };
  }
  const { text, template, slideCount } = parsed.data;

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return { ok: false, error: "The server is missing its OpenAI API key." };
  }

  try {
    const openai = new OpenAI({ apiKey });
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: buildPrompt(template, slideCount, text) }],
      response_format: { type: "json_object" },
      temperature: TEMPERATURE[template],
      max_tokens: 1500,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      return { ok: false, error: "The model returned an empty response. Try again." };
    }

    let json: unknown;
    try {
      json = JSON.parse(content);
    } catch {
      return { ok: false, error: "The model returned an unexpected format. Try again." };
    }

    const slides = validateSlides(template, json);
    if (!slides) {
      return { ok: false, error: "The model returned an unexpected format. Try again." };
    }

    return { ok: true, slides };
  } catch {
    // Network, rate limit, auth, etc. — never throw to the client.
    return { ok: false, error: "Generation failed. Please try again in a moment." };
  }
}
