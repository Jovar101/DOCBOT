# app.py
from flask import Flask, request, jsonify, send_from_directory
import os

app = Flask(__name__, static_folder='static')


questions = [
    {"id": 1, "question": "What is your age range?", "options": ["Under 18", "18-30", "31-50", "51-70", "Over 70"]},
    {"id": 2, "question": "What is your gender?", "options": ["Male", "Female", "Other", "Prefer not to say"]},
    {"id": 3, "question": "Do you have any allergies?", "options": ["Yes", "No"]},
    # Add more questions as needed
]
answers_list = []

@app.route('/')
def serve_frontend():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/get_questions', methods=['GET'])
def get_questions():
    return jsonify(questions)

@app.route('/submit_answers', methods=['POST'])
def submit_answers():
    try:
        # Get the answers from the request
        answers = request.json.get('answers', {})
        
        # Ensure answers is a dictionary
        if not isinstance(answers, dict):
            return jsonify({"message": "Invalid data format"}), 400
        
        # Append the answers to the global list
        answers_list.append(answers)
        
        # Return success message and the updated answers list
        return jsonify({"message": "Answers submitted successfully!", "answers": answers_list}), 200
    
    except Exception as e:
        # Log the exception if needed (logging setup required)
        print(f"Error: {e}")
        return jsonify({"message": "An error occurred while processing your request."}), 500


if __name__ == '__main__':
    app.run(debug=True)
