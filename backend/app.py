from flask import Flask, request, jsonify
from flask_cors import CORS

from PyPDF2 import PdfReader
from docx import Document

import os
import re
import json
from datetime import datetime

from dotenv import load_dotenv
from google import genai


# =========================================================
# APP SETUP
# =========================================================

load_dotenv(
    os.path.join(
        os.path.dirname(__file__),
        ".env"
    ),
    override=True
)

app = Flask(__name__)
CORS(app)


# =========================================================
# GEMINI AI SETUP
# =========================================================

GEMINI_API_KEY = os.getenv(
    "GEMINI_API_KEY"
)

if GEMINI_API_KEY:

    gemini_client = genai.Client(
    api_key=GEMINI_API_KEY,
    http_options={"timeout": 15000}
)

else:

    gemini_client = None


# =========================================================
# UPLOAD FOLDER
# =========================================================

UPLOAD_FOLDER = "uploads"

os.makedirs(
    UPLOAD_FOLDER,
    exist_ok=True
)

app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER


# =========================================================
# ALLOWED FILES
# =========================================================

ALLOWED_EXTENSIONS = {
    "pdf",
    "doc",
    "docx"
}


def allowed_file(filename):

    return (
        "."
        in filename
        and
        filename.rsplit(".", 1)[1].lower()
        in ALLOWED_EXTENSIONS
    )


# =========================================================
# PDF TEXT EXTRACTION
# =========================================================

def extract_pdf_text(file_path):

    text = ""

    reader = PdfReader(file_path)

    for page in reader.pages:

        page_text = page.extract_text()

        if page_text:

            text += page_text + "\n"

    return text


# =========================================================
# DOCX TEXT EXTRACTION
# =========================================================

def extract_docx_text(file_path):

    document = Document(file_path)

    text = ""

    for paragraph in document.paragraphs:

        if paragraph.text.strip():

            text += paragraph.text + "\n"

    return text


# =========================================================
# RESUME TEXT EXTRACTION
# =========================================================

def extract_resume_text(file_path):

    extension = (
        file_path
        .rsplit(".", 1)[1]
        .lower()
    )

    if extension == "pdf":

        return extract_pdf_text(
            file_path
        )

    elif extension == "docx":

        return extract_docx_text(
            file_path
        )

    elif extension == "doc":

        return (
            "DOC format detected. "
            "Please use DOCX for best text extraction."
        )

    return ""


# =========================================================
# SKILL DETECTION
# =========================================================

def detect_skills(text):

    skills_database = [

        # PROGRAMMING
        "Python",
        "Java",
        "JavaScript",
        "TypeScript",
        "C++",
        "C",
        "C#",
        "PHP",
        "Go",
        "Ruby",

        # WEB
        "HTML",
        "CSS",
        "React",
        "Angular",
        "Vue",
        "Node.js",
        "Express",
        "Next.js",

        # DATABASE
        "SQL",
        "MySQL",
        "PostgreSQL",
        "MongoDB",
        "Oracle",
        "Redis",

        # AI / ML
        "Machine Learning",
        "Deep Learning",
        "Artificial Intelligence",
        "NLP",
        "Data Science",
        "TensorFlow",
        "PyTorch",

        # ANALYTICS
        "Excel",
        "Power BI",
        "Tableau",
        "Data Analysis",

        # CLOUD
        "AWS",
        "Azure",
        "Google Cloud",
        "Cloud Computing",

        # TOOLS
        "Git",
        "GitHub",
        "Docker",
        "Kubernetes",
        "Jira",

        # IT / MANAGEMENT
        "SDLC",
        "Agile",
        "Lean",
        "APIs",
        "API",
        "Server",
        "Network Infrastructure",
        "Project Management",
        "Business Analysis",
        "Product Management",
        "User Stories",
        "Product Backlog",
        "Epics",
        "Features",
        "Tasks",
        "Vendor Management",
        "SaaS",

        # PROFESSIONAL
        "Requirements",
        "Requirements Gathering",
        "Stakeholder Management",
        "Risk Management",
        "Team Management",
        "Leadership",
        "Software Development",
        "IT Management",
        "IT Operations",
        "System Administration",
        "Cybersecurity"
    ]

    found_skills = []

    for skill in skills_database:

        if skill == "C":

            pattern = r"\bC\b"

        elif skill == "C++":

            pattern = r"(?<!\w)C\+\+(?!\w)"

        elif skill == "C#":

            pattern = r"(?<!\w)C#(?!\w)"

        elif skill == "Node.js":

            pattern = r"\bNode\.js\b"

        elif skill == "API":

            pattern = r"\bAPI\b"

        elif skill == "APIs":

            pattern = r"\bAPIs\b"

        else:

            pattern = (
                r"\b"
                +
                re.escape(skill)
                +
                r"\b"
            )

        if re.search(
            pattern,
            text,
            re.IGNORECASE
        ):

            found_skills.append(
                skill
            )

    # Remove API duplicate
    if (
        "API" in found_skills
        and
        "APIs" in found_skills
    ):

        found_skills.remove(
            "API"
        )

    return found_skills


# =========================================================
# DATE PARSER
# =========================================================

def parse_resume_date(date_text):

    formats = [
        "%B %Y",
        "%b %Y"
    ]

    for fmt in formats:

        try:

            return datetime.strptime(
                date_text.strip(),
                fmt
            )

        except ValueError:

            continue

    return None


# =========================================================
# EXPERIENCE DETECTION
# =========================================================

