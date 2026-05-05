import Layout from "@/components/Layout";
import FadeIn from "@/components/FadeIn";

const sections = [
  {
    title: "Abstract",
    content: "This project presents an AR-based interactive learning system for engineering labs. Students explore motherboard architecture through real-time visualization, component identification, and gamified assembly — all accessible through standard mobile devices.",
  },
  {
    title: "Problem Statement",
    content: "Engineering students face challenges understanding hardware due to limited lab access, static diagrams, and costly equipment. Traditional methods often fail to engage students, resulting in surface-level understanding of critical concepts.",
  },
  {
    title: "Proposed System",
    content: "The system uses marker-based AR to overlay a detailed 3D motherboard model. Students interact with components via touch, accessing real-time information. A guided assembly mode lets students practice building a motherboard virtually.",
  },
  {
    title: "Methodology",
    content: "Development follows agile methodology. The AR system uses Unity with Vuforia SDK. This companion website is built with React and TypeScript. User testing with engineering students refines interaction design and learning outcomes.",
  },
  {
    title: "Future Work",
    content: "Planned enhancements include markerless AR, multi-user sessions, LMS integration, expanded hardware coverage, voice-guided tutorials, and AI-powered adaptive learning paths.",
  },
];

const Research = () => (
  <Layout>
    <section className="px-5 py-10 md:section-padding">
      <div className="container-narrow">
        <FadeIn>
          <p className="text-primary text-xs font-medium tracking-wider uppercase mb-3">Research</p>
          <h1 className="text-2xl md:text-4xl font-extrabold text-foreground mb-8">
            Research & Documentation
          </h1>
        </FadeIn>

        <div className="space-y-3">
          {sections.map((s, i) => (
            <FadeIn key={s.title} delay={i * 0.06}>
              <div className="glass rounded-xl p-5 md:p-8">
                <h2 className="text-sm font-bold text-foreground mb-2">{s.title}</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.content}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  </Layout>
);

export default Research;
