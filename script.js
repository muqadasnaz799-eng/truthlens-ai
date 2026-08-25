// =====================================================
// TRUTHLENS AI
// Image Detection + News Verification
// =====================================================


// =====================================================
// WEBHOOK URLs
// =====================================================

// EXISTING IMAGE DETECTION WEBHOOK
// DO NOT CHANGE
const WEBHOOK_URL =
    "https://hashimmughal84.app.n8n.cloud/webhook/truthlens-analyze";

// NEW NEWS VERIFICATION WEBHOOK
const NEWS_WEBHOOK_URL =
    "https://hashimmughal84.app.n8n.cloud/webhook/truthlens-news";


// =====================================================
// ELEMENTS
// =====================================================

const fileInput =
    document.getElementById("fileInput");

const uploadButton =
    document.getElementById("uploadButton");

const analyzeButton =
    document.getElementById("analyzeButton");

const fileText =
    document.getElementById("fileText");

const loading =
    document.getElementById("loading");

const result =
    document.getElementById("result");

const score =
    document.getElementById("score");

const status =
    document.getElementById("status");

const fakeScore =
    document.getElementById("fakeScore");

const realScore =
    document.getElementById("realScore");

const explanationText =
    document.getElementById("explanationText");

const againButton =
    document.getElementById("againButton");


// =====================================================
// QUICK ACTION BUTTONS
// =====================================================

const quickActions =
    document.querySelectorAll(".quick-actions button");


// =====================================================
// OPEN FILE SELECTOR
// =====================================================

uploadButton.addEventListener("click", () => {

    fileInput.click();

});


// =====================================================
// FILE SELECTED
// =====================================================

fileInput.addEventListener("change", () => {

    const file = fileInput.files[0];

    if (!file) {

        fileText.textContent =
            "Ask TruthLens to analyze this file";

        return;
    }


    // Only images for now

    if (!file.type.startsWith("image/")) {

        alert(
            "Please select an image (JPG, PNG or WEBP)."
        );

        fileInput.value = "";

        fileText.textContent =
            "Ask TruthLens to analyze this file";

        return;
    }


    fileText.textContent = file.name;

});


// =====================================================
// EXISTING IMAGE ANALYSIS
// DO NOT CHANGE THE IMAGE WEBHOOK
// =====================================================

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


    result.classList.add("hidden");

    loading.classList.remove("hidden");


    try {

        const formData =
            new FormData();


        // IMPORTANT:
        // Existing image binary field
        // remains exactly the same

        formData.append("data", file);


        const response =
            await fetch(WEBHOOK_URL, {

                method: "POST",

                body: formData

            });


        if (!response.ok) {

            throw new Error(
                `Server error: ${response.status}`
            );

        }


        const data =
            await response.json();


        console.log(
            "TruthLens image result:",
            data
        );


        const label =
            data.label;


        const confidence =
            Number(data.confidence);


        const realPercentage =
            data.real_percentage !== null &&
            data.real_percentage !== undefined
                ? Number(data.real_percentage)
                : null;


        const fakePercentage =
            data.fake_percentage !== null &&
            data.fake_percentage !== undefined
                ? Number(data.fake_percentage)
                : null;


        // Confidence

        if (!Number.isNaN(confidence)) {

            score.textContent =
                confidence.toFixed(2) + "%";

        }


        // Status

        status.textContent =
            data.status ||
            label ||
            "Analysis Complete";


        // Real percentage

        if (
            realPercentage !== null &&
            !Number.isNaN(realPercentage)
        ) {

            realScore.textContent =
                realPercentage.toFixed(2) + "%";

        } else {

            realScore.textContent =
                "--";

        }


        // Fake percentage

        if (
            fakePercentage !== null &&
            !Number.isNaN(fakePercentage)
        ) {

            fakeScore.textContent =
                fakePercentage.toFixed(2) + "%";

        } else {

            fakeScore.textContent =
                "--";

        }


        // Explanation

        if (
            String(label).toLowerCase() === "real"
        ) {

            explanationText.textContent =
                "The AI model classified this image as Real based on its prediction score.";

        } else {

            explanationText.textContent =
                "The AI model classified this image as Fake based on its prediction score.";

        }


        loading.classList.add("hidden");

        result.classList.remove("hidden");


        result.scrollIntoView({

            behavior: "smooth",

            block: "center"

        });


    } catch (error) {

        console.error(
            "TruthLens image error:",
            error
        );


        loading.classList.add("hidden");


        alert(
            "Image analysis failed. Please try again."
        );

    }

});