def detect_experience(text):

    work_match = re.search(
        r"WORK EXPERIENCE(.*)",
        text,
        re.IGNORECASE | re.DOTALL
    )

    if not work_match:

        return "Not detected"

    work_text = work_match.group(1)

    pattern = (
        r"([A-Za-z]+\s+\d{4})"
        r"\s*[-–/]\s*"
        r"(current|present|[A-Za-z]+\s+\d{4})"
    )

    matches = re.findall(
        pattern,
        work_text,
        re.IGNORECASE
    )

    total_months = 0

    for start_date, end_date in matches:

        start = parse_resume_date(
            start_date
        )

        if end_date.lower() in [
            "current",
            "present"
        ]:

            end = datetime.now()

        else:

            end = parse_resume_date(
                end_date
            )

        if start and end:

            months = (
                (end.year - start.year) * 12
                +
                (end.month - start.month)
            )

            if months > 0:

                total_months += months

    if total_months == 0:

        return "Not detected"

    years = total_months / 12

    return f"{years:.1f}+ Years"


# =========================================================
# EXPERIENCE TO NUMBER
# =========================================================

def experience_to_years(experience):

    match = re.search(
        r"(\d+(?:\.\d+)?)",
        experience
    )

    if match:

        return float(
            match.group(1)
        )

    return 0


# =========================================================
# JOB DATABASE
# =========================================================

def get_job_roles():

    return {

        "IT Manager": {

            "core_skills": [
                "python",
                "project management",
                "server",
                "network infrastructure",
                "saas",
                "apis"
            ],

            "supporting_skills": [
                "sdlc",
                "agile",
                "jira",
                "lean"
            ],

            "keywords": [
                "it manager",
                "information technology manager",
                "it management"
            ],

            "minimum_experience": 4
        },

        "Technology Manager": {

            "core_skills": [
                "sdlc",
                "server",
                "network infrastructure",
                "project management",
                "leadership",
                "it management"
            ],

            "supporting_skills": [
                "python",
                "apis",
                "agile",
                "jira"
            ],

            "keywords": [
                "technology manager",
                "technology management",
                "technology leadership"
            ],

            "minimum_experience": 4
        },

        "Technical Project Manager": {

            "core_skills": [
                "project management",
                "agile",
                "jira",
                "risk management",
                "stakeholder management",
                "team management"
            ],

            "supporting_skills": [
                "saas",
                "apis",
                "server",
                "sdlc"
            ],

            "keywords": [
                "technical project manager",
                "technical project",
                "technology project"
            ],

            "minimum_experience": 3
        },

        "IT Project Manager": {

            "core_skills": [
                "project management",
                "agile",
                "jira",
                "sdlc",
                "user stories",
                "tasks"
            ],

            "supporting_skills": [
                "risk management",
                "stakeholder management",
                "saas"
            ],

            "keywords": [
                "it project manager",
                "project manager",
                "project management",
                "delivery manager"
            ],

            "minimum_experience": 3
        },

        "IT Business Analyst": {

            "core_skills": [
                "business analysis",
                "requirements",
                "requirements gathering",
                "user stories",
                "sdlc",
                "jira"
            ],

            "supporting_skills": [
                "data analysis",
                "sql",
                "project management"
            ],

            "keywords": [
                "it business analyst",
                "business analyst",
                "business analysis",
                "requirements analyst"
            ],

            "minimum_experience": 2
        },

        "Product / Business Analyst": {

            "core_skills": [
                "business analysis",
                "product management",
                "user stories",
                "product backlog",
                "epics",
                "features"
            ],

            "supporting_skills": [
                "requirements",
                "data analysis",
                "jira"
            ],

            "keywords": [
                "product analyst",
                "product manager",
                "product owner",
                "business analyst"
            ],

            "minimum_experience": 2
        },

        "IT Operations Manager": {

            "core_skills": [
                "server",
                "network infrastructure",
                "it operations",
                "system administration",
                "leadership",
                "project management"
            ],

            "supporting_skills": [
                "cybersecurity",
                "jira",
                "agile"
            ],

            "keywords": [
                "it operations manager",
                "operations manager",
                "infrastructure manager",
                "system administrator"
            ],

            "minimum_experience": 4
        },

        "Cloud / Technology Manager": {

            "core_skills": [
                "aws",
                "azure",
                "cloud computing",
                "project management",
                "apis",
                "server"
            ],

            "supporting_skills": [
                "python",
                "network infrastructure",
                "sdlc"
            ],

            "keywords": [
                "cloud manager",
                "cloud technology",
                "cloud infrastructure",
                "cloud engineer"
            ],

            "minimum_experience": 3
        },

        "Software Developer": {

            "core_skills": [
                "python",
                "java",
                "javascript",
                "software development",
                "git"
            ],

            "supporting_skills": [
                "sql",
                "apis"
            ],

            "keywords": [
                "software developer",
                "software engineer",
                "application developer"
            ],

            "minimum_experience": 1
        },

        "Python Developer": {

            "core_skills": [
                "python",
                "git",
                "apis",
                "sql"
            ],

            "supporting_skills": [
                "django",
                "flask"
            ],

            "keywords": [
                "python developer",
                "python engineer",
                "python development"
            ],

            "minimum_experience": 1
        },

        "Full Stack Developer": {

            "core_skills": [
                "javascript",
                "html",
                "css",
                "react",
                "node.js"
            ],

            "supporting_skills": [
                "sql",
                "git"
            ],

            "keywords": [
                "full stack",
                "full-stack developer",
                "web developer"
            ],

            "minimum_experience": 1
        },

        "Frontend Developer": {

            "core_skills": [
                "javascript",
                "html",
                "css",
                "react",
                "typescript"
            ],

            "supporting_skills": [
                "git",
                "vue",
                "angular"
            ],

            "keywords": [
                "frontend developer",
                "front-end developer",
                "frontend engineer",
                "ui developer"
            ],

            "minimum_experience": 1
        },

        "Backend Developer": {

            "core_skills": [
                "python",
                "java",
                "node.js",
                "sql",
                "apis"
            ],

            "supporting_skills": [
                "git",
                "server"
            ],

            "keywords": [
                "backend developer",
                "back-end developer",
                "backend engineer",
                "server-side"
            ],

            "minimum_experience": 1
        },

        "Data Analyst": {

            "core_skills": [
                "sql",
                "excel",
                "data analysis",
                "power bi",
                "tableau"
            ],

            "supporting_skills": [
                "python",
                "mysql"
            ],

            "keywords": [
                "data analyst",
                "data analysis",
                "reporting analyst",
                "business intelligence"
            ],

            "minimum_experience": 1
        },

        "Data Scientist": {

            "core_skills": [
                "python",
                "data science",
                "machine learning",
                "sql",
                "data analysis"
            ],

            "supporting_skills": [
                "deep learning",
                "tensorflow",
                "pytorch"
            ],

            "keywords": [
                "data scientist",
                "data science",
                "statistical analysis"
            ],

            "minimum_experience": 2
        },

        "AI / ML Engineer": {

            "core_skills": [
                "python",
                "machine learning",
                "deep learning",
                "artificial intelligence"
            ],

            "supporting_skills": [
                "tensorflow",
                "pytorch",
                "nlp"
            ],

            "keywords": [
                "machine learning engineer",
                "ml engineer",
                "ai engineer",
                "artificial intelligence engineer"
            ],

            "minimum_experience": 1
        }
    }


