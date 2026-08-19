import Image from "next/image";
import ContactModal, { DemoContactButton } from "./contact-modal";

const projects = [
  {
    number: "01",
    title: "RoyaltyOps",
    category: "Operations platform",
    status: "Live site",
    description:
      "A multi-tenant Next.js and PostgreSQL platform that imports and validates royalty data—up to 50,000 rows per file—then calculates rates, generates statements, tracks payments, and maintains publisher ledgers.",
    technologies: ["Next.js", "Prisma", "PostgreSQL"],
    href: "https://royalty-ops.vercel.app/",
    repositoryHref: "https://github.com/jneberhard/royalty-ops",
    favicon: "https://royalty-ops.vercel.app/favicon.ico",
    featured: true,
    demoAccess: true,
  },
    {
    number: "02",
    title: "KinLedger",
    category: "Family loan ledger",
    status: "Live site",
    description:
      "A secure Next.js and PostgreSQL family-loan ledger with exact day-count interest, idempotent monthly posting, audit logs, CSV export, parent administration, and server-enforced read-only access for children.",
    technologies: ["Next.js", "Prisma", "PostgreSQL"],
    href: "https://family-loan.vercel.app/",
    repositoryHref: "https://github.com/jneberhard/family-loan",
    favicon: "https://family-loan.vercel.app/icon.png",
    featured: false,
    demoAccess: true,
  },
  {
    number: "03",
    title: "Handcrafted Haven",
    category: "E-commerce",
    status: "Live site",
    description:
      "A full-stack marketplace built with Next.js, Prisma, PostgreSQL, and Vercel Blob. It gives independent makers one workflow for product images, inventory, orders, reviews, buyer messages, and notifications.",
    technologies: ["Next.js", "Prisma", "Vercel Blob"],
    href: "https://handcrafted-haven-gilt.vercel.app/",
    repositoryHref: "https://github.com/Stratoverus/handcrafted-haven",
    favicon:
      "https://handcrafted-haven-gilt.vercel.app/favicon.ico?favicon.d46da309.ico",
    featured: false,
    demoAccess: true,
  },
  {
    number: "04",
    title: "Independent Sheets",
    category: "Digital marketplace",
    status: "Live site",
    description:
      "A role-based sheet-music marketplace using Next.js, Prisma, Neon, and Vercel Blob. Publishers upload rights-verified PDFs and audio previews while purchases automatically create royalty and platform-share records.",
    technologies: ["Next.js", "Neon", "Prisma"],
    href: "https://independent-sheets.vercel.app/",
    repositoryHref: "https://github.com/jneberhard/independent_sheets",
    favicon:
      "https://independent-sheets.vercel.app/favicon.ico?favicon.0ac29rffyx4hv.ico",
    featured: false,
    demoAccess: true,
  },
  {
    number: "05",
    title: "The Feud",
    category: "Team game",
    status: "Live site",
    description:
      "A host-controlled survey game built with Next.js and TypeScript. Six category packs provide 60 scored rounds, while editable teams, answer reveals, strikes, and round totals keep group play moving smoothly.",
    technologies: ["Next.js", "TypeScript", "Game state"],
    href: "https://the-feud.vercel.app/",
    repositoryHref: "https://github.com/jneberhard/the-feud",
    favicon: "https://the-feud.vercel.app/icon.png?icon.110d926wanqnk.png",
    featured: true,
  },
  {
    number: "06",
    title: "Snake Garden (Game)",
    category: "Interactive experience",
    status: "Live site",
    description:
      "A browser-ready evolution of a Python Arcade game with multiple board sizes, progressive speed, poison hazards, pause and sound controls, textured graphics, and persistent local high scores—with no backend required.",
    technologies: ["JavaScript", "Python / Arcade", "Local storage"],
    href: "https://snake-garden.vercel.app/",
    repositoryHref: "https://github.com/jneberhard/Game_Framework",
    favicon: "https://snake-garden.vercel.app/assets/textures/snake_head.png",
    featured: false,
  },
  {
    number: "07",
    title: "Connect Four",
    category: ".NET game",
    status: "Live site",
    description:
      "A two-player Blazor game whose C# GameState engine validates moves, alternates turns, detects horizontal, vertical, and diagonal wins, and resets play without a page reload.",
    technologies: ["Blazor", "C#", ".NET"],
    href: "https://connect-four-three-eta.vercel.app/",
    repositoryHref: "https://github.com/jneberhard/ConnectFour",
    favicon: "https://connect-four-three-eta.vercel.app/favicon.svg?v=2",
    featured: false,
  },
  {
    number: "08",
    title: "Music Info US",
    category: "Music discovery",
    status: "Live site",
    description:
      "A responsive Vite application that searches Spotify-powered artist and song data, organizes discovery by genre and top lists, and keeps API credentials server-side through a Netlify Function.",
    technologies: ["JavaScript", "Spotify API", "Netlify Functions"],
    href: "https://musicinfous.netlify.app/",
    repositoryHref: "https://github.com/jneberhard/musicinfous",
    favicon: "https://musicinfous.netlify.app/assets/favicon-CCal0LGn.ico",
    featured: false,
  },
  {
    number: "09",
    title: "Data Analysis",
    category: "Python & data",
    status: "Live site",
    description:
      "LoanLens analyzes 4,269 applications with Pandas, NumPy, and a custom logistic-regression model. It found nearly identical approval rates for self-employed and salaried applicants and powers an in-browser probability estimator.",
    technologies: ["Python", "Pandas / NumPy", "Regression"],
    href: "https://data-analysis-nine-lilac.vercel.app/#estimator",
    repositoryHref: "https://github.com/jneberhard/Data_Analysis",
    favicon: "https://data-analysis-nine-lilac.vercel.app/favicon.svg",
    featured: true,
  },
  {
    number: "10",
    title: "Cloud Databases",
    category: "Cloud data catalog",
    status: "Live site",
    description:
      "A Flask and Firestore music catalog with searchable albums, artists, and songs. Full CRUD workflows keep album track lists and song-to-album relationships synchronized across a responsive web interface.",
    technologies: ["Python", "Flask", "Firestore"],
    href: "https://cloud-databases.vercel.app/",
    repositoryHref: "https://github.com/jneberhard/Cloud_Databases",
    favicon: "https://cloud-databases.vercel.app/favicon.svg",
    featured: false,
  },
  {
    number: "11",
    title: "WorkSync",
    category: "Team operations platform",
    status: "Live site",
    description:
      "A tenant-isolated operations workspace built with Blazor, ASP.NET Core, EF Core, and PostgreSQL. Role-based workflows unify work orders, assignments, confidential follow-ups, employees, dashboards, and exportable reports.",
    technologies: ["Blazor", "EF Core", "PostgreSQL"],
    href: "https://work-sync-plum.vercel.app/",
    repositoryHref: "https://github.com/jneberhard/WorkSync",
    favicon: "https://work-sync-plum.vercel.app/favicon.png",
    featured: false,
    demoAccess: true,
  },

];

