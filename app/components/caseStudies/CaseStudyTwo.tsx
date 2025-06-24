// case-studies/project-two.tsx

"use client";

import { useLighting } from "../../context/LightingContext";
import { useTheme } from "next-themes";
import projects from "@/data/projects";
import { useActiveProject } from "@/app/context/ActiveProjectContext";

export default function CaseStudyTwo() {
  const { resolvedTheme } = useTheme();
  const { activeIndex } = useActiveProject();

  const { getTextColorClass } = useLighting();
  const textColorClass = getTextColorClass(
    resolvedTheme || "light",
    projects[activeIndex].textColor
  );
  return (
    <article>
      <section id="section-1" className="scroll-mt-24">
        <h2
          className={`font-sans font-semibold text-3xl ${textColorClass} leading-loose`}
        >
          W1232
        </h2>
        <p>
          Our team set out to solve a common but underexplored problem: how do
          product teams know which design works best—really know, with data?
          While qualitative methods dominate early design, we noticed a gap in
          quant UX tooling, particularly for live prototype testing. We wanted
          to bring statistical rigor to the kinds of questions teams already ask
          in Figma: which variant performs better? Where do users hesitate?
        </p>
        <p>
          Our team set out to solve a common but underexplored problem: how do
          product teams know which design works best—really know, with data?
          While qualitative methods dominate early design, we noticed a gap in
          quant UX tooling, particularly for live prototype testing. We wanted
          to bring statistical rigor to the kinds of questions teams already ask
          in Figma: which variant performs better? Where do users hesitate?
        </p>{" "}
        <p>
          Our team set out to solve a common but underexplored problem: how do
          product teams know which design works best—really know, with data?
          While qualitative methods dominate early design, we noticed a gap in
          quant UX tooling, particularly for live prototype testing. We wanted
          to bring statistical rigor to the kinds of questions teams already ask
          in Figma: which variant performs better? Where do users hesitate?
        </p>{" "}
        <p>
          Our team set out to solve a common but underexplored problem: how do
          product teams know which design works best—really know, with data?
          While qualitative methods dominate early design, we noticed a gap in
          quant UX tooling, particularly for live prototype testing. We wanted
          to bring statistical rigor to the kinds of questions teams already ask
          in Figma: which variant performs better? Where do users hesitate?
        </p>
      </section>
      <section id="section-2" className="scroll-mt-24">
        <h2>Research</h2>
        <p>
          We interviewed 20 UX researchers, PMs, and designers from growth-stage
          startups to large companies. A common theme emerged: people hacked
          together surveys, Hotjar, or A/B tools not designed for prototypes. We
          ran internal experiments simulating variant tests using Figma embeds
          and simple behavior tracking to confirm feasibility. We learned that:
          Designers wanted answers without leaving Figma Researchers needed
          statistical confidence, not just impressions PMs cared about speed and
          simplicity
        </p>{" "}
        <p>
          We interviewed 20 UX researchers, PMs, and designers from growth-stage
          startups to large companies. A common theme emerged: people hacked
          together surveys, Hotjar, or A/B tools not designed for prototypes. We
          ran internal experiments simulating variant tests using Figma embeds
          and simple behavior tracking to confirm feasibility. We learned that:
          Designers wanted answers without leaving Figma Researchers needed
          statistical confidence, not just impressions PMs cared about speed and
          simplicity
        </p>{" "}
        <p>
          We interviewed 20 UX researchers, PMs, and designers from growth-stage
          startups to large companies. A common theme emerged: people hacked
          together surveys, Hotjar, or A/B tools not designed for prototypes. We
          ran internal experiments simulating variant tests using Figma embeds
          and simple behavior tracking to confirm feasibility. We learned that:
          Designers wanted answers without leaving Figma Researchers needed
          statistical confidence, not just impressions PMs cared about speed and
          simplicity
        </p>{" "}
        <p>
          We interviewed 20 UX researchers, PMs, and designers from growth-stage
          startups to large companies. A common theme emerged: people hacked
          together surveys, Hotjar, or A/B tools not designed for prototypes. We
          ran internal experiments simulating variant tests using Figma embeds
          and simple behavior tracking to confirm feasibility. We learned that:
          Designers wanted answers without leaving Figma Researchers needed
          statistical confidence, not just impressions PMs cared about speed and
          simplicity
        </p>
      </section>
      <section id="section-3" className="scroll-mt-24">
        <h2>Design</h2>
        <p>
          We designed a Figma plugin that let users create quick A/B tests using
          variant frames. The UX prioritized minimal overhead: select variants,
          choose your goal (e.g. click-through, completion time), and get a
          shareable test link. We built a clean dashboard for results with clear
          visualizations and confidence scores. One challenge was balancing
          power and clarity. We iterated on how to communicate statistical
          significance without jargon. We also built in safeguards for
          underpowered tests and designed guidance to help teams interpret data
          responsibly.
        </p>{" "}
        <p>
          We designed a Figma plugin that let users create quick A/B tests using
          variant frames. The UX prioritized minimal overhead: select variants,
          choose your goal (e.g. click-through, completion time), and get a
          shareable test link. We built a clean dashboard for results with clear
          visualizations and confidence scores. One challenge was balancing
          power and clarity. We iterated on how to communicate statistical
          significance without jargon. We also built in safeguards for
          underpowered tests and designed guidance to help teams interpret data
          responsibly.
        </p>{" "}
        <p>
          We designed a Figma plugin that let users create quick A/B tests using
          variant frames. The UX prioritized minimal overhead: select variants,
          choose your goal (e.g. click-through, completion time), and get a
          shareable test link. We built a clean dashboard for results with clear
          visualizations and confidence scores. One challenge was balancing
          power and clarity. We iterated on how to communicate statistical
          significance without jargon. We also built in safeguards for
          underpowered tests and designed guidance to help teams interpret data
          responsibly.
        </p>{" "}
        <p>
          We designed a Figma plugin that let users create quick A/B tests using
          variant frames. The UX prioritized minimal overhead: select variants,
          choose your goal (e.g. click-through, completion time), and get a
          shareable test link. We built a clean dashboard for results with clear
          visualizations and confidence scores. One challenge was balancing
          power and clarity. We iterated on how to communicate statistical
          significance without jargon. We also built in safeguards for
          underpowered tests and designed guidance to help teams interpret data
          responsibly.
        </p>
      </section>
      <section id="section-4" className="scroll-mt-24">
        <h2>Outcome</h2>
        <p>
          We launched a closed beta with 12 teams and saw strong engagement.
          Teams used the tool to test landing page flows, signup friction, and
          feature comprehension. Feedback praised its speed and clarity. The
          product is now in early access with growing adoption. It’s helping
          teams make design decisions with evidence, not guesswork—and reshaping
          what quantitative UX looks like in practice.
        </p>
        <p>
          We launched a closed beta with 12 teams and saw strong engagement.
          Teams used the tool to test landing page flows, signup friction, and
          feature comprehension. Feedback praised its speed and clarity. The
          product is now in early access with growing adoption. It’s helping
          teams make design decisions with evidence, not guesswork—and reshaping
          what quantitative UX looks like in practice.
        </p>
        <p>
          We launched a closed beta with 12 teams and saw strong engagement.
          Teams used the tool to test landing page flows, signup friction, and
          feature comprehension. Feedback praised its speed and clarity. The
          product is now in early access with growing adoption. It’s helping
          teams make design decisions with evidence, not guesswork—and reshaping
          what quantitative UX looks like in practice.
        </p>
        <p>
          We launched a closed beta with 12 teams and saw strong engagement.
          Teams used the tool to test landing page flows, signup friction, and
          feature comprehension. Feedback praised its speed and clarity. The
          product is now in early access with growing adoption. It’s helping
          teams make design decisions with evidence, not guesswork—and reshaping
          what quantitative UX looks like in practice.
        </p>
        <p>
          We launched a closed beta with 12 teams and saw strong engagement.
          Teams used the tool to test landing page flows, signup friction, and
          feature comprehension. Feedback praised its speed and clarity. The
          product is now in early access with growing adoption. It’s helping
          teams make design decisions with evidence, not guesswork—and reshaping
          what quantitative UX looks like in practice.
        </p>
        <p>
          We launched a closed beta with 12 teams and saw strong engagement.
          Teams used the tool to test landing page flows, signup friction, and
          feature comprehension. Feedback praised its speed and clarity. The
          product is now in early access with growing adoption. It’s helping
          teams make design decisions with evidence, not guesswork—and reshaping
          what quantitative UX looks like in practice.
        </p>
        <p>
          We launched a closed beta with 12 teams and saw strong engagement.
          Teams used the tool to test landing page flows, signup friction, and
          feature comprehension. Feedback praised its speed and clarity. The
          product is now in early access with growing adoption. It’s helping
          teams make design decisions with evidence, not guesswork—and reshaping
          what quantitative UX looks like in practice.
        </p>
        <p>
          We launched a closed beta with 12 teams and saw strong engagement.
          Teams used the tool to test landing page flows, signup friction, and
          feature comprehension. Feedback praised its speed and clarity. The
          product is now in early access with growing adoption. It’s helping
          teams make design decisions with evidence, not guesswork—and reshaping
          what quantitative UX looks like in practice.
        </p>
        <p>
          We launched a closed beta with 12 teams and saw strong engagement.
          Teams used the tool to test landing page flows, signup friction, and
          feature comprehension. Feedback praised its speed and clarity. The
          product is now in early access with growing adoption. It’s helping
          teams make design decisions with evidence, not guesswork—and reshaping
          what quantitative UX looks like in practice.
        </p>
        <p>
          We launched a closed beta with 12 teams and saw strong engagement.
          Teams used the tool to test landing page flows, signup friction, and
          feature comprehension. Feedback praised its speed and clarity. The
          product is now in early access with growing adoption. It’s helping
          teams make design decisions with evidence, not guesswork—and reshaping
          what quantitative UX looks like in practice.
        </p>
        <p>
          We launched a closed beta with 12 teams and saw strong engagement.
          Teams used the tool to test landing page flows, signup friction, and
          feature comprehension. Feedback praised its speed and clarity. The
          product is now in early access with growing adoption. It’s helping
          teams make design decisions with evidence, not guesswork—and reshaping
          what quantitative UX looks like in practice.
        </p>
      </section>{" "}
      <section id="section-5" className="scroll-mt-24">
        <h2>Outcome</h2>
        <p>
          We launched a closed beta with 12 teams and saw strong engagement.
          Teams used the tool to test landing page flows, signup friction, and
          feature comprehension. Feedback praised its speed and clarity. The
          product is now in early access with growing adoption. It’s helping
          teams make design decisions with evidence, not guesswork—and reshaping
          what quantitative UX looks like in practice.
        </p>
        <p>
          We launched a closed beta with 12 teams and saw strong engagement.
          Teams used the tool to test landing page flows, signup friction, and
          feature comprehension. Feedback praised its speed and clarity. The
          product is now in early access with growing adoption. It’s helping
          teams make design decisions with evidence, not guesswork—and reshaping
          what quantitative UX looks like in practice.
        </p>
        <p>
          We launched a closed beta with 12 teams and saw strong engagement.
          Teams used the tool to test landing page flows, signup friction, and
          feature comprehension. Feedback praised its speed and clarity. The
          product is now in early access with growing adoption. It’s helping
          teams make design decisions with evidence, not guesswork—and reshaping
          what quantitative UX looks like in practice.
        </p>
        <p>
          We launched a closed beta with 12 teams and saw strong engagement.
          Teams used the tool to test landing page flows, signup friction, and
          feature comprehension. Feedback praised its speed and clarity. The
          product is now in early access with growing adoption. It’s helping
          teams make design decisions with evidence, not guesswork—and reshaping
          what quantitative UX looks like in practice.
        </p>
        <p>
          We launched a closed beta with 12 teams and saw strong engagement.
          Teams used the tool to test landing page flows, signup friction, and
          feature comprehension. Feedback praised its speed and clarity. The
          product is now in early access with growing adoption. It’s helping
          teams make design decisions with evidence, not guesswork—and reshaping
          what quantitative UX looks like in practice.
        </p>
        <p>
          We launched a closed beta with 12 teams and saw strong engagement.
          Teams used the tool to test landing page flows, signup friction, and
          feature comprehension. Feedback praised its speed and clarity. The
          product is now in early access with growing adoption. It’s helping
          teams make design decisions with evidence, not guesswork—and reshaping
          what quantitative UX looks like in practice.
        </p>
        <p>
          We launched a closed beta with 12 teams and saw strong engagement.
          Teams used the tool to test landing page flows, signup friction, and
          feature comprehension. Feedback praised its speed and clarity. The
          product is now in early access with growing adoption. It’s helping
          teams make design decisions with evidence, not guesswork—and reshaping
          what quantitative UX looks like in practice.
        </p>
        <p>
          We launched a closed beta with 12 teams and saw strong engagement.
          Teams used the tool to test landing page flows, signup friction, and
          feature comprehension. Feedback praised its speed and clarity. The
          product is now in early access with growing adoption. It’s helping
          teams make design decisions with evidence, not guesswork—and reshaping
          what quantitative UX looks like in practice.
        </p>
        <p>
          We launched a closed beta with 12 teams and saw strong engagement.
          Teams used the tool to test landing page flows, signup friction, and
          feature comprehension. Feedback praised its speed and clarity. The
          product is now in early access with growing adoption. It’s helping
          teams make design decisions with evidence, not guesswork—and reshaping
          what quantitative UX looks like in practice.
        </p>
        <p>
          We launched a closed beta with 12 teams and saw strong engagement.
          Teams used the tool to test landing page flows, signup friction, and
          feature comprehension. Feedback praised its speed and clarity. The
          product is now in early access with growing adoption. It’s helping
          teams make design decisions with evidence, not guesswork—and reshaping
          what quantitative UX looks like in practice.
        </p>
        <p>
          We launched a closed beta with 12 teams and saw strong engagement.
          Teams used the tool to test landing page flows, signup friction, and
          feature comprehension. Feedback praised its speed and clarity. The
          product is now in early access with growing adoption. It’s helping
          teams make design decisions with evidence, not guesswork—and reshaping
          what quantitative UX looks like in practice.
        </p>
      </section>{" "}
      <section id="section-6" className="scroll-mt-24">
        <h2>Outcome</h2>
        <p>
          We launched a closed beta with 12 teams and saw strong engagement.
          Teams used the tool to test landing page flows, signup friction, and
          feature comprehension. Feedback praised its speed and clarity. The
          product is now in early access with growing adoption. It’s helping
          teams make design decisions with evidence, not guesswork—and reshaping
          what quantitative UX looks like in practice.
        </p>
        <p>
          We launched a closed beta with 12 teams and saw strong engagement.
          Teams used the tool to test landing page flows, signup friction, and
          feature comprehension. Feedback praised its speed and clarity. The
          product is now in early access with growing adoption. It’s helping
          teams make design decisions with evidence, not guesswork—and reshaping
          what quantitative UX looks like in practice.
        </p>
        <p>
          We launched a closed beta with 12 teams and saw strong engagement.
          Teams used the tool to test landing page flows, signup friction, and
          feature comprehension. Feedback praised its speed and clarity. The
          product is now in early access with growing adoption. It’s helping
          teams make design decisions with evidence, not guesswork—and reshaping
          what quantitative UX looks like in practice.
        </p>
        <p>
          We launched a closed beta with 12 teams and saw strong engagement.
          Teams used the tool to test landing page flows, signup friction, and
          feature comprehension. Feedback praised its speed and clarity. The
          product is now in early access with growing adoption. It’s helping
          teams make design decisions with evidence, not guesswork—and reshaping
          what quantitative UX looks like in practice.
        </p>
        <p>
          We launched a closed beta with 12 teams and saw strong engagement.
          Teams used the tool to test landing page flows, signup friction, and
          feature comprehension. Feedback praised its speed and clarity. The
          product is now in early access with growing adoption. It’s helping
          teams make design decisions with evidence, not guesswork—and reshaping
          what quantitative UX looks like in practice.
        </p>
        <p>
          We launched a closed beta with 12 teams and saw strong engagement.
          Teams used the tool to test landing page flows, signup friction, and
          feature comprehension. Feedback praised its speed and clarity. The
          product is now in early access with growing adoption. It’s helping
          teams make design decisions with evidence, not guesswork—and reshaping
          what quantitative UX looks like in practice.
        </p>
        <p>
          We launched a closed beta with 12 teams and saw strong engagement.
          Teams used the tool to test landing page flows, signup friction, and
          feature comprehension. Feedback praised its speed and clarity. The
          product is now in early access with growing adoption. It’s helping
          teams make design decisions with evidence, not guesswork—and reshaping
          what quantitative UX looks like in practice.
        </p>
        <p>
          We launched a closed beta with 12 teams and saw strong engagement.
          Teams used the tool to test landing page flows, signup friction, and
          feature comprehension. Feedback praised its speed and clarity. The
          product is now in early access with growing adoption. It’s helping
          teams make design decisions with evidence, not guesswork—and reshaping
          what quantitative UX looks like in practice.
        </p>
        <p>
          We launched a closed beta with 12 teams and saw strong engagement.
          Teams used the tool to test landing page flows, signup friction, and
          feature comprehension. Feedback praised its speed and clarity. The
          product is now in early access with growing adoption. It’s helping
          teams make design decisions with evidence, not guesswork—and reshaping
          what quantitative UX looks like in practice.
        </p>
        <p>
          We launched a closed beta with 12 teams and saw strong engagement.
          Teams used the tool to test landing page flows, signup friction, and
          feature comprehension. Feedback praised its speed and clarity. The
          product is now in early access with growing adoption. It’s helping
          teams make design decisions with evidence, not guesswork—and reshaping
          what quantitative UX looks like in practice.
        </p>
        <p>
          We launched a closed beta with 12 teams and saw strong engagement.
          Teams used the tool to test landing page flows, signup friction, and
          feature comprehension. Feedback praised its speed and clarity. The
          product is now in early access with growing adoption. It’s helping
          teams make design decisions with evidence, not guesswork—and reshaping
          what quantitative UX looks like in practice.
        </p>
      </section>
    </article>
  );
}
