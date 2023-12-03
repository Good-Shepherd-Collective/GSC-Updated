export interface Template {
    url: string;
    title: string;
    type: string;
    image: string;
    date: string;
    description: string;
  };
  const one: Template = {
    url: "/work/case-study",
    description: "Exploring the creative potential of Figma for seamless design collaboration.",
    type: "Design Collaboration",
    title: "Figma Xperience",
    image: "/logos/figma.svg",
    date: "2023-10-15",
  };

  const two: Template = {
    url: "/work/case-study",
    description: "Utilizing JetBrains tools to supercharge the development journey of StartupForge Apps.",
    type: "Development Tooling",
    title: "JetBrains",
    image: "/logos/jetbrains.svg",
    date: "2023-11-02",
  };

  const three: Template = {
    url: "/work/case-study",
    description: "Creating innovative solutions for smart homes and IoT ecosystems using Discord.",
    type: "IoT Integration",
    title: "VSCode",
    image: "/logos/vscode.svg",
    date: "2023-11-20",
  };

  const four: Template = {
    url: "/work/case-study",
    description: "Transforming ideas into captivating visual stories with MotionCraft Studios and Zapier.",
    type: "Visual Storytelling",
    title: "Zapier",
    image: "/logos/zapier.svg",
    date: "2023-12-05",
  };

  const five: Template = {
    url: "/work/case-study",
    description: "Revolutionizing healthcare with AI-driven diagnostics and patient care using Kayako.",
    type: "HealthTech Innovation",
    title: "Kayako ",
    image: "/logos/kayako.svg",
    date: "2024-01-08",
  };

  const six: Template = {
    url: "/work/case-study",
    description: "Exploring the intersection of art and technology with Procreate for MedAI Solutions.",
    type: "Artificial Intelligence Artistry",
    title: "Procreate ",
    image: "/logos/procreate.svg",
    date: "2024-02-15",
  };
  export const byName = {
    one,
    two,
    three,
    four,
    five,
    six
  };
  export const work = Object.values(byName);