# =========================================================
# ROLE TITLE DETECTION
# =========================================================

def role_title_match(
    role,
    resume_text
):

    resume_lower = resume_text.lower()

    title_patterns = {

        "IT Manager": [
            "it manager",
            "information technology manager"
        ],

        "Technology Manager": [
            "technology manager"
        ],

        "Technical Project Manager": [
            "technical project manager"
        ],

        "IT Project Manager": [
            "it project manager"
        ],

        "IT Business Analyst": [
            "it business analyst"
        ],

        "Product / Business Analyst": [
            "product analyst",
            "product manager",
            "product owner"
        ],

        "IT Operations Manager": [
            "it operations manager"
        ],

        "Cloud / Technology Manager": [
            "cloud manager",
            "cloud technology manager"
        ],

        "Software Developer": [
            "software developer",
            "software engineer"
        ],

        "Python Developer": [
            "python developer"
        ],

        "Full Stack Developer": [
            "full stack developer",
            "full-stack developer"
        ],

        "Frontend Developer": [
            "frontend developer",
            "front-end developer"
        ],

        "Backend Developer": [
            "backend developer",
            "back-end developer"
        ],

        "Data Analyst": [
            "data analyst"
        ],

        "Data Scientist": [
            "data scientist"
        ],

        "AI / ML Engineer": [
            "ai engineer",
            "machine learning engineer",
            "ml engineer"
        ]
    }

    for title in title_patterns.get(
        role,
        []
    ):

        if title in resume_lower:

            return True

    return False


# =========================================================
# SMART JOB MATCHING
# =========================================================

