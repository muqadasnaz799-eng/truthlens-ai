const WEBHOOK_URL =
  "https://hashimmughal84.app.n8n.cloud/webhook/truthlens-analyze";

let selectedFile = null;

// File input
const fileInput = document.querySelector('input[type="file"]');

// Upload buttons
const uploadButtons = document.querySelectorAll(
  'button, .upload-btn, .upload-button'
);

// Analyze button
const analyzeButton = Array.from(document.querySelectorAll("button")).find(
  button => button.textContent.trim().toLowerCase().includes("analyze")
);

// Result elements
const resultSection =
  document.querySelector("#result") ||
  document.querySelector(".result-section") ||
  document.querySelector(".results");

// File selection
if (fileInput) {
  fileInput.addEventListener("change", function (event) {
    const file = event.target.files[0];

    if (!file) return;

    selectedFile = file;

    console.log("Selected file:", file.name);

    // Show selected file name
    const fileNameElement =
      document.querySelector("#fileName") ||
      document.querySelector(".file-name");

    if (fileNameElement) {
      fileNameElement.textContent = file.name;
    }

    // Enable analyze button
    if (analyzeButton) {
      analyzeButton.disabled = false;
    }
  });
}

// Upload area click
uploadButtons.forEach(button => {
  button.addEventListener("click", function () {
    if (fileInput) {
      fileInput.click();
    }
  });
});

// Analyze image
if (analyzeButton) {
  analyzeButton.addEventListener("click", async function () {
    if (!selectedFile) {
      alert("Please upload an image first.");
      return;
    }

    analyzeButton.disabled = true;
    analyzeButton.textContent = "Analyzing...";

    try {
      // Create FormData
      const formData = new FormData();

      // IMPORTANT:
      // This "data" name must match n8n Webhook Binary Property Name
      formData.append("data", selectedFile);

      // Send image to n8n
      const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        body: formData
      });

      if (!response.ok) {
        throw new Error(
          `Server error: ${response.status} ${response.statusText}`
        );
      }

      const result = await response.json();

      console.log("TruthLens AI result:", result);

      // Display result
      showResult(result);

    } catch (error) {
      console.error("TruthLens error:", error);

      alert(
        "Analysis failed. Please make sure the n8n workflow is active and try again."
      );

    } finally {
      analyzeButton.disabled = false;
      analyzeButton.textContent = "Analyze Now";
    }
  });
}


// Display AI result
function showResult(result) {

  const real = Number(result.real_percentage || 0);
  const fake = Number(result.fake_percentage || 0);
  const status = result.status || "Unknown";

  // Find result elements
  const realElement =
    document.querySelector("#realPercentage") ||
    document.querySelector(".real-percentage");

  const fakeElement =
    document.querySelector("#fakePercentage") ||
    document.querySelector(".fake-percentage");

  const statusElement =
    document.querySelector("#status") ||
    document.querySelector(".status");

  if (realElement) {
    realElement.textContent = `${real.toFixed(2)}%`;
  }

  if (fakeElement) {
    fakeElement.textContent = `${fake.toFixed(2)}%`;
  }

  if (statusElement) {
    statusElement.textContent = status;
  }

  // Show result section
  if (resultSection) {
    resultSection.style.display = "block";

    resultSection.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }

  console.log("Real:", real + "%");
  console.log("Fake:", fake + "%");
  console.log("Status:", status);
}
