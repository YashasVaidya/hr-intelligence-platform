import json
from faker import Faker
import random
import os
import subprocess
from datetime import datetime, timedelta

fake = Faker()

# Custom lists for more realistic content
universities = [
    "Harvard University", "Stanford University", "University of California, Berkeley",
    "University of Michigan", "University of Texas at Austin", 
    "California State University, Long Beach", "University of Alabama",
    "Boston College", "University of North Carolina at Chapel Hill", 
    "Appalachian State University"
]



degrees = [
    "Bachelor of Science in Computer Science", "Master of Business Administration",
    "Bachelor of Arts in Psychology", "Master of Science in Data Science",
    "Bachelor of Science in Mathematics", "Master of Public Health",
    "Bachelor of Arts in Sociology", "Master of Science in Environmental Science",
    "Bachelor of Science in Biology", "Master of Arts in International Relations"
]

summary_templates = [
    "Experienced {} with {} years of expertise in {}. Proven track record in {} and {}. Strong background in {} with a focus on delivering high-quality results.",
    "Results-driven {} professional with extensive experience in {}. Demonstrated success in {} and {}. Skilled in {} with a passion for {}.",
    "Dynamic {} with {} years of experience specializing in {}. Expert in {} and {}. Proven ability to {}.",
]

def generate_work_dates(start_year_range=(-5, -2)):
    """Generate realistic work experience dates"""
    current_year = datetime.now().year
    start_year = current_year + start_year_range[0]
    end_year = current_year + start_year_range[1]
    
    # Generate random years within the range
    start = random.randint(start_year, end_year)
    end = random.randint(start + 1, current_year)
    
    return start, end

def generate_professional_summary(job_title, years, skills):
    template = random.choice(summary_templates)
    achievements = [
        "leading cross-functional teams",
        "implementing innovative solutions",
        "optimizing business processes",
        "developing strategic initiatives",
        "driving project success",
        "improving operational efficiency"
    ]
    return template.format(
        job_title,
        years,
        skills[0],
        random.choice(achievements),
        random.choice(achievements),
        skills[1] if len(skills) > 1 else "professional development"
    )

