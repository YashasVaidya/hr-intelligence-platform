from flask import Flask, request, jsonify
from models.hr_intelligence import HRIntelligence
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
hr_intelligence = HRIntelligence()

@app.route('/analyze_candidate', methods=['POST'])
def analyze_candidate():
    data = request.json
    resume_text = data.get('resume_text')
    job_desc = data.get('job_desc')
    if not resume_text or not job_desc:
        return jsonify({"error": "Missing resume_text or job_desc"}), 400
    result = hr_intelligence.analyze_candidate(resume_text, job_desc)
    return jsonify(result)

@app.route('/analyze_engagement', methods=['POST'])
def analyze_engagement():
    data = request.json
    communication_data = data.get('communication_data')
    if not communication_data:
        return jsonify({"error": "Missing communication_data"}), 400
    result = hr_intelligence.analyze_engagement(communication_data)
    return jsonify(result)

@app.route('/get_hr_metrics', methods=['GET'])
def get_hr_metrics():
    result = hr_intelligence.get_hr_metrics()
    return jsonify(result)

@app.route('/get_engagement_prediction', methods=['GET'])
def get_engagement_prediction():
    result = hr_intelligence.predict_engagement_prediction()
    return jsonify({"predictions": result})

if __name__ == '__main__':
    app.run(debug=True) 