
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
import re

app = FastAPI(
    title="Cynbit AI Lead Intelligence API",
    description="AI-powered lead classification, scoring and response generation",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

training_texts = [
    "I need an ecommerce online shopping website",
    "Build an online store with payment gateway",
    "I want a shopping website for my products",
    "Need a mobile application for Android and iOS",
    "Develop an app for my business",
    "I need a mobile app with user login",
    "I want an AI chatbot for customer support",
    "Build an artificial intelligence chatbot",
    "Need machine learning automation for my company",
    "I need SEO and digital marketing services",
    "Help me with social media marketing",
    "I want online advertising and marketing",
    "Need a business website with contact form",
    "Create a portfolio website for my company",
    "I need a web application with dashboard",
]

training_labels = [
    "E-commerce Development",
    "E-commerce Development",
    "E-commerce Development",
    "Mobile App Development",
    "Mobile App Development",
    "Mobile App Development",
    "AI/ML Solutions",
    "AI/ML Solutions",
    "AI/ML Solutions",
    "Digital Marketing",
    "Digital Marketing",
    "Digital Marketing",
    "Web Development",
    "Web Development",
    "Web Development",
]

model = Pipeline([
    ("tfidf", TfidfVectorizer(ngram_range=(1, 2))),
    ("classifier", LogisticRegression(max_iter=1000))
])

model.fit(training_texts, training_labels)


class LeadRequest(BaseModel):
    message: str


def extract_budget(message):
    text = message.lower()

    patterns = [
        r"(?:₹|rs\.?|inr)\s*([\d,]+)",
        r"([\d,]+)\s*(?:rupees|rs\.?)",
    ]

    for pattern in patterns:
        match = re.search(pattern, text)
        if match:
            return "₹" + match.group(1)

    if "1 lakh" in text or "one lakh" in text:
        return "₹100000"

    return "Not specified"


def extract_timeline(message):
    text = message.lower()

    match = re.search(
        r"(\d+)\s*(day|days|week|weeks|month|months)",
        text
    )

    if match:
        return match.group(1) + " " + match.group(2)

    if "urgent" in text or "as soon as possible" in text:
        return "Urgent"

    return "Not specified"


def calculate_priority(message, budget, timeline):
    text = message.lower()
    score = 30

    if budget != "Not specified":
        score += 25

    if timeline != "Not specified":
        score += 20

    if any(word in text for word in ["urgent", "immediately", "asap"]):
        score += 15

    if any(word in text for word in ["ready to start", "hire", "purchase"]):
        score += 10

    score = min(score, 100)

    if score >= 70:
        priority = "High"
        action = "Schedule a discovery call immediately"
    elif score >= 45:
        priority = "Medium"
        action = "Contact the lead and understand requirements"
    else:
        priority = "Low"
        action = "Send an introductory email and follow up"

    return score, priority, action


def generate_reply(service, budget, timeline):
    return (
        f"Hello! Thank you for contacting Cynbit. "
        f"We would be happy to help you with {service}. "
        f"We have noted your budget as {budget} and timeline as "
        f"{timeline}. Our team will review your requirements "
        f"and get in touch with you shortly."
    )


@app.get("/")
def home():
    return {
        "success": True,
        "message": "Cynbit AI Lead Intelligence API is running"
    }


@app.get("/api/health")
def health():
    return {
        "status": "healthy",
        "model": "TF-IDF + Logistic Regression"
    }


@app.post("/api/analyze")
def analyze_lead(lead: LeadRequest):
    message = lead.message.strip()

    if not message:
        return {
            "success": False,
            "message": "Please enter a customer inquiry"
        }

    service = model.predict([message])[0]
    probabilities = model.predict_proba([message])[0]
    confidence = round(float(max(probabilities)) * 100, 2)

    budget = extract_budget(message)
    timeline = extract_timeline(message)

    score, priority, action = calculate_priority(
        message,
        budget,
        timeline
    )

    reply = generate_reply(service, budget, timeline)

    return {
        "success": True,
        "analysis": {
            "service": service,
            "confidence": confidence,
            "budget": budget,
            "timeline": timeline,
            "lead_score": score,
            "priority": priority,
            "recommended_action": action,
            "suggested_reply": reply
        }
    }