def generate_resumes(num=15):
    resumes = []
    skills = ["JavaScript", "TypeScript", "React", "Python", "Machine Learning", "Data Analysis", 
              "Communication", "Project Management", "Team Leadership", "Agile Methodologies",
              "Cloud Computing", "DevOps", "System Design", "Database Management"]
    
    job_titles = [
        "Software Engineer", "Data Scientist", "Project Manager", "Product Manager",
        "Business Analyst", "UX Designer", "DevOps Engineer", "Full Stack Developer",
        "Machine Learning Engineer", "Technical Lead"
    ]
    
    data_dir = os.path.join('data', 'resumes')
    os.makedirs(data_dir, exist_ok=True)
    os.chmod(data_dir, 0o777)  # Give full permissions to the directory

    latex_template = r"""
    \documentclass[11pt]{article}
    \usepackage[margin=1in]{geometry}
    \usepackage{parskip}
    \usepackage[utf8]{inputenc}
    \usepackage[T1]{fontenc}
    \usepackage{lmodern}
    \usepackage{enumitem}
    \usepackage{textcomp}

    \begin{document}
    \begin{center}
        {\Huge \textbf{%s}}\\[1ex]
        \texttt{%s} | \texttt{%s} | \texttt{%s}
    \end{center}

    \section*{Summary}
    %s

    \section*{Work Experience}
    %s

    \section*{Education}
    %s

    \section*{Skills}
    %s
    \end{document}
    """

    for i in range(1, num + 1):
        try:
            print(f"\n{'='*50}")
            print(f"Processing resume {i} of {num}")
            print(f"{'='*50}")
            
            # Generate fake data with more realistic content
            name = fake.name()
            email = fake.email()
            phone = fake.phone_number()
            address = fake.address().replace('\n', ' ')
            
            print(f"Generated personal info for: {name}")
            
            # Generate work experience with realistic dates and descriptions
            selected_job_titles = random.sample(job_titles, k=2)
            work_experience_list = []
            for job_title in selected_job_titles:
                start_year, end_year = generate_work_dates()
                work_experience_list.append(
                    f"\\textbf{{{job_title}}} at {fake.company()} ({start_year} - {end_year})\\newline\n"
                    f"\\begin{{itemize}}[noitemsep]\n"
                    f"\\item {fake.catch_phrase()}\n"
                    f"\\item Successfully {fake.bs()}\n"
                    f"\\item Led team of {random.randint(3, 15)} professionals in {fake.catch_phrase().lower()}\n"
                    f"\\end{{itemize}}"
                )
            work_experience = "\n\n".join(work_experience_list)
            
            print("Generated work experience")
            
            # Generate skills and education
            selected_skills = random.sample(skills, k=random.randint(4, 6))
            degree = random.choice(degrees)
            grad_year = datetime.now().year - random.randint(1, 10)
            education = f"\\textbf{{{degree}}} at {random.choice(universities)} ({grad_year})"
            
            print(f"Generated education: {degree}")
            
            # Generate professional summary
            years_experience = random.randint(3, 15)
            summary = generate_professional_summary(selected_job_titles[0], years_experience, selected_skills)

            print("Generated summary")

            # Create LaTeX content
            latex_content = latex_template % (
                name,
                email,
                phone,
                address,
                summary,
                work_experience,
                education,
                ", ".join(selected_skills)
            )

            # Save and compile LaTeX
            tex_filename = os.path.join(data_dir, f"resume_{i}.tex")
            
            # Print the directory and file information
            print(f"\nFile Information:")
            print(f"Working directory: {os.getcwd()}")
            print(f"TeX file path: {tex_filename}")
            print(f"Data directory: {data_dir}")
            
            # Save the LaTeX file
            print("\nSaving LaTeX file...")
            with open(tex_filename, "w", encoding='utf-8') as tex_file:
                tex_file.write(latex_content)
            
            # Verify the .tex file was created
            if not os.path.exists(tex_filename):
                print(f"Error: TEX file not created at {tex_filename}")
                continue
            else:
                print(f"TEX file successfully created at {tex_filename}")

            # Create temporary directory for TeX
            temp_dir = os.path.join(data_dir, 'temp')
            os.makedirs(temp_dir, exist_ok=True)
            os.chmod(temp_dir, 0o777)

            # Run pdflatex with modified environment
            print("\nRunning pdflatex...")
            env = os.environ.copy()
            env['TEXMFVAR'] = temp_dir

            # First run of pdflatex
            process = subprocess.run(
                [
                    "pdflatex",
                    "-interaction=nonstopmode",
                    "-output-directory", data_dir,
                    tex_filename
                ],
                capture_output=True,
                text=True,
                env=env
            )
            
            if process.returncode != 0:
                print(f"\nError generating PDF for resume_{i}:")
                print("Error output:")
                print(process.stderr)
                print("\nCommand output (first 1000 chars):")
                print(process.stdout[:1000])
                continue

            # Verify PDF was created
            pdf_path = os.path.join(data_dir, f"resume_{i}.pdf")
            if not os.path.exists(pdf_path):
                print(f"\nError: PDF file not created at {pdf_path}")
                continue
            else:
                print(f"\nSuccess: PDF file created at {pdf_path}")

            # Remove auxiliary files and .tex file
            print("\nCleaning up auxiliary files and .tex file...")
            for ext in [".aux", ".log", ".tex"]:
                try:
                    aux_file = os.path.join(data_dir, f"resume_{i}{ext}")
                    if os.path.exists(aux_file):
                        os.remove(aux_file)
                        print(f"Removed {ext} file")
                except FileNotFoundError:
                    print(f"No {ext} file found to clean up")
                except Exception as e:
                    print(f"Error removing {ext} file: {str(e)}")

            # Collect resume data for JSON
            resume = {
                "id": i,
                "name": name,
                "email": email,
                "phone": phone,
                "address": address,
                "summary": summary,
                "work_experience": work_experience,
                "education": education,
                "skills": selected_skills,
                "file_path": f"resumes/resume_{i}.pdf"
            }
            resumes.append(resume)
            
            print(f"\nSuccessfully processed resume {i}")
            
        except Exception as e:
            print(f"\nError processing resume_{i}: {str(e)}")
            print(f"Error type: {type(e).__name__}")
            continue

    # Clean up temporary directory
    try:
        import shutil
        shutil.rmtree(os.path.join(data_dir, 'temp'), ignore_errors=True)
    except Exception as e:
        print(f"Error cleaning up temporary directory: {str(e)}")

    print(f"\nProcessed {len(resumes)} resumes successfully")
    return resumes

