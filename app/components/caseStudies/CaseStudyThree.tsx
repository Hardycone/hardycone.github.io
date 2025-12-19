// case-studies/project-two.tsx
"use client";

import { useTheme } from "next-themes";
import projects from "@/data/projects";
import { useActiveProject } from "@/app/context/ActiveProjectContext";
import { useProjectTheme } from "@/hooks/useProjectTheme";

export default function CaseStudyThree() {
  const { resolvedTheme } = useTheme();
  const { activeIndex } = useActiveProject();

  const theme = useProjectTheme(projects[activeIndex].id);

  return (
    <article>
      <section id="section-1" className="scroll-mt-24">
        <h2
          className={`font-sans text-3xl font-semibold ${theme.textColorClass} leading-loose`}
        >
          W1232
        </h2>{" "}
        <p>
          Filmmakers often have great ideas but struggle to translate them into
          structured scripts and visual plans. We partnered with a team of indie
          filmmakers and technologists to create a tool that helps storytellers
          go from premise to production—with AI-enhanced tools for storyboarding
          and voice.
        </p>{" "}
        <p>
          Filmmakers often have great ideas but struggle to translate them into
          structured scripts and visual plans. We partnered with a team of indie
          filmmakers and technologists to create a tool that helps storytellers
          go from premise to production—with AI-enhanced tools for storyboarding
          and voice.
        </p>{" "}
        <p>
          Filmmakers often have great ideas but struggle to translate them into
          structured scripts and visual plans. We partnered with a team of indie
          filmmakers and technologists to create a tool that helps storytellers
          go from premise to production—with AI-enhanced tools for storyboarding
          and voice.
        </p>{" "}
        <p>
          Filmmakers often have great ideas but struggle to translate them into
          structured scripts and visual plans. We partnered with a team of indie
          filmmakers and technologists to create a tool that helps storytellers
          go from premise to production—with AI-enhanced tools for storyboarding
          and voice.
        </p>
      </section>
      <section id="section-2" className="scroll-mt-24">
        <h2>Research</h2>
        <p>
          We ran discovery sessions with 15 independent creators and small
          production teams. They described a fragmented process: notes in Google
          Docs, sketches in notebooks, and scattered tools for voiceover and
          visualization. What they wanted was creative momentum—tools that
          support flow, not friction. We also studied screenwriting and story
          structure pedagogy, integrating ideas from Save the Cat and The Hero’s
          Journey to inform potential prompts and scaffolds.
        </p>
        <p>
          We ran discovery sessions with 15 independent creators and small
          production teams. They described a fragmented process: notes in Google
          Docs, sketches in notebooks, and scattered tools for voiceover and
          visualization. What they wanted was creative momentum—tools that
          support flow, not friction. We also studied screenwriting and story
          structure pedagogy, integrating ideas from Save the Cat and The Hero’s
          Journey to inform potential prompts and scaffolds.
        </p>{" "}
        <p>
          We ran discovery sessions with 15 independent creators and small
          production teams. They described a fragmented process: notes in Google
          Docs, sketches in notebooks, and scattered tools for voiceover and
          visualization. What they wanted was creative momentum—tools that
          support flow, not friction. We also studied screenwriting and story
          structure pedagogy, integrating ideas from Save the Cat and The Hero’s
          Journey to inform potential prompts and scaffolds.
        </p>{" "}
        <p>
          We ran discovery sessions with 15 independent creators and small
          production teams. They described a fragmented process: notes in Google
          Docs, sketches in notebooks, and scattered tools for voiceover and
          visualization. What they wanted was creative momentum—tools that
          support flow, not friction. We also studied screenwriting and story
          structure pedagogy, integrating ideas from Save the Cat and The Hero’s
          Journey to inform potential prompts and scaffolds.
        </p>
      </section>
      <section id="section-3" className="scroll-mt-24">
        <h2>Design</h2>
        <p>
          We designed an app with four core tools: Story Engine: guided
          narrative scaffolding with flexible templates AI Storyboards:
          auto-generated visual scenes from descriptions Script Editor:
          screenplay formatting with beat tracking Voice Studio: AI voices to
          prototype tone, pace, and narration The UI was optimized for minimal
          context switching. We used a timeline layout to help writers visualize
          progression. We built a lightweight collaboration model for teams.
        </p>{" "}
        <p>
          We designed an app with four core tools: Story Engine: guided
          narrative scaffolding with flexible templates AI Storyboards:
          auto-generated visual scenes from descriptions Script Editor:
          screenplay formatting with beat tracking Voice Studio: AI voices to
          prototype tone, pace, and narration The UI was optimized for minimal
          context switching. We used a timeline layout to help writers visualize
          progression. We built a lightweight collaboration model for teams.
        </p>{" "}
        <p>
          We designed an app with four core tools: Story Engine: guided
          narrative scaffolding with flexible templates AI Storyboards:
          auto-generated visual scenes from descriptions Script Editor:
          screenplay formatting with beat tracking Voice Studio: AI voices to
          prototype tone, pace, and narration The UI was optimized for minimal
          context switching. We used a timeline layout to help writers visualize
          progression. We built a lightweight collaboration model for teams.
        </p>{" "}
        <p>
          We designed an app with four core tools: Story Engine: guided
          narrative scaffolding with flexible templates AI Storyboards:
          auto-generated visual scenes from descriptions Script Editor:
          screenplay formatting with beat tracking Voice Studio: AI voices to
          prototype tone, pace, and narration The UI was optimized for minimal
          context switching. We used a timeline layout to help writers visualize
          progression. We built a lightweight collaboration model for teams.
        </p>
      </section>{" "}
      <section id="section-4" className="scroll-mt-24">
        <h2>Outcome</h2>
        <p>
          After launching the MVP, we onboarded 300 users in three months. Many
          cited the AI storyboards as their favorite feature—it helped them
          pitch ideas visually before production. We saw diverse use cases: from
          solo YouTubers to nonprofit doc teams. The product earned recognition
          from the Sundance Institute’s Story Lab and continues to evolve as a
          creative catalyst for narrative thinkers.
        </p>
        <p>
          After launching the MVP, we onboarded 300 users in three months. Many
          cited the AI storyboards as their favorite feature—it helped them
          pitch ideas visually before production. We saw diverse use cases: from
          solo YouTubers to nonprofit doc teams. The product earned recognition
          from the Sundance Institute’s Story Lab and continues to evolve as a
          creative catalyst for narrative thinkers.
        </p>
        <p>
          After launching the MVP, we onboarded 300 users in three months. Many
          cited the AI storyboards as their favorite feature—it helped them
          pitch ideas visually before production. We saw diverse use cases: from
          solo YouTubers to nonprofit doc teams. The product earned recognition
          from the Sundance Institute’s Story Lab and continues to evolve as a
          creative catalyst for narrative thinkers.
        </p>
        <p>
          After launching the MVP, we onboarded 300 users in three months. Many
          cited the AI storyboards as their favorite feature—it helped them
          pitch ideas visually before production. We saw diverse use cases: from
          solo YouTubers to nonprofit doc teams. The product earned recognition
          from the Sundance Institute’s Story Lab and continues to evolve as a
          creative catalyst for narrative thinkers.
        </p>
        <p>
          After launching the MVP, we onboarded 300 users in three months. Many
          cited the AI storyboards as their favorite feature—it helped them
          pitch ideas visually before production. We saw diverse use cases: from
          solo YouTubers to nonprofit doc teams. The product earned recognition
          from the Sundance Institute’s Story Lab and continues to evolve as a
          creative catalyst for narrative thinkers.
        </p>
        <p>
          After launching the MVP, we onboarded 300 users in three months. Many
          cited the AI storyboards as their favorite feature—it helped them
          pitch ideas visually before production. We saw diverse use cases: from
          solo YouTubers to nonprofit doc teams. The product earned recognition
          from the Sundance Institute’s Story Lab and continues to evolve as a
          creative catalyst for narrative thinkers.
        </p>
        <p>
          After launching the MVP, we onboarded 300 users in three months. Many
          cited the AI storyboards as their favorite feature—it helped them
          pitch ideas visually before production. We saw diverse use cases: from
          solo YouTubers to nonprofit doc teams. The product earned recognition
          from the Sundance Institute’s Story Lab and continues to evolve as a
          creative catalyst for narrative thinkers.
        </p>
        <p>
          After launching the MVP, we onboarded 300 users in three months. Many
          cited the AI storyboards as their favorite feature—it helped them
          pitch ideas visually before production. We saw diverse use cases: from
          solo YouTubers to nonprofit doc teams. The product earned recognition
          from the Sundance Institute’s Story Lab and continues to evolve as a
          creative catalyst for narrative thinkers.
        </p>
        <p>
          After launching the MVP, we onboarded 300 users in three months. Many
          cited the AI storyboards as their favorite feature—it helped them
          pitch ideas visually before production. We saw diverse use cases: from
          solo YouTubers to nonprofit doc teams. The product earned recognition
          from the Sundance Institute’s Story Lab and continues to evolve as a
          creative catalyst for narrative thinkers.
        </p>
        <p>
          After launching the MVP, we onboarded 300 users in three months. Many
          cited the AI storyboards as their favorite feature—it helped them
          pitch ideas visually before production. We saw diverse use cases: from
          solo YouTubers to nonprofit doc teams. The product earned recognition
          from the Sundance Institute’s Story Lab and continues to evolve as a
          creative catalyst for narrative thinkers.
        </p>
        <p>
          After launching the MVP, we onboarded 300 users in three months. Many
          cited the AI storyboards as their favorite feature—it helped them
          pitch ideas visually before production. We saw diverse use cases: from
          solo YouTubers to nonprofit doc teams. The product earned recognition
          from the Sundance Institute’s Story Lab and continues to evolve as a
          creative catalyst for narrative thinkers.
        </p>
        <p>
          After launching the MVP, we onboarded 300 users in three months. Many
          cited the AI storyboards as their favorite feature—it helped them
          pitch ideas visually before production. We saw diverse use cases: from
          solo YouTubers to nonprofit doc teams. The product earned recognition
          from the Sundance Institute’s Story Lab and continues to evolve as a
          creative catalyst for narrative thinkers.
        </p>
        <p>
          After launching the MVP, we onboarded 300 users in three months. Many
          cited the AI storyboards as their favorite feature—it helped them
          pitch ideas visually before production. We saw diverse use cases: from
          solo YouTubers to nonprofit doc teams. The product earned recognition
          from the Sundance Institute’s Story Lab and continues to evolve as a
          creative catalyst for narrative thinkers.
        </p>
        <p>
          After launching the MVP, we onboarded 300 users in three months. Many
          cited the AI storyboards as their favorite feature—it helped them
          pitch ideas visually before production. We saw diverse use cases: from
          solo YouTubers to nonprofit doc teams. The product earned recognition
          from the Sundance Institute’s Story Lab and continues to evolve as a
          creative catalyst for narrative thinkers.
        </p>
        <p>
          After launching the MVP, we onboarded 300 users in three months. Many
          cited the AI storyboards as their favorite feature—it helped them
          pitch ideas visually before production. We saw diverse use cases: from
          solo YouTubers to nonprofit doc teams. The product earned recognition
          from the Sundance Institute’s Story Lab and continues to evolve as a
          creative catalyst for narrative thinkers.
        </p>
      </section>{" "}
      <section id="section-5" className="scroll-mt-24">
        <h2>Outcome</h2>
        <p>
          After launching the MVP, we onboarded 300 users in three months. Many
          cited the AI storyboards as their favorite feature—it helped them
          pitch ideas visually before production. We saw diverse use cases: from
          solo YouTubers to nonprofit doc teams. The product earned recognition
          from the Sundance Institute’s Story Lab and continues to evolve as a
          creative catalyst for narrative thinkers.
        </p>
        <p>
          After launching the MVP, we onboarded 300 users in three months. Many
          cited the AI storyboards as their favorite feature—it helped them
          pitch ideas visually before production. We saw diverse use cases: from
          solo YouTubers to nonprofit doc teams. The product earned recognition
          from the Sundance Institute’s Story Lab and continues to evolve as a
          creative catalyst for narrative thinkers.
        </p>
        <p>
          After launching the MVP, we onboarded 300 users in three months. Many
          cited the AI storyboards as their favorite feature—it helped them
          pitch ideas visually before production. We saw diverse use cases: from
          solo YouTubers to nonprofit doc teams. The product earned recognition
          from the Sundance Institute’s Story Lab and continues to evolve as a
          creative catalyst for narrative thinkers.
        </p>
        <p>
          After launching the MVP, we onboarded 300 users in three months. Many
          cited the AI storyboards as their favorite feature—it helped them
          pitch ideas visually before production. We saw diverse use cases: from
          solo YouTubers to nonprofit doc teams. The product earned recognition
          from the Sundance Institute’s Story Lab and continues to evolve as a
          creative catalyst for narrative thinkers.
        </p>
        <p>
          After launching the MVP, we onboarded 300 users in three months. Many
          cited the AI storyboards as their favorite feature—it helped them
          pitch ideas visually before production. We saw diverse use cases: from
          solo YouTubers to nonprofit doc teams. The product earned recognition
          from the Sundance Institute’s Story Lab and continues to evolve as a
          creative catalyst for narrative thinkers.
        </p>
        <p>
          After launching the MVP, we onboarded 300 users in three months. Many
          cited the AI storyboards as their favorite feature—it helped them
          pitch ideas visually before production. We saw diverse use cases: from
          solo YouTubers to nonprofit doc teams. The product earned recognition
          from the Sundance Institute’s Story Lab and continues to evolve as a
          creative catalyst for narrative thinkers.
        </p>
        <p>
          After launching the MVP, we onboarded 300 users in three months. Many
          cited the AI storyboards as their favorite feature—it helped them
          pitch ideas visually before production. We saw diverse use cases: from
          solo YouTubers to nonprofit doc teams. The product earned recognition
          from the Sundance Institute’s Story Lab and continues to evolve as a
          creative catalyst for narrative thinkers.
        </p>
        <p>
          After launching the MVP, we onboarded 300 users in three months. Many
          cited the AI storyboards as their favorite feature—it helped them
          pitch ideas visually before production. We saw diverse use cases: from
          solo YouTubers to nonprofit doc teams. The product earned recognition
          from the Sundance Institute’s Story Lab and continues to evolve as a
          creative catalyst for narrative thinkers.
        </p>
        <p>
          After launching the MVP, we onboarded 300 users in three months. Many
          cited the AI storyboards as their favorite feature—it helped them
          pitch ideas visually before production. We saw diverse use cases: from
          solo YouTubers to nonprofit doc teams. The product earned recognition
          from the Sundance Institute’s Story Lab and continues to evolve as a
          creative catalyst for narrative thinkers.
        </p>
        <p>
          After launching the MVP, we onboarded 300 users in three months. Many
          cited the AI storyboards as their favorite feature—it helped them
          pitch ideas visually before production. We saw diverse use cases: from
          solo YouTubers to nonprofit doc teams. The product earned recognition
          from the Sundance Institute’s Story Lab and continues to evolve as a
          creative catalyst for narrative thinkers.
        </p>
        <p>
          After launching the MVP, we onboarded 300 users in three months. Many
          cited the AI storyboards as their favorite feature—it helped them
          pitch ideas visually before production. We saw diverse use cases: from
          solo YouTubers to nonprofit doc teams. The product earned recognition
          from the Sundance Institute’s Story Lab and continues to evolve as a
          creative catalyst for narrative thinkers.
        </p>
        <p>
          After launching the MVP, we onboarded 300 users in three months. Many
          cited the AI storyboards as their favorite feature—it helped them
          pitch ideas visually before production. We saw diverse use cases: from
          solo YouTubers to nonprofit doc teams. The product earned recognition
          from the Sundance Institute’s Story Lab and continues to evolve as a
          creative catalyst for narrative thinkers.
        </p>
        <p>
          After launching the MVP, we onboarded 300 users in three months. Many
          cited the AI storyboards as their favorite feature—it helped them
          pitch ideas visually before production. We saw diverse use cases: from
          solo YouTubers to nonprofit doc teams. The product earned recognition
          from the Sundance Institute’s Story Lab and continues to evolve as a
          creative catalyst for narrative thinkers.
        </p>
        <p>
          After launching the MVP, we onboarded 300 users in three months. Many
          cited the AI storyboards as their favorite feature—it helped them
          pitch ideas visually before production. We saw diverse use cases: from
          solo YouTubers to nonprofit doc teams. The product earned recognition
          from the Sundance Institute’s Story Lab and continues to evolve as a
          creative catalyst for narrative thinkers.
        </p>
        <p>
          After launching the MVP, we onboarded 300 users in three months. Many
          cited the AI storyboards as their favorite feature—it helped them
          pitch ideas visually before production. We saw diverse use cases: from
          solo YouTubers to nonprofit doc teams. The product earned recognition
          from the Sundance Institute’s Story Lab and continues to evolve as a
          creative catalyst for narrative thinkers.
        </p>
      </section>{" "}
    </article>
  );
}