def calculate_job_matches(
    skills_lower,
    resume_text,
    experience
):

    job_roles = get_job_roles()

    experience_years = experience_to_years(
        experience
    )

    results = []

    for role, details in job_roles.items():

        core_skills = details[
            "core_skills"
        ]

        supporting_skills = details[
            "supporting_skills"
        ]

        keywords = details[
            "keywords"
        ]

        minimum_experience = details[
            "minimum_experience"
        ]

        matched_core = []

        missing_core = []

        for skill in core_skills:

            if skill.lower() in skills_lower:

                matched_core.append(
                    skill
                )

            else:

                missing_core.append(
                    skill
                )

        if core_skills:

            core_score = (
                len(matched_core)
                /
                len(core_skills)
            ) * 100

        else:

            core_score = 0

        matched_supporting = []

        for skill in supporting_skills:

            if skill.lower() in skills_lower:

                matched_supporting.append(
                    skill
                )

        if supporting_skills:

            supporting_score = (
                len(matched_supporting)
                /
                len(supporting_skills)
            ) * 100

        else:

            supporting_score = 0

        if experience_years <= 0:

            experience_score = 40

        elif experience_years >= minimum_experience:

            experience_score = 100

        else:

            experience_score = (
                experience_years
                /
                minimum_experience
            ) * 100

        keyword_matches = 0

        for keyword in keywords:

            if keyword.lower() in resume_text.lower():

                keyword_matches += 1

        if keywords:

            keyword_score = (
                keyword_matches
                /
                len(keywords)
            ) * 100

        else:

            keyword_score = 0

        exact_title = role_title_match(
            role,
            resume_text
        )

        if exact_title:

            title_score = 100

        else:

            title_score = 0

        final_score = (

            core_score * 0.55

            +

            supporting_score * 0.10

            +

            experience_score * 0.20

            +

            keyword_score * 0.05

            +

            title_score * 0.10
        )

        missing_core_count = len(
            missing_core
        )

        if missing_core_count >= 5:

            final_score -= 10

        elif missing_core_count == 4:

            final_score -= 8

        elif missing_core_count == 3:

            final_score -= 6

        elif missing_core_count == 2:

            final_score -= 4

        elif missing_core_count == 1:

            final_score -= 2

        if not exact_title:

            if role in [
                "Technology Manager",
                "Technical Project Manager",
                "IT Project Manager",
                "IT Business Analyst",
                "Product / Business Analyst",
                "IT Operations Manager",
                "Cloud / Technology Manager"
            ]:

                final_score -= 5

        final_score = round(
            max(
                0,
                min(
                    final_score,
                    95
                )
            )
        )

        if final_score >= 85:

            match_level = "Excellent Match"

        elif final_score >= 75:

            match_level = "Strong Match"

        elif final_score >= 60:

            match_level = "Good Match"

        else:

            match_level = "Potential Match"

        matched_skills = (
            matched_core
            +
            matched_supporting
        )

        reason_parts = []

        if matched_core:

            reason_parts.append(
                "core skills: "
                +
                ", ".join(
                    matched_core[:4]
                )
            )

        if matched_supporting:

            reason_parts.append(
                "supporting skills: "
                +
                ", ".join(
                    matched_supporting[:3]
                )
            )

        if exact_title:

            reason_parts.append(
                "resume title directly matches this role"
            )

        if experience_years >= minimum_experience:

            reason_parts.append(
                "experience meets the role level"
            )

        elif experience_years > 0:

            reason_parts.append(
                "experience is partially aligned"
            )

        if missing_core:

            reason_parts.append(
                "missing core skills: "
                +
                ", ".join(
                    missing_core[:3]
                )
            )

        if not reason_parts:

            reason_parts.append(
                "limited resume alignment"
            )

        reason = (
            match_level
            +
            " based on "
            +
            " and ".join(
                reason_parts
            )
        )

        if len(matched_skills) >= 1:

            results.append({

                "role":
                    role,

                "match_percentage":
                    final_score,

                "match_level":
                    match_level,

                "matched_skills":
                    matched_skills,

                "missing_skills":
                    missing_core,

                "reason":
                    reason
            })

    results.sort(
        key=lambda item:
        item["match_percentage"],
        reverse=True
    )

    results = results[:5]

    job_matches = [

        item["role"]

        for item in results
    ]

    return (
        job_matches,
        results
    )


# =========================================================
# JOB-SPECIFIC SKILL GAP ENGINE
# =========================================================

