import { prisma } from "./db";

/**
 * Default content used as fallback when DB has no data yet.
 * Also used as the seed data structure.
 */
const defaultContent = {
  profile: {
    name: "Jaikiran E",
    titles: [
      "Cyber Security Student",
      "CTF Competitor",
      "Bug Hunting",
      "Security Tool Developer",
    ],
    phone: "+91-9361195139",
    email: "jaikiranjaikiran37@gmail.com",
    location: "Chennai, India",
    links: {
      github: "https://github.com/MR-JK-37",
      linkedin: "https://linkedin.com/in/jaikiran-e-mr1jk1",
      tryhackme: "https://tryhackme.com/p/MR1JK1",
      legacyPortfolio: "https://mr-jk-37.github.io/MR-JK-MART",
    },
    summary:
      "Cyber Security undergraduate with national CTF victories (DEFCON, TN Police CTF Top 26/300+), C-DAC internship in Wazuh SIEM deployment, and 3 industry certifications. Actively building AI-powered malware detection, Android automation agents, and fraud detection engines. Learning penetration testing and malware analysis through competitive labs and self-study.",
  },
  skills: {
    "Security Tools": [
      "Nmap",
      "Wireshark",
      "Burp Suite",
      "Wazuh SIEM",
      "Zabbix",
      "Steghide",
      "StegSolve",
      "Binwalk",
      "ExifTool",
    ],
    Programming: [
      "Python",
      "Java",
      "C++",
      "JavaScript",
      "HTML/CSS",
      "MySQL",
      "Bash Scripting",
    ],
    "OS / Platforms": [
      "Kali Linux",
      "Parrot OS",
      "Arch Linux",
      "Windows",
    ],
    "Focus Areas": [
      "CTF Challenges",
      "Bug Hunting",
      "Steganography",
      "Malware Analysis (learning)",
      "Security Automation",
    ],
  },
  experience: [
    {
      role: "Cyber Security Intern",
      org: "C-DAC, Chennai",
      dates: "Jun 2025 – Jul 2025",
      bullets: [
        "Deployed Wazuh SIEM and Zabbix monitoring across Linux/Windows endpoints for real-time security event detection",
        "Performed system log review, Windows Firewall hardening, and Linux baseline security configuration",
      ],
    },
  ],
  projects: [
    {
      title: "AI-Powered Antivirus Software",
      description:
        "Auto-detects and removes malware via AI classification; monitors system and network logs in real time and explains suspicious entries using an LLM for faster triage.",
      stack: [
        "Python",
        "Scikit-Learn",
        "LLM APIs",
        "File System Monitoring",
        "Network Log Parsing",
      ],
    },
    {
      title: "Android Automation Agent",
      description:
        "Accepts natural language commands and fully controls Android devices: app launching, UI interaction, screen scraping, and system-level task automation.",
      stack: ["Python", "ADB", "Appium", "AI Agent Framework"],
    },
    {
      title: "MCP Server",
      description:
        "Built a Model Context Protocol server enabling AI models to interface with real-world tools and APIs for multi-agent task orchestration and automation workflows.",
      stack: ["Python", "FastAPI", "MCP Protocol", "REST APIs"],
    },
    {
      title: "Task Reminder & CTF Feed App",
      description:
        "Android app with smart daily reminders and live feeds for upcoming CTF events and cybersecurity hackathons, all trackable with in-app notifications.",
      stack: [
        "Android Studio",
        "Java/Kotlin",
        "Firebase",
        "CTFtime API",
      ],
    },
    {
      title: "Fraud Detection Engine",
      description:
        "ML-assisted system that analyzes banking transaction patterns, flags behavioral anomalies, and generates real-time risk scores for suspicious activity.",
      stack: ["Python", "Scikit-Learn", "Pandas", "MySQL"],
    },
  ],
  certifications: [
    {
      title: "APISEC Certification",
      detail: "API Security and vulnerability testing",
    },
    {
      title: "COFPS",
      detail: "Certified Online Fraud Prevention Specialist",
    },
    {
      title:
        "Oracle Cloud Infrastructure 2025 Certified AI Foundations Associate",
      detail: "",
    },
  ],
  achievements: [
    {
      title: "1st Place — CTF, AI & ML Dept.",
      detail: "St. Joseph's College of Engineering",
    },
    {
      title: "1st Place — V-Vertex CTF",
      detail: "VIT College",
    },
    {
      title: "8th Place — DEFCON-conducted CTF",
      detail: "Team event, international level",
    },
    {
      title: "Top 26 of 300+",
      detail: "TN Government Police CTF Finals",
    },
    {
      title: "3rd Place — Brain Storm Competition",
      detail:
        "Debugging, PPT & Hackathon, Dhanalakshmi Engineering College",
    },
  ],
  education: [
    {
      degree: "B.E. Computer Science & Engineering (Cyber Security)",
      institution: "R.M.K. College of Engineering and Technology",
      years: "2024 – 2028",
    },
    {
      degree: "Higher Secondary Certificate (Computer Science)",
      institution: "R.M.K. Matriculation Higher Secondary School",
      years: "2022 – 2024",
    },
  ],
  extraCurricular: [
    "2nd Place, Singing Competition (2nd Year)",
    "3rd Place, Singing Competition (1st Year)",
    "Content Creator: cybersecurity educational content",
  ],
  heroDayImage: "/uploads/hero-day.jpg",
  heroNightImage: "/uploads/hero-night.jpg",
};

export type PublicContent = typeof defaultContent;

/**
 * Fetch all public content from the database.
 * Falls back to defaults if DB is empty (first run before seed).
 */
export async function getPublicContent(): Promise<PublicContent> {
  try {
    const rows = await prisma.siteContent.findMany();

    if (rows.length === 0) {
      return defaultContent;
    }

    const contentMap: Record<string, string> = {};
    for (const row of rows) {
      contentMap[`${row.type}:${row.key}`] = row.value;
    }

    const get = (type: string, key: string, fallback: unknown) => {
      const raw = contentMap[`${type}:${key}`];
      if (!raw) return fallback;
      try {
        return JSON.parse(raw);
      } catch {
        return raw;
      }
    };

    return {
      profile: {
        name: get("profile", "name", defaultContent.profile.name) as string,
        titles: get("profile", "titles", defaultContent.profile.titles) as string[],
        phone: get("profile", "phone", defaultContent.profile.phone) as string,
        email: get("profile", "email", defaultContent.profile.email) as string,
        location: get("profile", "location", defaultContent.profile.location) as string,
        links: get("profile", "links", defaultContent.profile.links) as typeof defaultContent.profile.links,
        summary: get("profile", "summary", defaultContent.profile.summary) as string,
      },
      skills: get("skills", "all", defaultContent.skills) as typeof defaultContent.skills,
      experience: get("experience", "all", defaultContent.experience) as typeof defaultContent.experience,
      projects: get("projects", "all", defaultContent.projects) as typeof defaultContent.projects,
      certifications: get("certifications", "all", defaultContent.certifications) as typeof defaultContent.certifications,
      achievements: get("achievements", "all", defaultContent.achievements) as typeof defaultContent.achievements,
      education: get("education", "all", defaultContent.education) as typeof defaultContent.education,
      extraCurricular: get("extraCurricular", "all", defaultContent.extraCurricular) as string[],
      heroDayImage: get("hero", "dayImage", defaultContent.heroDayImage) as string,
      heroNightImage: get("hero", "nightImage", defaultContent.heroNightImage) as string,
    };
  } catch (error) {
    console.error("Failed to fetch content from DB, using defaults:", error);
    return defaultContent;
  }
}

export { defaultContent };
