// =====================================================
// TRUTHLENS AI
// Image Detection + News Verification + Face Analysis
// =====================================================


// =====================================================
// WEBHOOK URLs
// =====================================================

// IMAGE DETECTION
const WEBHOOK_URL =
    "https://hashimmughal84.app.n8n.cloud/webhook/truthlens-analyze";

// NEWS VERIFICATION
const NEWS_WEBHOOK_URL =
    "https://hashimmughal84.app.n8n.cloud/webhook/truthlens-news";

// FACE ANALYSIS
// TEST URL - use this while n8n is in Test/Listening mode
const FACE_WEBHOOK_URL =
    "https://hashimmughal84.app.n8n.cloud/webhook/truthlens-face";


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

if (uploadButton) {

    uploadButton.addEventListener("click", () => {

        fileInput.click();

    });

}


// =====================================================
// FILE SELECTED
// =====================================================

if (fileInput) {

    fileInput.addEventListener("change", () => {

        const file = fileInput.files[0];

        if (!file) {

            fileText.textContent =
                "Ask TruthLens to analyze this file";

            return;

        }


        // Only images

        if (!file.type.startsWith("image/")) {

            alert(
                "Please select an image (JPG, PNG or WEBP)."
            );

            fileInput.value = "";

            fileText.textContent =
                "Ask TruthLens to analyze this file";

            return;

        }


        fileText.textContent =
            file.name;

    });

}


// =====================================================
// IMAGE DETECTION
// =====================================================