def calculate_skill_gap(
    skills_lower,
    primary_role=None
):

    role_skill_gaps = {

        "IT Manager": [

            {
                "skill": "Cloud Computing",
                "priority": "High",
                "related": [
                    "cloud computing",
                    "aws",
                    "azure",
                    "google cloud"
                ]
            },

            {
                "skill": "Cybersecurity",
                "priority": "High",
                "related": [
                    "cybersecurity",
                    "network infrastructure",
                    "server",
                    "system administration"
                ]
            },

            {
                "skill": "IT Operations",
                "priority": "High",
                "related": [
                    "it operations",
                    "system administration",
                    "server",
                    "network infrastructure"
                ]
            },

            {
                "skill": "AWS",
                "priority": "Medium",
                "related": [
                    "aws",
                    "cloud computing",
                    "azure"
                ]
            },

            {
                "skill": "Data Analysis",
                "priority": "Medium",
                "related": [
                    "data analysis",
                    "sql",
                    "excel",
                    "power bi",
                    "tableau"
                ]
            },

            {
                "skill": "Power BI",
                "priority": "Medium",
                "related": [
                    "power bi",
                    "data analysis",
                    "excel",
                    "tableau"
                ]
            },

            {
                "skill": "Artificial Intelligence",
                "priority": "Low",
                "related": [
                    "artificial intelligence",
                    "machine learning",
                    "deep learning",
                    "nlp"
                ]
            },

            {
                "skill": "Machine Learning",
                "priority": "Low",
                "related": [
                    "machine learning",
                    "artificial intelligence",
                    "data science",
                    "python"
                ]
            }
        ],

        "Technology Manager": [

            {
                "skill": "Cloud Computing",
                "priority": "High",
                "related": [
                    "cloud computing",
                    "aws",
                    "azure",
                    "google cloud"
                ]
            },

            {
                "skill": "Cybersecurity",
                "priority": "High",
                "related": [
                    "cybersecurity",
                    "network infrastructure",
                    "server",
                    "system administration"
                ]
            },

            {
                "skill": "Leadership",
                "priority": "High",
                "related": [
                    "leadership",
                    "team management",
                    "stakeholder management"
                ]
            },

            {
                "skill": "AWS",
                "priority": "Medium",
                "related": [
                    "aws",
                    "cloud computing",
                    "azure"
                ]
            },

            {
                "skill": "Data Analysis",
                "priority": "Medium",
                "related": [
                    "data analysis",
                    "sql",
                    "excel",
                    "power bi"
                ]
            },

            {
                "skill": "Power BI",
                "priority": "Low",
                "related": [
                    "power bi",
                    "data analysis",
                    "excel"
                ]
            }
        ],

        "Technical Project Manager": [

            {
                "skill": "Risk Management",
                "priority": "High",
                "related": [
                    "risk management",
                    "project management",
                    "agile"
                ]
            },

            {
                "skill": "Stakeholder Management",
                "priority": "High",
                "related": [
                    "stakeholder management",
                    "requirements",
                    "requirements gathering"
                ]
            },

            {
                "skill": "Team Management",
                "priority": "High",
                "related": [
                    "team management",
                    "leadership",
                    "project management"
                ]
            },

            {
                "skill": "Cloud Computing",
                "priority": "Medium",
                "related": [
                    "cloud computing",
                    "aws",
                    "azure"
                ]
            },

            {
                "skill": "Cybersecurity",
                "priority": "Low",
                "related": [
                    "cybersecurity",
                    "network infrastructure",
                    "server"
                ]
            }
        ],

        "IT Project Manager": [

            {
                "skill": "Risk Management",
                "priority": "High",
                "related": [
                    "risk management",
                    "project management",
                    "agile"
                ]
            },

            {
                "skill": "Stakeholder Management",
                "priority": "High",
                "related": [
                    "stakeholder management",
                    "requirements",
                    "requirements gathering"
                ]
            },

            {
                "skill": "Team Management",
                "priority": "High",
                "related": [
                    "team management",
                    "leadership",
                    "project management"
                ]
            },

            {
                "skill": "Cloud Computing",
                "priority": "Medium",
                "related": [
                    "cloud computing",
                    "aws",
                    "azure"
                ]
            },

            {
                "skill": "Data Analysis",
                "priority": "Low",
                "related": [
                    "data analysis",
                    "sql",
                    "excel"
                ]
            }
        ],

        "IT Business Analyst": [

            {
                "skill": "Requirements Gathering",
                "priority": "High",
                "related": [
                    "requirements gathering",
                    "requirements",
                    "business analysis"
                ]
            },

            {
                "skill": "SQL",
                "priority": "High",
                "related": [
                    "sql",
                    "mysql",
                    "postgresql",
                    "data analysis"
                ]
            },

            {
                "skill": "Data Analysis",
                "priority": "Medium",
                "related": [
                    "data analysis",
                    "sql",
                    "excel",
                    "power bi"
                ]
            },

            {
                "skill": "Power BI",
                "priority": "Medium",
                "related": [
                    "power bi",
                    "data analysis",
                    "excel"
                ]
            },

            {
                "skill": "Cloud Computing",
                "priority": "Low",
                "related": [
                    "cloud computing",
                    "aws",
                    "azure"
                ]
            }
        ],

        "Software Developer": [

            {
                "skill": "SQL",
                "priority": "High",
                "related": [
                    "sql",
                    "mysql",
                    "postgresql",
                    "mongodb"
                ]
            },

            {
                "skill": "Docker",
                "priority": "High",
                "related": [
                    "docker",
                    "kubernetes"
                ]
            },

            {
                "skill": "Git",
                "priority": "Medium",
                "related": [
                    "git",
                    "github"
                ]
            },

            {
                "skill": "Cloud Computing",
                "priority": "Medium",
                "related": [
                    "cloud computing",
                    "aws",
                    "azure"
                ]
            }
        ],

        "Python Developer": [

            {
                "skill": "SQL",
                "priority": "High",
                "related": [
                    "sql",
                    "mysql",
                    "postgresql"
                ]
            },

            {
                "skill": "Docker",
                "priority": "High",
                "related": [
                    "docker",
                    "kubernetes"
                ]
            },

            {
                "skill": "AWS",
                "priority": "Medium",
                "related": [
                    "aws",
                    "cloud computing"
                ]
            },

            {
                "skill": "Django",
                "priority": "Medium",
                "related": [
                    "django",
                    "python"
                ]
            }
        ],

        "Full Stack Developer": [

            {
                "skill": "React",
                "priority": "High",
                "related": [
                    "react",
                    "javascript",
                    "typescript"
                ]
            },

            {
                "skill": "Node.js",
                "priority": "High",
                "related": [
                    "node.js",
                    "javascript",
                    "express"
                ]
            },

            {
                "skill": "SQL",
                "priority": "Medium",
                "related": [
                    "sql",
                    "mysql",
                    "postgresql"
                ]
            },

            {
                "skill": "Docker",
                "priority": "Low",
                "related": [
                    "docker",
                    "kubernetes"
                ]
            }
        ],

        "Frontend Developer": [

            {
                "skill": "React",
                "priority": "High",
                "related": [
                    "react",
                    "javascript",
                    "typescript"
                ]
            },

            {
                "skill": "TypeScript",
                "priority": "High",
                "related": [
                    "typescript",
                    "javascript"
                ]
            },

            {
                "skill": "Git",
                "priority": "Medium",
                "related": [
                    "git",
                    "github"
                ]
            },

            {
                "skill": "Node.js",
                "priority": "Low",
                "related": [
                    "node.js",
                    "javascript"
                ]
            }
        ],

        "Backend Developer": [

            {
                "skill": "SQL",
                "priority": "High",
                "related": [
                    "sql",
                    "mysql",
                    "postgresql",
                    "mongodb"
                ]
            },

            {
                "skill": "Docker",
                "priority": "High",
                "related": [
                    "docker",
                    "kubernetes"
                ]
            },

            {
                "skill": "Cloud Computing",
                "priority": "Medium",
                "related": [
                    "cloud computing",
                    "aws",
                    "azure"
                ]
            },

            {
                "skill": "Kubernetes",
                "priority": "Low",
                "related": [
                    "kubernetes",
                    "docker"
                ]
            }
        ],

        "Data Analyst": [

            {
                "skill": "SQL",
                "priority": "High",
                "related": [
                    "sql",
                    "mysql",
                    "postgresql"
                ]
            },

            {
                "skill": "Power BI",
                "priority": "High",
                "related": [
                    "power bi",
                    "data analysis",
                    "excel"
                ]
            },

            {
                "skill": "Excel",
                "priority": "Medium",
                "related": [
                    "excel",
                    "data analysis"
                ]
            },

            {
                "skill": "Tableau",
                "priority": "Medium",
                "related": [
                    "tableau",
                    "power bi",
                    "data analysis"
                ]
            },

            {
                "skill": "Python",
                "priority": "Low",
                "related": [
                    "python",
                    "data science"
                ]
            }
        ],

        "Data Scientist": [

            {
                "skill": "Machine Learning",
                "priority": "High",
                "related": [
                    "machine learning",
                    "artificial intelligence",
                    "data science"
                ]
            },

            {
                "skill": "Python",
                "priority": "High",
                "related": [
                    "python"
                ]
            },

            {
                "skill": "SQL",
                "priority": "Medium",
                "related": [
                    "sql",
                    "mysql",
                    "postgresql"
                ]
            },

            {
                "skill": "Deep Learning",
                "priority": "Medium",
                "related": [
                    "deep learning",
                    "machine learning",
                    "tensorflow",
                    "pytorch"
                ]
            }
        ],

        "AI / ML Engineer": [

            {
                "skill": "Machine Learning",
                "priority": "High",
                "related": [
                    "machine learning",
                    "artificial intelligence",
                    "data science"
                ]
            },

            {
                "skill": "Deep Learning",
                "priority": "High",
                "related": [
                    "deep learning",
                    "machine learning",
                    "tensorflow",
                    "pytorch"
                ]
            },

            {
                "skill": "Python",
                "priority": "High",
                "related": [
                    "python"
                ]
            },

            {
                "skill": "TensorFlow",
                "priority": "Medium",
                "related": [
                    "tensorflow",
                    "deep learning"
                ]
            },

            {
                "skill": "PyTorch",
                "priority": "Medium",
                "related": [
                    "pytorch",
                    "deep learning"
                ]
            }
        ]
    }

    if primary_role not in role_skill_gaps:

        primary_role = "IT Manager"

    requirements = role_skill_gaps[
        primary_role
    ]

    skill_gap = []

    for item in requirements:

        target_skill = item[
            "skill"
        ].lower()

        if target_skill in skills_lower:

            progress = 100

        else:

            related_found = 0

            for related in item[
                "related"
            ]:

                if related in skills_lower:

                    related_found += 1

            if related_found > 0:

                progress = round(
                    (
                        related_found
                        /
                        len(
                            item["related"]
                        )
                    )
                    * 100
                )

            else:

                progress = 0

        if progress < 100:

            skill_gap.append({

                "skill":
                    item["skill"],

                "priority":
                    item["priority"],

                "progress":
                    progress
            })

    return skill_gap


