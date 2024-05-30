import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
import json

# Initialize Firebase Admin SDK
cred = credentials.Certificate("./firebase.json")  # Replace with your service account key path
firebase_admin.initialize_app(cred)

# Create a Firestore client
db = firestore.client()

# Specify the reference path
ref_path = "databaseDataRaw"  # Replace with the desired reference path

# Read the data from JSON file
with open("./dataraw.json", encoding="utf8") as json_file:  # Replace with the actual path to your JSON file
    data = json.load(json_file)

# Upload each data entry to Firestore if it doesn't already exist
for entry in data:
    unique_id = entry.get("unique_id")  # Replace "unique_id" with the actual unique identifier key in your data

    # Query Firestore to check if the entry already exists
    query = db.collection(ref_path).where("unique_id", "==", unique_id)  # Replace "unique_id" with the actual field name in Firestore
    existing_entries = query.get()

    # Upload the entry only if it doesn't already exist
    if len(existing_entries) == 0:
        doc_ref = db.collection(ref_path).document()
        doc_ref.set(entry)
        print(f"Uploaded entry with unique_id: {unique_id}")
    else:
        print(f"Skipping entry with unique_id {unique_id} as it already exists in the database.")

print("Data upload completed.")
