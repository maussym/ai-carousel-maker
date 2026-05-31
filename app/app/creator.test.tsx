import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";
import { render, screen, cleanup, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Creator from "./creator";
import { generateSlides } from "./actions";

// Mock the server action: server actions are verified by their input contract,
// NOT by hitting OpenAI (per Task 6 — do not mock OpenAI itself). This also
// keeps the real actions.ts (openai/supabase imports) out of the test graph.
vi.mock("./actions", () => ({
  generateSlides: vi.fn(),
}));

// Proves the Task 5 state wiring that Task 6 depends on — runs headless in
// jsdom, no browser. The console.log assertion locks the exact payload shape
// the generation route will consume.

describe("Creator — /app UI wiring", () => {
  // globals:false means RTL can't auto-register cleanup — do it explicitly so
  // each test starts with a fresh DOM (otherwise renders stack and queries dup).
  afterEach(cleanup);

  beforeEach(() => {
    vi.mocked(generateSlides).mockReset();
    vi.mocked(generateSlides).mockResolvedValue({ ok: true, slides: [] });
  });

  it("counter updates live as you type", async () => {
    const user = userEvent.setup();
    render(<Creator />);
    expect(screen.getByText("0 / 8000 characters")).toBeTruthy();

    const textarea = screen.getByPlaceholderText(/Paste an article/i);
    await user.type(textarea, "Hello");
    expect(screen.getByText("5 / 8000 characters")).toBeTruthy();
  });

  it("template selection updates state and selected styling (default Bold)", async () => {
    const user = userEvent.setup();
    render(<Creator />);

    const bold = screen.getByRole("radio", {
      name: /Bold Statement/i,
    }) as HTMLInputElement;
    const soft = screen.getByRole("radio", {
      name: /Soft Educational/i,
    }) as HTMLInputElement;

    expect(bold.checked).toBe(true); // default selection
    expect(soft.checked).toBe(false);

    await user.click(soft);
    expect(soft.checked).toBe(true);
    expect(bold.checked).toBe(false);
    expect(soft.closest("label")?.className).toContain("border-[#0066FF]");
  });

  it("slide count selection updates (default 7 -> click 10)", async () => {
    const user = userEvent.setup();
    render(<Creator />);

    const seven = screen.getByRole("button", { name: "7" });
    const ten = screen.getByRole("button", { name: "10" });

    expect(seven.className).toContain("bg-[#0066FF]"); // default selected
    expect(ten.className).not.toContain("bg-[#0066FF]");

    await user.click(ten);
    expect(ten.className).toContain("bg-[#0066FF]");
    expect(seven.className).not.toContain("bg-[#0066FF]");
  });

  it("Generate is disabled when empty, enabled after typing, and logs the exact shape", async () => {
    const user = userEvent.setup();
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    render(<Creator />);

    const btn = screen.getByRole("button", {
      name: /Generate carousel/i,
    }) as HTMLButtonElement;
    expect(btn.disabled).toBe(true);

    const textarea = screen.getByPlaceholderText(/Paste an article/i);
    await user.type(textarea, "My article body");
    expect(btn.disabled).toBe(false);

    // Mirror the reviewer's exact scenario: Soft Educational + 10 slides.
    await user.click(screen.getByRole("radio", { name: /Soft Educational/i }));
    await user.click(screen.getByRole("button", { name: "10" }));
    await user.click(btn);

    // Exact shape: template is the id "soft" (NOT "Soft Educational"),
    // slideCount is the number 10 (NOT the string "10"). toHaveBeenCalledWith
    // uses deep equality, so a string/label mismatch fails this test.
    expect(logSpy).toHaveBeenCalledWith({
      text: "My article body",
      template: "soft",
      slideCount: 10,
    });
    logSpy.mockRestore();
  });

  it("caps input at 8000 chars and highlights the limit in blue", async () => {
    const user = userEvent.setup();
    render(<Creator />);
    const textarea = screen.getByPlaceholderText(
      /Paste an article/i
    ) as HTMLTextAreaElement;

    await user.click(textarea);
    await user.paste("a".repeat(8050)); // attempt to exceed the cap

    expect(textarea.value.length).toBe(8000); // blocked at 8000
    const limit = screen.getByText("Maximum length reached");
    expect(limit.className).toContain("text-[#0066FF]"); // highlighted blue
  });

  it("Clear shows only when there's text, and empties the field", async () => {
    const user = userEvent.setup();
    render(<Creator />);
    expect(screen.queryByText("Clear")).toBeNull(); // hidden when empty

    const textarea = screen.getByPlaceholderText(
      /Paste an article/i
    ) as HTMLTextAreaElement;
    await user.type(textarea, "some text");
    expect(screen.getByText("Clear")).toBeTruthy();

    await user.click(screen.getByText("Clear"));
    expect(textarea.value).toBe("");
    expect(screen.queryByText("Clear")).toBeNull(); // hidden again
    expect(screen.getByText("0 / 8000 characters")).toBeTruthy();
  });

  it("whitespace-only input does NOT enable Generate", async () => {
    const user = userEvent.setup();
    render(<Creator />);
    const btn = screen.getByRole("button", {
      name: /Generate carousel/i,
    }) as HTMLButtonElement;

    await user.type(screen.getByPlaceholderText(/Paste an article/i), "     ");
    expect(btn.disabled).toBe(true); // text.trim() === "" stays disabled
  });

  it("calls generateSlides with the exact payload on Generate (Task 6 contract)", async () => {
    const user = userEvent.setup();
    render(<Creator />);

    await user.type(
      screen.getByPlaceholderText(/Paste an article/i),
      "Article body"
    );
    await user.click(screen.getByRole("radio", { name: /Quote Card/i }));
    await user.click(screen.getByRole("button", { name: "5" }));
    await user.click(screen.getByRole("button", { name: /Generate carousel/i }));

    await waitFor(() =>
      expect(generateSlides).toHaveBeenCalledWith({
        text: "Article body",
        template: "quote",
        slideCount: 5,
      })
    );
  });
});