# =========================================================
# LEARNING ROADMAP
# =========================================================

def generate_learning_roadmap(
    skill_gap_details
):

    roadmap = []

    for item in skill_gap_details:

        if item["priority"] == "High":

            roadmap.append(
                "Learn "
                +
                item["skill"]
                +
                " fundamentals"
            )

    for item in skill_gap_details:

        if item["priority"] == "Medium":

            roadmap.append(
                "Develop "
                +
                item["skill"]
                +
                " skills"
            )

    for item in skill_gap_details:

        if item["priority"] == "Low":

            roadmap.append(
                "Explore "
                +
                item["skill"]
                +
                " for future growth"
            )

    roadmap.append(
        "Build a real-world project using your new skills"
    )

    roadmap = roadmap[:7]

    return [

        f"{index}. {item}"

        for index, item in enumerate(
            roadmap,
            start=1
        )
    ]


# =========================================================
# PRIMARY CAREER ROLE
# =========================================================

def detect_primary_role(
    text,
    skills,
    job_matches
):

    resume_lower = text.lower()

    first_part = resume_lower[
        :2500
    ]

    direct_titles = [

        (
            "IT Manager",
            [
                "it manager",
                "information technology manager"
            ]
        ),

        (
            "Technology Manager",
            [
                "technology manager"
            ]
        ),

        (
            "Technical Project Manager",
            [
                "technical project manager"
            ]
        ),

        (
            "IT Project Manager",
            [
                "it project manager",
                "project manager"
            ]
        ),

        (
            "IT Business Analyst",
            [
                "it business analyst",
                "business analyst"
            ]
        ),

        (
            "IT Operations Manager",
            [
                "it operations manager",
                "operations manager"
            ]
        ),

        (
            "Data Scientist",
            [
                "data scientist"
            ]
        ),

        (
            "Data Analyst",
            [
                "data analyst"
            ]
        ),

        (
            "AI / ML Engineer",
            [
                "ai engineer",
                "machine learning engineer",
                "ml engineer"
            ]
        ),

        (
            "Full Stack Developer",
            [
                "full stack developer",
                "full-stack developer"
            ]
        ),

        (
            "Frontend Developer",
            [
                "frontend developer",
                "front-end developer"
            ]
        ),

        (
            "Backend Developer",
            [
                "backend developer",
                "back-end developer"
            ]
        ),

        (
            "Python Developer",
            [
                "python developer"
            ]
        ),

        (
            "Software Developer",
            [
                "software developer",
                "software engineer"
            ]
        )
    ]

    for role, titles in direct_titles:

        for title in titles:

            if title in first_part:

                return role

    skills_lower = [
        skill.lower()
        for skill in skills
    ]

    if (
        "machine learning" in skills_lower
        and
        "python" in skills_lower
    ):

        return "AI / ML Engineer"

    if (
        "data science" in skills_lower
        and
        "python" in skills_lower
    ):

        return "Data Scientist"

    if (
        "data analysis" in skills_lower
        and
        (
            "excel" in skills_lower
            or
            "power bi" in skills_lower
            or
            "tableau" in skills_lower
        )
    ):

        return "Data Analytics"

    if (
        "project management" in skills_lower
        and
        (
            "agile" in skills_lower
            or
            "sdlc" in skills_lower
        )
    ):

        return "IT Management / Technology"

    if job_matches:

        top_role = job_matches[0]

        if top_role in [
            "IT Manager",
            "Technology Manager",
            "IT Operations Manager",
            "IT Project Manager",
            "Technical Project Manager"
        ]:

            return "IT Management / Technology"

        if top_role in [
            "Data Analyst",
            "Data Scientist"
        ]:

            return "Data Analytics"

        if top_role in [
            "Software Developer",
            "Python Developer",
            "Full Stack Developer",
            "Frontend Developer",
            "Backend Developer"
        ]:

            return "Software Development"

        if top_role == "AI / ML Engineer":

            return "AI / Data Technology"

    return "Technology / IT"


