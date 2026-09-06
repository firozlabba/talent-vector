// =====================================================
// TALENT VECTOR - HOME PAGE
// =====================================================


// =========================
// UPLOAD RESUME BUTTON
// =========================

function uploadResume() {

    const resumeInput =
        document.getElementById("resumeInput");

    if (resumeInput) {
        resumeInput.click();
    }
}


// =========================
// STATISTICS COUNT ANIMATION
// =========================

document.addEventListener("DOMContentLoaded", function () {

    const statNumbers =
        document.querySelectorAll(".stat h2");

    statNumbers.forEach(function (element) {

        const originalText =
            element.textContent.trim();

        const numberMatch =
            originalText.match(/[\d,]+/);

        if (!numberMatch) {
            return;
        }

        const target =
            parseInt(
                numberMatch[0].replace(/,/g, ""),
                10
            );

        const suffix =
            originalText.replace(
                numberMatch[0],
                ""
            );

        const duration = 2800;

        const startTime =
            performance.now();


        function animate(currentTime) {

            const elapsed =
                currentTime - startTime;

            const progress =
                Math.min(
                    elapsed / duration,
                    1
                );


            // Very smooth ease-out
            const easedProgress =
                progress < 0.5

                    ? 4 * progress * progress * progress

                    : 1 -
                      Math.pow(
                          -2 * progress + 2,
                          3
                      ) / 2;


            const current =
                Math.round(
                    target * easedProgress
                );


            element.textContent =
                current.toLocaleString() +
                suffix;


            if (progress < 1) {

                requestAnimationFrame(
                    animate
                );

            } else {

                element.textContent =
                    target.toLocaleString() +
                    suffix;

            }

        }


        requestAnimationFrame(
            animate
        );

    });

});