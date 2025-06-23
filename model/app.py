
from flask import Flask, request, jsonify
import pandas as pd
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.metrics.pairwise import cosine_similarity
from flask_cors import CORS
from dotenv import load_dotenv
import os
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Google Sheet CSV URL

SHEET_URL = os.getenv("Google_sheet_url")

# Function to Load Google Sheets Data
def load_google_sheet(url):
    try:
        data = pd.read_csv(url)
        data.columns = data.columns.str.strip()  # Remove extra spaces in column names
        return data
    except Exception as e:
        print(f"Error loading Google Sheet: {e}")
        return None

# Preprocessing Function
def preprocess(data):
    relevant_columns = [
        'Email', 'Name', 'Phone Number', 'What is your age-group?',
        'What is your highest level of education?', 'How many years of experience do you have in entrepreneurship?',
        'What stage is your current business in?', 'What is your business model preference?',
        'Do you have experience in securing funding?',
        'How comfortable are you with technology and AI integration in business? (Scale of 1-5)',
        'How risk-tolerant are you in business decisions? (Scale of 1-5)',
        'What type of entrepreneurs do you prefer connecting with?'
    ]
    missing_columns = [col for col in relevant_columns if col not in data.columns]
    if missing_columns:
        raise ValueError(f"Missing columns in dataset: {missing_columns}")
    return data[relevant_columns]

# Matching Function
# def get_matches(data, weighted_df, label_encoders, user_id, num_matches=5):
#     try:
#         user_index = data[data['Email'] == user_id].index[0]
#     except IndexError:
#         return []
    
#     profile_df = weighted_df.iloc[user_index].values.reshape(1, -1)
#     scores = cosine_similarity(profile_df, weighted_df).flatten()
#     scores[user_index] = -1  # Exclude self
    
#     top_indices = scores.argsort()[-num_matches:][::-1]
#     decoded_records = []
#     for i in top_indices:
#         record = data.iloc[i].to_dict()
#         for feature in label_encoders.keys():
#             if feature in record:
#                 try:
#                     record[feature] = label_encoders[feature].inverse_transform([int(record[feature])])[0]
#                 except ValueError:
#                     record[feature] = "Unknown"
#         decoded_records.append(record)
    
#     return decoded_records

# @app.route("/find_matches", methods=["POST"])
# def find_matches():
#     try:
#         request_data = request.get_json()
#         user_id = request_data.get("user_id")

#         if not user_id:
#             return jsonify({"error": "User ID is required"}), 400

#         # Load Google Sheet dynamically
#         data = load_google_sheet(SHEET_URL)
#         if data is None:
#             return jsonify({"error": "Failed to load dataset"}), 500

#         # Normalize Email column (strip spaces, lowercase)
#         data['Email'] = data['Email'].astype(str).str.strip().str.lower()
#         user_id = user_id.strip().lower()

#         print(f"\n🔍 Checking User: {user_id}")
#         print(f"📜 Normalized Emails in Dataset:\n{data['Email'].unique().tolist()}")

#         if user_id not in data['Email'].values:
#             return jsonify({"error": f"User ID '{user_id}' not found in the dataset"}), 404

#         # Preprocess dataset
#         data = preprocess(data)
        
#         # Label Encoding for Categorical Columns
#         categorical_features = [
#             'What is your highest level of education?', 'What stage is your current business in?',
#             'What is your business model preference?', 'Do you have experience in securing funding?',
#             'What type of entrepreneurs do you prefer connecting with?',
#             'How many years of experience do you have in entrepreneurship?',
#             'What is your age-group?'
#         ]
#         label_encoders = {}
#         for feature in categorical_features:
#             le = LabelEncoder()
#             data[feature] = le.fit_transform(data[feature].astype(str))
#             label_encoders[feature] = le