# =========================================================
# CAREER PROFILE
# =========================================================

def generate_career_profile(
    text,
    skills,
    job_matches,
    experience
):

    primary_role = detect_primary_role(
        text,
        skills,
        job_matches
    )

    return {

        "experience":
            experience,

        "primary_role":
            primary_role,

        "strengths":
            skills[:10],

        "recommended_roles":
            job_matches[:5]
    }


# =========================================================
# REAL GEMINI AI RESUME ANALYSIS
# =========================================================

def generate_ai_analysis(
    resume_text,
    existing_skills,
    existing_jobs,
    experience
):

    fallback = {

        "enabled":
            False,

        "status":
            "AI analysis unavailable",

        "summary":
            "AI analysis is not available right now.",

        "primary_role":
            None,

        "strengths":
            existing_skills[:6],

        "improvement_areas":
            [],

        "career_advice":
            "Continue developing skills related to your recommended roles.",

        "roadmap":
            []
    }

    if gemini_client is None:

        fallback["status"] = (
            "Gemini API key not configured"
        )

        return fallback

    try:

        resume_for_ai = (
            resume_text
            .encode(
                "utf-8",
                errors="ignore"
            )
            .decode(
                "utf-8",
                errors="ignore"
            )
        )

    except Exception:

        resume_for_ai = str(
            resume_text
        )

    resume_for_ai = re.sub(
        r"[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]",
        " ",
        resume_for_ai
    )

    resume_for_ai = resume_for_ai[
        :18000
    ]

    safe_skills = [
        str(skill)
        for skill in existing_skills
    ]

    safe_jobs = [
        str(job)
        for job in existing_jobs
    ]

    safe_experience = str(
        experience
    )

    prompt = f"""
You are an AI career intelligence assistant for a project called Talent Vector.

Analyze the following resume carefully.

Return ONLY valid JSON.
Do not use markdown.
Do not add ``` or explanations outside JSON.

The JSON must contain exactly these keys:

{{
  "summary": "2-4 sentence professional summary",
  "primary_role": "best career role based on the resume",
  "strengths": [
    "strength 1",
    "strength 2",
    "strength 3",
    "strength 4"
  ],
  "improvement_areas": [
    "area 1",
    "area 2",
    "area 3"
  ],
  "career_advice": "specific useful career advice",
  "roadmap": [
    "step 1",
    "step 2",
    "step 3",
    "step 4",
    "step 5"
  ]
}}

Rules:

- Base the answer only on the resume.
- Do not invent qualifications.
- Keep recommendations realistic.
- Prefer skills and roles supported by the resume.
- The roadmap should be practical and career-focused.
- Do not calculate job-match percentages.
- Do not change or override the application's existing job matching.
- Do not change the application's existing skill-gap calculation.

Existing detected skills:
{safe_skills}

Existing recommended jobs:
{safe_jobs}

Detected experience:
{safe_experience}

RESUME:
{resume_for_ai}
"""

    try:

        response = gemini_client.models.generate_content(

            model="gemini-3.6-flash",

            contents=prompt
        )

        output_text = response.text

        if not output_text:

            raise ValueError(
                "Gemini returned empty output."
            )

        output_text = output_text.strip()

        output_text = re.sub(
            r"^```json\s*",
            "",
            output_text,
            flags=re.IGNORECASE
        )

        output_text = re.sub(
            r"^```\s*",
            "",
            output_text
        )

        output_text = re.sub(
            r"\s*```$",
            "",
            output_text
        )

        ai_data = json.loads(
            output_text
        )

        summary = ai_data.get(
            "summary",
            fallback["summary"]
        )

        primary_role = ai_data.get(
            "primary_role"
        )

        strengths = ai_data.get(
            "strengths",
            []
        )

        improvement_areas = ai_data.get(
            "improvement_areas",
            []
        )

        career_advice = ai_data.get(
            "career_advice",
            ""
        )

        roadmap = ai_data.get(
            "roadmap",
            []
        )

        if not isinstance(
            strengths,
            list
        ):

            strengths = []

        if not isinstance(
            improvement_areas,
            list
        ):

            improvement_areas = []

        if not isinstance(
            roadmap,
            list
        ):

            roadmap = []

        return {

            "enabled":
                True,

            "status":
                "Gemini AI analysis completed successfully",

            "summary":
                str(summary),

            "primary_role":
                str(primary_role)
                if primary_role
                else None,

            "strengths":
                [
                    str(item)
                    for item in strengths[:6]
                ],

            "improvement_areas":
                [
                    str(item)
                    for item in improvement_areas[:5]
                ],

            "career_advice":
                str(career_advice),

            "roadmap":
                [
                    str(item)
                    for item in roadmap[:7]
                ]
        }

    except Exception as error:

        print(
            "Gemini AI analysis error:",
            repr(error)
        )

        fallback["status"] = (
            "Gemini AI analysis failed; using standard analysis"
        )

        fallback["error"] = str(
            error
        )

        return fallback


