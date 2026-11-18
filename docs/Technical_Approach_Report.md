# Technical Approach Report
## Cynbit AI – Intelligent Lead & Project Discovery Agent

### 1. Introduction

The Cynbit AI Lead & Project Discovery Agent is a proof of concept designed to analyze customer inquiries and convert unstructured messages into useful business information.

The system identifies the requested service, extracts budget and project timeline, calculates a lead priority score, and recommends a next action.

### 2. System Architecture

The application has two main components:

**Frontend – React.js**
- Provides the user interface.
- Allows users to submit customer inquiries.
- Sends inquiry text to the backend API.
- Displays category, budget, timeline, priority, and suggested reply.

**Backend – Python FastAPI**
- Receives customer messages through a REST API.
- Processes the inquiry text.
- Uses a Machine Learning model for service classification.
- Extracts budget and timeline.
- Calculates lead score and priority.
- Returns structured JSON results.

### 3. Data Flow

1. User enters a customer inquiry in the React dashboard.
2. Frontend sends a POST request to `/api/analyze`.
3. FastAPI receives the message.
4. Text is passed to the trained classification pipeline.
5. TF-IDF converts text into numerical features.
6. Logistic Regression predicts the service category.
7. Pattern matching extracts budget and timeline.
8. Rule-based logic calculates the lead score.
9. Backend generates a recommended action and suggested reply.
10. Frontend displays the analysis results.

### 4. Machine Learning Approach

**Text Vectorization: TF-IDF**

TF-IDF (Term Frequency–Inverse Document Frequency) converts text into numerical features that a Machine Learning model can process.

It gives importance to words based on their frequency in a message and their distribution across the training dataset.

**Classification: Logistic Regression**

Logistic Regression is used to predict the service category from the processed inquiry text.

The current proof of concept uses synthetic training examples for categories such as:

- E-commerce
- Web Development
- Mobile Application
- AI/ML
- Digital Marketing

The TF-IDF vectorizer and Logistic Regression classifier are combined into a Scikit-learn pipeline.

### 5. Information Extraction

The backend uses basic pattern matching and regular expressions to identify:

- Budget