import Image from "next/image";
import ContactModal, { DemoContactButton } from "./contact-modal";

const projects = [
  {
    number: "01",
    title: "Royalty Ops",
    category: "Operations platform",
    status: "Live site",
    description:
      "A royalty-tracking system that turns complex reporting workflows into clear, dependable operations.",
    technologies: ["TypeScript", "PostgreSQL", "Full stack"],
    href: "https://royalty-ops.vercel.app/",
    favicon: "https://royalty-ops.vercel.app/favicon.ico?favicon.9a71d8b1.ico",
    featured: true,
    demoAccess: true,
  },
  {
    number: "02",
    title: "Handcrafted Haven",
    category: "E-commerce",
    status: "Live site",
    description:
      "A full-stack marketplace designed to help independent makers present and sell handcrafted goods.",
    technologies: ["React", "Node.js", "Commerce"],
    href: "https://handcrafted-haven-gilt.vercel.app/",
    favicon:
      "https://handcrafted-haven-gilt.vercel.app/favicon.ico?favicon.d46da309.ico",
    featured: false,
    demoAccess: true,
  },
  {
    number: "03",
    title: "Independent Sheets",
    category: "Digital marketplace",
    status: "Live site",
    description:
      "A platform where sheet-music publishers and composers can organize, showcase, and distribute their work.",
    technologies: ["React", "Next.js", "TypeScript"],
    href: "https://independent-sheets.vercel.app/",
    favicon:
      "https://independent-sheets.vercel.app/favicon.ico?favicon.0ac29rffyx4hv.ico",
    featured: false,
    demoAccess: true,
  },
  {
    number: "04",
    title: "The Feud",
    category: "Team game",
    status: "Live site",
    description:
      "A lively, shared-screen game experience built for workplace teams, classrooms, and groups.",
    technologies: ["TypeScript", "React", "Game logic"],
    href: "https://the-feud.vercel.app/",
    favicon: "https://the-feud.vercel.app/icon.png?icon.110d926wanqnk.png",
    featured: true,
  },
  {
    number: "05",
    title: "Snake Garden (Game)",
    category: "Interactive experience",
    status: "Live site",
    description:
      "A modern take on the arcade classic, focused on responsive controls, clear feedback, and replayability.",
    technologies: ["JavaScript", "Canvas", "UI state"],
    href: "https://snake-garden.vercel.app/",
    favicon: "https://snake-garden.vercel.app/assets/textures/snake_head.png",
    featured: false,
  },
  {
    number: "06",
    title: "Connect Four",
    category: ".NET game",
    status: "Live site",
    description:
      "A complete Connect Four implementation that demonstrates object-oriented design and thoughtful game rules.",
    technologies: [".NET", "C#", "Game logic"],
    href: "https://connect-four-three-eta.vercel.app/",
    favicon: "https://connect-four-three-eta.vercel.app/favicon.svg?v=2",
    featured: false,
  },
  {
    number: "07",
    title: "Music Info US",
    category: "Music discovery",
    status: "Live site",
    description:
      "A responsive music-information experience for exploring artists, releases, and the stories behind the music.",
    technologies: ["JavaScript", "HTML", "CSS"],
    href: "https://musicinfous.netlify.app/",
    favicon: "https://musicinfous.netlify.app/assets/favicon-CCal0LGn.ico",
    featured: false,
  },
  {
    number: "08",
    title: "Data Analysis",
    category: "Python & data",
    status: "Live site",
    description:
      "Exploratory analysis that transforms raw datasets into clear patterns, practical summaries, and useful decisions.",
    technologies: ["Python", "Data analysis", "Visualization"],
    href: "https://data-analysis-nine-lilac.vercel.app/#estimator",
    favicon: "https://data-analysis-nine-lilac.vercel.app/favicon.svg",
    featured: true,
  },
  {
    number: "09",
    title: "Cloud Databases",
    category: "Cloud data catalog",
    status: "Live site",
    description:
      "A responsive music catalog with searchable albums, artists, and songs backed by synchronized cloud data.",
    technologies: ["Python", "Flask", "Firestore"],
    href: "https://cloud-databases.vercel.app/",
    favicon: "https://cloud-databases.vercel.app/favicon.svg",
    featured: false,
  },
  {
    number: "10",
    title: "WorkSync",
    category: "Team operations platform",
    status: "Live site",
    description:
      "A multi-tenant workspace for organizing work orders, meeting assignments, follow-ups, employees, deadlines, and reports with role-based access.",
    technologies: ["ASP.NET Core", "Blazor", "PostgreSQL"],
    href: "https://work-sync-plum.vercel.app/",
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
              Junior software developer · Full-stack developer · Problem solver
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
            <span className="count">10 projects / Full-stack &amp; beyond</span>
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
                {project.demoAccess ? (
                  <DemoContactButton project={project.title} />
                ) : null}
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
          </div>
        </div>
      </footer>
    </>
  );
}
