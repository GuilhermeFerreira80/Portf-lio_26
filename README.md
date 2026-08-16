# Portfolio — Guilherme

Portfolio pessoal construído com **React + Vite**. Todo o conteúdo do site é gerido a partir de **um único ficheiro JSON** — não precisas de mexer em nenhum componente React para atualizar textos, projetos, skills, etc.

---

## 🚀 Como correr

```bash
npm install
npm run dev
```

---

## 📁 Estrutura do projeto

```
src/
├── data/
│   ├── portfolioData.json   ← 🟢 ESTE É O FICHEIRO QUE EDITAS
│   └── parseRichText.jsx    ← (helper interno, não mexer)
├── components/
│   ├── CanvasBg.jsx
│   └── LeftPanel.jsx
├── sections/
│   ├── About.jsx
│   ├── Projects.jsx
│   ├── Skills.jsx
│   └── Contact.jsx
├── App.jsx
├── App.css
├── index.css
└── main.jsx
```

---

## ✏️ Como editar o conteúdo

Abre o ficheiro **`src/data/portfolioData.json`** e altera o que quiseres. Abaixo estão explicadas todas as secções.

> **Nota:** O site suporta duas línguas: `"en"` (inglês) e `"pt"` (português). Cada secção tem textos para ambas.

> **Nota:** Para texto com destaque, usa `<highlight>texto</highlight>` e para negrito usa `<b>texto</b>`. Exemplo: `"Sou o <highlight>Guilherme</highlight>"` vai aparecer com o texto "Guilherme" destacado na cor do tema.

---

### 👤 Informações pessoais

```json
"personal": {
    "name": "GUILHERME",
    "year": 2026,
    "cvFile": "/cv.pdf",
    "socials": {
        "linkedin": "https://linkedin.com/in/SEU-PERFIL",
        "github": "https://github.com/SEU-USERNAME"
    },
    "en": {
        "role": "INFORMATICS ENGINEER STUDENT",
        "subtitle": "Studying and making projects...",
        "footerText": "Designed & Built by"
    },
    "pt": {
        "role": "ESTUDANTE DE ENGENHARIA INFORMÁTICA",
        "subtitle": "Estudando e fazendo projetos...",
        "footerText": "Desenhado e Construído por"
    }
}
```

| Campo | O que faz |
|---|---|
| `name` | O teu nome (aparece em MAIÚSCULAS no painel esquerdo) |
| `year` | Ano que aparece no footer |
| `cvFile` | Caminho para o teu CV (mete o PDF na pasta `public/`) |
| `socials.linkedin` | Link do teu LinkedIn |
| `socials.github` | Link do teu GitHub |
| `role` | O teu título/cargo |
| `subtitle` | Frase que aparece com animação de typing |
| `footerText` | Texto antes do teu nome no footer |

---

### 📝 Secção About (Sobre Mim)

```json
"about": {
    "en": {
        "paragraphs": [
            "Primeiro parágrafo com <highlight>palavras destacadas</highlight>...",
            "Segundo parágrafo...",
            "Terceiro parágrafo..."
        ],
        "stats": [
            { "target": 10, "suffix": "+", "label": "Projects" },
            { "target": 3,  "suffix": "+", "label": "Years Learning" },
            { "target": 15, "suffix": "+", "label": "Technologies" }
        ]
    }
}
```

| Campo | O que faz |
|---|---|
| `paragraphs` | Array de parágrafos de texto (podes ter quantos quiseres) |
| `stats` | Cards com números animados |
| `stats.target` | O número final da animação |
| `stats.suffix` | Texto depois do número (ex: `"+"`, `"%"`) |
| `stats.label` | Legenda abaixo do número |

Para **adicionar/remover stats**, basta adicionar ou remover objetos do array `stats`.

---

### 🛠️ Secção Projects (Projetos)

```json
"projects": {
    "en": [
        {
            "icon": "fa-shield-alt",
            "title": "Network Intrusion Detection System",
            "desc": "A machine-learning powered IDS that...",
            "tags": ["Python", "Scikit-learn", "ML"],
            "github": "https://github.com/user/repo",
            "live": "https://demo.example.com"
        }
    ]
}
```

