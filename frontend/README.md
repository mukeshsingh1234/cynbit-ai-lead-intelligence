
# Cynbit AI – Intelligent Lead & Project Discovery Agent

An AI-powered lead intelligence platform that analyzes customer inquiries, identifies service requirements, extracts budget and timeline information, scores leads, and recommends follow-up actions.

## Project Overview

Cynbit AI helps businesses understand incoming customer inquiries and prioritize potential leads using Machine Learning.

## Features

- AI-based service classification
- Customer budget extraction
- Project timeline extraction
- Automated lead scoring
- High, Medium and Low priority classification
- Recommended follow-up actions
- AI-generated suggested customer replies
- React-based dashboard
- Python FastAPI backend

## Technology Stack

### Frontend
- React.js
- Vite
- JavaScript
- CSS

### Backend
- Python
- FastAPI
- Scikit-learn
- TF-IDF Vectorizer
- Logistic Regression

## Project Structure

```text
AI ML/
├── frontend/
│   ├── src/
│   └── package.json
│
├── ai-engine/
│   ├── app/
│   │   └── main.py
│   └── venv/
│
└── README.md
```

## Installation and Setup

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

### 2. Start the Backend

```bash
cd ai-engine
```

Create and activate a virtual environment:

```bash
python -m venv venv
```

Windows PowerShell:

```powershell
.\venv\Scripts\Activate.ps1
```

Install dependencies:

```bash
pip install fastapi "uvicorn[standard]" scikit-learn pandas numpy
```

Start the API:

```bash
python -m uvicorn app.main:app --reload
```

Backend URL:

http://127.0.0.1:8000

API documentation:

http://127.0.0.1:8000/docs

### 3. Start the Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL shown by Vite in your browser.

## API Endpoint

### POST /api/analyze

Example request:

```json
{
  "message": "I need an ecommerce website with payment gateway. My budget is 100000 rupees and I need it within 30 days."
}
```

The API returns:
- Service category
- Confidence score
- Budget
- Timeline
- Lead score
- Priority
- Recommended action
- Suggested reply

## Machine Learning Approach

The current prototype uses:

- TF-IDF for text feature extraction
- Logistic Regression for service classification
- Rule-based extraction for budget and timeline
- Rule-based lead scoring and priority assignment

## Limitations

- The current model uses a small synthetic training dataset.
- Classification accuracy requires further evaluation using real, labelled data.
- Lead records are currently stored in frontend memory and are not persistent.
- The prototype does not yet include production authentication or database integration.
- Confidence scores should be treated as experimental.

## Future Improvements

- Expand the labelled training dataset.
- Integrate MongoDB for persistent lead storage.
- Add authentication and role-based access.
- Improve lead scoring with historical conversion data.
- Deploy the frontend and backend to production.

## Project Status

Functional Proof of Concept – Frontend and AI backend integration completed.