# =========================================================
# COMPLETE RESUME ANALYSIS
# =========================================================

def analyze_resume(text):

    skills = detect_skills(
        text
    )

    experience = detect_experience(
        text
    )

    skills_lower = [
        skill.lower()
        for skill in skills
    ]

    (
        job_matches,
        job_match_details
    ) = calculate_job_matches(
        skills_lower,
        text,
        experience
    )

    detected_role = detect_primary_role(
        text,
        skills,
        job_matches
    )

    skill_gap_details = calculate_skill_gap(
        skills_lower,
        detected_role
    )

    skill_gap = [
        item["skill"]
        for item in skill_gap_details
    ]

    learning_roadmap = generate_learning_roadmap(
        skill_gap_details
    )

    career_profile = generate_career_profile(
        text,
        skills,
        job_matches,
        experience
    )

    ai_analysis = generate_ai_analysis(

        resume_text=text,

        existing_skills=skills,

        existing_jobs=job_matches,

        experience=experience
    )

    if ai_analysis.get(
        "enabled",
        False
    ):

        ai_primary_role = ai_analysis.get(
            "primary_role"
        )

        if ai_primary_role:

            career_profile[
                "ai_primary_role"
            ] = ai_primary_role

        career_profile[
            "ai_summary"
        ] = ai_analysis.get(
            "summary",
            ""
        )

        career_profile[
            "ai_strengths"
        ] = ai_analysis.get(
            "strengths",
            []
        )

        career_profile[
            "ai_improvement_areas"
        ] = ai_analysis.get(
            "improvement_areas",
            []
        )

        career_profile[
            "ai_career_advice"
        ] = ai_analysis.get(
            "career_advice",
            ""
        )

        ai_roadmap = ai_analysis.get(
            "roadmap",
            []
        )

        if ai_roadmap:

            learning_roadmap = [

                f"{index}. {item}"

                for index, item in enumerate(
                    ai_roadmap,
                    start=1
                )
            ]

    return {

        "skills":
            skills,

        "experience":
            experience,

        "job_matches":
            job_matches,

        "job_match_details":
            job_match_details,

        "skill_gap":
            skill_gap[:8],

        "skill_gap_details":
            skill_gap_details[:8],

        "learning_roadmap":
            learning_roadmap,

        "career_profile":
            career_profile,

        "ai_analysis":
            ai_analysis,

        "ai_powered":
            ai_analysis.get(
                "enabled",
                False
            ),

        "resume_length":
            len(text),

        "status":
            "Resume analyzed successfully"
    }


# =========================================================
# HOME
# =========================================================

@app.route(
    "/",
    methods=["GET"]
)
def home():

    return jsonify({

        "message":
            "Talent Vector AI Backend is running!",

        "status":
            "success",

        "ai":
            "enabled"
            if gemini_client
            else
            "not configured"
    })


# =========================================================
# RESUME UPLOAD API
# =========================================================

@app.route(
    "/api/upload-resume",
    methods=["POST"]
)
def upload_resume():

    if "resume" not in request.files:

        return jsonify({

            "success":
                False,

            "message":
                "No resume file received."
        }), 400

    file = request.files[
        "resume"
    ]

    if file.filename == "":

        return jsonify({

            "success":
                False,

            "message":
                "No file selected."
        }), 400

    if not allowed_file(
        file.filename
    ):

        return jsonify({

            "success":
                False,

            "message":
                "Only PDF, DOC and DOCX files are allowed."
        }), 400

    filename = file.filename

    file_path = os.path.join(
        app.config[
            "UPLOAD_FOLDER"
        ],
        filename
    )

    file.save(
        file_path
    )

    try:

        resume_text = extract_resume_text(
            file_path
        )

        if not resume_text.strip():

            return jsonify({

                "success":
                    False,

                "message":
                    "Could not extract text from the resume."
            }), 400

        analysis = analyze_resume(
            resume_text
        )

        return jsonify({

            "success":
                True,

            "message":
                "Resume uploaded and analyzed successfully.",

            "filename":
                filename,

            "analysis":
                analysis
        })

    except Exception as error:

        print(
            "Resume analysis error:",
            repr(error)
        )

        return jsonify({

            "success":
                False,

            "message":
                "Could not analyze the resume.",

            "error":
                str(error)
        }), 500


# =========================================================
# START SERVER
# =========================================================

if __name__ == "__main__":

    app.run(
        host="127.0.0.1",
        port=5000,
        debug=True
    )