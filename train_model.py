import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
import pickle

print("Loading dataset...")

# load dataset
data = pd.read_csv("emails.csv")

# keep required columns
data = data[['Email Text', 'Email Type']]
data.columns = ['text', 'label']

print("Cleaning data...")

# remove empty rows
data.dropna(inplace=True)

# remove rows with empty text
data = data[data['text'].str.strip() != ""]

# clean label values
data['label'] = data['label'].str.strip()

# map labels
data['label'] = data['label'].map({
    'Phishing Email': 1,
    'Safe Email': 0
})

# remove rows where mapping failed
data.dropna(inplace=True)

print("Remaining samples:", len(data))

# split dataset
X_train, X_test, y_train, y_test = train_test_split(
    data['text'],
    data['label'],
    test_size=0.2,
    random_state=42
)

print("Training model...")

# convert text into numeric features
vectorizer = TfidfVectorizer(stop_words='english')
X_train_vec = vectorizer.fit_transform(X_train)
X_test_vec = vectorizer.transform(X_test)

# train model
model = LogisticRegression(max_iter=1000)
model.fit(X_train_vec, y_train)

print("Evaluating model...")

# predictions
predictions = model.predict(X_test_vec)

# accuracy
accuracy = accuracy_score(y_test, predictions)
print("\nModel Accuracy:", round(accuracy * 100, 2), "%")

# confusion matrix
print("\nConfusion Matrix:")
print(confusion_matrix(y_test, predictions))

# classification report
print("\nClassification Report:")
print(classification_report(y_test, predictions))

# save model & vectorizer
pickle.dump(model, open("phishing_model.pkl", "wb"))
pickle.dump(vectorizer, open("vectorizer.pkl", "wb"))

print("\n✅ Model trained & saved successfully!")