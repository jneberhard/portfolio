const projects = [
  {
    number: "01",
    title: "Royalty Ops",
    category: "Operations platform",
    status: "Case study",
    description:
      "A royalty-tracking system that turns complex reporting workflows into clear, dependable operations.",
    technologies: ["TypeScript", "PostgreSQL", "Full stack"],
    href: "https://github.com/jneberhard?tab=repositories",
    featured: true,
  },
  {
    number: "02",
    title: "Handcrafted Haven",
    category: "E-commerce",
    status: "Private build",
    description:
      "A full-stack marketplace designed to help independent makers present and sell handcrafted goods.",
    technologies: ["React", "Node.js", "Commerce"],
    href: "https://github.com/jneberhard?tab=repositories",
    featured: false,
  },
  {
    number: "03",
    title: "Independent Sheets",
    category: "Digital marketplace",
    status: "GitHub",
    description:
      "A platform where sheet-music publishers and composers can organize, showcase, and distribute their work.",
    technologies: ["React", "Next.js", "TypeScript"],
    href: "https://github.com/jneberhard/independent_sheets",
    featured: false,
  },
  {
    number: "04",
    title: "The Feud",
    category: "Team game",
    status: "GitHub",
    description:
      "A lively, shared-screen game experience built for workplace teams, classrooms, and groups.",
    technologies: ["TypeScript", "React", "Game logic"],
    href: "https://github.com/jneberhard/the-feud",
    featured: true,
  },
  {
    number: "05",
    title: "Snake Game",
    category: "Interactive experience",
    status: "Private build",
    description:
      "A modern take on the arcade classic, focused on responsive controls, clear feedback, and replayability.",
    technologies: ["JavaScript", "Canvas", "UI state"],
    href: "https://github.com/jneberhard?tab=repositories",
    featured: false,
  },
  {
    number: "06",
    title: "Connect Four",
    category: ".NET game",
    status: "GitHub",
    description:
      "A complete Connect Four implementation that demonstrates object-oriented design and thoughtful game rules.",
    technologies: [".NET", "C#", "Game logic"],
    href: "https://github.com/jneberhard/ConnectFour",
    featured: false,
  },
  {
    number: "07",
    title: "Data Analysis",
    category: "Python",
    status: "GitHub",
    description:
      "Exploratory data work that turns raw information into useful patterns, summaries, and decisions.",
    technologies: ["Python", "Analysis", "Data"],
    href: "https://github.com/jneberhard/Data_Analysis",
    featured: false,
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
];

export default function Home() {
  return (
    <>
      <header className="site-header shell">
        <a className="mark" href="#top" aria-label="Jim Eberhard home">
          JE
        </a>
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
            <h2 id="work-title">Selected work</h2>
            <span className="count">07 projects / Full-stack &amp; beyond</span>
          </div>
          <div className="projects">
            {projects.map((project) => (
              <a
                className={`project${project.featured ? " featured" : ""}`}
                href={project.href}
                target="_blank"
                rel="noreferrer"
                key={project.title}
                aria-label={`View ${project.title} on GitHub`}
              >
                <div className="project-meta">
                  <span>
                    {project.number} / {project.category}
                  </span>
                  <span>{project.status}</span>
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
              completing my degree, I worked as an Americas SMB Team Lead at
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
            <div className="footer-links">
              <a href="https://github.com/jneberhard" target="_blank" rel="noreferrer">
                GitHub <span aria-hidden="true">↗</span>
              </a>
              <a
                href="https://www.linkedin.com/in/jim-eberhard"
                target="_blank"
                rel="noreferrer"
              >
                LinkedIn <span aria-hidden="true">↗</span>
              </a>
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
