// ============================================================================
// 1. CONFIGURAÇÕES GERAIS E LINKS
// ============================================================================
const CONFIG = {
  githubUsername: "g-opec", // Seu usuário do GitHub
  linkedinUrl: "https://www.linkedin.com/in/genez-jose-mattos-junior/", // URL do LinkedIn
  email: "genezmattos@gmail.com",
  // Caminho manual da foto do Perfil (salve a imagem na pasta assets/profile.png)
  // Se o arquivo não existir, o sistema carregará a foto do GitHub automaticamente.
  profileImagePath: "assets/profile.png" 
};

// ============================================================================
// 2. DADOS DO LINKEDIN (MULTILÍNGUE: PT / EN)
// Preencha com suas informações detalhadas do LinkedIn
// ============================================================================
const RESUME_DATA = {
  pt: {
    ui: {
      print_btn: "Salvar PDF",
      about_title: "Sobre",
      github_title: "Métricas & Linguagens (GitHub)",
      gh_repos: "Repositórios Públicos",
      gh_stars: "Stars Recebidas",
      gh_followers: "Seguidores",
      top_langs: "Linguagens Mais Utilizadas",
      featured_repos: "Projetos em Destaque",
      exp_title: "Experiência Profissional",
      edu_title: "Formação Acadêmica",
      skills_title: "Competências & Tecnologias",
      footer_text: "Desenvolvido com HTML, CSS & Vanilla JS • Hospedado no GitHub Pages"
    },
    profile: {
      name: "Genez Mattos",
      headline: "Desenvolvedor Full-Stack | Especialista em Operações Comerciais (OPEC) & Inteligência de Dados",
      location: "Lages, Santa Catarina, Brasil",
      about: "Profissional com sólida experiência na interseção entre desenvolvimento de software, automação de processos e operações comerciais no setor de mídia. Focado na criação de sistemas web escaláveis, pipelines de ETL, análise de dados e arquiteturas serverless para eliminar gargalos operacionais."
    },
    experience: [
      {
        role: "Desenvolvedor de Software & Especialista OPEC",
        company: "Setor de Mídia & Radiodifusão",
        period: "Atual",
        description: "Desenvolvimento e arquitetura de sistemas de gestão comercial (G-OPEC), automação de roteiros, auditoria de veiculação e integração de dados entre plataformas de rádio, TV e digital."
      }
      // Adicione outras experiências copiando o bloco acima
    ],
    education: [
      {
        degree: "Especialização em Inteligência de Dados & IA (SCTech)",
        institution: "Programa SCTech",
        period: "2026",
        description: "Análise exploratória de dados, pipelines ETL, Business Intelligence e Inteligência Artificial aplicada a operações."
      }
      // Adicione outras formações aqui
    ],
    skills: [
      "JavaScript (ES6+)", "Python", "SQL", "HTML5 & CSS3",
      "Google Apps Script", "Firebase", "Pandas & NumPy",
      "Looker Studio", "Git & GitHub", "Arquitetura Serverless", "ETL & BI"
    ]
  },

  en: {
    ui: {
      print_btn: "Save PDF",
      about_title: "About",
      github_title: "Metrics & Languages (GitHub)",
      gh_repos: "Public Repositories",
      gh_stars: "Stars Earned",
      gh_followers: "Followers",
      top_langs: "Most Used Languages",
      featured_repos: "Featured Projects",
      exp_title: "Work Experience",
      edu_title: "Education",
      skills_title: "Skills & Technologies",
      footer_text: "Built with HTML, CSS & Vanilla JS • Hosted on GitHub Pages"
    },
    profile: {
      name: "Genez Mattos",
      headline: "Full-Stack Developer | Commercial Operations Specialist (OPEC) & Data Intelligence",
      location: "Lages, Santa Catarina, Brazil",
      about: "Professional with strong experience at the intersection of software development, process automation, and commercial operations in the media sector. Focused on building scalable web systems, ETL pipelines, data analytics, and serverless architectures to eliminate operational bottlenecks."
    },
    experience: [
      {
        role: "Software Developer & OPEC Specialist",
        company: "Media & Broadcasting Sector",
        period: "Present",
        description: "Development and architecture of commercial management systems (G-OPEC), scheduling automation, broadcast auditing, and data integration across radio, TV, and digital platforms."
      }
    ],
    education: [
      {
        degree: "Data Intelligence & AI Specialization (SCTech)",
        institution: "SCTech Program",
        period: "2026",
        description: "Exploratory data analysis, ETL pipelines, Business Intelligence, and Artificial Intelligence applied to business operations."
      }
    ],
    skills: [
      "JavaScript (ES6+)", "Python", "SQL", "HTML5 & CSS3",
      "Google Apps Script", "Firebase", "Pandas & NumPy",
      "Looker Studio", "Git & GitHub", "Serverless Architecture", "ETL & BI"
    ]
  }
};

// ============================================================================
// 3. MOTOR DE RENDERIZAÇÃO E MULTILÍNGUE
// ============================================================================
let currentLang = "pt";

