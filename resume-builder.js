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
// PDF DOWNLOAD - PRINT / SAVE AS PDF
// =====================================================

function downloadPDF() {

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
    // GET RESUME NAME
    // =================================================

    const name =
        getValue("fullName")
        ||
        "Talent Vector Resume";


    // =================================================
    // OPEN PRINT WINDOW
    // =================================================

    const printWindow =
        window.open(
            "",
            "_blank"
        );


    if (!printWindow) {

        alert(
            "Please allow pop-ups for this website to print your resume."
        );

        return;

    }


    // =================================================
    // PRINT DOCUMENT
    // =================================================

    printWindow.document.open();

    printWindow.document.write(`

        <!DOCTYPE html>

        <html>

        <head>

            <meta charset="UTF-8">

            <meta
                name="viewport"
                content="width=device-width, initial-scale=1.0"
            >

            <title>
                ${escapeHTML(name)} - Resume
            </title>


            <style>

                /* =========================================
                   PAGE
                ========================================= */

                @page {

                    size: A4;

                    margin: 0;

                }


                /* =========================================
                   RESET
                ========================================= */

                * {

                    box-sizing: border-box;

                }


                html,
                body {

                    margin: 0;

                    padding: 0;

                    width: 210mm;

                    min-height: 297mm;

                    background: #ffffff;

                }


                body {

                    font-family: Arial, sans-serif;

                    color: #252525;

                }


                /* =========================================
                   RESUME PAPER
                ========================================= */

                .resume-paper {

                    width: 210mm;

                    min-height: 297mm;

                    padding: 15mm;

                    margin: 0;

                    background: #ffffff;

                    color: #252525;

                    font-family: Arial, sans-serif;

                    line-height: 1.5;

                    box-sizing: border-box;

                    animation: none !important;

                    transition: none !important;

                    transform: none !important;

                    opacity: 1 !important;

                    visibility: visible !important;

                    box-shadow: none !important;

                    overflow: visible !important;

                }


                /* =========================================
                   NAME
                ========================================= */

                .resume-name {

                    font-size: 30px;

                    font-weight: 800;

                    color: #222222;

                    margin-bottom: 3px;

                }


                /* =========================================
                   JOB TITLE
                ========================================= */

                .resume-title {

                    color: #7036ff;

                    font-size: 14px;

                    font-weight: 700;

                    margin-bottom: 10px;

                }


                /* =========================================
                   CONTACT
                ========================================= */

                .resume-contact {

                    display: flex;

                    flex-wrap: wrap;

                    gap: 6px 14px;

                    padding-bottom: 15px;

                    border-bottom: 2px solid #7036ff;

                    font-size: 9px;

                    color: #666666;

                }


                /* =========================================
                   SECTIONS
                ========================================= */

                .resume-section {

                    margin-top: 19px;

                    animation: none !important;

                    transition: none !important;

                    transform: none !important;

                    opacity: 1 !important;

                    visibility: visible !important;

                    break-inside: avoid;

                    page-break-inside: avoid;

                }


                /* =========================================
                   SECTION TITLES
                ========================================= */

                .resume-section-title {

                    font-size: 12px;

                    font-weight: 800;

                    color: #7036ff;

                    text-transform: uppercase;

                    margin-bottom: 7px;

                    padding-bottom: 4px;

                    border-bottom: 1px solid #e6e1f5;

                }


                /* =========================================
                   SUMMARY
                ========================================= */

                .resume-summary {

                    font-size: 10px;

                    color: #555555;

                }


                /* =========================================
                   ITEMS
                ========================================= */

                .resume-item {

                    margin-bottom: 11px;

                    break-inside: avoid;

                    page-break-inside: avoid;

                }


                .resume-item-title {

                    font-size: 11px;

                    font-weight: 800;

                    color: #333333;

                }


                .resume-item-subtitle {

                    font-size: 9px;

                    color: #777777;

                    margin-top: 2px;

                }


                .resume-item-description {

                    margin-top: 5px;

                    font-size: 9px;

                    color: #555555;

                    white-space: pre-line;

                }


                /* =========================================
                   SKILLS
                ========================================= */

                .resume-skills {

                    display: flex;

                    flex-wrap: wrap;

                    gap: 5px;

                }


                .resume-skill {

                    display: inline-block;

                    background: #f0ebff;

                    color: #6333d5;

                    padding: 4px 7px;

                    border-radius: 5px;

                    font-size: 8px;

                    font-weight: 700;

                }


                /* =========================================
                   REMOVE ALL ANIMATIONS
                ========================================= */

                .resume-paper *,
                .resume-paper *::before,
                .resume-paper *::after {

                    animation: none !important;

                    transition: none !important;

                    transform: none !important;

                    opacity: 1 !important;

                    visibility: visible !important;

                }


                /* =========================================
                   PRINT
                ========================================= */

                @media print {

                    html,
                    body {

                        width: 210mm;

                        min-height: 297mm;

                        margin: 0;

                        padding: 0;

                        background: #ffffff;

                    }


                    .resume-paper {

                        width: 210mm;

                        min-height: 297mm;

                        margin: 0;

                        padding: 15mm;

                    }

                }

            </style>

        </head>


        <body>

            ${resumePaper.outerHTML}

        </body>

        </html>

    `);


    printWindow.document.close();


    // =================================================
    // PRINT AFTER PAGE LOAD
    // =================================================

    printWindow.onload = function () {

        setTimeout(
            function () {

                printWindow.focus();

                printWindow.print();

            },
            600
        );

    };

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