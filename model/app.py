# from flask import Flask, request, jsonify
# import pandas as pd
# from sklearn.preprocessing import LabelEncoder, StandardScaler
# from sklearn.metrics.pairwise import cosine_similarity
# from flask_cors import CORS

# app = Flask(__name__)
# CORS(app)  # Enable CORS for all routes

# # Preprocessing Function
# def preprocess(data):
#     relevant_columns = ['Email', 'Name', 'Phone Number', 'What is your age-group?', 'What is your highest level of education?', 'How many years of experience do you have in entrepreneurship?','What stage is your current business in?','What is your business model preference?','Do you have experience in securing funding?','How comfortable are you with technology and AI integration in business? (Scale of 1-5)','How risk-tolerant are you in business decisions? (Scale of 1-5)','What type of entrepreneurs do you prefer connecting with?']
#     return data[relevant_columns]

# # Match Function
# def get_matches(data, weighted_df, label_encoders, user_id, num_matches=5):
#     user_index = data[data['Email'] == user_id].index[0]
#     profile_df = weighted_df.iloc[user_index].values.reshape(1, -1)
#     scores = cosine_similarity(profile_df, weighted_df).flatten()
#     scores[user_index] = -1  # Exclude self
    
#     top_indices = scores.argsort()[-num_matches:][::-1]
    
#     decoded_records = []
#     for i in top_indices:
#         record = data.iloc[i].to_dict()
#         for feature in label_encoders.keys():
#             if feature in record:
#                 record[feature] = label_encoders[feature].inverse_transform([record[feature]])[0]
#         decoded_records.append(record)
    
#     return decoded_records

# @app.route("/find_matches", methods=["POST"])
# def find_matches():
#     try:
#         request_data = request.get_json()
#         user_id = request_data.get("user_id")

#         if not user_id:
#             return jsonify({"error": "User ID is required"}), 400

#         data = pd.read_csv("https://docs.google.com/spreadsheets/d/1zeniVRb5M1o999FLSF21uWdr7GgMXbdBLHiRfoTknaA/edit?usp=sharing")
#         data = preprocess(data)

#         label_encoders = {}
#         for col in ['Email', 'Name', 'Phone Number', 'What is your age-group?', 'What is your highest level of education?', 'How many years of experience do you have in entrepreneurship?','What stage is your current business in?','What is your business model preference?','Do you have experience in securing funding?','How comfortable are you with technology and AI integration in business? (Scale of 1-5)','How risk-tolerant are you in business decisions? (Scale of 1-5)','What type of entrepreneurs do you prefer connecting with?']:
#             if data[col].dtype == 'object':
#                 le = LabelEncoder()
#                 data[col] = le.fit_transform(data[col].astype(str))
#                 label_encoders[col] = le

#         if user_id not in label_encoders['Email'].classes_:
#             return jsonify({"error": f"User ID '{user_id}' not found in the dataset"}), 404
        
#         weights = {
#             'What is your highest level of education?': 10,
#             'How many years of experience do you have in entrepreneurship?': 50,
#             'What stage is your current business in?':50,
#             'What is your business model preference?': 70,
#             'Do you have experience in securing funding?':70,
#             'How comfortable are you with technology and AI integration in business? (Scale of 1-5)':50,
#             'How risk-tolerant are you in business decisions? (Scale of 1-5)':75,
#             'What type of entrepreneurs do you prefer connecting with?': 80,
#             'What is your age-group?': 20,
#             'Email': 0,  # Include ID for reference but with no impact on similarity
#             'Name': 0,
#             'Phone Number': 0
#         }

#         weighted_df = data.copy()
#         for feature, weight in weights.items():
#             weighted_df[feature] = data[feature] * weight

#         scaler = StandardScaler()
#         weighted_df[['What is your age-group?', 'What is your highest level of education?', 'How many years of experience do you have in entrepreneurship?','What stage is your current business in?','What is your business model preference?','Do you have experience in securing funding?','How comfortable are you with technology and AI integration in business? (Scale of 1-5)','How risk-tolerant are you in business decisions? (Scale of 1-5)','What type of entrepreneurs do you prefer connecting with?']] = scaler.fit_transform(
#             weighted_df[['What is your age-group?', 'What is your highest level of education?', 'How many years of experience do you have in entrepreneurship?','What stage is your current business in?','What is your business model preference?','Do you have experience in securing funding?','How comfortable are you with technology and AI integration in business? (Scale of 1-5)','How risk-tolerant are you in business decisions? (Scale of 1-5)','What type of entrepreneurs do you prefer connecting with?']]
#         )

