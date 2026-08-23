const fileInput = document.getElementById("fileInput");
const uploadButton = document.getElementById("uploadButton");
const analyzeButton = document.getElementById("analyzeButton");
const fileText = document.getElementById("fileText");
const loading = document.getElementById("loading");
const result = document.getElementById("result");
const againButton = document.getElementById("againButton");


/* =========================
   OPEN FILE SELECTOR
========================= */

uploadButton.addEventListener("click", function () {
    fileInput.click();
});


/* =========================
   FILE SELECTED
========================= */

fileInput.addEventListener("change", function () {

    if (fileInput.files.length > 0) {

        const file = fileInput.files[0];

        fileText.innerText = file.name;

    }

});


/* =========================
   ANALYZE BUTTON
========================= */

analyzeButton.addEventListener("click", async function () {

    if (!fileInput.files.length) {

        alert("Please upload an image first.");

        return;

    }

    const file = fileInput.files[0];


    /* SHOW LOADING */

    loading.classList.remove("hidden");
    result.classList.add("hidden");


    try {

        /* =========================
           SEND FILE TO n8n
        ========================= */

        const formData = new FormData();

        formData.append("data", file);


        const response = await fetch(
            "https://hashimmughal84.app.n8n.cloud/webhook/truthlens-analyze",
            {
                method: "POST",
                body: formData
            }
        );


        if (!response.ok) {

            throw new Error(
                "Server error: " + response.status
            );

        }


        /* =========================
           GET n8n RESULT
        ========================= */

        const data = await response.json();

        console.log("TruthLens result:", data);


        /* HIDE LOADING */

        loading.classList.add("hidden");


        /* SHOW RESULT */

        result.classList.remove("hidden");


        /* =========================
           DISPLAY REAL RESULT
        ========================= */

        document.getElementById("score").innerText =
            data.real_percentage + "%";


        document.getElementById("status").innerText =
            data.status;


        document.getElementById("fakeScore").innerText =
            data.fake_percentage + "%";


        document.getElementById("realScore").innerText =
            data.real_percentage + "%";


        document.getElementById("explanationText").innerText =
            "TruthLens AI analyzed your uploaded file using AI-powered verification.";


    } catch (error) {

        console.error(error);

        loading.classList.add("hidden");

        alert(
            "Analysis failed. Please try again."
        );

    }

});


/* =========================
   ANALYZE ANOTHER
========================= */

againButton.addEventListener("click", function () {

    result.classList.add("hidden");

    fileInput.value = "";

    fileText.innerText =
        "Ask TruthLens to analyze this file.";

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

});


/* =========================
   QUICK ACTIONS
========================= */

const quickButtons =
    document.querySelectorAll(
        ".quick-actions button"
    );


quickButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        fileInput.click();

    });

});
