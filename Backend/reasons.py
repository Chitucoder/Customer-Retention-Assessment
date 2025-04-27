from socket import timeout
import google.generativeai as genai
import os
import marko
from requests.exceptions import RequestException, Timeout
apikey = "AIzaSyCj1E9VFmppU6pHnJpxq_oELpDF0uOgscs"

genai.configure(api_key=apikey)

model = genai.GenerativeModel('gemini-1.5-pro-latest')
h = "a" + "b"
def rec(fd):
    prompt_parts = "User will provide a customer data and churn probability of customer. Based on the data, you have to come up with the reasons of why customer would churn or wouldn't churn. Provide information in 4-5 lines not more than that. \n\nCustomer's data:\n\n" + "age ="+ str(fd['age'])+"\ntenure ="+  str(fd['tenure'])+"\nusage_frequency ="+ str( fd['usage_frequency'])+ "\nsupport_calls ="+  str(fd['support_calls'])+ "\npayment_delay ="+  str(fd['payment_delay'])+ "\ntotal_spend= "+ str(fd['total_spend'])+"\nlast_interaction= "+ str(fd['last_interaction'])+ "\ngender= "+ str(fd['gender'])+ "\nsubscription_type= "+ str(fd['subscription_type'])+ "\ncontract_length= "+ str(fd['contract_length'])+"\nProbability of leaving service = "+ str(fd['yes'])    
    response = model.generate_content(prompt_parts)
    bot_response = response.text
    fd['response'] = bot_response
    return fd