#         user_recommendations = get_matches(data, weighted_df, label_encoders, user_id)
#         if not user_recommendations:
#             return jsonify({"error": f"No matches found for user {user_id}"}), 404

#         return jsonify(user_recommendations)
    
#     except Exception as e:
#         return jsonify({"error": str(e)}), 500

# if __name__ == "__main__":
#     app.run(debug=True, host="0.0.0.0", port=8080)


# from flask import Flask, request, jsonify
# import pandas as pd
# from sklearn.preprocessing import LabelEncoder, StandardScaler
# from sklearn.metrics.pairwise import cosine_similarity
# from flask_cors import CORS

# app = Flask(__name__)
# CORS(app)  # Enable CORS for all routes

# # Preprocessing Function
# def preprocess(data):
#     relevant_columns = ['Email', 'Name', 'Phone Number', 'What is your age-group?', 'What is your highest level of education?', 'How many years of experience do you have in entrepreneurship?','What stage is your current business in?','What is your business model preference?','Do you have experience in securing funding?','How comfortable are you with technology and AI integration in business? (Scale of 1-5)','How risk-tolerant are you in business decisions? (Scale of 1-5)','What type of entrepreneurs do you prefer connecting with?']
#     return data[relevant_columns]

# # Match Function
# def get_matches(data, weighted_df, label_encoders, user_id, num_matches=5):
#     user_index = data[data['Email'] == user_id].index[0]
#     profile_df = weighted_df.iloc[user_index].values.reshape(1, -1)
#     scores = cosine_similarity(profile_df, weighted_df).flatten()
#     scores[user_index] = -1  # Exclude self
    
#     top_indices = scores.argsort()[-num_matches:][::-1]
    
#     decoded_records = []
#     for i in top_indices:
#         record = data.iloc[i].to_dict()
#         for feature in label_encoders.keys():
#             if feature in record:
#                 record[feature] = label_encoders[feature].inverse_transform([record[feature]])[0]
#         decoded_records.append(record)
    
#     return decoded_records

# @app.route("/find_matches", methods=["POST"])
# def find_matches():
#     try:
#         request_data = request.get_json()
#         user_id = request_data.get("user_id")

#         if not user_id:
#             return jsonify({"error": "User ID is required"}), 400

#         data = pd.read_csv("https://docs.google.com/spreadsheets/d/1zeniVRb5M1o999FLSF21uWdr7GgMXbdBLHiRfoTknaA/export?format=csv")
#         data = preprocess(data)

#         label_encoders = {}
#         for col in ['What is your age-group?', 'What is your highest level of education?', 'How many years of experience do you have in entrepreneurship?','What stage is your current business in?','What is your business model preference?','Do you have experience in securing funding?','How comfortable are you with technology and AI integration in business? (Scale of 1-5)','How risk-tolerant are you in business decisions? (Scale of 1-5)','What type of entrepreneurs do you prefer connecting with?']:
#             if data[col].dtype == 'object':
#                 le = LabelEncoder()
#                 data[col] = le.fit_transform(data[col].astype(str))
#                 label_encoders[col] = le

#         if user_id not in data['Email'].values:
#             return jsonify({"error": f"User ID '{user_id}' not found in the dataset"}), 404
        
#         weights = {
#             'What is your highest level of education?': 10,
#             'How many years of experience do you have in entrepreneurship?': 50,
#             'What stage is your current business in?': 50,
#             'What is your business model preference?': 70,
#             'Do you have experience in securing funding?': 70,
#             'How comfortable are you with technology and AI integration in business? (Scale of 1-5)': 50,
#             'How risk-tolerant are you in business decisions? (Scale of 1-5)': 75,
#             'What type of entrepreneurs do you prefer connecting with?': 80,
#             'What is your age-group?': 20,
#             'Email': 0,  # No weight for Email
#             'Name': 0,  # No weight for Name
#             'Phone Number': 0  # No weight for Phone Number
#         }

#         weighted_df = data.copy()
#         for feature, weight in weights.items():
#             weighted_df[feature] = data[feature] * weight

#         scaler = StandardScaler()
#         weighted_df[list(weights.keys())] = scaler.fit_transform(weighted_df[list(weights.keys())])

