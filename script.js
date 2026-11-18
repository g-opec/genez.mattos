// ============================================================================
// 1. CONFIGURAÇÕES GERAIS E LINKS
// ============================================================================
const CONFIG = {
  githubUsername: "g-opec",
  repoName: "genez.mattos",
  linkedinUrl: "https://www.linkedin.com/in/genez-jose-mattos-junior/",
  email: "genezmattos@gmail.com",
  profileImagePath: "assets/profile.png"
};

let resumeDataGlobal = null;
let currentLang = "pt";

// ============================================================================
// 2. CARREGAMENTO DINÂMICO DOS DADOS DO CURRÍCULO (JSON)
// ============================================================================
async function loadResumeData() {
  try {
    const response = await fetch("resume.json");
    if (!response.ok) throw new Error("Não foi possível carregar o arquivo resume.json");
    resumeDataGlobal = await response.json();
    renderResume(currentLang);
  } catch (error) {
    console.error("Erro ao carregar dados do currículo:", error);
  }
}

// ============================================================================
// 3. MOTOR DE RENDERIZAÇÃO E MULTILÍNGUE
// ============================================================================
function renderResume(lang) {
  if (!resumeDataGlobal) return;
  const data = resumeDataGlobal[lang];

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
// 4. CONSTRUTOR DE CERTIFICADOS AUTOMÁTICO (VIA PASTA DO GITHUB)
// ============================================================================
async function fetchCertificatesFromGitHub() {
  const certContainer = document.getElementById("certifications-list");
  if (!certContainer) return;

  try {
    // Consulta a API do GitHub na pasta /certificados do repositório
    const apiUrl = `https://api.github.com/repos/${CONFIG.githubUsername}/${CONFIG.repoName}/contents/certificados`;
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      certContainer.innerHTML = `<p class="role-desc">Crie uma pasta chamada <code>certificados</code> no repositório para listar os arquivos automaticamente.</p>`;
      return;
    }

    const files = await response.json();

    // Filtra apenas arquivos válidos (PDF, imagens)
    const certFiles = files.filter(file => 
      file.type === "file" && /\.(pdf|png|jpg|jpeg)$/i.test(file.name)
    );

    if (certFiles.length === 0) {
      certContainer.innerHTML = `<p class="role-desc">Nenhum certificado encontrado na pasta.</p>`;
      return;
    }

    // Renderiza cada certificado encontrado convertendo o nome do arquivo em um título limpo
    certContainer.innerHTML = certFiles.map(file => {
      // Remove extensão e substitui hífens/underscores por espaços (ex: "certificado-python.pdf" -> "Certificado Python")
      const cleanName = file.name
        .substring(0, file.name.lastIndexOf('.'))
        .replace(/[-_]/g, ' ');
      
      const formattedTitle = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);

      return `
        <div class="timeline-item">
          <div class="role-title">
            <a href="${file.download_url}" target="_blank" rel="noopener" style="color: inherit; text-decoration: none;">
              ${formattedTitle} 📄
            </a>
          </div>
          <div class="company-name">Validação Direta (Repositório)</div>
          <p class="role-desc">Clique no título para visualizar o documento original.</p>
        </div>
      `;
    }).join("");

  } catch (error) {
    console.error("Erro ao buscar certificados do GitHub:", error);
    certContainer.innerHTML = `<p class="role-desc">Pasta de certificados não configurada ou vazia.</p>`;
  }
}

// ============================================================================
// 5. INTEGRAÇÃO AUTOMÁTICA COM A API DO GITHUB (MÉTRICAS E LINGUAGENS)
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
    const userRes = await fetch(`https://api.github.com/users/${CONFIG.githubUsername}`);
    if (!userRes.ok) throw new Error("Erro ao buscar usuário do GitHub");
    const userData = await userRes.json();

    imgElement.src = CONFIG.profileImagePath;
    imgElement.onerror = () => {
      imgElement.src = userData.avatar_url;
    };

    document.getElementById("gh-repos").textContent = userData.public_repos;
    document.getElementById("gh-followers").textContent = userData.followers;

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

    if (statusBadge) statusBadge.textContent = "API Online";
  } catch (error) {
    console.error(error);
    if (statusBadge) statusBadge.textContent = "Offline / Limite de API";
  }
}

// ============================================================================
// 6. INICIALIZAÇÃO
// ============================================================================
document.getElementById("lang-toggle").addEventListener("click", (e) => {
  currentLang = currentLang === "pt" ? "en" : "pt";
  e.target.textContent = currentLang === "pt" ? "EN" : "PT";
  renderResume(currentLang);
});

loadResumeData();
fetchGitHubMetrics();
fetchCertificatesFromGitHub();