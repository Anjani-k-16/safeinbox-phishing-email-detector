document.getElementById("scan").addEventListener("click", async () => {

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: getEmailText
  }, async (results) => {

    const emailText = results[0].result;

    const response = await fetch("http://127.0.0.1:5000/predict", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ text: emailText })
    });

    const data = await response.json();

    const status = document.getElementById("status");
    const details = document.getElementById("details");

    if (data.risk > 60) {
      status.innerText = "⚠ HIGH RISK";
      status.className = "danger";
    } else {
      status.innerText = "✅ SAFE";
      status.className = "safe";
    }

    details.innerText = "Phishing Probability: " + data.risk + "%";
  });

});

function getEmailText() {
  return document.body.innerText;
}