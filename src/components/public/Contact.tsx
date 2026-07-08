import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { TiltCard } from "@/components/shared/TiltCard";

interface ContactProps {
  email: string;
  phone: string;
  location: string;
  links: Record<string, string>;
}

const GithubIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
  </svg>
);

const LinkedInIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const TryHackMeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M10.705 0C7.54 0 4.902 2.285 4.349 5.291a4.525 4.525 0 00-4.33 4.513c0 2.498 2.022 4.523 4.521 4.523h.714v-2.004h-.714c-1.39 0-2.517-1.13-2.517-2.52 0-1.39 1.127-2.516 2.517-2.516h.714V5.283h-.004C5.674 3.08 7.927 1.2 10.706 1.2c2.777 0 5.03 1.88 5.454 4.087h-.004V7.29h.714c1.39 0 2.517 1.126 2.517 2.517 0 1.389-1.127 2.52-2.517 2.52h-.714v2.003h.714a4.525 4.525 0 004.521-4.524 4.525 4.525 0 00-4.33-4.513C17.508 2.285 14.87 0 11.705 0h-1zM8.882 9.98v8.378h2.004V9.98H8.882zm4.246 0v8.378h2.003V9.98h-2.003zM6.872 14.957v5.53c0 1.932 1.56 3.508 3.49 3.513h3.3c1.932 0 3.508-1.573 3.508-3.506V14.95h-2.004v5.544c0 .826-.676 1.509-1.504 1.509h-3.3c-.82-.004-1.486-.683-1.486-1.502v-5.544H6.872z" />
  </svg>
);

export function Contact({ email, phone, location, links }: ContactProps) {
  const socialLinks = [
    { name: "GitHub",      url: links.github,     icon: <GithubIcon />,    color: "blue" as const,   desc: "Open-source & CTF writeups" },
    { name: "LinkedIn",    url: links.linkedin,   icon: <LinkedInIcon />,  color: "blue" as const,   desc: "Professional network" },
    { name: "TryHackMe",   url: links.tryhackme,  icon: <TryHackMeIcon />, color: "violet" as const, desc: "Capture The Flag ranking" },
  ].filter((l) => l.url);

  const contactItems = [
    {
      label: "email",
      value: email,
      href: `mailto:${email}`,
      color: "blue" as const,
      icon: (
        <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
        </svg>
      ),
    },
    {
      label: "phone",
      value: phone,
      href: `tel:${phone}`,
      color: "violet" as const,
      icon: (
        <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
        </svg>
      ),
    },
    {
      label: "location",
      value: location,
      href: undefined,
      color: "amber" as const,
      icon: (
        <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
        </svg>
      ),
    },
  ];

  const getColorStyle = (color: "blue" | "violet" | "amber") => ({
    blue:   { text: "var(--color-blue)",   bg: "rgba(69,211,255,0.07)",  border: "rgba(69,211,255,0.18)",  glow: "rgba(69,211,255,0.25)"  },
    violet: { text: "var(--color-violet)", bg: "rgba(178,115,255,0.07)", border: "rgba(178,115,255,0.18)", glow: "rgba(178,115,255,0.25)" },
    amber:  { text: "var(--color-amber)",  bg: "rgba(240,166,58,0.07)",  border: "rgba(240,166,58,0.18)",  glow: "rgba(240,166,58,0.25)"  },
  }[color]);

  return (
    <section id="contact" className="section-padding section-lazy">
      <div className="section-max-width">
        <ScrollReveal>
          <p className="eyebrow mb-4">$ netcat --connect</p>
          <h2 className="section-heading mb-3">
            Get In{" "}
            <span className="neon-blue">Touch</span>
          </h2>
          <p className="text-text-secondary mb-12" style={{ fontSize: "0.95rem", maxWidth: "480px" }}>
            Open to opportunities, collaborations, and interesting conversations.
          </p>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          {/* Contact channels */}
          <ScrollReveal delay={0.1}>
            <div className="space-y-4">
              {contactItems.map(({ label, value, href, color, icon }) => {
                const c = getColorStyle(color);
                const Tag = href ? "a" : "div";
                return (
                  <Tag
                    key={label}
                    {...(href ? { href, ...(label === "email" || label === "phone" ? {} : { target: "_blank", rel: "noopener noreferrer" }) } : {})}
                    className="flex items-center gap-4 p-4 rounded-xl group transition-all duration-300 cursor-default"
                    style={{
                      background: c.bg,
                      border: `1px solid ${c.border}`,
                      textDecoration: "none",
                    }}
                    onMouseEnter={href ? (e: React.MouseEvent<HTMLElement>) => {
                      (e.currentTarget as HTMLElement).style.boxShadow = `0 0 20px ${c.glow}`;
                      (e.currentTarget as HTMLElement).style.borderColor = c.text;
                    } : undefined}
                    onMouseLeave={href ? (e: React.MouseEvent<HTMLElement>) => {
                      (e.currentTarget as HTMLElement).style.boxShadow = "none";
                      (e.currentTarget as HTMLElement).style.borderColor = c.border;
                    } : undefined}
                  >
                    <div
                      className="shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ background: `rgba(${color === "blue" ? "69,211,255" : color === "violet" ? "178,115,255" : "240,166,58"},0.12)`, color: c.text }}
                    >
                      {icon}
                    </div>
                    <div className="min-w-0">
                      <p
                        className="font-[family-name:var(--font-mono)] uppercase mb-0.5"
                        style={{ fontSize: "0.6rem", color: c.text, letterSpacing: "0.14em", opacity: 0.8 }}
                      >
                        {label}
                      </p>
                      <p
                        className="text-text-primary truncate"
                        style={{ fontSize: "0.88rem" }}
                      >
                        {value}
                      </p>
                    </div>
                    {href && (
                      <svg
                        className="ml-auto shrink-0 text-text-muted group-hover:text-blue transition-all duration-300 group-hover:translate-x-1"
                        width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                      </svg>
                    )}
                  </Tag>
                );
              })}
            </div>
          </ScrollReveal>

          {/* Social links */}
          <ScrollReveal delay={0.2}>
            <div>
              <h3
                className="font-[family-name:var(--font-mono)] mb-5"
                style={{ fontSize: "0.78rem", color: "var(--color-violet)", letterSpacing: "0.08em" }}
              >
                $ find / -name &quot;social_links&quot;
              </h3>

              <div className="space-y-4">
                {socialLinks.map((link) => {
                  const c = getColorStyle(link.color);
                  return (
                    <TiltCard
                      key={link.name}
                      className={`cyber-card-wrapper cyber-card-wrapper-${link.color}`}
                      glowColor={link.color}
                      tiltAmount={6}
                    >
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="cyber-card-inner p-5 flex items-center gap-4 group"
                        style={{ textDecoration: "none" }}
                      >
                        <div className="cyber-card-corner-bl" />
                        <span
                          className="shrink-0 transition-colors duration-300"
                          style={{ color: "var(--color-text-muted)" }}
                        >
                          {link.icon}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="text-text-primary font-medium" style={{ fontSize: "0.9rem" }}>
                            {link.name}
                          </p>
                          <p className="text-text-muted" style={{ fontSize: "0.72rem", marginTop: "2px" }}>
                            {link.desc}
                          </p>
                        </div>
                        <svg
                          className="ml-auto shrink-0 text-text-muted transition-all duration-300 group-hover:translate-x-1"
                          width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"
                          style={{ color: c.text, opacity: 0.5 }}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                        </svg>
                      </a>
                    </TiltCard>
                  );
                })}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
