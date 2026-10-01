// =====================================================
// TALENT VECTOR - RESUME BUILDER
// =====================================================


// =====================================================
// GET FORM VALUE
// =====================================================

function getValue(id) {

    const element =
        document.getElementById(id);

    if (!element) {
        return "";
    }

    return element.value.trim();

}


// =====================================================
// ESCAPE HTML
// =====================================================

function escapeHTML(value) {

    return String(value || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


// =====================================================
// GENERATE RESUME
// =====================================================

function generateResume() {

    const fullName =
        getValue("fullName");

    const jobTitle =
        getValue("jobTitle");

    const email =
        getValue("email");

    const phone =
        getValue("phone");

    const location =
        getValue("location");

    const linkedin =
        getValue("linkedin");

    const github =
        getValue("github");

    const summary =
        getValue("summary");

    const degree =
        getValue("degree");

    const college =
        getValue("college");

    const educationYear =
        getValue("educationYear");

    const grade =
        getValue("grade");

    const experienceRole =
        getValue("experienceRole");

    const company =
        getValue("company");

    const experienceDuration =
        getValue("experienceDuration");

    const experienceDescription =
        getValue("experienceDescription");

    const skills =
        getValue("skills");

    const projectName =
        getValue("projectName");

    const projectTech =
        getValue("projectTech");

    const projectDescription =
        getValue("projectDescription");

    const certificateName =
        getValue("certificateName");

    const certificateOrganization =
        getValue("certificateOrganization");


    // =================================================
    // BASIC VALIDATION
    // =================================================

    if (!fullName) {

        alert(
            "Please enter your full name."
        );

        document
            .getElementById("fullName")
            .focus();

        return;

    }


    if (!jobTitle) {

        alert(
            "Please enter your job title."
        );

        document
            .getElementById("jobTitle")
            .focus();

        return;

    }


    // =================================================
    // CONTACT INFORMATION
    // =================================================

    let contactHTML = "";


    if (email) {

        contactHTML +=
            `<span>✉ ${escapeHTML(email)}</span>`;

    }


    if (phone) {

        contactHTML +=
            `<span>☎ ${escapeHTML(phone)}</span>`;

    }


    if (location) {

        contactHTML +=
            `<span>📍 ${escapeHTML(location)}</span>`;

    }


    if (linkedin) {

        contactHTML +=
            `<span>in ${escapeHTML(linkedin)}</span>`;

    }


    if (github) {

        contactHTML +=
            `<span>GitHub: ${escapeHTML(github)}</span>`;

    }


    // =================================================
    // SUMMARY
    // =================================================

    let summaryHTML = "";


    if (summary) {

        summaryHTML = `

            <div class="resume-section">

                <div class="resume-section-title">
                    Professional Summary
                </div>

                <div class="resume-summary">
                    ${escapeHTML(summary)}
                </div>

            </div>

        `;

    }


    // =================================================
    // EDUCATION
    // =================================================

    let educationHTML = "";


    if (
        degree ||
        college ||
        educationYear ||
        grade
    ) {

        educationHTML = `

            <div class="resume-section">

                <div class="resume-section-title">
                    Education
                </div>

                <div class="resume-item">

                    ${
                        degree
                            ?
                        `<div class="resume-item-title">
                            ${escapeHTML(degree)}
                        </div>`
                            :
                        ""
                    }

                    ${
                        college
                            ?
                        `<div class="resume-item-subtitle">
                            ${escapeHTML(college)}
                        </div>`
                            :
                        ""
                    }

                    ${
                        educationYear || grade
                            ?
                        `<div class="resume-item-subtitle">
                            ${escapeHTML(educationYear)}
                            ${
                                grade
                                    ?
                                " • " +
                                escapeHTML(grade)
                                    :
                                ""
                            }
                        </div>`
                            :
                        ""
                    }

                </div>

            </div>

        `;

    }


    // =================================================
    // EXPERIENCE
    // =================================================

    let experienceHTML = "";


    if (
        experienceRole ||
        company ||
        experienceDuration ||
        experienceDescription
    ) {

        experienceHTML = `

            <div class="resume-section">

                <div class="resume-section-title">
                    Experience
                </div>

                <div class="resume-item">

                    ${
                        experienceRole
                            ?
                        `<div class="resume-item-title">
                            ${escapeHTML(experienceRole)}
                        </div>`
                            :
                        ""
                    }

                    ${
                        company
                            ?
                        `<div class="resume-item-subtitle">
                            ${escapeHTML(company)}
                        </div>`
                            :
                        ""
                    }

                    ${
                        experienceDuration
                            ?
                        `<div class="resume-item-subtitle">
                            ${escapeHTML(experienceDuration)}
                        </div>`
                            :
                        ""
                    }

                    ${
                        experienceDescription
                            ?
                        `<div class="resume-item-description">
                            ${escapeHTML(experienceDescription)}
                        </div>`
                            :
                        ""
                    }

                </div>

            </div>

        `;

    }


    // =================================================
    // SKILLS
    // =================================================

    let skillsHTML = "";


    if (skills) {

        const skillList =
            skills
                .split(",")
                .map(
                    skill =>
                        skill.trim()
                )
                .filter(
                    skill =>
                        skill.length > 0
                );


        if (skillList.length > 0) {

            skillsHTML = `

                <div class="resume-section">

                    <div class="resume-section-title">
                        Skills
                    </div>

                    <div class="resume-skills">

                        ${
                            skillList
                                .map(
                                    skill =>
                                        `
                                        <span class="resume-skill">
                                            ${escapeHTML(skill)}
                                        </span>
                                        `
                                )
                                .join("")
                        }

                    </div>

                </div>

            `;

        }

    }


    // =================================================
    // PROJECT
    // =================================================

    let projectHTML = "";


    if (
        projectName ||
        projectTech ||
        projectDescription
    ) {

        projectHTML = `

            <div class="resume-section">

                <div class="resume-section-title">
                    Projects
                </div>

                <div class="resume-item">

                    ${
                        projectName
                            ?
                        `<div class="resume-item-title">
                            ${escapeHTML(projectName)}
                        </div>`
                            :
                        ""
                    }

                    ${
                        projectTech
                            ?
                        `<div class="resume-item-subtitle">
                            ${escapeHTML(projectTech)}
                        </div>`
                            :
                        ""
                    }

                    ${
                        projectDescription
                            ?
                        `<div class="resume-item-description">
                            ${escapeHTML(projectDescription)}
                        </div>`
                            :
                        ""
                    }

                </div>

            </div>

        `;

    }


    // =================================================
    // CERTIFICATIONS
    // =================================================

    let certificationHTML = "";


    if (
        certificateName ||
        certificateOrganization
    ) {

        certificationHTML = `

            <div class="resume-section">

                <div class="resume-section-title">
                    Certifications
                </div>

                <div class="resume-item">

                    ${
                        certificateName
                            ?
                        `<div class="resume-item-title">
                            ${escapeHTML(certificateName)}
                        </div>`
                            :
                        ""
                    }

                    ${
                        certificateOrganization
                            ?
                        `<div class="resume-item-subtitle">
                            ${escapeHTML(certificateOrganization)}
                        </div>`
                            :
                        ""
                    }

                </div>

            </div>

        `;

    }


    // =================================================
    // COMPLETE RESUME
    // =================================================

    const preview =
        document.getElementById(
            "resumePreview"
        );


    if (!preview) {

        alert(
            "Resume preview area not found."
        );

        return;

    }


    preview.innerHTML = `

        <div class="resume-paper">

            <div class="resume-name">
                ${escapeHTML(fullName)}
            </div>

            <div class="resume-title">
                ${escapeHTML(jobTitle)}
            </div>

            <div class="resume-contact">

                ${contactHTML}

            </div>

            ${summaryHTML}

            ${experienceHTML}

            ${educationHTML}

            ${skillsHTML}

            ${projectHTML}

            ${certificationHTML}

        </div>

    `;


    // =================================================
    // SHOW DOWNLOAD BUTTONS
    // =================================================

    const downloadArea =
        document.getElementById(
            "downloadArea"
        );


    if (downloadArea) {

        downloadArea.style.display =
            "flex";

    }


    // =================================================
    // SAVE RESUME DATA
    // =================================================

    const resumeData = {

        fullName,
        jobTitle,
        email,
        phone,
        location,
        linkedin,
        github,
        summary,

        education: {

            degree,
            college,
            year: educationYear,
            grade

        },

        experience: {

            role: experienceRole,
            company,
            duration: experienceDuration,
            description:
                experienceDescription

        },

        skills,

        project: {

            name: projectName,
            technologies:
                projectTech,
            description:
                projectDescription

        },

        certification: {

            name:
                certificateName,

            organization:
                certificateOrganization

        }

    };


    localStorage.setItem(

        "talentVectorResume",

        JSON.stringify(
            resumeData
        )

    );


    // =================================================
    // SCROLL TO PREVIEW
    // =================================================

    preview.scrollIntoView({

        behavior: "smooth",

        block: "start"

    });

}


// =====================================================
// EDIT RESUME
// =====================================================

function editResume() {

    const fullName =
        document.getElementById(
            "fullName"
        );


    if (fullName) {

        fullName.focus();

    }


    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}


// =====================================================
// PDF DOWNLOAD
// =====================================================

async function downloadPDF() {

    const resumePreview =
        document.getElementById(
            "resumePreview"
        );


    if (!resumePreview) {

        alert(
            "Resume preview not found."
        );

        return;

    }


    const resumePaper =
        resumePreview.querySelector(
            ".resume-paper"
        );


    if (
        !resumePaper ||
        !resumePaper.innerText.trim()
    ) {

        alert(
            "Please generate your resume first."
        );

        return;

    }


    // =================================================
    // CHECK HTML2CANVAS
    // =================================================

    if (
        typeof html2canvas ===
        "undefined"
    ) {

        alert(
            "PDF library is not loaded. Please refresh the page."
        );

        return;

    }


    // =================================================
    // CHECK JSPDF
    // =================================================

    if (
        typeof window.jspdf ===
        "undefined"
        &&
        typeof window.jsPDF ===
        "undefined"
    ) {

        alert(
            "PDF library is not loaded. Please refresh the page."
        );

        return;

    }


    const name =
        getValue("fullName")
        ||
        "Talent-Vector-Resume";


    const filename =

        name

            .replace(
                /[^a-z0-9]/gi,
                "-"
            )

            .replace(
                /-+/g,
                "-"
            )

            +
            "-Resume.pdf";


    // =================================================
    // TEMPORARY PDF CONTAINER
    // =================================================

    const pdfContainer =
        document.createElement(
            "div"
        );


    pdfContainer.style.position =
        "fixed";

    pdfContainer.style.left =
        "-99999px";

    pdfContainer.style.top =
        "0";

    pdfContainer.style.width =
        "794px";

    pdfContainer.style.background =
        "#ffffff";

    pdfContainer.style.padding =
        "0";

    pdfContainer.style.margin =
        "0";

    pdfContainer.style.zIndex =
        "-9999";


    // =================================================
    // CLONE RESUME
    // =================================================

    const pdfResume =
        resumePaper.cloneNode(
            true
        );


    pdfResume.style.width =
        "794px";

    pdfResume.style.maxWidth =
        "794px";

    pdfResume.style.minWidth =
        "794px";

    pdfResume.style.height =
        "auto";

    pdfResume.style.minHeight =
        "1123px";

    pdfResume.style.margin =
        "0";

    pdfResume.style.padding =
        "45px";

    pdfResume.style.boxSizing =
        "border-box";

    pdfResume.style.background =
        "#ffffff";

    pdfResume.style.color =
        "#111111";

    pdfResume.style.position =
        "relative";

    pdfResume.style.left =
        "0";

    pdfResume.style.top =
        "0";

    pdfResume.style.transform =
        "none";

    pdfResume.style.zoom =
        "1";

    pdfResume.style.overflow =
        "visible";

    pdfResume.style.display =
        "block";

    pdfResume.style.boxShadow =
        "none";


    pdfContainer.appendChild(
        pdfResume
    );


    document.body.appendChild(
        pdfContainer
    );


    // =================================================
    // WAIT FOR RENDER
    // =================================================

    await new Promise(
        resolve => {

            requestAnimationFrame(
                () => {

                    requestAnimationFrame(
                        () => {

                            setTimeout(
                                resolve,
                                300
                            );

                        }
                    );

                }
            );

        }
    );


    try {

        // =================================================
        // CREATE CANVAS
        // =================================================

        const canvas =
            await html2canvas(

                pdfResume,

                {

                    scale: 2,

                    useCORS: true,

                    allowTaint: true,

                    backgroundColor:
                        "#ffffff",

                    logging: false,

                    width: 794,

                    windowWidth: 794,

                    scrollX: 0,

                    scrollY: 0

                }

            );


        // =================================================
        // GET JSPDF
        // =================================================

        let PDF;


        if (
            window.jspdf
            &&
            window.jspdf.jsPDF
        ) {

            PDF =
                window.jspdf.jsPDF;

        }


        else if (
            window.jsPDF
        ) {

            PDF =
                window.jsPDF;

        }


        else {

            throw new Error(
                "jsPDF not available."
            );

        }


        // =================================================
        // CREATE A4 PDF
        // =================================================

        const pdf =
            new PDF({

                orientation:
                    "portrait",

                unit:
                    "mm",

                format:
                    "a4",

                compress:
                    true

            });


        const pageWidth =
            210;

        const pageHeight =
            297;


        // =================================================
        // CANVAS DIMENSIONS
        // =================================================

        const canvasWidth =
            canvas.width;

        const canvasHeight =
            canvas.height;


        const pdfWidth =
            pageWidth;


        const pdfHeight =

            (
                canvasHeight *
                pdfWidth
            )
            /
            canvasWidth;


        // =================================================
        // MULTI-PAGE PDF
        // =================================================

        let position = 0;


        let remainingHeight =
            pdfHeight;


        pdf.addImage(

            canvas,

            "JPEG",

            0,

            position,

            pdfWidth,

            pdfHeight,

            undefined,

            "FAST"

        );


        remainingHeight -=
            pageHeight;


        while (
            remainingHeight > 0
        ) {

            position =
                remainingHeight -
                pdfHeight;


            pdf.addPage();


            pdf.addImage(

                canvas,

                "JPEG",

                0,

                position,

                pdfWidth,

                pdfHeight,

                undefined,

                "FAST"

            );


            remainingHeight -=
                pageHeight;

        }


        // =================================================
        // SAVE PDF
        // =================================================

        pdf.save(
            filename
        );


        console.log(
            "Talent Vector PDF downloaded successfully."
        );


    }

    catch (error) {

        console.error(
            "PDF generation error:",
            error
        );


        alert(
            "Unable to create PDF. Please try again."
        );

    }


    // =================================================
    // REMOVE TEMPORARY CONTAINER
    // =================================================

    if (
        pdfContainer
        &&
        pdfContainer.parentNode
    ) {

        pdfContainer.parentNode.removeChild(
            pdfContainer
        );

    }

}


// =====================================================
// LOAD SAVED RESUME
// =====================================================

document.addEventListener(

    "DOMContentLoaded",

    function () {


        const savedResume =
            localStorage.getItem(
                "talentVectorResume"
            );


        if (!savedResume) {

            return;

        }


        try {


            const data =
                JSON.parse(
                    savedResume
                );


            // =================================================
            // PERSONAL INFORMATION
            // =================================================

            if (data.fullName) {

                const element =
                    document.getElementById(
                        "fullName"
                    );

                if (element) {

                    element.value =
                        data.fullName;

                }

            }


            if (data.jobTitle) {

                const element =
                    document.getElementById(
                        "jobTitle"
                    );

                if (element) {

                    element.value =
                        data.jobTitle;

                }

            }


            if (data.email) {

                const element =
                    document.getElementById(
                        "email"
                    );

                if (element) {

                    element.value =
                        data.email;

                }

            }


            if (data.phone) {

                const element =
                    document.getElementById(
                        "phone"
                    );

                if (element) {

                    element.value =
                        data.phone;

                }

            }


            if (data.location) {

                const element =
                    document.getElementById(
                        "location"
                    );

                if (element) {

                    element.value =
                        data.location;

                }

            }


            if (data.linkedin) {

                const element =
                    document.getElementById(
                        "linkedin"
                    );

                if (element) {

                    element.value =
                        data.linkedin;

                }

            }


            if (data.github) {

                const element =
                    document.getElementById(
                        "github"
                    );

                if (element) {

                    element.value =
                        data.github;

                }

            }


            // =================================================
            // SUMMARY
            // =================================================

            if (data.summary) {

                const element =
                    document.getElementById(
                        "summary"
                    );

                if (element) {

                    element.value =
                        data.summary;

                }

            }


            // =================================================
            // EDUCATION
            // =================================================

            if (data.education) {


                const degree =
                    document.getElementById(
                        "degree"
                    );

                if (degree) {

                    degree.value =
                        data.education.degree
                        ||
                        "";

                }


                const college =
                    document.getElementById(
                        "college"
                    );

                if (college) {

                    college.value =
                        data.education.college
                        ||
                        "";

                }


                const educationYear =
                    document.getElementById(
                        "educationYear"
                    );

                if (educationYear) {

                    educationYear.value =
                        data.education.year
                        ||
                        "";

                }


                const grade =
                    document.getElementById(
                        "grade"
                    );

                if (grade) {

                    grade.value =
                        data.education.grade
                        ||
                        "";

                }

            }


            // =================================================
            // EXPERIENCE
            // =================================================

            if (data.experience) {


                const experienceRole =
                    document.getElementById(
                        "experienceRole"
                    );

                if (experienceRole) {

                    experienceRole.value =
                        data.experience.role
                        ||
                        "";

                }


                const company =
                    document.getElementById(
                        "company"
                    );

                if (company) {

                    company.value =
                        data.experience.company
                        ||
                        "";

                }


                const experienceDuration =
                    document.getElementById(
                        "experienceDuration"
                    );

                if (experienceDuration) {

                    experienceDuration.value =
                        data.experience.duration
                        ||
                        "";

                }


                const experienceDescription =
                    document.getElementById(
                        "experienceDescription"
                    );

                if (experienceDescription) {

                    experienceDescription.value =
                        data.experience.description
                        ||
                        "";

                }

            }


            // =================================================
            // SKILLS
            // =================================================

            if (data.skills) {

                const skills =
                    document.getElementById(
                        "skills"
                    );

                if (skills) {

                    skills.value =
                        data.skills;

                }

            }


            // =================================================
            // PROJECT
            // =================================================

            if (data.project) {


                const projectName =
                    document.getElementById(
                        "projectName"
                    );

                if (projectName) {

                    projectName.value =
                        data.project.name
                        ||
                        "";

                }


                const projectTech =
                    document.getElementById(
                        "projectTech"
                    );

                if (projectTech) {

                    projectTech.value =
                        data.project.technologies
                        ||
                        "";

                }


                const projectDescription =
                    document.getElementById(
                        "projectDescription"
                    );

                if (projectDescription) {

                    projectDescription.value =
                        data.project.description
                        ||
                        "";

                }

            }


            // =================================================
            // CERTIFICATION
            // =================================================

            if (data.certification) {


                const certificateName =
                    document.getElementById(
                        "certificateName"
                    );

                if (certificateName) {

                    certificateName.value =
                        data.certification.name
                        ||
                        "";

                }


                const certificateOrganization =
                    document.getElementById(
                        "certificateOrganization"
                    );

                if (certificateOrganization) {

                    certificateOrganization.value =
                        data.certification.organization
                        ||
                        "";

                }

            }


        }

        catch (error) {

            console.error(
                "Saved resume error:",
                error
            );

        }

    }

);