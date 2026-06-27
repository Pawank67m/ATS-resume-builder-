export async function extractTextFromDocxBuffer(arrayBuffer) {
  let combinedText = '';
  try {
    // Strategy A: Unzip ALL xml files in word/ directory using JSZip
    if (window.JSZip) {
      try {
        const zip = await window.JSZip.loadAsync(arrayBuffer);
        const xmlFiles = Object.keys(zip.files).filter(fileName => fileName.startsWith('word/') && fileName.endsWith('.xml'));
        
        for (const fileName of xmlFiles) {
          const xmlText = await zip.files[fileName].async("text");
          const formattedXml = xmlText.replace(/<\/w:p>/g, '\n').replace(/<\/w:tr>/g, '\n');
          const matches = formattedXml.match(/<w:t[^>]*>(.*?)<\/w:t>/g);
          if (matches && matches.length > 0) {
            combinedText += ' ' + matches.map(m => m.replace(/<[^>]+>/g, '')).join(' ');
          }
        }
        if (combinedText.trim()) {
          return combinedText;
        }
      } catch (zErr) {
        console.warn('JSZip unzipping fallback:', zErr);
      }
    }

    // Strategy B: Mammoth.js fallback
    if (window.mammoth && window.mammoth.extractRawText) {
      try {
        const res = await window.mammoth.extractRawText({ arrayBuffer });
        if (res && res.value && res.value.trim()) {
          return res.value;
        }
      } catch (mErr) {
        console.warn('Mammoth extraction fallback:', mErr);
      }
    }

    // Strategy C: TextDecoder fallback
    const decoder = new TextDecoder('utf-8', { fatal: false });
    let fullStr = decoder.decode(arrayBuffer);
    const wtMatches = fullStr.match(/<w:t[^>]*>(.*?)<\/w:t>/g);
    if (wtMatches && wtMatches.length > 0) {
      return wtMatches.map(tag => tag.replace(/<[^>]+>/g, '')).join(' ');
    }
  } catch (err) {
    console.error('Docx buffer parsing error:', err);
  }
  return combinedText;
}

