from flask import Flask, request, jsonify
from flask_cors import CORS
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# 🧩 Data training lebih banyak dan seimbang
emails = [
    # spam
    "Win money now",
    "Limited offer, click this link",
    "You won a free ticket!",
    "Congratulations, claim your prize",
    "Earn $5000 working from home",
    "Exclusive discount just for you",
    "Free vacation offer, click here",
    "Update your account to avoid suspension",
    
    # not spam
    "Meeting schedule for tomorrow",
    "Let's have lunch together",
    "Hello, how are you?",
    "Can we reschedule our appointment?",
    "Your Amazon order has been shipped",
    "Reminder: team meeting at 10am",
    "Project deadline is next week",
    "Please review the attached report"
]

labels = [
    1, 1, 1, 1, 1, 1, 1, 1,   # spam
    0, 0, 0, 0, 0, 0, 0, 0    # not spam
]

# ⚙️ Gunakan TF-IDF (lebih akurat daripada CountVectorizer)
vectorizer = TfidfVectorizer()
X_train = vectorizer.fit_transform(emails)

model = MultinomialNB()
model.fit(X_train, labels)

@app.route("/api/screen", methods=["POST"])
def screen_email():
    data = request.get_json()
    text = data.get("text", "")
    if not text.strip():
        return jsonify({"error": "No text provided"}), 400

    X_test = vectorizer.transform([text])
    prediction = model.predict(X_test)[0]
    result = "spam" if prediction == 1 else "not spam"
    return jsonify({"result": result})

@app.route("/")
def home():
    return jsonify({"message": "Backend Python is running!"})

if __name__ == "__main__":
    app.run(debug=True)