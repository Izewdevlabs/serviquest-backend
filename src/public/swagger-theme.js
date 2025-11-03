window.addEventListener("load", function () {
  const body = document.querySelector("body.swagger-ui");
  const savedTheme = localStorage.getItem("sq-swagger-theme") || "light";
  body.classList.add(savedTheme);

  const toggleBtn = document.createElement("button");
  toggleBtn.className = "theme-toggle";
  toggleBtn.innerText = savedTheme === "dark" ? "🌙 Dark" : "☀️ Light";
  toggleBtn.onclick = () => {
    const newTheme = body.classList.contains("dark") ? "light" : "dark";
    body.classList.remove("light", "dark");
    body.classList.add(newTheme);
    toggleBtn.innerText = newTheme === "dark" ? "🌙 Dark" : "☀️ Light";
    localStorage.setItem("sq-swagger-theme", newTheme);
  };
  document.body.appendChild(toggleBtn);
});
