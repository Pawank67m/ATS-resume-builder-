export async function extractResumeWithAI(rawText, apiKey = '', provider = 'gemini') {
  if (!apiKey || !apiKey.trim()) {
    return null;
  }

  const prompt = `You are an expert ATS resume parser. Extract the structured resume information from the following text and return ONLY valid raw JSON without markdown formatting, code blocks, or extra commentary.
The JSON must follow this exact structure:
{
  "personal": {
    "fullName": "Full Name",
    "jobTitle": "Job Title / Role",
    "email": "email@example.com",
    "phone": "+1 234 567 8900",
    "location": "City, State",
    "website": "",
    "linkedin": "linkedin.com/in/username",
    "github": "github.com/username"
  },
  "summary": "2-3 sentence professional summary",
  "experiences": [
    {
      "id": "exp-1",
      "jobTitle": "Title",
      "company": "Company",
      "location": "Location",
      "startDate": "YYYY or MM/YYYY",
      "endDate": "Present or MM/YYYY",
      "current": true,
      "bullets": [
        "Accomplishment bullet point 1",
        "Accomplishment bullet point 2"
      ]
    }
  ],
  "education": [
    {
      "id": "edu-1",
      "degree": "Degree",
      "institution": "University / College",
      "location": "",
      "startDate": "YYYY",
      "endDate": "YYYY",
      "gpa": ""
    }
  ],
  "skills": {
    "technical": ["Skill1", "Skill2", "Skill3"],
    "soft": ["SoftSkill1", "SoftSkill2"],
    "tools": ["Tool1", "Tool2"]
  }
}

Resume Content:
${rawText.slice(0, 4000)}`;

  try {
    if (provider === 'microsoft' || provider === 'openai') {
      // Call Azure / OpenAI / Microsoft Graph AI Endpoint
      const url = provider === 'microsoft' 
        ? `https://graph.microsoft.com/v1.0/me/drive/root` // Microsoft Graph endpoint representation
        : `https://api.openai.com/v1/chat/completions`;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey.trim()}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.1
        })
      });

      const data = await response.json();
      if (data.choices && data.choices[0]?.message?.content) {
        const jsonText = data.choices[0].message.content.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(jsonText);
      }
    } else {
      // Google Gemini API Endpoint
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey.trim()}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });

      const data = await response.json();
      if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
        const jsonText = data.candidates[0].content.parts[0].text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(jsonText);
      }
    }
  } catch (err) {
    console.error('AI Extraction API Error:', err);
  }
  return null;
}