def generate_job_descriptions(num=7):
    job_titles = ["Software Engineer", "Data Scientist", "Project Manager", "HR Specialist", "DevOps Engineer", "UI/UX Designer", "Business Analyst"]
    skills = ["JavaScript", "TypeScript", "React", "Python", "Machine Learning", "Data Analysis", "Communication", "Project Management"]
    job_descriptions = []
    for i in range(1, num + 1):
        job = {
            "id": i,
            "title": random.choice(job_titles),
            "description": f"{fake.text()} Required Skills: {', '.join(random.sample(skills, k=random.randint(3, 5)))}",
            "required_proficiency": {skill: random.randint(3, 5) for skill in random.sample(skills, k=random.randint(3, 5))}
        }
        job_descriptions.append(job)
    return job_descriptions

def generate_communication_data(num=50):
    messages = [
        "Great start to the new project!",
        "Facing some challenges with the workflow.",
        "Looking forward to the team meeting.",
        "Need assistance with the current task.",
        "Celebrating our recent achievements!",
        "Experiencing issues with the software.",
        "Happy to collaborate on this initiative.",
        "Struggling to meet the deadline."
    ]
    sentiment_emotions = ["Happy", "Frustrated", "Excited", "Anxious", "Content", "Disappointed"]
    communication_data = []
    for i in range(num):
        entry = {
            "timestamp": fake.date_between(start_date='-6m', end_date='today').isoformat(),
            "message": random.choice(messages),
            "emotion": random.choice(sentiment_emotions)
        }
        communication_data.append(entry)
    return communication_data

def generate_hr_metrics():
    metrics = {
        "employee_turnover": round(random.uniform(0.05, 0.2), 2),
        "average_tenure": round(random.uniform(1.0, 5.0), 1),
        "employee_satisfaction": round(random.uniform(3.0, 5.0), 1),
        "recruitment_speed": round(random.uniform(20, 60), 1),  # in days
        "training_hours": round(random.uniform(10, 40), 1)
    }
    return metrics

def save_data():
    data_dir = 'data'
    os.makedirs(data_dir, exist_ok=True)
    
    resumes = generate_resumes()
    jobs = generate_job_descriptions()
    communications = generate_communication_data()
    metrics = generate_hr_metrics()
    
    with open(os.path.join(data_dir, 'sampleResumes.json'), 'w') as f:
        json.dump(resumes, f, indent=2)
    
    with open(os.path.join(data_dir, 'sampleJobDescriptions.json'), 'w') as f:
        json.dump(jobs, f, indent=2)
    
    with open(os.path.join(data_dir, 'sampleCommunications.json'), 'w') as f:
        json.dump(communications, f, indent=2)
    
    with open(os.path.join(data_dir, 'sampleMetrics.json'), 'w') as f:
        json.dump(metrics, f, indent=2)
    
    print("Synthetic data generated successfully.")

if __name__ == "__main__":
    save_data()