const WEBHOOK_URL =
  "https://hashimmughal84.app.n8n.cloud/webhook/truthlens-analyze";

const fileInput = document.getElementById("fileInput");
const uploadButton = document.getElementById("uploadButton");
const analyzeButton = document.getElementById("analyzeButton");

const fileText = document.getElementById("fileText");

const loading = document.getElementById("loading");
const result = document.getElementById("result");

const score = document.getElementById("score");
const status = document.getElementById("status");

const fakeScore = document.getElementById("fakeScore");
const realScore = document.getElementById("realScore");

const explanationText =
  document.getElementById("explanationText");

const againButton =
  document.getElementById("againButton");

let selectedFile = null;


// ========================================
// UPLOAD BUTTON
// ========================================

uploadButton.addEventListener("click", () => {
  fileInput.click();
});


// ========================================
// FILE SELECTED
// ========================================

fileInput.addEventListener("change", () => {

  const file = fileInput.files[0];

  if (!file) {
    return;
  }

  selectedFile = file;

  fileText.textContent = file.name;

  analyzeButton.disabled = false;

});


// ========================================
// ANALYZE BUTTON
// ========================================

analyzeButton.addEventListener("click", async () => {

  if (!selectedFile) {

    alert("Please upload an image first.");

    return;

  }


  // Show loading screen

  loading.classList.remove("hidden");

  result.classList.add("hidden");

  analyzeButton.disabled = true;


  // Create FormData

  const formData = new FormData();

  // IMPORTANT:
  // "data" must match n8n Webhook Property Name

  formData.append("data", selectedFile);


  try {

    // Send image to n8n

    const response = await fetch(WEBHOOK_URL, {

      method: "POST",

      body: formData

    });


    if (!response.ok) {

      throw new Error(
        `Server Error: ${response.status}`
      );

    }


    // Get JSON response

    const data = await response.json();


    console.log("TruthLens Result:", data);


    // Hide loading

    loading.classList.add("hidden");


    // Show result

    result.classList.remove("hidden");


    // Get values

    const real = Number(data.real_percentage || 0);

    const fake = Number(data.fake_percentage || 0);

    const resultStatus =
      data.status || "Unknown";


    // ========================================
    // DISPLAY RESULT
    // ========================================

    score.textContent =
      `${Math.max(real, fake).toFixed(2)}%`;

    status.textContent =
      resultStatus;

    realScore.textContent =
      `${real.toFixed(2)}%`;

    fakeScore.textContent =
      `${fake.toFixed(2)}%`;


    // Explanation

    if (resultStatus === "Likely Real") {

      explanationText.textContent =
        `The AI model classified this image as likely real with ${real.toFixed(2)}% confidence. The estimated AI/fake score is ${fake.toFixed(2)}%.`;

    }

    else if (resultStatus === "Suspicious") {

      explanationText.textContent =
        `The analysis detected mixed authenticity signals. The image should be treated as suspicious and verified with additional sources.`;

    }

    else {

      explanationText.textContent =
        `The AI model detected strong indicators associated with AI-generated or manipulated content. The estimated AI/fake score is ${fake.toFixed(2)}%.`;

    }


    // Scroll to result

    result.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });


  }

  catch (error) {

    console.error(
      "TruthLens Error:",
      error
    );


    loading.classList.add("hidden");

    analyzeButton.disabled = false;


    alert(
      "Analysis failed. Please make sure the n8n workflow is active and try again."
    );

  }

});


// ========================================
// ANALYZE ANOTHER FILE
// ========================================

againButton.addEventListener("click", () => {

  selectedFile = null;

  fileInput.value = "";

  fileText.textContent =
    "Ask TruthLens to analyze this file";

  result.classList.add("hidden");

  loading.classList.add("hidden");

  analyzeButton.disabled = false;

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

});