#         user_recommendations = get_matches(data, weighted_df, label_encoders, user_id)
#         if not user_recommendations:
#             return jsonify({"error": f"No matches found for user {user_id}"}), 404

#         return jsonify(user_recommendations)
    
#     except Exception as e:
#         return jsonify({"error": str(e)}), 500

# if __name__ == "__main__":
#     app.run(debug=True, host="0.0.0.0", port=8080)

from flask import Flask, request, jsonify
import pandas as pd
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.metrics.pairwise import cosine_similarity
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Preprocessing Function
def preprocess(data):
    relevant_columns = ['Email', 'Name', 'Phone Number', 'What is your age-group?', 'What is your highest level of education?', 'How many years of experience do you have in entrepreneurship?','What stage is your current business in?','What is your business model preference?','Do you have experience in securing funding?','How comfortable are you with technology and AI integration in business? (Scale of 1-5)','How risk-tolerant are you in business decisions? (Scale of 1-5)','What type of entrepreneurs do you prefer connecting with?']
    return data[relevant_columns]

# Match Function
def get_matches(data, weighted_df, label_encoders, user_id, num_matches=5):
    try:
        user_index = data[data['Email'] == user_id].index[0]
    except IndexError:
        return []
    
    profile_df = weighted_df.iloc[user_index].values.reshape(1, -1)
    scores = cosine_similarity(profile_df, weighted_df).flatten()
    scores[user_index] = -1  # Exclude self
    
    top_indices = scores.argsort()[-num_matches:][::-1]
    
    decoded_records = []
    for i in top_indices:
        record = data.iloc[i].to_dict()
        for feature in label_encoders.keys():
            if feature in record:
                record[feature] = label_encoders[feature].inverse_transform([record[feature]])[0]
        decoded_records.append(record)
    
    return decoded_records

@app.route("/find_matches", methods=["POST"])
def find_matches():
    try:
        request_data = request.get_json()
        user_id = request_data.get("user_id")

        if not user_id:
            return jsonify({"error": "User ID is required"}), 400

        data = pd.read_csv("https://docs.google.com/spreadsheets/d/1zeniVRb5M1o999FLSF21uWdr7GgMXbdBLHiRfoTknaA/export?format=csv")
        data = preprocess(data)

        label_encoders = {}
        categorical_columns = ['What is your age-group?', 'What is your highest level of education?', 'What stage is your current business in?', 'What is your business model preference?', 'Do you have experience in securing funding?', 'How comfortable are you with technology and AI integration in business? (Scale of 1-5)', 'How risk-tolerant are you in business decisions? (Scale of 1-5)', 'What type of entrepreneurs do you prefer connecting with?']
        
        for col in categorical_columns:
            if data[col].dtype == 'object':
                le = LabelEncoder()
                data[col] = le.fit_transform(data[col].astype(str))
                label_encoders[col] = le

        data['How many years of experience do you have in entrepreneurship?'] = pd.to_numeric(data['How many years of experience do you have in entrepreneurship?'], errors='coerce').fillna(0)
        
        if user_id not in data['Email'].values:
            return jsonify({"error": f"User ID '{user_id}' not found in the dataset"}), 404
        
        weights = {
            'What is your highest level of education?': 10,
            'How many years of experience do you have in entrepreneurship?': 50,
            'What stage is your current business in?': 50,
            'What is your business model preference?': 70,
            'Do you have experience in securing funding?': 70,
            'How comfortable are you with technology and AI integration in business? (Scale of 1-5)': 50,
            'How risk-tolerant are you in business decisions? (Scale of 1-5)': 75,
            'What type of entrepreneurs do you prefer connecting with?': 80,
            'What is your age-group?': 20,
            'Email': 0,  # No weight for Email
            'Name': 0,  # No weight for Name
            'Phone Number': 0  # No weight for Phone Number
        }

        for feature, weight in weights.items():
            if weight > 0:
                data[feature] *= weight

        scaler = StandardScaler()
        weighted_features = [key for key, value in weights.items() if value > 0]
        data[weighted_features] = scaler.fit_transform(data[weighted_features])

        user_recommendations = get_matches(data, data, label_encoders, user_id)
        if not user_recommendations:
            return jsonify({"error": f"No matches found for user {user_id}"}), 404

        return jsonify(user_recommendations)
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__== "__main__":
    app.run(debug=True, host="0.0.0.0", port=8080)