const skills = [
  "JavaScript",
  "TypeScript",
  "Python",
  "C#",
  "React",
  "Next.js",
  "Node.js",
  "PostgreSQL",
  "Prisma",
  "REST APIs",
  "Git & GitHub",
  "Vercel",
  "Database Design",
  "Authentication",
  "API Design",
  "Cloud Deployment",
  "Responsive Design",
  "Data Visualization",
  "Object-Oriented Design",
  "Team Leadership",
  "Flask",
  "Firebase / Firestore",
  "CRUD Applications",
  "Serverless APIs",
  "ASP.NET Core",
  "Blazor",
  "Entity Framework Core",
  "Multi-Tenant Architecture",
];

export default function Home() {
  return (
    <>
      <header className="site-header shell">
        <div className="brand-cluster">
          <a className="mark" href="#top" aria-label="Jim Eberhard home">
            JE
          </a>
          <div className="welcome-animation" aria-hidden="true">
            <span className="balloon">
              <span className="balloon-body" />
              <span className="balloon-string" />
            </span>
            <span className="pop-burst" />
            <span className="welcome-word">Welcome</span>
          </div>
        </div>
        <span className="site-name">Jim Eberhard / Portfolio</span>
        <nav aria-label="Primary navigation">
          <a href="#work">Work</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>

      <main id="top">
        <section className="hero shell" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow">
              Software developer · Full-stack developer · Problem solver
            </p>
            <h1 id="hero-title">
              Building software with <em>clarity.</em>
            </h1>
          </div>
          <div className="hero-note">
            <p>
              Building modern web applications that combine great user
              experiences with scalable, maintainable software solutions.
            </p>
            <a className="availability" href="#contact">
              <span className="dot" aria-hidden="true" />
              Open to software opportunities
            </a>
          </div>
        </section>

        <section className="work shell" id="work" aria-labelledby="work-title">
          <div className="section-head">
            <h2 id="work-title">Selected Works</h2>
            <span className="count">11 projects / Full-stack &amp; beyond</span>
          </div>
          <div className="projects">
            {projects.map((project) => (
              <article
                className={`project${project.featured ? " featured" : ""}`}
                key={project.title}
              >
                <a
                  className="project-link"
                  href={project.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Open the ${project.title} project`}
                >
                  <div className="project-meta">
                    <span>
                      {project.number} / {project.category}
                    </span>
                    <span>{project.status}</span>
                  </div>
                  <div className="project-favicon" aria-hidden="true">
                    <Image
                      src={project.favicon}
                      alt=""
                      width={64}
                      height={64}
                      unoptimized
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="project-body">
                    <h3>{project.title}</h3>
                    <p>{project.description}</p>
                  </div>
                  <div className="project-footer">
                    <span>{project.technologies.join(" · ")}</span>
                    <span className="arrow" aria-hidden="true">
                      ↗
                    </span>
                  </div>
                </a>
                <div className="project-actions">
                  <a
                    className="repository-access"
                    href={project.repositoryHref}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={
                      project.repositoryLabel
                        ? `Browse Jim Eberhard's GitHub repositories for ${project.title}`
                        : `Open the ${project.title} repository on GitHub`
                    }
                  >
                    <span>{project.repositoryLabel ?? "View repository"}</span>
                    <span aria-hidden="true">GitHub ↗</span>
                  </a>
                  {project.demoAccess ? (
                    <DemoContactButton project={project.title} />
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="about shell" id="about" aria-labelledby="about-title">
          <div className="about-heading">
            <p className="eyebrow">About me</p>
            <h2 id="about-title">
              Engineer’s mindset. <em>Leader’s perspective.</em>
            </h2>
          </div>
          <div className="about-copy">
            <p className="about-lede">
              Hello! I’m Jim Eberhard, a Software Development graduate from
              BYU–Idaho with a passion for building modern, user-focused
              applications that solve real-world problems.
            </p>
            <p>
              My background combines software engineering and leadership. While
              completing my degree, I worked as the Americas SMB Team Lead at
              Adobe—leading teams, improving processes, and developing a deep
              understanding of technology, project management, and customer
              needs. That experience strengthened the communication,
              problem-solving, and collaboration skills I bring to every build.
            </p>
            <p>
              I enjoy full-stack development, especially designing scalable
              systems, creating intuitive experiences, and turning complex ideas
              into practical software. Projects such as Independent Sheets,
              royalty tracking tools, and e-commerce applications have given me
              hands-on experience with database design, authentication, cloud
              deployment, and modern Git workflows.
            </p>
            <p>
              I’m continually learning and enjoy solving difficult problems with
              clean, maintainable code. My goal is to contribute on a
              collaborative engineering team where I can keep growing and build
              software that makes a meaningful difference.
            </p>
          </div>
          <div className="skills" aria-label="Technologies and skills">
            {skills.map((skill, index) => (
              <span key={skill}>
                <b>{String(index + 1).padStart(2, "0")}</b>
                {skill}
              </span>
            ))}
          </div>
        </section>
      </main>

      <footer className="site-footer" id="contact">
        <div className="footer-inner">
          <div className="footer-top">
            <div>
              <p className="footer-kicker">Have a role or project in mind?</p>
              <p className="footer-title">
                Let’s build something <em>worth using.</em>
              </p>
            </div>
            <div className="footer-actions">
              <ContactModal />
              <div className="footer-links">
                <a
                  href="https://github.com/jneberhard"
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className="footer-link-label">
                    <Image
                      src="https://github.githubassets.com/favicons/favicon.svg"
                      alt=""
                      width={28}
                      height={28}
                      unoptimized
                      referrerPolicy="no-referrer"
                      aria-hidden="true"
                    />
                    GitHub
                  </span>
                  <span aria-hidden="true">↗</span>
                </a>
                <a
                  href="https://www.linkedin.com/in/james-eberhard-7582bb5"
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className="footer-link-label">
                    <Image
                      src="https://www.linkedin.com/favicon.ico"
                      alt=""
                      width={28}
                      height={28}
                      unoptimized
                      referrerPolicy="no-referrer"
                      aria-hidden="true"
                    />
                    LinkedIn
                  </span>
                  <span aria-hidden="true">↗</span>
                </a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <span>Jim Eberhard © 2026</span>
            <span>Built with React + curiosity</span>
            <span>Open to software development roles</span>
            <a href="/privacy">Privacy</a>
          </div>
        </div>
      </footer>
    </>
  );
}
