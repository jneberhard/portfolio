/** Content contract consumed by static case-study routes and metadata generation. */
export type CaseStudy = {
  slug: string;
  number: string;
  title: string;
  category: string;
  summary: string;
  liveHref: string;
  repositoryHref: string;
  technologies: string[];
  challenge: string;
  approach: string;
  highlights: Array<{
    title: string;
    description: string;
  }>;
  outcomes: string[];
};

// Case-study copy lives outside the page component so the layout stays reusable and
// each slug has one source of truth for metadata, links, narrative, and outcomes.
export const caseStudies: CaseStudy[] = [
  {
    slug: "royalty-ops",
    number: "01",
    title: "Royalty Ops",
    category: "Multi-tenant operations platform",
    summary:
      "A full-stack platform that turns high-volume royalty data into validated statements, payment records, and dependable publisher ledgers.",
    liveHref: "https://royalty-ops.vercel.app/",
    repositoryHref: "https://github.com/jneberhard/royalty-ops",
    technologies: ["Next.js", "TypeScript", "Prisma", "PostgreSQL", "Vercel"],
    challenge:
      "Royalty administration combines large imports, rate rules, statements, payments, and historical balances. The system needed to keep those workflows understandable while isolating each organization's data and preserving a reliable financial trail.",
    approach:
      "I organized the application around a tenant-aware data model and a staged import workflow. Files are validated before royalty calculations change operational records, while statements, payments, and publisher balances remain connected through explicit database relationships.",
    highlights: [
      {
        title: "High-volume validation",
        description:
          "Processes imports of up to 50,000 rows and surfaces validation problems before downstream calculations and statements are produced.",
      },
      {
        title: "Tenant-aware architecture",
        description:
          "Scopes operational data by organization so publishers, statements, imports, and payments remain separated at the application and database layers.",
      },
      {
        title: "Connected financial workflow",
        description:
          "Carries approved data through rate calculations, statement generation, payment tracking, and publisher-ledger updates rather than treating each step as an isolated tool.",
      },
      {
        title: "Operational clarity",
        description:
          "Uses status-driven workflows and focused interfaces to make complex royalty operations easier to review, correct, and complete.",
      },
    ],
    outcomes: [
      "Consolidates importing, calculation, statement, payment, and ledger work into one application.",
      "Reduces the risk of invalid source data silently reaching financial outputs.",
      "Demonstrates scalable file processing, relational modeling, and multi-tenant application design.",
    ],
  },
  {
    slug: "kinledger",
    number: "02",
    title: "KinLedger",
    category: "Secure family-loan ledger",
    summary:
      "A role-based ledger that makes family advances, repayments, interest, and history transparent without sacrificing administrative control.",
    liveHref: "https://family-loan.vercel.app/",
    repositoryHref: "https://github.com/jneberhard/family-loan",
    technologies: ["Next.js", "TypeScript", "Prisma", "PostgreSQL", "CSV"],
    challenge:
      "Informal family loans become difficult to reconcile when balances, interest, and payments live in spreadsheets or message threads. The application needed exact calculations, a clear audit history, and different capabilities for administrators and family members.",
    approach:
      "I modeled advances, repayments, interest postings, and audit events as durable ledger records. Authorization is enforced on the server, and monthly interest operations are idempotent so a repeated request cannot post the same period twice.",
    highlights: [
      {
        title: "Exact interest calculations",
        description:
          "Uses day-count interest logic so balances reflect the timing of advances and repayments instead of relying on coarse monthly estimates.",
      },
      {
        title: "Idempotent monthly posting",
        description:
          "Protects recurring interest operations from duplicate execution and preserves a consistent ledger when requests are retried.",
      },
      {
        title: "Server-enforced roles",
        description:
          "Allows parent administrators to manage records while family-member accounts receive read-only access to the information intended for them.",
      },
      {
        title: "Portable records",
        description:
          "Provides audit history and CSV export so activity can be reviewed outside the interface and retained as a practical record.",
      },
    ],
    outcomes: [
      "Creates a single, understandable source of truth for balances and transaction history.",
      "Prevents duplicate monthly interest from changing balances during request retries.",
      "Demonstrates financial-domain modeling, authorization, auditability, and defensive backend design.",
    ],
  },
  {
    slug: "independent-sheets",
    number: "04",
    title: "Independent Sheets",
    category: "Digital sheet-music marketplace",
    summary:
      "A role-based marketplace where publishers can distribute rights-verified music files and purchases automatically produce royalty records.",
    liveHref: "https://independent-sheets.vercel.app/",
    repositoryHref: "https://github.com/jneberhard/independent_sheets",
    technologies: ["Next.js", "TypeScript", "Prisma", "Neon", "Vercel Blob"],
    challenge:
      "A sheet-music marketplace must serve buyers while respecting publisher ownership, file rights, media delivery, and royalty accounting. Those responsibilities needed to work as one coherent transaction rather than disconnected upload and storefront features.",
    approach:
      "I separated publisher and customer workflows through role-based access, stored structured catalog and purchase data in PostgreSQL, and used managed blob storage for PDFs, artwork, and audio previews. Purchase records connect directly to royalty and platform-share records.",
    highlights: [
      {
        title: "Rights-aware publishing",
        description:
          "Publisher workflows capture ownership confirmation before sheet-music files and previews become part of the catalog.",
      },
      {
        title: "Managed media delivery",
        description:
          "Uses Vercel Blob for durable PDF, image, and audio assets while keeping searchable catalog metadata in the relational database.",
      },
      {
        title: "Role-based experiences",
        description:
          "Separates publisher administration from customer discovery and purchasing so each user sees focused tools and appropriate permissions.",
      },
      {
        title: "Royalty-aware purchases",
        description:
          "Creates royalty and platform-share data as part of the purchase workflow, keeping commercial activity tied to accounting records.",
      },
    ],
    outcomes: [
      "Connects catalog management, media delivery, purchasing, and royalty records in one full-stack product.",
      "Gives independent publishers a structured way to present downloadable music and audio previews.",
      "Demonstrates authentication, authorization, relational commerce modeling, and cloud file storage.",
    ],
  },
  {
    slug: "worksync",
    number: "11",
    title: "WorkSync",
    category: "Tenant-isolated operations workspace",
    summary:
      "A Blazor operations platform that brings work orders, assignments, follow-ups, employees, dashboards, and reports into one role-aware workspace.",
    liveHref: "https://work-sync-plum.vercel.app/",
    repositoryHref: "https://github.com/jneberhard/WorkSync",
    technologies: ["Blazor", "C#", "ASP.NET Core", "EF Core", "PostgreSQL"],
    challenge:
      "Teams often track assignments, follow-ups, employees, and reporting across separate tools. WorkSync needed to centralize that work while isolating organizations, protecting confidential follow-ups, and giving each role an appropriate operational view.",
    approach:
      "I built the application around tenant-scoped entities and role-based workflows in ASP.NET Core. Blazor provides the interactive interface, EF Core manages relational persistence, and reporting views translate operational records into useful summaries and exports.",
    highlights: [
      {
        title: "Tenant isolation",
        description:
          "Associates operational records with an organization and applies that scope across queries and workflows to prevent cross-tenant access.",
      },
      {
        title: "Role-based workflows",
        description:
          "Adapts work-order, employee, assignment, and administrative capabilities to the responsibilities of each signed-in user.",
      },
      {
        title: "Confidential follow-ups",
        description:
          "Separates sensitive follow-up information from general work activity and limits visibility through server-side authorization.",
      },
      {
        title: "Operational reporting",
        description:
          "Combines dashboards with exportable reports so teams can monitor work and carry structured information into other processes.",
      },
    ],
    outcomes: [
      "Unifies recurring team operations in a consistent workspace.",
      "Demonstrates enterprise-oriented C# development beyond a single-user CRUD application.",
      "Applies multi-tenancy, authorization, reporting, and relational design to a realistic business domain.",
    ],
  },
  {
    slug: "loanlens-data-analysis",
    number: "09",
    title: "LoanLens Data Analysis",
    category: "Applied data analysis",
    summary:
      "An analysis of 4,269 loan applications paired with a transparent logistic-regression estimator that makes the model explorable in the browser.",
    liveHref: "https://data-analysis-nine-lilac.vercel.app/#estimator",
    repositoryHref: "https://github.com/jneberhard/Data_Analysis",
    technologies: ["Python", "Pandas", "NumPy", "Logistic Regression", "JavaScript"],
    challenge:
      "The project needed to move beyond charts and produce a reproducible answer to a practical lending question: how applicant characteristics relate to approval outcomes. The result also needed to be understandable to someone who did not write the analysis code.",
    approach:
      "I cleaned and explored 4,269 application records with Pandas and NumPy, compared approval patterns across applicant groups, and implemented logistic regression rather than relying on an opaque hosted prediction service. The fitted logic powers an interactive estimator on the deployed site.",
    highlights: [
      {
        title: "Reproducible preparation",
        description:
          "Uses a documented Python workflow to clean, transform, and inspect the application dataset before modeling.",
      },
      {
        title: "Evidence-based comparison",
        description:
          "Found nearly identical approval rates for self-employed and salaried applicants in the analyzed data, challenging a simple employment-status assumption.",
      },
      {
        title: "Custom regression model",
        description:
          "Implements the probability model with explicit inputs and coefficients, making the analytical path easier to inspect and explain.",
      },
      {
        title: "Interactive communication",
        description:
          "Turns a static analysis into a browser-based estimator so visitors can explore how inputs change the modeled probability.",
      },
    ],
    outcomes: [
      "Connects data preparation, statistical modeling, interpretation, and product presentation.",
      "Communicates a concrete finding from 4,269 records without overstating causation.",
      "Demonstrates how Python analysis can support an accessible interactive web experience.",
    ],
  },
];

/** Finds a case study by its URL-safe route segment. */
export function getCaseStudy(slug: string) {
  return caseStudies.find((caseStudy) => caseStudy.slug === slug);
}
