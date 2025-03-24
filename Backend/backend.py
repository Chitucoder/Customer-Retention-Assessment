import pickle
import os
from webbrowser import get
import pandas as pd
from flask_cors import CORS
from flask import Flask,request
from flask import jsonify
import numpy as np
from sklearn.preprocessing import OneHotEncoder
from sklearn.ensemble import RandomForestClassifier
import sqlalchemy
from sqlalchemy import create_engine, Column, Integer, String,text
from sqlalchemy.orm import declarative_base, sessionmaker
import itertools
app = Flask(__name__)
CORS(app)   

engine = create_engine("sqlite:///files\CustomerDataBase.db")
Session = sessionmaker(bind=engine)


features = ['customer_id','age', 'gender', 'tenure', 'usage_frequency', 'support_calls', 'payment_delay', 'subscription_type','contract_length', 'total_spend', 'last_interaction',  'churn']

def getFeatures(custId):
    session = Session()
    q = "SELECT * FROM customers WHERE customer_id == " + str(custId)
    query = text(q)
    result = session.execute(query)
    session.close()
    return result.fetchall()



class CustomerChurnClassifier:
    
    def __init__(self, model_path, encoder_path):
        
        with open(model_path, 'rb') as file:
            self.model = pickle.load(file)
            
        with open(encoder_path, 'rb') as file:
            self.encoder = pickle.load(file)
    
    def predict(self, age: int, tenure: int, usage_frequency: int, support_calls: int, payment_delay: int, total_spend: float, last_interaction: int, gender: str, subscription_type: str, contract_length: str):
        
        # Checking input datatypes
        expected_data_types = [int, int, int, int, int, float, int, str, str, str]
        input_arguments = [age, tenure, usage_frequency, support_calls, payment_delay, total_spend, last_interaction, gender, subscription_type, contract_length]
        input_arguments_names = ['age', 'tenure', 'usage_frequency', 'support_calls', 'payment_delay', 'total_spend', 'last_interaction', 'gender', 'subscription_type', 'contract_length']

        for i in range(len(input_arguments)):
            current_arg_type = type(input_arguments[i])

            if current_arg_type != expected_data_types[i]:
                raise TypeError(f"Error: Given {input_arguments_names[i]} ({current_arg_type.__name__}) is not of the expected type ({expected_data_types[i].__name__}).")
                
        # Checking gender, subscription_type, and contract_length values
        valid_genders = ['Female', 'Male']
        valid_subscription_types = ['Standard', 'Basic', 'Premium']
        valid_contract_lengths = ['Annual', 'Monthly', 'Quarterly']

        if gender not in valid_genders:
            raise ValueError(f"Error: Invalid gender value '{gender}'. Expected one of {valid_genders}.")

        if subscription_type not in valid_subscription_types:
            raise ValueError(f"Error: Invalid subscription_type value '{subscription_type}'. Expected one of {valid_subscription_types}.")

        if contract_length not in valid_contract_lengths:
            raise ValueError(f"Error: Invalid contract_length value '{contract_length}'. Expected one of {valid_contract_lengths}.")
            
            
        
        # One Hot Encoding
        ohe_data = list(self.encoder.transform([[gender, subscription_type, contract_length]])[0])
        
        to_predict_array = [age, tenure, usage_frequency, support_calls, payment_delay, total_spend, last_interaction] + ohe_data
        to_predict_array = np.array(to_predict_array).reshape((1, -1))
        proba = self.model.predict_proba(to_predict_array)[0]
        print(proba)
        return proba


customer_churn = CustomerChurnClassifier('files\customer_churn_random_forest_model.pkl', 'files\encoder.pkl')

@app.route("/predict",methods=["POST"])
def info():
    custId = request.data.decode('utf-8')
    ftrs = getFeatures(custId)
    fd = dict(zip(features,ftrs[0]))
    proba = customer_churn.predict(
        age=int(fd['age']),
        tenure = int(fd['tenure']),
        usage_frequency= int(fd['usage_frequency']), 
        support_calls= int(fd['support_calls']), 
        payment_delay= int(fd['payment_delay']), 
        total_spend= float(fd['total_spend']), 
        last_interaction= int(fd['last_interaction']), 
        gender= str(fd['gender']), 
        subscription_type= str(fd['subscription_type']), 
        contract_length= str(fd['contract_length'])
    )
    fd['yes'] = proba[1]
    fd['no'] = proba[0]
    return jsonify(fd)
    
@app.route("/agedistributiondata",methods=["GET"])
def agedistributiondata():
    session = Session()
    query = text("SELECT age FROM customers")
    allAges = session.execute(query)
    allAges = allAges.fetchall()
    ages = list(itertools.chain(*allAges))
    bins = [18, 30, 40, 50, 60, 70]
    labels = ["18-30", "30-40", "40-50", "50-60", "60-70"]
    age_bins = pd.cut(ages, bins=bins, labels=labels, right=False)
    age_sort = age_bins.value_counts().sort_index()
    dict_age = age_sort.to_dict()
    converted_data = [{"agegroup": k, "count": v} for k, v in dict_age.items()]
    session.close()
    return jsonify(converted_data)
    
@app.route("/subtypepie",methods=["GET"])
def subscriptiontypeinfo():
    session = Session()
    query = text("SELECT subscription_type FROM customers")
    subType = session.execute(query)
    subType = subType.fetchall()
    subType = list(itertools.chain(*subType))
    dict_subtype = {"Standard":0,"Premium":0,"Basic":0}
    for i in subType:
        dict_subtype[i] = dict_subtype[i]+1
    converted_data = [{"subscription": k, "count": v,"percent": ((v/10000)*100)} for k, v in dict_subtype.items()]
    session.close()
    return jsonify(converted_data)
    
@app.route("/suppersub",methods=["GET"])
def suppersubinfo():
    session = Session()
    query = text("SELECT subscription_type,support_calls FROM customers")
    subp = session.execute(query)
    subp = subp.fetchall()
    res = dict({'Standard':0,'Premium':0,'Basic':0})
    for key,value in subp:
        res[key] = res[key] + value
    converted_data = [{"subscription": k, "support calls": v} for k, v in res.items()]
    session.close()
    return jsonify(converted_data)

if(__name__ == '__main__'):
    app.run()