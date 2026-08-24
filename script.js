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


// ===============================
// OPEN FILE SELECTOR
// ===============================

uploadButton.addEventListener("click", () => {
    fileInput.click();
});


// ===============================
// FILE SELECTED
// ===============================

fileInput.addEventListener("change", () => {

    const file = fileInput.files[0];

    if (!file) {
        fileText.textContent =
            "Ask TruthLens to analyze this file";
        return;
    }

    // Only images for now
    if (!file.type.startsWith("image/")) {

        alert("Please select an image (JPG, PNG or WEBP).");

        fileInput.value = "";

        fileText.textContent =
            "Ask TruthLens to analyze this file";

        return;
    }

    fileText.textContent = file.name;
});


// ===============================
// ANALYZE IMAGE
// ===============================

analyzeButton.addEventListener("click", async () => {

    const file = fileInput.files[0];

    if (!file) {
        alert("Please select an image first.");
        return;
    }

    if (!file.type.startsWith("image/")) {
        alert("Please select an image.");
        return;
    }


    // Hide previous result
    result.classList.add("hidden");


    // Show loading
    loading.classList.remove("hidden");


    try {

        // Create multipart form data
        const formData = new FormData();

        // IMPORTANT:
        // This must match the n8n Webhook binary field name
        formData.append("data", file);


        // Send image to n8n
        const response = await fetch(WEBHOOK_URL, {
            method: "POST",
            body: formData
        });


        if (!response.ok) {
            throw new Error(
                `Server error: ${response.status}`
            );
        }


        // Get actual JSON returned by n8n
        const data = await response.json();


        console.log("TruthLens actual result:", data);


        // ===============================
        // DISPLAY ACTUAL MODEL RESULT
        // ===============================

        const label = data.label;
        const confidence = Number(data.confidence);

        const realPercentage =
            data.real_percentage !== null
                ? Number(data.real_percentage)
                : null;

        const fakePercentage =
            data.fake_percentage !== null
                ? Number(data.fake_percentage)
                : null;


        // Confidence
        if (!Number.isNaN(confidence)) {
            score.textContent =
                confidence.toFixed(2) + "%";
        }


        // Status
        status.textContent =
            data.status || label || "Analysis Complete";


        // Real percentage
        if (realPercentage !== null) {

            realScore.textContent =
                realPercentage.toFixed(2) + "%";

        } else {

            realScore.textContent = "--";

        }


        // Fake percentage
        if (fakePercentage !== null) {

            fakeScore.textContent =
                fakePercentage.toFixed(2) + "%";

        } else {

            fakeScore.textContent = "--";

        }


        // Explanation
        if (
            String(label).toLowerCase() === "real"
        ) {

            explanationText.textContent =
                "The AI model classified this image as Real based on its actual prediction score.";

        } else {

            explanationText.textContent =
                "The AI model classified this image as Fake based on its actual prediction score.";

        }


        // Hide loading
        loading.classList.add("hidden");


        // Show result
        result.classList.remove("hidden");


        // Scroll to result
        result.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });


    } catch (error) {

        console.error("TruthLens error:", error);


        loading.classList.add("hidden");


        alert(
            "Image analysis failed. Please try again."
        );

    }

});


// ===============================
// ANALYZE ANOTHER FILE
// ===============================

againButton.addEventListener("click", () => {

    fileInput.value = "";

    fileText.textContent =
        "Ask TruthLens to analyze this file";

    score.textContent = "--";

    status.textContent = "Waiting...";

    fakeScore.textContent = "--";

    realScore.textContent = "--";

    explanationText.textContent =
        "Your analysis will appear here.";

    result.classList.add("hidden");

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

});
