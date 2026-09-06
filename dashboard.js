const resumeFile =
    document.getElementById("resumeFile");

const dropArea =
    document.getElementById("dropArea");

const fileInfo =
    document.getElementById("fileInfo");

const fileName =
    document.getElementById("fileName");

const fileSize =
    document.getElementById("fileSize");

const analyzeBtn =
    document.getElementById("analyzeBtn");

const userName =
    document.getElementById("userName");


// =====================================================
// SHOW USER NAME
// =====================================================

const savedUser =
    JSON.parse(
        localStorage.getItem("talentVectorUser")
    );

if (savedUser && userName) {

    userName.textContent =
        savedUser.name;

}


// =====================================================
// FILE SELECT
// =====================================================

if (resumeFile) {

    resumeFile.addEventListener(
        "change",
        function () {

            if (this.files.length > 0) {

                showFile(
                    this.files[0]
                );

            }

        }
    );

}


// =====================================================
// SHOW FILE
// =====================================================

function showFile(file) {

    const allowedTypes = [

        "application/pdf",

        "application/msword",

        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"

    ];


    if (!allowedTypes.includes(file.type)) {

        alert(
            "Please upload a PDF, DOC or DOCX file."
        );

        resumeFile.value = "";

        return;

    }


    fileName.textContent =
        file.name;


    fileSize.textContent =
        formatFileSize(file.size);


    fileInfo.classList.remove(
        "hidden"
    );


    analyzeBtn.disabled = false;

}


// =====================================================
// FILE SIZE
// =====================================================

function formatFileSize(bytes) {

    if (bytes < 1024) {

        return bytes + " Bytes";

    }


    if (bytes < 1024 * 1024) {

        return (
            (bytes / 1024).toFixed(1)
            +
            " KB"
        );

    }


    return (
        (bytes / (1024 * 1024)).toFixed(1)
        +
        " MB"
    );

}


// =====================================================
// REMOVE FILE
// =====================================================

function removeFile() {

    resumeFile.value = "";

    fileInfo.classList.add(
        "hidden"
    );

    analyzeBtn.disabled = true;

}


// =====================================================
// DRAG & DROP
// =====================================================

if (dropArea) {

    dropArea.addEventListener(
        "dragover",
        function (event) {

            event.preventDefault();

            dropArea.classList.add(
                "dragging"
            );

        }
    );


    dropArea.addEventListener(
        "dragleave",
        function () {

            dropArea.classList.remove(
                "dragging"
            );

        }
    );


    dropArea.addEventListener(
        "drop",
        function (event) {

            event.preventDefault();

            dropArea.classList.remove(
                "dragging"
            );


            const files =
                event.dataTransfer.files;


            if (files.length > 0) {

                resumeFile.files =
                    files;

                showFile(
                    files[0]
                );

            }

        }
    );

}


// =====================================================
// JOB REQUIREMENTS
// =====================================================

const jobRequirements = {

    "Full Stack Developer": [

        "html",
        "css",
        "javascript",
        "react",
        "node.js",
        "sql"

    ],


    "Software Developer": [

        "python",
        "java",
        "javascript",
        "git",
        "sql",
        "software development"

    ],


    "Frontend Developer": [

        "html",
        "css",
        "javascript",
        "react",
        "git"

    ],


    "Backend Developer": [

        "python",
        "java",
        "node.js",
        "sql",
        "apis",
        "server"

    ],


    "IT Project Manager": [

        "sdlc",
        "agile",
        "project management",
        "jira",
        "user stories",
        "tasks"

    ],


    "Technical Project Manager": [

        "project management",
        "saas",
        "agile",
        "jira",
        "apis",
        "server"

    ],


    "IT Manager": [

        "python",
        "apis",
        "server",
        "network infrastructure",
        "project management",
        "saas"

    ],


    "Technology Manager": [

        "python",
        "sdlc",
        "project management",
        "apis",
        "server",
        "network infrastructure"

    ],


    "IT Operations Manager": [

        "server",
        "network infrastructure",
        "it operations",
        "system administration",
        "project management",
        "leadership"

    ],


    "Cloud / Technology Manager": [

        "aws",
        "azure",
        "cloud computing",
        "python",
        "apis",
        "project management"

    ],


    "IT Business Analyst": [

        "sdlc",
        "business analysis",
        "data analysis",
        "user stories",
        "jira",
        "requirements"

    ],


    "Product / Business Analyst": [

        "business analysis",
        "product management",
        "user stories",
        "product backlog",
        "epics",
        "features"

    ]

};