if (analyzeButton) {

    analyzeButton.addEventListener(
        "click",
        async () => {

            const file =
                fileInput.files[0];


            if (!file) {

                alert(
                    "Please select an image first."
                );

                return;

            }


            if (!file.type.startsWith("image/")) {

                alert(
                    "Please select an image."
                );

                return;

            }


            result.classList.add("hidden");

            loading.classList.remove("hidden");


            const loadingTitle =
                loading.querySelector("h2");

            const loadingText =
                loading.querySelector("p");


            if (loadingTitle) {

                loadingTitle.textContent =
                    "Analyzing the image...";

            }


            if (loadingText) {

                loadingText.textContent =
                    "TruthLens AI is checking the image.";

            }


            try {

                const formData =
                    new FormData();


                // IMPORTANT
                // n8n Webhook binary field = data

                formData.append(
                    "data",
                    file
                );


                const response =
                    await fetch(
                        WEBHOOK_URL,
                        {
                            method: "POST",
                            body: formData
                        }
                    );


                if (!response.ok) {

                    throw new Error(
                        `Image server error: ${response.status}`
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

                } else {

                    score.textContent =
                        "--";

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

        }
    );

}


// =====================================================
// NEWS VERIFICATION
// =====================================================

async function verifyNews() {

    const news =
        prompt(
            "Enter the news or claim you want TruthLens AI to verify:"
        );


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


    result.classList.add("hidden");

    loading.classList.remove("hidden");


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


        const verdict =
            data.verdict ||
            "UNCERTAIN";


        const confidence =
            Number(data.confidence);


        const message =
            data.message ||
            "There is not enough evidence to confidently classify this claim.";


        // =================================================
        // NEWS SOURCES
        // =================================================

        let sourcesBox =
            document.getElementById("newsSources");


        if (!sourcesBox) {

            sourcesBox =
                document.createElement("div");

            sourcesBox.id =
                "newsSources";

            sourcesBox.className =
                "news-sources";

            explanationText.parentElement.after(
                sourcesBox
            );

        }


        sourcesBox.innerHTML = "";


        if (
            Array.isArray(data.sources) &&
            data.sources.length > 0
        ) {

            const heading =
                document.createElement("h3");

            heading.textContent =
                "News Evidence & Sources";

            sourcesBox.appendChild(
                heading
            );


            data.sources.forEach(article => {

                if (!article.title) {

                    return;

                }


                const sourceItem =
                    document.createElement("div");

                sourceItem.className =
                    "news-source-item";


                const title =
                    document.createElement("h4");

                title.textContent =
                    article.title;


                const source =
                    document.createElement("p");

                source.textContent =
                    `${article.source || "Unknown Source"}${article.date ? " • " + article.date : ""}`;


                sourceItem.appendChild(
                    title
                );


                sourceItem.appendChild(
                    source
                );


                if (article.link) {

                    const link =
                        document.createElement("a");

                    link.href =
                        article.link;

                    link.target =
                        "_blank";

                    link.rel =
                        "noopener noreferrer";

                    link.textContent =
                        "Read Source →";

                    sourceItem.appendChild(
                        link
                    );

                }


                sourcesBox.appendChild(
                    sourceItem
                );

            });

        }


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


        fakeScore.textContent =
            "--";


        realScore.textContent =
            "--";


        explanationText.textContent =
            message;


        loading.classList.add("hidden");

        result.classList.remove("hidden");


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
// FACE ANALYSIS
// =====================================================

async function analyzeFace() {

    const file =
        fileInput.files[0];


    // No image

    if (!file) {

        alert(
            "Please select a face image first."
        );

        fileInput.click();

        return;

    }


    // Check image

    if (!file.type.startsWith("image/")) {

        alert(
            "Please select an image."
        );

        return;

    }


    result.classList.add("hidden");

    loading.classList.remove("hidden");


    const loadingTitle =
        loading.querySelector("h2");

    const loadingText =
        loading.querySelector("p");


    if (loadingTitle) {

        loadingTitle.textContent =
            "Analyzing the face...";

    }


    if (loadingText) {

        loadingText.textContent =
            "TruthLens AI is checking the image for possible face manipulation indicators.";

    }


    try {

        console.log(
            "Sending image for face analysis:",
            file.name
        );


        // =================================================
        // CREATE FORM DATA
        // =================================================

        const formData =
            new FormData();


        // IMPORTANT
        // n8n Webhook binary field = data

        formData.append(
            "data",
            file
        );


        // =================================================
        // SEND TO FACE N8N WORKFLOW
        // =================================================

        const response =
            await fetch(
                FACE_WEBHOOK_URL,
                {

                    method: "POST",

                    body: formData

                }
            );


        if (!response.ok) {

            throw new Error(
                `Face server error: ${response.status}`
            );

        }


        // =================================================
        // GET N8N RESPONSE
        // =================================================

        const data =
            await response.json();


        console.log(
            "TruthLens face result:",
            data
        );


        // =================================================
        // FACE RESULT
        // =================================================

        const verdict =
            data.verdict ||
            data.label ||
            data.status ||
            "UNCERTAIN";


        const confidence =
            Number(
                data.confidence ??
                data.score ??
                data.percentage
            );


        const message =
            data.message ||
            data.explanation ||
            "The face analysis has been completed.";


        // =================================================
        // DISPLAY CONFIDENCE
        // =================================================

        if (!Number.isNaN(confidence)) {

            score.textContent =
                confidence.toFixed(2) + "%";

        } else {

            score.textContent =
                "--";

        }


        // =================================================
        // DISPLAY VERDICT
        // =================================================

        status.textContent =
            verdict;


        // =================================================
        // FACE REAL / FAKE PERCENTAGES
        // =================================================

        if (
            data.real_percentage !== undefined &&
            data.real_percentage !== null
        ) {

            realScore.textContent =
                Number(data.real_percentage)
                    .toFixed(2) + "%";

        } else {

            realScore.textContent =
                "--";

        }


        if (
            data.fake_percentage !== undefined &&
            data.fake_percentage !== null
        ) {

            fakeScore.textContent =
                Number(data.fake_percentage)
                    .toFixed(2) + "%";

        } else {

            fakeScore.textContent =
                "--";

        }


        // =================================================
        // EXPLANATION
        // =================================================

        explanationText.textContent =
            message;


        // =================================================
        // SHOW RESULT
        // =================================================

        loading.classList.add("hidden");

        result.classList.remove("hidden");


        result.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });


    } catch (error) {

        console.error(
            "TruthLens face error:",
            error
        );


        loading.classList.add("hidden");


        alert(
            "Face analysis failed. Please make sure the n8n Face workflow is listening for the test request."
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

                analyzeFace();

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
// ANALYZE ANOTHER
// =====================================================

if (againButton) {

    againButton.addEventListener(
        "click",
        () => {

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


            // Remove news sources

            const sourcesBox =
                document.getElementById("newsSources");


            if (sourcesBox) {

                sourcesBox.remove();

            }


            result.classList.add("hidden");


            window.scrollTo({

                top: 0,

                behavior: "smooth"

            });

        }
    );

}
