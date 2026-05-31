import Link from "next/link";
import OrbsBackdrop from "@/components/orbs-backdrop";
import StackedPanels from "@/components/stacked-panels";

const steps = [
  {
    n: "01",
    title: "Paste your text or URL",
    desc: "Drop in an article, blog post, thread, or raw notes.",
  },
  {
    n: "02",
    title: "Pick a template and slide count",
    desc: "Three templates, 5 / 7 / 10 slides. One click.",
  },
  {
    n: "03",
    title: "Download as PNGs",
    desc: "Post-ready 1080×1080 images in a single ZIP.",
  },
];

const faqs = [
  {
    q: "What's the difference between this and Canva?",
    a: "Canva gives you a blank canvas and endless choices. We turn your text into finished, post-ready slides in one click — no manual layout.",
  },
  {
    q: "Can I edit the text after generation?",
    a: "Yes. Every slide is editable — click any slide, fix the wording, and re-download.",
  },
  {
    q: "What formats do I get?",
    a: "A ZIP of square 1080×1080 PNGs, ready for Instagram and LinkedIn.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. Cancel anytime from the billing portal — no emails, no hoops.",
  },
  {
    q: "Is my text data stored?",
    a: "We store your input so you can revisit past carousels. You can delete it anytime, and we never share it.",
  },
];

