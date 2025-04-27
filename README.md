# Customer-Retention-Assessment

## Overview

Customer Retention Assessment (CRA) is a project designed to help businesses analyze and improve customer retention by leveraging machine learning and data visualization techniques. The project uses a **Random Forest model** to train on historical customer data, providing valuable insights when queried by a customer ID. It incorporates a **Flask** backend and a **React** frontend, offering a user-friendly interface for interaction.

## Features

- **Customer Database Analysis**: Process and analyze customer data to generate insights.
- **Random Forest Model**: Machine learning model to predict customer retention based on historical data.
- **Data Visualizations**: Visual representation of customer retention metrics and trends.
- **Flask Backend**: RESTful API to handle data processing and model predictions.
- **React Frontend**: User interface for users to input a customer ID and receive insights.

## Technologies Used

- **Backend**: Flask
- **Frontend**: React
- **Machine Learning**: Random Forest (scikit-learn)
- **Database**: SQLite (or another database you prefer)
- **Data Visualization**: Matplotlib / Plotly / Seaborn
- **Deployment**: Docker (optional, if you're using it for deployment)

## Installation

Follow these steps to set up the project locally:

# 1. Clone the repository
git clone https://github.com/Chitucoder/Customer-Retention-Assessment.git
cd cra-project

# 2. Create and activate a virtual environment
python -m venv venv
source venv/bin/activate  # On Windows, use 'venv\Scripts\activate'

# 3. Install the required backend dependencies
pip install -r requirements.txt

# 4. Run the Flask backend
python backend.py  # The backend will be running at http://127.0.0.1:5000

# 5. Navigate to the frontend directory
cd frontend

# 6. Install the required frontend dependencies
npm install

# 7. Start the React frontend
npm run dev  # The frontend will be running at http://localhost:3000
