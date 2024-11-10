import spacy

class SkillMatchingModel:
    def __init__(self):
        # Load a pre-trained NLP model, e.g., spaCy
        self.nlp = spacy.load('en_core_web_sm')
        self.skill_database = self.load_skill_database()

    def load_skill_database(self):
        # Load a predefined list of skills
        return {"Python", "Machine Learning", "Data Analysis", "Communication", "Project Management"}

    def extract_skills(self, text):
        doc = self.nlp(text)
        extracted_skills = {ent.text for ent in doc.ents if ent.text in self.skill_database}
        return list(extracted_skills)

    def calculate_similarity(self, skills, job_desc):
        # Implement semantic similarity scoring between skills and job description
        # Placeholder for actual similarity calculation
        similarity_score = 0.85  # Dummy value
        return similarity_score 