| Campo | O que faz |
|---|---|
| `icon` | Ícone FontAwesome (sem o `fa-` inicial do prefixo `fas`). Ex: `"fa-shield-alt"`, `"fa-cloud"`, `"fa-lock"`, `"fa-server"`, `"fa-code"` |
| `title` | Nome do projeto |
| `desc` | Descrição curta |
| `tags` | Array de tecnologias usadas |
| `github` | Link para o repositório (remove o campo para não mostrar o botão) |
| `live` | Link para o demo live (remove o campo para não mostrar o botão) |

**Para adicionar um projeto novo**, copia um objeto existente e altera os campos. Lembra-te de adicionar nas duas línguas (`en` e `pt`).

**Para remover um projeto**, apaga o objeto do array (nas duas línguas).

#### Ícones disponíveis (FontAwesome)

Podes usar qualquer ícone do [FontAwesome 6](https://fontawesome.com/icons). Alguns úteis:
- `fa-shield-alt` — Segurança
- `fa-cloud` — Cloud
- `fa-lock` — Password/Encriptação
- `fa-server` — Servidor/Infraestrutura
- `fa-code` — Código/Programação
- `fa-database` — Base de dados
- `fa-robot` — AI/Automação
- `fa-terminal` — Terminal/CLI
- `fa-network-wired` — Redes
- `fa-bug` — Bug bounty/Debug

---

### 💡 Secção Skills (Competências)

Existem dois tipos de skills: **barras de progresso** e **pills** (etiquetas).

#### Skill com barra de progresso:

```json
{
    "key": "cyber",
    "title": "Cybersecurity",
    "icon": "fa-shield-halved",
    "type": "bars",
    "items": [
        { "label": "Penetration Testing", "pct": 75 },
        { "label": "Network Security", "pct": 80 }
    ]
}
```

#### Skill com pills (etiquetas):

```json
{
    "key": "programming",
    "title": "Programming",
    "icon": "fa-code",
    "type": "pills",
    "items": ["Python", "Bash", "JavaScript", "C"]
}
```

| Campo | O que faz |
|---|---|
| `key` | Identificador único (qualquer nome sem espaços) |
| `title` | Título da categoria |
| `icon` | Ícone FontAwesome |
| `type` | `"bars"` para barras de progresso, `"pills"` para etiquetas |
| `items` | Para `bars`: array de objetos `{ label, pct }`. Para `pills`: array de strings |
| `pct` | Percentagem da barra (0 a 100) |

**Para adicionar uma categoria nova**, copia uma existente e altera. Para adicionar um item, basta adicionar ao array `items`.

---

### 📬 Secção Contact (Contacto)

```json
"contact": {
    "email": "guilherme@example.com",
    "en": {
        "intro": "Whether you want to <highlight>collaborate</highlight>...",
        "namePlaceholder": "John Doe",
        "emailPlaceholder": "john@example.com",
        "messagePlaceholder": "Hey Guilherme, let's talk about...",
        "sendButton": "Send Message",
        "sentButton": "Sent!"
    }
}
```

| Campo | O que faz |
|---|---|
| `email` | O teu email (aparece no link de contacto) |
| `intro` | Texto introdutório da secção |
| `namePlaceholder` | Placeholder do campo nome |
| `emailPlaceholder` | Placeholder do campo email |
| `messagePlaceholder` | Placeholder da mensagem |
| `sendButton` | Texto do botão de enviar |
| `sentButton` | Texto que aparece quando a mensagem é "enviada" |

---

## 📋 Checklist rápido

Quando quiseres personalizar o portfólio:

- [ ] Abre `src/data/portfolioData.json`
- [ ] Muda o `name`, `role`, `subtitle`
- [ ] Mete os teus links reais em `socials`
- [ ] Mete o teu email real em `contact.email`
- [ ] Atualiza os projetos com os teus projetos reais
- [ ] Ajusta as skills e percentagens
- [ ] Coloca o teu CV em `public/cv.pdf`
- [ ] Corre `npm run dev` para verificar

---

## 📦 Build para produção

```bash
npm run build
```

Os ficheiros ficam na pasta `dist/`.
