import Link from "next/link";

// case-studies/project-two.tsx
export default function CaseStudyTwo() {
  return (
    <main className="max-w-3xl mx-auto p-8 prose">
      <Link
        href="/"
        className="mb-5 inline-block text-blue-600 hover:underline"
      >
        ← Back to Home
      </Link>
      <h2>Background</h2>
      <p>
        Our team set out to solve a common but underexplored problem: how do
        product teams know which design works best—really know, with data? While
        qualitative methods dominate early design, we noticed a gap in quant UX
        tooling, particularly for live prototype testing. We wanted to bring
        statistical rigor to the kinds of questions teams already ask in Figma:
        which variant performs better? Where do users hesitate?
      </p>

      <h2>Research</h2>
      <p>
        We interviewed 20 UX researchers, PMs, and designers from growth-stage
        startups to large companies. A common theme emerged: people hacked
        together surveys, Hotjar, or A/B tools not designed for prototypes. We
        ran internal experiments simulating variant tests using Figma embeds and
        simple behavior tracking to confirm feasibility. We learned that:
        Designers wanted answers without leaving Figma Researchers needed
        statistical confidence, not just impressions PMs cared about speed and
        simplicity
      </p>

      <h2>Design</h2>
      <p>
        We designed a Figma plugin that let users create quick A/B tests using
        variant frames. The UX prioritized minimal overhead: select variants,
        choose your goal (e.g. click-through, completion time), and get a
        shareable test link. We built a clean dashboard for results with clear
        visualizations and confidence scores. One challenge was balancing power
        and clarity. We iterated on how to communicate statistical significance
        without jargon. We also built in safeguards for underpowered tests and
        designed guidance to help teams interpret data responsibly.
      </p>
      <h2>Outcome</h2>
      <p>
        We launched a closed beta with 12 teams and saw strong engagement. Teams
        used the tool to test landing page flows, signup friction, and feature
        comprehension. Feedback praised its speed and clarity. The product is
        now in early access with growing adoption. It’s helping teams make
        design decisions with evidence, not guesswork—and reshaping what
        quantitative UX looks like in practice.
      </p>
    </main>
  );
}