#         # Feature weighting
#         weights = {
#             'What is your highest level of education?': 10,
#             'How many years of experience do you have in entrepreneurship?': 50,
#             'What stage is your current business in?': 50,
#             'What is your business model preference?': 70,
#             'Do you have experience in securing funding?': 70,
#             'How comfortable are you with technology and AI integration in business? (Scale of 1-5)': 50,
#             'How risk-tolerant are you in business decisions? (Scale of 1-5)': 75,
#             'What type of entrepreneurs do you prefer connecting with?': 80,
#             'What is your age-group?': 20
#         }

#         # Apply weights
#         for feature, weight in weights.items():
#             if feature in data.columns:
#                 data[feature] = data[feature].astype(float) * weight

#         # Normalize data
#         scaler = StandardScaler()
#         weighted_features = list(weights.keys())
#         weighted_df = pd.DataFrame(scaler.fit_transform(data[weighted_features]), columns=weighted_features)
        
#         # Find matches
#         user_recommendations = get_matches(data, weighted_df, label_encoders, user_id)

#         if not user_recommendations:
#             return jsonify({"error": f"No matches found for user {user_id}"}), 404

#         return jsonify(user_recommendations)

#     except Exception as e:
#         print(f" Error in find_matches: {str(e)}")
#         return jsonify({"error": str(e)}), 500

def get_matches(original_data, weighted_df, user_id, num_matches=5):
    try:
        user_index = original_data[original_data['Email'] == user_id].index[0]
    except IndexError:
        return []
    
    profile_df = weighted_df.iloc[user_index].values.reshape(1, -1)
    scores = cosine_similarity(profile_df, weighted_df).flatten()
    scores[user_index] = -1  # Exclude self
    
    top_indices = scores.argsort()[-num_matches:][::-1]
    decoded_records = []
    for i in top_indices:
        record = original_data.iloc[i].to_dict()  # Use original (not encoded) data
        decoded_records.append(record)
    
    return decoded_records

@app.route("/find_matches", methods=["POST"])
def find_matches():
    try:
        request_data = request.get_json()
        user_id = request_data.get("user_id")
        if not user_id:
            return jsonify({"error": "User ID is required"}), 400

        data = load_google_sheet(SHEET_URL)
        if data is None:
            return jsonify({"error": "Failed to load dataset"}), 500

        data['Email'] = data['Email'].astype(str).str.strip().str.lower()
        user_id = user_id.strip().lower()

        if user_id not in data['Email'].values:
            return jsonify({"error": f"User ID '{user_id}' not found in the dataset"}), 404

        # Preprocess dataset
        relevant_data = preprocess(data)
        original_data = relevant_data.copy()  # Keep for output

        # Label Encoding on a copy for ML only
        ml_data = relevant_data.copy()
        categorical_features = [
            'What is your highest level of education?', 'What stage is your current business in?',
            'What is your business model preference?', 'Do you have experience in securing funding?',
            'What type of entrepreneurs do you prefer connecting with?',
            'How many years of experience do you have in entrepreneurship?',
            'What is your age-group?'
        ]
        for feature in categorical_features:
            le = LabelEncoder()
            ml_data[feature] = le.fit_transform(ml_data[feature].astype(str))

        weights = {
            'What is your highest level of education?': 10,
            'How many years of experience do you have in entrepreneurship?': 50,
            'What stage is your current business in?': 50,
            'What is your business model preference?': 70,
            'Do you have experience in securing funding?': 70,
            'How comfortable are you with technology and AI integration in business? (Scale of 1-5)': 50,
            'How risk-tolerant are you in business decisions? (Scale of 1-5)': 75,
            'What type of entrepreneurs do you prefer connecting with?': 80,
            'What is your age-group?': 20
        }
        for feature, weight in weights.items():
            if feature in ml_data.columns:
                ml_data[feature] = ml_data[feature].astype(float) * weight

        scaler = StandardScaler()
        weighted_features = list(weights.keys())
        weighted_df = pd.DataFrame(scaler.fit_transform(ml_data[weighted_features]), columns=weighted_features)

        user_recommendations = get_matches(original_data, weighted_df, user_id)

        if not user_recommendations:
            return jsonify({"error": f"No matches found for user {user_id}"}), 404

        return jsonify(user_recommendations)

    except Exception as e:
        print(f" Error in find_matches: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=8080)