// =====================================================
// NORMALIZE SKILL
// =====================================================

function normalizeSkill(skill) {

    return String(skill)
        .toLowerCase()
        .trim();

}


// =====================================================
// CREATE JOB DETAILS
// IMPORTANT:
// SCORE COMES ONLY FROM BACKEND
// =====================================================

function createJobDetails(
    job,
    backendMatchedSkills,
    allResumeSkills
) {

    const role =
        job.role || "";


    const requirements =
        jobRequirements[role] || [];


    const resumeSkills =
        (allResumeSkills || [])
            .map(normalizeSkill);


    let matchedSkills = [];


    // -------------------------------------------------
    // BACKEND MATCHED SKILLS
    // -------------------------------------------------

    if (
        backendMatchedSkills &&
        backendMatchedSkills.length > 0
    ) {

        matchedSkills =
            backendMatchedSkills
                .map(normalizeSkill);

    }


    // -------------------------------------------------
    // ADD RESUME SKILLS
    // ONLY FOR DISPLAY
    // -------------------------------------------------

    requirements.forEach(
        skill => {

            const normalized =
                normalizeSkill(skill);


            if (
                resumeSkills.includes(
                    normalized
                )
                &&
                !matchedSkills.includes(
                    normalized
                )
            ) {

                matchedSkills.push(
                    normalized
                );

            }

        }
    );


    // -------------------------------------------------
    // MISSING SKILLS
    // -------------------------------------------------

    const missingSkills =
        requirements.filter(
            skill => {

                return !matchedSkills.includes(
                    normalizeSkill(skill)
                );

            }
        );


    // -------------------------------------------------
    // BACKEND SCORE ONLY
    // -------------------------------------------------

    let percentage =
        Number(
            job.match_percentage
        );


    if (
        Number.isNaN(percentage)
    ) {

        percentage = 0;

    }


    percentage =
        Math.round(
            percentage
        );


    // Safety limit
    percentage =
        Math.min(
            percentage,
            95
        );


    return {

        role:
            role,

        percentage:
            percentage,

        matched:
            matchedSkills,

        missing:
            missingSkills,

        matchLevel:
            job.match_level || "",

        reason:
            job.reason || ""

    };

}


// =====================================================
// FORMAT SKILL NAME
// =====================================================

function formatSkillName(skill) {

    const names = {

        "html":
            "HTML",

        "css":
            "CSS",

        "javascript":
            "JavaScript",

        "typescript":
            "TypeScript",

        "node.js":
            "Node.js",

        "sql":
            "SQL",

        "python":
            "Python",

        "java":
            "Java",

        "git":
            "Git",

        "github":
            "GitHub",

        "apis":
            "APIs",

        "api":
            "API",

        "server":
            "Server",

        "aws":
            "AWS",

        "azure":
            "Azure",

        "sdlc":
            "SDLC",

        "agile":
            "Agile",

        "jira":
            "Jira",

        "saas":
            "SaaS",

        "react":
            "React",

        "project management":
            "Project Management",

        "network infrastructure":
            "Network Infrastructure",

        "software development":
            "Software Development",

        "business analysis":
            "Business Analysis",

        "data analysis":
            "Data Analysis",

        "user stories":
            "User Stories",

        "product management":
            "Product Management",

        "product backlog":
            "Product Backlog",

        "system administration":
            "System Administration",

        "it operations":
            "IT Operations",

        "leadership":
            "Leadership",

        "requirements":
            "Requirements",

        "requirements gathering":
            "Requirements Gathering",

        "risk management":
            "Risk Management",

        "stakeholder management":
            "Stakeholder Management",

        "team management":
            "Team Management",

        "epics":
            "Epics",

        "features":
            "Features",

        "tasks":
            "Tasks"

    };


    return (
        names[
            normalizeSkill(skill)
        ]
        ||
        skill
    );

}


// =====================================================
// START AI ANALYSIS
// =====================================================

