import swaggerJSDoc from "swagger-jsdoc";
import path from "path";

/**
 * 🧭 ServiQuest Swagger Configuration
 * Includes: branding, dark/light mode toggle, persistent theme storage
 */

const swaggerDefinition = {
  openapi: "3.0.3",
  info: {
    title: "ServiQuest API Documentation",
    version: "1.0.0",
    description: `
      <div style="font-family: Inter, sans-serif; line-height: 1.6;">
        <h3>🚀 ServiQuest Backend API</h3>
        <p>
          A full-featured service marketplace backend with
          <b> authentication </b>, <b> booking </b>, <b> payment </b>,
          and <b> admin dashboards </b>.
        </p>
        <h4>✨ Core Features:</h4>
        <ul>
          <li>User registration, login, and JWT authentication</li>
          <li>Service listings and provider management</li>
          <li>Booking lifecycle — create, update, cancel</li>
          <li>Payment processing and financial reporting</li>
          <li>Admin dashboards and platform statistics</li>
          <li>File upload (avatars) + dark-mode-ready frontends</li>
        </ul>
      </div>
    `,
    contact: {
      name: "ServiQuest Dev Team",
      email: "support@serviquest.io",
      url: "https://serviquest.io",
    },
    license: {
      name: "MIT License",
      url: "https://opensource.org/licenses/MIT",
    },
  },
  servers: [
    {
      url: "http://localhost:5000",
      description: "Local Development Server",
    },
    {
      url: "https://api.serviquest.io",
      description: "Production Server",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
  security: [{ bearerAuth: [] }],
  tags: [
    { name: "Authentication", description: "User registration and login endpoints" },
    { name: "Users", description: "Profile, password, and avatar management" },
    { name: "Services", description: "Create and manage service listings" },
    { name: "Bookings", description: "Service booking lifecycle and tracking" },
    { name: "Payments", description: "Payment recording and transaction reports" },
    { name: "Admin", description: "Administrative insights and user control" },
  ],
};

const options = {
  swaggerDefinition,
  apis: [
    path.resolve("src/routes/*.js"),
    path.resolve("src/controllers/*.js"),
    path.resolve("src/models/*.js"),
  ],
};

const swaggerSpecs = swaggerJSDoc(options);

// ─────────────── UI Theming + Toggle Logic ───────────────
export const swaggerUiOptions = {
  customCss: `
    body.swagger-ui {
      transition: background-color 0.3s ease, color 0.3s ease;
    }
    body.swagger-ui.light { background-color: #f8fafc; color: #111; }
    body.swagger-ui.dark { background-color: #0f172a; color: #e2e8f0; }

    .swagger-ui .topbar {
      background-color: #0d47a1 !important;
    }
    .swagger-ui .topbar-wrapper img {
      content: url('https://i.ibb.co/BPjKCwr/serviquest-logo.png');
      width: 38px;
    }
    .swagger-ui .info {
      background: var(--sq-info-bg, #f9fafc);
      padding: 1rem;
      border-radius: 10px;
      border: 1px solid #e5e7eb;
    }
    .swagger-ui.dark .info {
      background: #1e293b;
      border-color: #334155;
    }
    .swagger-ui .btn.authorize {
      background-color: #1976d2;
      border-radius: 6px;
    }
    .theme-toggle {
      position: fixed;
      top: 12px;
      right: 20px;
      background: #1976d2;
      color: white;
      border: none;
      border-radius: 6px;
      padding: 6px 12px;
      cursor: pointer;
      font-size: 13px;
      box-shadow: 0 2px 6px rgba(0,0,0,0.2);
      z-index: 9999;
      transition: background 0.2s;
    }
    .theme-toggle:hover { background: #0d47a1; }
  `,
  // 🚀 Embedded JS for theme toggle
  customJs: `
    window.addEventListener("load", function () {
      const body = document.querySelector("body.swagger-ui");

      // Detect or load saved theme
      const savedTheme = localStorage.getItem("sq-swagger-theme")
        || (window.matchMedia('(prefers-color-scheme: dark)').matches ? "dark" : "light");
      body.classList.add(savedTheme);

      // Create toggle button
      const toggleBtn = document.createElement("button");
      toggleBtn.className = "theme-toggle";
      toggleBtn.innerText = savedTheme === "dark" ? "🌙 Dark" : "☀️ Light";

      // Toggle handler
      toggleBtn.onclick = () => {
        const newTheme = body.classList.contains("dark") ? "light" : "dark";
        body.classList.remove("light", "dark");
        body.classList.add(newTheme);
        toggleBtn.innerText = newTheme === "dark" ? "🌙 Dark" : "☀️ Light";
        localStorage.setItem("sq-swagger-theme", newTheme);
      };

      document.body.appendChild(toggleBtn);
    });
  `,
  customSiteTitle: "ServiQuest API Portal",
  customfavIcon: "https://i.ibb.co/1KTKHsM/serviquest-icon.png",
};

export default swaggerSpecs;