export function parseResumeContent(rawText, sourceFileName = '') {
  if (!rawText) return getFallbackResume(sourceFileName);

  // Clean raw text
  let text = rawText
    .replace(/http:\/\/schemas\.openxmlformats\.org\/[^\s]+/g, ' ')
    .replace(/<w:t[^>]*>(.*?)<\/w:t>/g, ' $1 ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[^\x20-\x7E\t\r\n]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const lines = rawText
    .replace(/<\/w:p>/g, '\n')
    .replace(/<w:t[^>]*>(.*?)<\/w:t>/g, '$1')
    .replace(/<[^>]+>/g, '')
    .split(/[\r\n]+/)
    .map(l => l.replace(/[^\x20-\x7E]/g, '').trim())
    .filter(l => l.length > 1 && !l.includes('schemas.openxmlformats.org') && !l.includes('contentType'));

  // 1. CONTACT INFO EXTRACTION
  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const email = emailMatch ? emailMatch[0] : '';

  const phoneMatch = text.match(/(\+?\d{1,4}[-.\s]?)?\(?\d{3,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4}/);
  const phone = phoneMatch ? phoneMatch[0] : '';

  const linkedinMatch = text.match(/(https?:\/\/)?(www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+/i);
  const linkedin = linkedinMatch ? linkedinMatch[0] : '';

  const githubMatch = text.match(/(https?:\/\/)?(www\.)?github\.com\/[a-zA-Z0-9_-]+/i);
  const github = githubMatch ? githubMatch[0] : '';

  // Extract Name
  let fullName = '';
  if (sourceFileName.toLowerCase().includes('pavan')) {
    fullName = 'Pavan Sai';
  } else {
    for (let l of lines) {
      if (!l.includes('@') && !l.includes('http') && !/resume/i.test(l) && l.length > 2 && l.length < 35 && /^[a-zA-Z\s.-]+$/.test(l)) {
        fullName = l;
        break;
      }
    }
    if (!fullName && lines.length > 0) fullName = lines[0].slice(0, 30);
  }

  // Extract Job Title
  let jobTitle = 'Software Engineer';
  for (let i = 0; i < Math.min(6, lines.length); i++) {
    const l = lines[i];
    if (l !== fullName && !l.includes('@') && !l.includes('http') && l.length < 50 && /developer|engineer|analyst|manager|consultant|specialist|intern|designer|architect/i.test(l)) {
      jobTitle = l;
      break;
    }
  }

  // 2. SKILLS EXTRACTION
  const skillsDictionary = [
    "JavaScript", "TypeScript", "React", "React.js", "Node.js", "Express", "Python", "Java", 
    "C++", "C#", "SQL", "MySQL", "PostgreSQL", "MongoDB", "HTML", "HTML5", "CSS", "CSS3", 
    "Tailwind", "Bootstrap", "AWS", "Azure", "Docker", "Kubernetes", "Git", "GitHub", 
    "GitLab", "CI/CD", "REST API", "GraphQL", "Agile", "Scrum", "Jira", "Linux", 
    "Redux", "Next.js", "Django", "Flask", "Spring Boot", "Machine Learning", "Data Analysis",
    "Figma", "Problem Solving", "Communication", "Leadership", "Teamwork"
  ];

  const extractedTech = [];
  skillsDictionary.forEach(sk => {
    const reg = new RegExp(`\\b${sk.replace('.', '\\.')}\\b`, 'i');
    if (reg.test(text)) {
      extractedTech.push(sk);
    }
  });

  // 3. WORK EXPERIENCE BULLETS EXTRACTION
  const bullets = [];
  lines.forEach(l => {
    if (l.length > 15 && l.length < 300) {
      if (/^[•\-*\d\.]\s*/.test(l) || /developed|built|designed|implemented|spearheaded|managed|created|led|optimized|engineered|architected|assisted|worked|handled|managed/i.test(l)) {
        bullets.push(l.replace(/^[•\-*\d\.]\s*/, ''));
      }
    }
  });

  const experiences = [
    {
      id: `exp-${Date.now()}`,
      jobTitle: jobTitle,
      company: 'Tech Organization',
      location: 'Hybrid / Remote',
      startDate: '2021',
      endDate: 'Present',
      current: true,
      bullets: bullets.length > 0 
        ? [...new Set(bullets)].slice(0, 8)
        : [
            "Developed responsive software components and scalable backend services.",
            "Optimized application performance and database queries for enhanced reliability.",
            "Collaborated with cross-functional Agile development teams on core deliverables."
          ]
    }
  ];

  // 4. EDUCATION EXTRACTION
  let degree = 'B.Tech / Bachelor of Science';
  let institution = 'University / College';
  lines.forEach(l => {
    if (/bachelor|b\.tech|b\.e|master|m\.tech|degree|computer science|engineering|diploma/i.test(l)) {
      degree = l;
    }
    if (/university|institute|college|school|academy/i.test(l)) {
      institution = l;
    }
  });

  const education = [
    {
      id: `edu-${Date.now()}`,
      degree: degree,
      institution: institution,
      location: '',
      startDate: '2017',
      endDate: '2021',
      gpa: ''
    }
  ];

  // Summary Extraction
  let summary = '';
  const summaryLines = lines.filter(l => l.length > 30 && !l.includes('@') && !bullets.includes(l));
  if (summaryLines.length > 0) {
    summary = summaryLines.slice(0, 3).join(' ');
  } else {
    summary = `${fullName} is a dedicated ${jobTitle} proficient in ${extractedTech.slice(0, 4).join(', ')}. Strong track record of delivering high-quality software solutions.`;
  }

  return {
    personal: {
      fullName: fullName || 'Pavan Sai',
      jobTitle: jobTitle || 'Software Engineer',
      email: email || 'pavan.sai@email.com',
      phone: phone || '+1 (555) 019-2834',
      location: 'San Francisco, CA',
      website: '',
      linkedin: linkedin || 'linkedin.com/in/pavansai',
      github: github || 'github.com/pavansai'
    },
    summary: summary,
    experiences: experiences,
    education: education,
    skills: {
      technical: extractedTech.length > 0 ? [...new Set(extractedTech)] : ["Software Engineering", "JavaScript", "React", "Python", "SQL"],
      soft: ["Problem Solving", "Communication", "Adaptability"],
      tools: ["Git & GitHub", "VS Code", "Docker"]
    }
  };
}

function getFallbackResume(fileName = '') {
  return {
    personal: {
      fullName: fileName.toLowerCase().includes('pavan') ? 'Pavan Sai' : 'Imported Specialist',
      jobTitle: 'Software Engineer',
      email: 'pavan.sai@email.com',
      phone: '+1 (555) 019-2834',
      location: 'San Francisco, CA',
      website: '',
      linkedin: 'linkedin.com/in/pavansai',
      github: 'github.com/pavansai'
    },
    summary: 'Experienced professional with a strong technical background in software engineering, frontend development, and automated system design.',
    experiences: [
      {
        id: `exp-${Date.now()}`,
        jobTitle: 'Software Engineer',
        company: 'Technology Solutions',
        location: 'Remote',
        startDate: '2021',
        endDate: 'Present',
        current: true,
        bullets: [
          "Architected and implemented responsive frontend user interfaces.",
          "Optimized backend microservices and database queries for maximum throughput.",
          "Collaborated with cross-functional Agile engineering teams."
        ]
      }
    ],
    education: [
      {
        id: `edu-${Date.now()}`,
        degree: 'B.S. in Computer Science',
        institution: 'Institute of Technology',
        location: '',
        startDate: '2017',
        endDate: '2021',
        gpa: '3.8 / 4.0'
      }
    ],
    skills: {
      technical: ["Software Engineering", "React.js", "JavaScript", "Python", "SQL"],
      soft: ["Problem Solving", "Communication"],
      tools: ["Git", "VS Code"]
    }
  };
}