function startAnalysis() {

    if (
        !resumeFile ||
        !resumeFile.files.length
    ) {

        alert(
            "Please upload your resume first."
        );

        return;

    }


    const file =
        resumeFile.files[0];


    analyzeBtn.disabled = true;


    analyzeBtn.textContent =
        "🧠 AI is analyzing your resume...";


    const formData =
        new FormData();


    formData.append(
        "resume",
        file
    );


    fetch(
        "http://127.0.0.1:5000/api/upload-resume",
        {

            method: "POST",

            body: formData

        }
    )


    .then(
        response => {

            if (!response.ok) {

                throw new Error(
                    "Server returned an error."
                );

            }


            return response.json();

        }
    )


    .then(
        data => {

            if (!data.success) {

                throw new Error(
                    data.message ||
                    "Analysis failed."
                );

            }


            console.log(
                "Talent Vector Analysis:",
                data.analysis
            );


            const analysis =
                data.analysis;


            // =================================================
            // JOB MATCHING
            // =================================================

            const jobMatchingResult =
                document.getElementById(
                    "jobMatchingResult"
                );


            const jobMatchingStatus =
                document.getElementById(
                    "jobMatchingStatus"
                );


            if (jobMatchingResult) {

                if (

                    analysis.job_match_details
                    &&
                    analysis.job_match_details.length > 0

                ) {

                    jobMatchingResult.innerHTML =

                        analysis.job_match_details
                            .map(
                                job => {

                                    const details =
                                        createJobDetails(
                                            job,
                                            job.matched_skills,
                                            analysis.skills || []
                                        );


                                    // -------------------------------------------------
                                    // MATCHED HTML
                                    // -------------------------------------------------

                                    const matchedHTML =

                                        details.matched.length > 0

                                            ?

                                        details.matched
                                            .map(
                                                skill =>

                                                    `<span style="
                                                        display:inline-block;
                                                        background:#e7f7ed;
                                                        color:#25834a;
                                                        padding:4px 7px;
                                                        border-radius:12px;
                                                        margin:3px;
                                                        font-size:9px;
                                                        font-weight:600;
                                                    ">
                                                        ✓ ${formatSkillName(skill)}
                                                    </span>`
                                            )
                                            .join("")

                                            :

                                        `<span style="
                                            color:#888;
                                            font-size:9px;
                                        ">
                                            No matched skills detected
                                        </span>`;


                                    // -------------------------------------------------
                                    // MISSING HTML
                                    // -------------------------------------------------

                                    const missingHTML =

                                        details.missing.length > 0

                                            ?

                                        details.missing
                                            .map(
                                                skill =>

                                                    `<span style="
                                                        display:inline-block;
                                                        background:#ffe5e5;
                                                        color:#d33;
                                                        padding:4px 7px;
                                                        border-radius:12px;
                                                        margin:3px;
                                                        font-size:9px;
                                                        font-weight:600;
                                                    ">
                                                        ! ${formatSkillName(skill)}
                                                    </span>`
                                            )
                                            .join("")

                                            :

                                        `<span style="
                                            background:#e7f7ed;
                                            color:#25834a;
                                            padding:4px 7px;
                                            border-radius:12px;
                                            font-size:9px;
                                            font-weight:600;
                                            padding:4px 8px;
                                        ">
                                            ✓ No major gaps
                                        </span>`;


                                    // -------------------------------------------------
                                    // MATCH LEVEL
                                    // -------------------------------------------------

                                    const matchLevelHTML =

                                        details.matchLevel

                                            ?

                                        `<div style="
                                            margin-top:5px;
                                            font-size:9px;
                                            color:#7545d9;
                                            font-weight:600;
                                        ">
                                            ${details.matchLevel}
                                        </div>`

                                            :

                                        "";


                                    // -------------------------------------------------
                                    // WHY JOB
                                    // -------------------------------------------------

                                    const reasonText =
                                        details.reason
                                            ||
                                        `Your resume has a ${details.percentage}% alignment with this role.`;


                                    return `

                                        <div style="
                                            margin-bottom:20px;
                                            padding-bottom:16px;
                                            border-bottom:1px solid #eeeeee;
                                        ">


                                            <!-- ROLE HEADER -->

                                            <div style="
                                                display:flex;
                                                justify-content:space-between;
                                                align-items:center;
                                                gap:8px;
                                            ">

                                                <strong style="
                                                    font-size:12px;
                                                    color:#292b50;
                                                ">

                                                    ${details.role}

                                                </strong>


                                                <span style="
                                                    background:#eee7ff;
                                                    color:#7545d9;
                                                    padding:5px 9px;
                                                    border-radius:20px;
                                                    font-size:9px;
                                                    font-weight:bold;
                                                    white-space:nowrap;
                                                ">

                                                    ${details.percentage}% Match

                                                </span>

                                            </div>


                                            ${matchLevelHTML}


                                            <!-- PROGRESS BAR -->

                                            <div style="
                                                margin-top:8px;
                                                height:6px;
                                                background:#eeeeee;
                                                border-radius:10px;
                                                overflow:hidden;
                                            ">

                                                <div style="
                                                    width:${details.percentage}%;
                                                    height:100%;
                                                    background:linear-gradient(
                                                        90deg,
                                                        #7036ff,
                                                        #a337ef
                                                    );
                                                    border-radius:10px;
                                                ">
                                                </div>

                                            </div>


                                            <!-- MATCHED SKILLS -->

                                            <div style="
                                                margin-top:10px;
                                            ">

                                                <strong style="
                                                    display:block;
                                                    font-size:9px;
                                                    color:#25834a;
                                                    margin-bottom:4px;
                                                ">

                                                    ✓ Matched Skills

                                                </strong>

                                                ${matchedHTML}

                                            </div>


                                            <!-- MISSING SKILLS -->

                                            <div style="
                                                margin-top:8px;
                                            ">

                                                <strong style="
                                                    display:block;
                                                    font-size:9px;
                                                    color:#d33;
                                                    margin-bottom:4px;
                                                ">

                                                    ! Missing Skills

                                                </strong>

                                                ${missingHTML}

                                            </div>


                                            <!-- WHY THIS JOB -->

                                            <div style="
                                                margin-top:10px;
                                                background:#f8f6ff;
                                                padding:8px;
                                                border-radius:8px;
                                            ">

                                                <strong style="
                                                    font-size:9px;
                                                    color:#7545d9;
                                                ">

                                                    💡 Why this job?

                                                </strong>


                                                <p style="
                                                    margin-top:4px;
                                                    font-size:9px;
                                                    color:#777;
                                                    line-height:1.5;
                                                ">

                                                    ${reasonText}

                                                </p>

                                            </div>

                                        </div>

                                    `;

                                }
                            )
                            .join("");

                }


                else {

                    jobMatchingResult.innerHTML = `

                        <div style="
                            padding:10px;
                            color:#777;
                            font-size:12px;
                        ">

                            No matching jobs detected yet.

                        </div>

                    `;

                }

            }


            if (jobMatchingStatus) {

                jobMatchingStatus.textContent =
                    "AI match analysis complete";

            }


            // =================================================
            // SKILL GAP
            // =================================================

            const skillGapResult =
                document.getElementById(
                    "skillGapResult"
                );


            const skillGapStatus =
                document.getElementById(
                    "skillGapStatus"
                );


            if (skillGapResult) {

                if (

                    analysis.skill_gap_details
                    &&
                    analysis.skill_gap_details.length > 0

                ) {

                    skillGapResult.innerHTML =

                        analysis.skill_gap_details
                            .map(
                                item => {

                                    let priorityBackground =
                                        "#eee7ff";

                                    let priorityColor =
                                        "#7545d9";


                                    if (
                                        item.priority === "High"
                                    ) {

                                        priorityBackground =
                                            "#ffe5e5";

                                        priorityColor =
                                            "#d33";

                                    }


                                    else if (
                                        item.priority === "Medium"
                                    ) {

                                        priorityBackground =
                                            "#fff2d6";

                                        priorityColor =
                                            "#b87900";

                                    }


                                    else if (
                                        item.priority === "Low"
                                    ) {

                                        priorityBackground =
                                            "#e7f7ed";

                                        priorityColor =
                                            "#25834a";

                                    }


                                    return `

                                        <div style="
                                            margin-bottom:18px;
                                            padding-bottom:14px;
                                            border-bottom:1px solid #eeeeee;
                                        ">

                                            <div style="
                                                display:flex;
                                                justify-content:space-between;
                                                align-items:center;
                                                gap:8px;
                                            ">

                                                <strong style="
                                                    font-size:12px;
                                                    color:#292b50;
                                                ">

                                                    ${item.skill}

                                                </strong>


                                                <span style="
                                                    margin:0;
                                                    padding:4px 8px;
                                                    border-radius:20px;
                                                    background:${priorityBackground};
                                                    color:${priorityColor};
                                                    font-size:9px;
                                                    font-weight:bold;
                                                ">

                                                    ${item.priority} Priority

                                                </span>

                                            </div>

                                        </div>

                                    `;

                                }
                            )
                            .join("");

                }


                else {

                    skillGapResult.innerHTML = `

                        <strong>
                            🎉 Excellent!
                        </strong>

                        <br><br>

                        No major skill gaps detected.

                    `;

                }

            }


            if (skillGapStatus) {

                skillGapStatus.textContent =
                    "Priority-based skill analysis";

            }


            // =================================================
            // LEARNING ROADMAP
            // =================================================

            const learningRoadmapResult =
                document.getElementById(
                    "learningRoadmapResult"
                );


            const learningRoadmapStatus =
                document.getElementById(
                    "learningRoadmapStatus"
                );


            if (learningRoadmapResult) {

                if (

                    analysis.learning_roadmap
                    &&
                    analysis.learning_roadmap.length > 0

                ) {

                    learningRoadmapResult.innerHTML =

                        analysis.learning_roadmap
                            .map(
                                step => `

                                    <div style="
                                        margin-bottom:8px;
                                        padding:7px 9px;
                                        background:#f8f6ff;
                                        border-radius:7px;
                                        font-size:10px;
                                        line-height:1.4;
                                        color:#555;
                                    ">

                                        ${step}

                                    </div>

                                `
                            )
                            .join("");

                }


                else {

                    learningRoadmapResult.textContent =
                        "No roadmap available yet.";

                }

            }


            if (learningRoadmapStatus) {

                learningRoadmapStatus.textContent =
                    "Roadmap generated";

            }


            // =================================================
            // CAREER PROFILE
            // =================================================

            const careerProfileResult =
                document.getElementById(
                    "careerProfileResult"
                );


            const careerProfileStatus =
                document.getElementById(
                    "careerProfileStatus"
                );


            if (careerProfileResult) {

                const profile =
                    analysis.career_profile;


                if (profile) {

                    const roles =

                        profile.recommended_roles
                        &&
                        profile.recommended_roles.length > 0

                            ?

                        profile.recommended_roles.join(
                            ", "
                        )

                            :

                        "No roles detected yet.";


                    const strengths =

                        profile.strengths
                        &&
                        profile.strengths.length > 0

                            ?

                        profile.strengths.join(
                            ", "
                        )

                            :

                        "No strengths detected yet.";


                    careerProfileResult.innerHTML =

                        "<strong>Role:</strong> " +

                        profile.primary_role +

                        "<br><br>" +


                        "<strong>Experience:</strong> " +

                        profile.experience +

                        "<br><br>" +


                        "<strong>Strengths:</strong> " +

                        strengths +

                        "<br><br>" +


                        "<strong>Recommended Roles:</strong> " +

                        roles;

                }


                else {

                    careerProfileResult.textContent =
                        "Career profile could not be generated.";

                }

            }


            if (careerProfileStatus) {

                careerProfileStatus.textContent =
                    "AI profile generated";

            }


            // =================================================
            // SAVE ANALYSIS
            // =================================================

            localStorage.setItem(
                "resumeUploaded",
                "true"
            );


            localStorage.setItem(
                "resumeAnalysis",
                JSON.stringify(
                    data.analysis
                )
            );


            // =================================================
            // SUCCESS MESSAGE
            // =================================================

            alert(

                "Resume analyzed successfully! 🎉\n\n" +

                "Skills detected: " +

                (
                    data.analysis.skills || []
                ).join(", ") +

                "\n\nExperience: " +

                data.analysis.experience

            );


            // =================================================
            // RESET BUTTON
            // =================================================

            analyzeBtn.disabled = false;


            analyzeBtn.textContent =
                "🧠 Analyze My Resume";

        }
    )


    .catch(
        error => {

            console.error(
                "Talent Vector Error:",
                error
            );


            alert(

                "Unable to connect to AI backend.\n\n" +

                error.message

            );


            analyzeBtn.disabled = false;


            analyzeBtn.textContent =
                "🧠 Analyze My Resume";

        }
    );

}


// =====================================================
// LOGOUT
// =====================================================

function logout() {

    localStorage.removeItem(
        "talentVectorLoggedIn"
    );


    window.location.href =
        "login.html";

}