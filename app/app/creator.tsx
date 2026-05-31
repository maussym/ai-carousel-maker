"use client";

import { useState } from "react";
import { generateSlides } from "./actions";

const MAX = 8000;

const templates = [
  { id: "bold", name: "Bold Statement", tagline: "Punchy LinkedIn", swatch: "bg-[#0A0A0A]" },
  { id: "soft", name: "Soft Educational", tagline: "Instagram how-tos", swatch: "bg-[#F5F1E8]" },
  { id: "quote", name: "Quote Card", tagline: "Shareable quotes", swatch: "bg-[#0066FF]" },
] as const;

const counts = [5, 7, 10] as const;

type Template = (typeof templates)[number]["id"];
type SlideCount = (typeof counts)[number];

export default function Creator() {
  const [text, setText] = useState("");
  const [template, setTemplate] = useState<Template>("bold");
  const [slideCount, setSlideCount] = useState<SlideCount>(7);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const atMax = text.length >= MAX;
  const isEmpty = text.trim().length === 0;

  async function handleGenerate() {
    // Payload trace — locks the Task 5 contract (asserted in creator.test.tsx).
    console.log({ text, template, slideCount });
    setError(null);
    setLoading(true);
    try {
      const result = await generateSlides({ text, template, slideCount });
      if (result.ok) {
        // Preview UI is Task 11; just log the slides for now.
        console.log(result.slides);
      } else {
        setError(result.error);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 md:flex-row">
      {/* Left pane — input (~60%) */}
      <div className="glass-strong rounded-3xl p-8 md:w-3/5">
        <h2 className="text-sm text-[#A1A1AA]">Paste your text or URL</h2>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value.slice(0, MAX))}
          maxLength={MAX}
          placeholder="Paste an article, blog post, or thread... or drop a URL."
          className="mt-4 min-h-[400px] w-full resize-none rounded-xl bg-transparent text-white placeholder:text-[#A1A1AA]/60 focus:outline-none focus:ring-1 focus:ring-[#0066FF]/40"
        />
        <div className="mt-2 flex items-center justify-between text-sm text-[#A1A1AA]">
          <span>
            {atMax ? (
              <span className="text-[#0066FF]">Maximum length reached</span>
            ) : (
              `${text.length} / ${MAX} characters`
            )}
          </span>
          {text.length > 0 && (
            <button
              onClick={() => setText("")}
              className="text-[#A1A1AA] transition-colors hover:text-white"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Right pane — config (~40%) */}
      <div className="glass-strong rounded-3xl md:w-2/5">
        {/* Template */}
        <div className="p-6">
          <h2 className="text-sm text-[#A1A1AA]">Template</h2>
          <div className="mt-4 space-y-2">
            {templates.map((t) => {
              const selected = template === t.id;
              return (
                <label
                  key={t.id}
                  className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition-colors ${
                    selected
                      ? "border-[#0066FF] bg-white/[0.04]"
                      : "border-transparent hover:bg-white/[0.02]"
                  }`}
                >
                  <input
                    type="radio"
                    name="template"
                    value={t.id}
                    checked={selected}
                    onChange={() => setTemplate(t.id)}
                    className="sr-only"
                  />
                  <span className={`h-6 w-6 shrink-0 rounded-md ${t.swatch}`} />
                  <span className="text-white">{t.name}</span>
                  <span className="ml-auto text-sm text-[#A1A1AA]">{t.tagline}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Slides */}
        <div className="border-t border-white/[0.08] p-6">
          <h2 className="text-sm text-[#A1A1AA]">Slides</h2>
          <div className="mt-4 flex gap-2">
            {counts.map((c) => {
              const selected = slideCount === c;
              return (
                <button
                  key={c}
                  onClick={() => setSlideCount(c)}
                  className={`flex-1 rounded-full py-2 text-sm font-medium text-white transition ${
                    selected ? "bg-[#0066FF]" : "glass hover:brightness-125"
                  }`}
                >
                  {c}
                </button>
              );
            })}
          </div>
        </div>

        {/* Generate */}
        <div className="border-t border-white/[0.08] p-6">
          <button
            onClick={handleGenerate}
            disabled={isEmpty || loading}
            className={`w-full rounded-full bg-[#0066FF] py-4 text-lg font-semibold text-white transition ${
              isEmpty
                ? "cursor-not-allowed opacity-40"
                : loading
                  ? "cursor-wait opacity-80"
                  : "hover:brightness-110"
            }`}
          >
            {loading ? (
              <span className="inline-flex items-center justify-center gap-2">
                Generating...
                <span className="h-2 w-2 animate-pulse rounded-full bg-white" />
              </span>
            ) : (
              "Generate carousel"
            )}
          </button>
          {error && (
            <p className="mt-3 text-center text-xs text-[#0066FF]/80">{error}</p>
          )}
          <p className="mt-3 text-center text-xs text-[#A1A1AA]">
            Free plan: 3 carousels per week. You have 3 left.
          </p>
        </div>
      </div>
    </section>
  );
}
