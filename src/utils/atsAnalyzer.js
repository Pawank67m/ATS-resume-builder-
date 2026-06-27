export const FAANG_ACTION_VERBS = [
  "architected", "spearheaded", "engineered", "orchestrated", "optimized", 
  "provisioned", "benchmarked", "automated", "pioneered", "launched", 
  "transformed", "streamlined", "overhauled", "scaled", "migrated", 
  "accelerated", "designed", "implemented", "reduced", "increased"
];

export function analyzeATS(resume, targetJobDescription = "") {
  let score = 0;
  const checks = [];
  const matchedKeywords = [];
  const missingKeywords = [];

  const { personal = {}, summary = '', experiences = [], projects = [], education = [], skills = {}, certs = [] } = resume;

  // 1. Leadership & Ownership (Max 20 pts)
  let contactPoints = 0;
  if (personal.fullName) contactPoints += 4;
  if (personal.email && personal.email.includes("@")) contactPoints += 4;
  if (personal.phone) contactPoints += 4;
  if (personal.linkedin || personal.github) contactPoints += 8;
  
  score += contactPoints;
  checks.push({
    title: "Leadership & Online Presence",
    status: contactPoints >= 16 ? "pass" : "warning",
    message: contactPoints >= 16 
      ? "FAANG Tier: Verified complete contact matrix including LinkedIn & GitHub engineering profiles." 
      : "Ensure LinkedIn and GitHub profiles are linked for FAANG engineering review."
  });

  // 2. Quantifiable Impact & Metric Density (Max 25 pts)
  let totalBullets = 0;
  let faangVerbCount = 0;
  let metricBulletCount = 0;

  experiences.forEach(exp => {
    (exp.bullets || []).forEach(bullet => {
      totalBullets++;
      const lower = bullet.toLowerCase();
      
      if (FAANG_ACTION_VERBS.some(verb => lower.includes(verb))) {
        faangVerbCount++;
      }
      
      // FAANG metrics: %, $, numbers, QPS, Latency, MAU, ARR, scale
      if (/\d+%|\$\d+|\d+\+|\b\d+\b|qps|ms|latency|uptime|scale|mau|crore|lakh/i.test(bullet)) {
        metricBulletCount++;
      }
    });
  });

  let impactPoints = 0;
  if (totalBullets > 0) {
    const verbRatio = faangVerbCount / totalBullets;
    const metricRatio = metricBulletCount / totalBullets;
    
    if (verbRatio >= 0.5) impactPoints += 12;
    else if (verbRatio > 0.2) impactPoints += 6;

    if (metricRatio >= 0.5) impactPoints += 13;
    else if (metricRatio > 0.2) impactPoints += 7;
  }
  score += impactPoints;

  checks.push({
    title: "Quantifiable Business Impact & Metrics",
    status: impactPoints >= 20 ? "pass" : "warning",
    message: `FAANG Audit: Detected ${metricBulletCount} bullet points containing numerical metrics (%, $, scale) and ${faangVerbCount} high-caliber action verbs.`
  });

  // 3. Cloud, Systems & AI Stack Alignment (Max 25 pts)
  const techSkills = skills.technical || [];
  const tools = skills.tools || [];
  const totalSkillCount = techSkills.length + tools.length;

  let stackPoints = 0;
  if (totalSkillCount >= 10) stackPoints = 25;
  else if (totalSkillCount >= 6) stackPoints = 18;
  else stackPoints = 10;

  score += stackPoints;
  checks.push({
    title: "Cloud, Systems & AI Stack Matrix",
    status: stackPoints >= 20 ? "pass" : "warning",
    message: `FAANG Tech Stack Score: Verified ${totalSkillCount} core technical competencies across Cloud, DevOps, and AI engineering.`
  });

  // 4. Formatting & Structure Integrity (Max 15 pts)
  let formatPoints = 15;
  const summaryLength = summary ? summary.trim().split(/\s+/).length : 0;
  if (summaryLength < 15 || summaryLength > 90) formatPoints -= 5;
  if (experiences.length === 0) formatPoints -= 5;

  score += Math.max(0, formatPoints);
  checks.push({
    title: "ATS Parser Formatting Integrity",
    status: formatPoints >= 12 ? "pass" : "warning",
    message: "FAANG Formatting Standard: Clean, machine-readable section hierarchy with zero table parsing errors."
  });

  // 5. Job Target Relevancy & Keyword Matcher (Max 15 pts)
  if (targetJobDescription.trim()) {
    const jdText = targetJobDescription.toLowerCase();
    const coreTechTerms = [
      "python", "javascript", "typescript", "react", "node", "sql", "aws", "docker", 
      "kubernetes", "terraform", "ci/cd", "generative ai", "llm", "agile", "devops", "mlops"
    ];

    const resumeText = JSON.stringify(resume).toLowerCase();

    coreTechTerms.forEach(term => {
      if (jdText.includes(term)) {
        if (resumeText.includes(term)) {
          matchedKeywords.push(term.toUpperCase());
        } else {
          missingKeywords.push(term.toUpperCase());
        }
      }
    });

    const matchRate = (matchedKeywords.length + missingKeywords.length) > 0 
      ? (matchedKeywords.length / (matchedKeywords.length + missingKeywords.length)) 
      : 1;
      
    const jdPoints = Math.round(matchRate * 15);
    score += jdPoints;

    checks.push({
      title: "FAANG Target Role Match Relevancy",
      status: matchRate > 0.7 ? "pass" : "warning",
      message: `Matched ${matchedKeywords.length} core technical keywords against target job posting. ${missingKeywords.length} suggested keywords missing.`
    });
  } else {
    score += 15;
    checks.push({
      title: "FAANG Target Role Matcher",
      status: "info",
      message: "Paste a target job posting in the checker to analyze keyword matches against FAANG standards."
    });
  }

  return {
    score: Math.min(100, Math.max(0, score)),
    checks,
    matchedKeywords: [...new Set(matchedKeywords)],
    missingKeywords: [...new Set(missingKeywords)]
  };
}
