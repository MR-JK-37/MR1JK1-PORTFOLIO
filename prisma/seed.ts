import { PrismaClient } from "@prisma/client";
import { V1_ORIGINAL_TOKENS, V2_CINEMATIC_TOKENS } from "../src/lib/theme";

const prisma = new PrismaClient();

const seedData: Array<{ type: string; key: string; value: unknown }> = [
  {
    type: "profile",
    key: "name",
    value: "Jaikiran E",
  },
  {
    type: "profile",
    key: "titles",
    value: [
      "Cyber Security Student",
      "CTF Competitor",
      "Bug Hunting",
      "Security Tool Developer",
    ],
  },
  {
    type: "profile",
    key: "phone",
    value: "+91-9361195139",
  },
  {
    type: "profile",
    key: "email",
    value: "jaikiranjaikiran37@gmail.com",
  },
  {
    type: "profile",
    key: "location",
    value: "Chennai, India",
  },
  {
    type: "profile",
    key: "links",
    value: {
      github: "https://github.com/MR-JK-37",
      linkedin: "https://linkedin.com/in/jaikiran-e-mr1jk1",
      tryhackme: "https://tryhackme.com/p/MR1JK1",
      legacyPortfolio: "https://mr-jk-37.github.io/MR-JK-MART",
    },
  },
  {
    type: "profile",
    key: "summary",
    value:
      "Cyber Security undergraduate with national CTF victories (DEFCON, TN Police CTF Top 26/300+), C-DAC internship in Wazuh SIEM deployment, and 3 industry certifications. Actively building AI-powered malware detection, Android automation agents, and fraud detection engines. Learning penetration testing and malware analysis through competitive labs and self-study.",
  },
  {
    type: "skills",
    key: "all",
    value: {
      "Security Tools": [
        "Nmap", "Wireshark", "Burp Suite", "Wazuh SIEM", "Zabbix",
        "Steghide", "StegSolve", "Binwalk", "ExifTool",
      ],
      Programming: [
        "Python", "Java", "C++", "JavaScript", "HTML/CSS", "MySQL", "Bash Scripting",
      ],
      "OS / Platforms": ["Kali Linux", "Parrot OS", "Arch Linux", "Windows"],
      "Focus Areas": [
        "CTF Challenges", "Bug Hunting", "Steganography",
        "Malware Analysis (learning)", "Security Automation",
      ],
    },
  },
  {
    type: "experience",
    key: "all",
    value: [
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
  },
  {
    type: "projects",
    key: "all",
    value: [
      {
        title: "AI-Powered Antivirus Software",
        description:
          "Auto-detects and removes malware via AI classification; monitors system and network logs in real time and explains suspicious entries using an LLM for faster triage.",
        stack: ["Python", "Scikit-Learn", "LLM APIs", "File System Monitoring", "Network Log Parsing"],
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
        stack: ["Android Studio", "Java/Kotlin", "Firebase", "CTFtime API"],
      },
      {
        title: "Fraud Detection Engine",
        description:
          "ML-assisted system that analyzes banking transaction patterns, flags behavioral anomalies, and generates real-time risk scores for suspicious activity.",
        stack: ["Python", "Scikit-Learn", "Pandas", "MySQL"],
      },
    ],
  },
  {
    type: "education",
    key: "all",
    value: [
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
  },
  {
    type: "extraCurricular",
    key: "all",
    value: [
      "2nd Place, Singing Competition (2nd Year)",
      "3rd Place, Singing Competition (1st Year)",
      "Content Creator: cybersecurity educational content",
    ],
  },
  {
    type: "hero",
    key: "dayImage",
    value: "/uploads/hero-day.jpg",
  },
  {
    type: "hero",
    key: "nightImage",
    value: "/uploads/hero-night.jpg",
  },
];

// Certification data for new dedicated model
const certificationsSeed = [
  { title: "APISEC Certification", issuer: "APIsec University", description: "API Security and vulnerability testing", order: 0 },
  { title: "COFPS", issuer: "COFPS", description: "Certified Online Fraud Prevention Specialist", order: 1 },
  { title: "Oracle Cloud Infrastructure 2025 Certified AI Foundations Associate", issuer: "Oracle", description: "Cloud AI foundations certification", order: 2 },
];

// Achievement data for new dedicated model
const achievementsSeed = [
  { title: "1st Place — CTF, AI & ML Dept.", org: "St. Joseph's College of Engineering", description: "College-level CTF competition victory", order: 0 },
  { title: "1st Place — V-Vertex CTF", org: "VIT College", description: "Inter-college CTF competition victory", order: 1 },
  { title: "8th Place — DEFCON-conducted CTF", org: "DEFCON", description: "Team event, international level", order: 2 },
  { title: "Top 26 of 300+", org: "TN Government", description: "TN Government Police CTF Finals", order: 3 },
  { title: "3rd Place — Brain Storm Competition", org: "Dhanalakshmi Engineering College", description: "Debugging, PPT & Hackathon", order: 4 },
];

async function main() {
  console.log("🌱 Seeding database...");

  // Seed SiteContent (existing)
  for (const item of seedData) {
    const value = JSON.stringify(item.value);

    await prisma.siteContent.upsert({
      where: {
        type_key: { type: item.type, key: item.key },
      },
      update: { value },
      create: {
        type: item.type,
        key: item.key,
        value,
      },
    });
  }
  console.log("✅ SiteContent seeded —", seedData.length, "entries.");

  // Seed Certifications (new dedicated model)
  for (const cert of certificationsSeed) {
    const existing = await prisma.certification.findFirst({ where: { title: cert.title } });
    if (!existing) {
      await prisma.certification.create({ data: cert });
    }
  }
  console.log("✅ Certifications seeded —", certificationsSeed.length, "entries.");

  // Seed Achievements (new dedicated model)
  for (const ach of achievementsSeed) {
    const existing = await prisma.achievement.findFirst({ where: { title: ach.title } });
    if (!existing) {
      await prisma.achievement.create({ data: ach });
    }
  }
  console.log("✅ Achievements seeded —", achievementsSeed.length, "entries.");

  // Seed Theme Versions
  const v1 = await prisma.themeVersion.upsert({
    where: { label: "v1-original" },
    update: { tokensJson: JSON.stringify(V1_ORIGINAL_TOKENS) },
    create: {
      label: "v1-original",
      tokensJson: JSON.stringify(V1_ORIGINAL_TOKENS),
    },
  });
  console.log("✅ Theme v1-original saved with ID:", v1.id);

  const v2 = await prisma.themeVersion.upsert({
    where: { label: "v2-cinematic" },
    update: { tokensJson: JSON.stringify(V2_CINEMATIC_TOKENS) },
    create: {
      label: "v2-cinematic",
      tokensJson: JSON.stringify(V2_CINEMATIC_TOKENS),
    },
  });
  console.log("✅ Theme v2-cinematic saved with ID:", v2.id);

  // Set active theme to v1-original
  await prisma.appSettings.upsert({
    where: { id: "singleton" },
    update: { activeThemeId: v1.id },
    create: { id: "singleton", activeThemeId: v1.id },
  });
  console.log("✅ Active theme set to v1-original.");

  console.log("\n🎉 Seed complete!");
  console.log("ℹ️  No admin user created — use the /admin setup flow to create one.");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
