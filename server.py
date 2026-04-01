from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle

app = Flask(__name__)

# ✅ allow requests from Chrome extension
CORS(app)

# load AI model
model = pickle.load(open("phishing_model.pkl", "rb"))
vectorizer = pickle.load(open("vectorizer.pkl", "rb"))

@app.route("/predict", methods=["POST", "OPTIONS"])
def predict():
    data = request.json["text"]

    vec = vectorizer.transform([data])
    prob = model.predict_proba(vec)[0][1]

    return jsonify({"risk": round(prob * 100, 2)})

if __name__ == "__main__":
    app.run(port=5000)