import pandas as pd 
from joblib import load
from flask import Flask, request, jsonify
from flask_cors import CORS
from category_encoders import BinaryEncoder

api = Flask(__name__)
CORS(api)

model = load('decision_tree_model.joblib')

x = pd.read_csv('brain_tumor_dataset.csv')

categorical_features = [col for col in ['Gender', 'Tumor_Type', 'Location', 'Histology', 'Stage', 
                                        'Symptom_1', 'Symptom_2', 'Symptom_3', 'Radiation_Treatment', 
                                        'Surgery_Performed', 'Chemotherapy', 'Family_History', 
                                        'MRI_Result'] if col in x.columns]

encoder = BinaryEncoder()
if categorical_features:
    x_encoded = encoder.fit_transform(x[categorical_features])


@api.post("/api/predict")
def predict_follow_up_check_up():
    data = request.get_json()
    input_df = pd.DataFrame([data])


    input_encoded = encoder.transform(input_df[categorical_features])

    input_df = input_df.drop(categorical_features, axis=1)

    input_encoded = input_encoded.reset_index(drop=True)
    final_input = pd.concat([input_df, input_encoded], axis=1)

    prediction = model.predict_proba(final_input)
    class_labels = model.classes_

    response = []
    for prob in prediction:
        prob_dict = {}
        for k,v in zip(class_labels, prob):
            prob_dict[str(k)] = round(float(v)*100, 2)
            response.append(prob_dict)

    return jsonify({"Prediction": response})

if __name__ == '__main__'  :
    api.run(debug=True, port=8080)     

