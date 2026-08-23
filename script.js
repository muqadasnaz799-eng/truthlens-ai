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

const againButton =
    document.getElementById("againButton");


/* =========================
   OPEN FILE SELECTOR
========================= */

uploadButton.addEventListener(
    "click",
    function () {

        fileInput.click();

    }
);


/* =========================
   FILE SELECTED
========================= */

fileInput.addEventListener(
    "change",
    function () {

        if (fileInput.files.length > 0) {

            const file =
                fileInput.files[0];

            fileText.innerText =
                file.name;

        }

    }
);


/* =========================
   ANALYZE BUTTON
========================= */

analyzeButton.addEventListener(
    "click",
    async function () {

        if (!fileInput.files.length) {

            alert(
                "Please upload an image or video first."
            );

            return;

        }


        /* SHOW LOADING */

        loading.classList.remove(
            "hidden"
        );

        result.classList.add(
            "hidden"
        );


        /*
        ===================================
        TEMPORARY DEMO
        ===================================

        Later we will replace this
        with the real n8n API request.
        */


        await new Promise(
            resolve =>
                setTimeout(
                    resolve,
                    2500
                )
        );


        /* HIDE LOADING */

        loading.classList.add(
            "hidden"
        );


        /* SHOW RESULT */

        result.classList.remove(
            "hidden"
        );


        document.getElementById(
            "score"
        ).innerText = "78%";


        document.getElementById(
            "status"
        ).innerText =
            "Suspicious";


        document.getElementById(
            "fakeScore"
        ).innerText =
            "78%";


        document.getElementById(
            "realScore"
        ).innerText =
            "22%";


        document.getElementById(
            "explanationText"
        ).innerText =

            "Demo result: possible AI manipulation indicators detected. Real AI analysis will be connected through n8n and Hugging Face.";

    }
);


/* =========================
   ANALYZE ANOTHER
========================= */

againButton.addEventListener(
    "click",
    function () {

        result.classList.add(
            "hidden"
        );

        fileInput.value = "";

        fileText.innerText =
            "Ask TruthLens to analyze this file.";

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }
);


/* =========================
   QUICK ACTIONS
========================= */

const quickButtons =
    document.querySelectorAll(
        ".quick-actions button"
    );


quickButtons.forEach(
    function (button) {

        button.addEventListener(
            "click",
            function () {

                const type =
                    button.dataset.type;

                fileInput.click();

            }
        );

    }
);