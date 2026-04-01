//////////////////////////////////////////////////
// SafeInbox Gmail Auto Detection (FINAL)
//////////////////////////////////////////////////

let lastUrl = location.href;

// Detect navigation changes in Gmail
setInterval(() => {
  if (location.href !== lastUrl) {
    lastUrl = location.href;

    setTimeout(scanInbox, 800);
    setTimeout(scanEmail, 1200);
  }
}, 1000);

//////////////////////////////////////////////////
// ⭐ Scan Inbox (before opening emails)
//////////////////////////////////////////////////

function scanInbox() {
  const rows = document.querySelectorAll("tr");

  rows.forEach(row => {
    if (row.dataset.checked) return;

    const subject = row.innerText.toLowerCase();

    if (
      subject.includes("urgent") ||
      subject.includes("verify") ||
      subject.includes("bank") ||
      subject.includes("password") ||
      subject.includes("suspended")
    ) {
      row.style.backgroundColor = "#ffe6e6";
      row.style.fontWeight = "bold";

      // one-line phishing label
      const label = document.createElement("span");
      label.textContent = "⚠ PHISHING SUSPECTED ";
      label.style.color = "red";
      label.style.fontWeight = "bold";
      label.style.whiteSpace = "nowrap";

      row.prepend(label);
    }

    row.dataset.checked = "true";
  });
}

//////////////////////////////////////////////////
// ⭐ Scan opened email automatically
//////////////////////////////////////////////////

function scanEmail() {
  const container = document.querySelector("div[role='main']");
  if (!container) return;

  // prevent duplicate banner
  if (document.getElementById("safeinbox-banner")) return;

  const text = container.innerText.toLowerCase();
  if (text.length < 50) return;

  detectSuspiciousLinks();

  fetch("http://127.0.0.1:5000/predict", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text })
  })
  .then(res => res.json())
  .then(data => showBanner(data.risk))
  .catch(() => {});
}

//////////////////////////////////////////////////
// ⭐ Security Banner (clean & professional)
//////////////////////////////////////////////////

function showBanner(risk) {
  const banner = document.createElement("div");
  banner.id = "safeinbox-banner";

  banner.innerHTML =
    risk > 60
      ? `🚨 PHISHING WARNING — Risk ${risk}%`
      : `🛡 SAFE EMAIL — Risk ${risk}%`;

  banner.style.background = risk > 60 ? "#d93025" : "#188038";
  banner.style.color = "white";
  banner.style.padding = "10px";
  banner.style.textAlign = "center";
  banner.style.fontSize = "16px";
  banner.style.fontWeight = "bold";
  banner.style.position = "sticky";
  banner.style.top = "0";
  banner.style.zIndex = "9999";

  const container = document.querySelector("div[role='main']");
  container.prepend(banner);
}

//////////////////////////////////////////////////
// ⭐ Highlight suspicious links safely
//////////////////////////////////////////////////

function detectSuspiciousLinks() {
  const links = document.querySelectorAll("a");

  links.forEach(link => {
    if (link.dataset.checked) return;

    const url = link.href.toLowerCase();

    if (
      url.includes("@") ||
      url.includes("login") ||
      url.includes("verify") ||
      url.includes(".ru") ||
      url.includes(".xyz")
    ) {
      link.style.outline = "2px solid red";
      link.style.borderRadius = "4px";
      link.title = "⚠ Suspicious link";
    }

    link.dataset.checked = "true";
  });
}