export default function Home() {
  return (
    <main className="relative min-h-screen">
      <OrbsBackdrop />

      {/* Sticky glass navbar — floats with margins so its glass edges read */}
      <header className="glass sticky top-4 z-50 mx-4 flex items-center justify-between rounded-2xl px-6 py-3">
        <Link href="/" className="font-bold tracking-tight text-white">
          Carousel
        </Link>
        <nav className="flex items-center gap-4">
          <a
            href="#pricing"
            className="text-sm text-[#A1A1AA] transition-colors hover:text-white"
          >
            Pricing
          </a>
          <Link
            href="/login"
            className="glass rounded-full px-4 py-1.5 text-sm text-white transition-colors hover:border-white/30"
          >
            Sign in
          </Link>
        </nav>
      </header>

      {/* Hero — 50/50 split on desktop, stacked on mobile */}
      <section className="mx-auto flex min-h-[88vh] max-w-6xl flex-col items-center gap-12 px-6 py-16 md:flex-row md:gap-10">
        <div className="flex-1">
          <h1 className="text-4xl font-bold leading-[1.05] tracking-tight md:text-6xl">
            Turn any text into a beautiful carousel in{" "}
            <span className="text-[#0066FF]">30 seconds</span>.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-[#A1A1AA]">
            Paste your article, blog post, or thread. Get post-ready slides for
            LinkedIn and Instagram. No design skills. No Canva fatigue.
          </p>
          <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <Link
              href="/login"
              className="rounded-full bg-[#0066FF] px-6 py-3 text-sm font-semibold text-white transition hover:brightness-110"
            >
              Try it free
            </Link>
            <a
              href="#pricing"
              className="text-sm text-[#A1A1AA] transition-colors hover:text-white"
            >
              See pricing →
            </a>
          </div>
        </div>
        <div className="h-[60vh] w-full flex-1 md:h-[80vh]">
          <StackedPanels />
        </div>
      </section>

      {/* How it works — three glass tiles */}
      <section className="mx-auto max-w-6xl px-6 py-20 md:py-32">
        <h2 className="text-5xl font-bold tracking-tight">Three steps.</h2>
        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {steps.map((s) => (
            <div key={s.n} className="glass rounded-3xl p-8">
              <div className="text-7xl font-bold text-[#0066FF]">{s.n}</div>
              <h3 className="mt-4 text-xl font-semibold text-white">
                {s.title}
              </h3>
              <p className="mt-2 text-[#A1A1AA]">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Template showcase — glass frames around opaque template previews */}
      <section className="mx-auto max-w-6xl px-6 py-20 md:py-32">
        <h2 className="text-5xl font-bold tracking-tight">
          Three templates. Every use case.
        </h2>
        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {/* Bold Statement — opaque #0A0A0A inside a glass frame */}
          <div>
            <div className="glass rounded-3xl p-3">
              <div className="relative flex aspect-square items-center justify-center rounded-2xl bg-[#0A0A0A] p-8">
                <p className="text-center text-2xl font-bold text-white">
                  One sharp idea per slide.
                </p>
                <span className="absolute right-4 top-4 text-xs text-[#A1A1AA]">
                  01 / 07
                </span>
              </div>
            </div>
            <p className="mt-3 text-sm text-[#A1A1AA]">
              Bold Statement — for punchy LinkedIn thought-leadership.
            </p>
          </div>

          {/* Soft Educational — #F5F1E8 is the ONLY off-palette color allowed:
              the template itself is beige in the product. */}
          <div>
            <div className="glass rounded-3xl p-3">
              <div className="flex aspect-square flex-col justify-center rounded-2xl bg-[#F5F1E8] p-8">
                <p className="text-xl font-bold text-[#0A0A0A]">
                  5 lessons from this article
                </p>
                <ul className="mt-4 space-y-2 text-sm text-[#0A0A0A]">
                  <li>• Lead with the outcome</li>
                  <li>• One idea per slide</li>
                  <li>• End with a takeaway</li>
                </ul>
              </div>
            </div>
            <p className="mt-3 text-sm text-[#A1A1AA]">
              Soft Educational — for Instagram how-tos that teach.
            </p>
          </div>

          {/* Quote Card — opaque #0066FF inside a glass frame */}
          <div>
            <div className="glass rounded-3xl p-3">
              <div className="flex aspect-square flex-col items-center justify-center rounded-2xl bg-[#0066FF] p-8 text-center">
                <p className="text-2xl font-bold text-white">
                  Design is the silent ambassador of your brand.
                </p>
                <p className="mt-4 text-sm text-white">— Paul Rand</p>
              </div>
            </div>
            <p className="mt-3 text-sm text-[#A1A1AA]">
              Quote Card — for shareable pull-quotes and podcast takeaways.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing — two glass cards */}
      <section id="pricing" className="mx-auto max-w-5xl px-6 py-20 md:py-32">
        <h2 className="text-5xl font-bold tracking-tight">Simple pricing.</h2>
        <div className="mt-16 grid gap-6 md:grid-cols-2">
          {/* Free */}
          <div className="glass rounded-3xl p-8">
            <h3 className="text-lg font-semibold text-white">Free</h3>
            <p className="mt-4 text-4xl font-bold text-white">
              $0
              <span className="text-base font-normal text-[#A1A1AA]">
                /month
              </span>
            </p>
            <ul className="mt-6 space-y-3 text-[#A1A1AA]">
              <li>3 carousels per week</li>
              <li>Watermark on downloads</li>
              <li>All three templates</li>
            </ul>
            <Link
              href="/login"
              className="mt-8 inline-block text-sm font-semibold text-white transition-opacity hover:opacity-70"
            >
              Start free →
            </Link>
          </div>

          {/* Pro — stronger glass + blue border highlight */}
          <div className="glass-strong relative rounded-3xl border-[#0066FF] p-8">
            <span className="absolute right-6 top-6 text-xs font-semibold text-[#0066FF]">
              Most popular
            </span>
            <h3 className="text-lg font-semibold text-white">Pro</h3>
            <p className="mt-4 text-4xl font-bold text-white">
              $12
              <span className="text-base font-normal text-[#A1A1AA]">
                /month
              </span>
            </p>
            <ul className="mt-6 space-y-3 text-[#A1A1AA]">
              <li>Unlimited carousels</li>
              <li>No watermark</li>
              <li>Priority generation</li>
              <li>All three templates</li>
            </ul>
            <Link
              href="/login"
              className="mt-8 inline-block rounded-full bg-[#0066FF] px-6 py-3 text-sm font-semibold text-white transition hover:brightness-110"
            >
              Get Pro
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ — one big glass panel with divided rows */}
      <section className="mx-auto max-w-3xl px-6 py-20 md:py-32">
        <h2 className="text-5xl font-bold tracking-tight">Questions.</h2>
        <div className="glass mt-12 rounded-3xl px-8">
          {faqs.map((f, i) => (
            <details
              key={f.q}
              className={`group py-6 ${
                i > 0 ? "border-t border-white/10" : ""
              }`}
            >
              <summary className="flex cursor-pointer list-none items-center justify-between text-white marker:content-none [&::-webkit-details-marker]:hidden">
                <span>{f.q}</span>
                <span className="ml-4 text-[#A1A1AA] after:content-['+'] group-open:after:content-['−']" />
              </summary>
              <p className="mt-4 text-[#A1A1AA]">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Footer — floating glass strip */}
      <footer className="glass mx-4 mb-4 flex flex-col items-center justify-between gap-4 rounded-2xl px-6 py-6 sm:flex-row">
        <div className="flex items-center gap-3">
          <span className="font-bold tracking-tight text-white">Carousel</span>
          <span className="text-sm text-[#A1A1AA]">© 2026</span>
        </div>
        <div className="flex items-center gap-6 text-sm text-[#A1A1AA]">
          <a href="#" className="transition-colors hover:text-white">
            Privacy
          </a>
          <a href="#" className="transition-colors hover:text-white">
            Terms
          </a>
          <a href="#" className="transition-colors hover:text-white">
            X
          </a>
        </div>
      </footer>
    </main>
  );
}
