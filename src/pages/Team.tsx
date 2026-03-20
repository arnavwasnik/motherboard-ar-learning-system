import { useState } from "react";
import Layout from "@/components/Layout";
import FadeIn from "@/components/FadeIn";

const members = [
  {
    name: "Arnav Wasnik",
    roll: "A-21",
    role: "Lead, Frontend, Backend, Hosting & AR",
    image: "/team/arnav.jpeg",
    phone: "7709773462",
    linkedin: "https://www.linkedin.com/in/arnavwasnik",
    website: "https://arnavwasnikportfolio.netlify.app/",
  },
  {
    name: "Aniket Thaokar",
    roll: "A-15",
    role: "AR Development",
    image: "/team/aniket.png",
    phone: "9356811029",
    linkedin: "#",
    website: "#",
  },
  {
    name: "Bhushan Kawale",
    roll: "A-40",
    role: "AR Development",
    image: "/team/bhushan.jpeg",
    phone: "9112075639",
    linkedin: "#",
    website: "#",
  },
  {
    name: "Aditya Jamunpane",
    roll: "A-5",
    role: "Testing & Documentation",
    image: "/team/aditya-j.jpeg",
    phone: "8855988903",
    linkedin: "#",
    website: "#",
  },
  {
    name: "Aditya Meshram",
    roll: "A-6",
    role: "Testing & Support",
    image: "/team/aditya-m.jpeg",
    phone: "8766700138",
    linkedin: "#",
    website: "#",
  },
];

const Team = () => {
  const [selected, setSelected] = useState(null);

  return (
    <Layout>
      <section className="px-4 pt-6 pb-16">
        <div className="max-w-5xl mx-auto">

          {/* Header */}
          <FadeIn>
            <p className="text-primary text-xs font-semibold tracking-wider uppercase mb-2">
              Team
            </p>

            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-6">
              Meet Our Team
            </h1>
          </FadeIn>

          {/* Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">

            {members.map((m, i) => (
              <FadeIn key={m.name} delay={i * 0.06}>

                <div
                  className={`glass rounded-xl p-4 text-center transition-all duration-300 
                  ${
                    m.name === "Arnav Wasnik"
                      ? "border border-primary/40 shadow-lg"
                      : "border border-white/10"
                  }`}
                >

                  {/* Image */}
                  <img
                    src={m.image}
                    alt={m.name}
                    className="w-20 h-20 mx-auto rounded-full object-cover border border-white/20 mb-3 shadow-md"
                  />

                  {/* Name */}
                  <h3 className="text-sm font-semibold text-foreground">
                    {m.name}
                  </h3>

                  {/* Role */}
                  <p className="text-[11px] text-muted-foreground mt-1">
                    {m.role}
                  </p>

                  {/* Roll */}
                  <p className="text-primary text-xs mt-1 mb-3">
                    Roll No: {m.roll}
                  </p>

                  {/* Button */}
                  <button
                    onClick={() => setSelected(m)}
                    className="text-xs px-3 py-1.5 rounded-md bg-primary/10 text-primary hover:bg-primary hover:text-white transition"
                  >
                    Contact
                  </button>

                </div>

              </FadeIn>
            ))}

          </div>
        </div>

        {/* Modal */}
        {selected && (
          <div
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4"
            onClick={() => setSelected(null)}
          >
            <div
              className="glass rounded-xl p-6 w-full max-w-sm text-center"
              onClick={(e) => e.stopPropagation()}
            >

              <img
                src={selected.image}
                alt={selected.name}
                className="w-24 h-24 mx-auto rounded-full object-cover mb-4"
              />

              <h2 className="text-lg font-semibold text-foreground">
                {selected.name}
              </h2>

              <p className="text-[12px] text-muted-foreground mt-1">
                {selected.role}
              </p>

              <p className="text-primary text-sm mb-6">
                Roll No: {selected.roll}
              </p>

              <div className="space-y-3">

                <a
                  href={`tel:${selected.phone}`}
                  className="block w-full border border-border rounded-md py-2 text-sm hover:bg-accent transition"
                >
                  Call
                </a>

                <a
                  href={selected.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full border border-border rounded-md py-2 text-sm hover:bg-accent transition"
                >
                  LinkedIn
                </a>

                <a
                  href={selected.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full border border-border rounded-md py-2 text-sm hover:bg-accent transition"
                >
                  Website
                </a>

              </div>

              <button
                onClick={() => setSelected(null)}
                className="mt-6 text-xs text-muted-foreground hover:text-foreground"
              >
                Close
              </button>

            </div>
          </div>
        )}

      </section>
    </Layout>
  );
};

export default Team;