// =====================================================
// VERIFY NEWS
// =====================================================

async function verifyNews() {

    const news =
        prompt(
            "Enter the news or claim you want TruthLens AI to verify:"
        );


    // User cancelled

    if (news === null) {

        return;

    }


    const cleanNews =
        news.trim();


    if (!cleanNews) {

        alert(
            "Please enter a news claim first."
        );

        return;

    }


    // Hide previous result

    result.classList.add("hidden");


    // Show loading

    loading.classList.remove("hidden");


    // Change loading text

    const loadingTitle =
        loading.querySelector("h2");

    const loadingText =
        loading.querySelector("p");


    if (loadingTitle) {

        loadingTitle.textContent =
            "Verifying the news...";

    }


    if (loadingText) {

        loadingText.textContent =
            "TruthLens AI is checking related news and evidence.";

    }


    try {

        console.log(
            "Sending news to TruthLens:",
            cleanNews
        );


        const response =
            await fetch(
                NEWS_WEBHOOK_URL,
                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body: JSON.stringify({

                        news: cleanNews

                    })

                }
            );


        if (!response.ok) {

            throw new Error(
                `News server error: ${response.status}`
            );

        }


        const data =
            await response.json();


        console.log(
            "TruthLens news result:",
            data
        );


        // =================================================
        // NEWS RESULT
        // =================================================

        const verdict =
            data.verdict ||
            "UNCERTAIN";


        const confidence =
            Number(data.confidence);


        const message =
            data.message ||
            "There is not enough evidence to confidently classify this claim.";


        // =================================================
        // DISPLAY NEWS RESULT
        // =================================================

        if (!Number.isNaN(confidence)) {

            score.textContent =
                confidence.toFixed(0) + "%";

        } else {

            score.textContent =
                "--";

        }


        status.textContent =
            verdict;


        // We don't have separate factual
        // percentages from the current n8n workflow.

        fakeScore.textContent =
            "--";


        realScore.textContent =
            "--";


        explanationText.textContent =
            message;


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

        console.error(
            "TruthLens news error:",
            error
        );


        loading.classList.add("hidden");


        alert(
            "News verification failed. Please make sure the n8n workflow is active and try again."
        );

    }

}


// =====================================================
// QUICK ACTIONS
// =====================================================

quickActions.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            const type =
                button.dataset.type;


            // IMAGE

            if (type === "image") {

                fileInput.click();

            }


            // NEWS

            else if (type === "news") {

                verifyNews();

            }


            // FACE

            else if (type === "face") {

                alert(
                    "Face Analysis will be available in the next stage."
                );

            }


            // VIDEO

            else if (type === "video") {

                alert(
                    "Video Analysis will be available in the next stage."
                );

            }

        }
    );

});


// =====================================================
// ANALYZE ANOTHER FILE
// =====================================================

againButton.addEventListener("click", () => {

    fileInput.value = "";


    fileText.textContent =
        "Ask TruthLens to analyze this file";


    score.textContent =
        "--";


    status.textContent =
        "Waiting...";


    fakeScore.textContent =
        "--";


    realScore.textContent =
        "--";


    explanationText.textContent =
        "Your analysis will appear here.";


    result.classList.add("hidden");


    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

});
