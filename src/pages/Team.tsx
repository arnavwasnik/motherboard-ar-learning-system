import { useState } from "react";
import Layout from "@/components/Layout";
import FadeIn from "@/components/FadeIn";

const members = [
  {
    name: "Arnav Wasnik",
    roll: "A-21",
    image: "/team/arnav.webp",
    phone: "7709773462",
    linkedin: "https://www.linkedin.com/in/arnavwasnik",
    website: "https://arnavwasnikportfolio.netlify.app/",
  },
  {
    name: "Aniket Thaokar",
    roll: "A-15",
    image: "/team/aniket.jpg",
    phone: "+91XXXXXXXXXX",
    linkedin: "#",
    website: "#",
  },
  {
    name: "Bhushan Kawale",
    roll: "A-40",
    image: "/team/bhushan.jpg",
    phone: "+91XXXXXXXXXX",
    linkedin: "#",
    website: "#",
  },
  {
    name: "Aditya Jamunpane",
    roll: "A-5",
    image: "/team/aditya-j.jpg",
    phone: "+91XXXXXXXXXX",
    linkedin: "#",
    website: "#",
  },
  {
    name: "Aditya Meshram",
    roll: "A-6",
    image: "/team/aditya-m.jpg",
    phone: "+91XXXXXXXXXX",
    linkedin: "#",
    website: "#",
  },
];

const Team = () => {
  const [selected, setSelected] = useState(null);

  return (
    <Layout>
      <section className="px-4 pt-6 pb-12">
        <div className="container-narrow">

          <FadeIn>
            <p className="text-primary text-xs font-semibold tracking-wider uppercase mb-2">
              Team
            </p>

            <h1 className="text-2xl font-bold text-foreground mb-6">
              Meet Our Team
            </h1>
          </FadeIn>

          {/* Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">

            {members.map((m, i) => (
              <FadeIn key={m.name} delay={i * 0.06}>

                <div className="glass rounded-xl p-4 text-center">

                  {/* Image */}
                  <img
                    src={m.image}
                    alt={m.name}
                    className="w-20 h-20 mx-auto rounded-full object-cover border border-white/20 mb-3"
                  />

                  {/* Name */}
                  <h3 className="text-sm font-semibold text-foreground">
                    {m.name}
                  </h3>

                  {/* Roll */}
                  <p className="text-primary text-xs mt-1 mb-3">
                    Roll No: {m.roll}
                  </p>

                  {/* Contact Button */}
                  <button
                    onClick={() => setSelected(m)}
                    className="text-xs px-3 py-1.5 rounded-md border border-primary text-primary hover:bg-primary hover:text-white transition"
                  >
                    Contact
                  </button>

                </div>

              </FadeIn>
            ))}

          </div>
        </div>

        {/* Contact Modal */}
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