function renderResume(lang) {
  const data = RESUME_DATA[lang];

  // Atualiza textos da interface (data-i18n)
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (data.ui[key]) el.textContent = data.ui[key];
  });

  // Perfil
  document.getElementById("user-name").textContent = data.profile.name;
  document.getElementById("user-headline").textContent = data.profile.headline;
  document.getElementById("user-location").textContent = data.profile.location;
  document.getElementById("user-about").textContent = data.profile.about;

  // Links
  document.getElementById("linkedin-link").href = CONFIG.linkedinUrl;
  document.getElementById("github-link").href = `https://github.com/${CONFIG.githubUsername}`;
  document.getElementById("email-link").href = `mailto:${CONFIG.email}`;

  // Experiência
  const expContainer = document.getElementById("experience-list");
  expContainer.innerHTML = data.experience.map(item => `
    <div class="timeline-item">
      <div class="role-title">${item.role}</div>
      <div class="company-name">${item.company}</div>
      <div class="period">${item.period}</div>
      <p class="role-desc">${item.description}</p>
    </div>
  `).join("");

  // Formação
  const eduContainer = document.getElementById("education-list");
  eduContainer.innerHTML = data.education.map(item => `
    <div class="timeline-item">
      <div class="role-title">${item.degree}</div>
      <div class="company-name">${item.institution}</div>
      <div class="period">${item.period}</div>
      <p class="role-desc">${item.description}</p>
    </div>
  `).join("");

  // Skills
  const skillsContainer = document.getElementById("skills-list");
  skillsContainer.innerHTML = data.skills.map(skill => `
    <span class="tag">${skill}</span>
  `).join("");
}

// ============================================================================
// 4. INTEGRAÇÃO AUTOMÁTICA COM A API DO GITHUB
// ============================================================================
const LANG_COLORS = {
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  HTML: "#e34c26",
  CSS: "#563d7c",
  TypeScript: "#3178c6",
  SQL: "#e38c00",
  Shell: "#89e051",
  Other: "#94a3b8"
};

async function fetchGitHubMetrics() {
  const statusBadge = document.getElementById("github-status");
  const imgElement = document.getElementById("profile-img");

  try {
    // 1. Busca dados do usuário
    const userRes = await fetch(`https://api.github.com/users/${CONFIG.githubUsername}`);
    if (!userRes.ok) throw new Error("Erro ao buscar usuário");
    const userData = await userRes.json();

    // Fallback da foto: se assets/profile.png não carregar, usa o avatar do GitHub
    imgElement.src = CONFIG.profileImagePath;
    imgElement.onerror = () => {
      imgElement.src = userData.avatar_url;
    };

    document.getElementById("gh-repos").textContent = userData.public_repos;
    document.getElementById("gh-followers").textContent = userData.followers;

    // 2. Busca repositórios públicos
    const reposRes = await fetch(`https://api.github.com/users/${CONFIG.githubUsername}/repos?per_page=100&sort=updated`);
    const reposData = await reposRes.json();

    let totalStars = 0;
    const langCount = {};

    reposData.forEach(repo => {
      totalStars += repo.stargazers_count;
      if (repo.language && !repo.fork) {
        langCount[repo.language] = (langCount[repo.language] || 0) + 1;
      }
    });

    document.getElementById("gh-stars").textContent = totalStars;

    // 3. Calcula porcentagem das linguagens
    const totalLangRepos = Object.values(langCount).reduce((a, b) => a + b, 0);
    const sortedLangs = Object.entries(langCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6);

    const barEl = document.getElementById("languages-bar");
    const legendEl = document.getElementById("languages-legend");
    barEl.innerHTML = "";
    legendEl.innerHTML = "";

    sortedLangs.forEach(([lang, count]) => {
      const pct = ((count / totalLangRepos) * 100).toFixed(1);
      const color = LANG_COLORS[lang] || LANG_COLORS.Other;

      barEl.innerHTML += `<div style="width: ${pct}%; background-color: ${color};" title="${lang}: ${pct}%"></div>`;
      legendEl.innerHTML += `
        <div class="legend-item">
          <span class="legend-dot" style="background-color: ${color};"></span>
          <span>${lang} (${pct}%)</span>
        </div>
      `;
    });

    // 4. Exibe os 4 repositórios atualizados recentemente (não-forks)
    const featured = reposData.filter(r => !r.fork).slice(0, 4);
    const reposGrid = document.getElementById("repos-grid");
    reposGrid.innerHTML = featured.map(repo => `
      <a href="${repo.html_url}" target="_blank" rel="noopener" class="repo-card">
        <div>
          <div class="repo-title">${repo.name}</div>
          <div class="repo-desc">${repo.description || "Sem descrição disponível."}</div>
        </div>
        <div class="repo-meta">
          <span>● ${repo.language || "Code"}</span>
          <span>★ ${repo.stargazers_count}</span>
        </div>
      </a>
    `).join("");

    statusBadge.textContent = "API Online";
  } catch (error) {
    console.error(error);
    statusBadge.textContent = "Offline / Limite de API";
  }
}

// ============================================================================
// 5. INICIALIZAÇÃO
// ============================================================================
document.getElementById("lang-toggle").addEventListener("click", (e) => {
  currentLang = currentLang === "pt" ? "en" : "pt";
  e.target.textContent = currentLang === "pt" ? "EN" : "PT";
  renderResume(currentLang);
});

renderResume(currentLang);
fetchGitHubMetrics();