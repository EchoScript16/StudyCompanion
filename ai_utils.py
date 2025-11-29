import os
import json
from io import BytesIO

# ============================================================
# FIX 1: REMOVE PROXY VARIABLES BEFORE ANY IMPORTS
# ============================================================
for key in ["HTTP_PROXY", "HTTPS_PROXY", "ALL_PROXY", "http_proxy", "https_proxy", "all_proxy"]:
    if key in os.environ:
        del os.environ[key]

from dotenv import load_dotenv

# ============================================================
# FIX 2: IMPORT httpx BEFORE GROQ
# ============================================================
import httpx

# ============================================================
# FIX 3: CREATE A NO-PROXY HTTP CLIENT
# ============================================================
no_proxy_client = httpx.Client(
    proxies=None,          # disable proxy usage
    trust_env=False,       # prevents reading proxy env vars
    follow_redirects=True,
)

from groq import Groq
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
import PyPDF2

load_dotenv()

# ============================================================
# GROQ CLIENT (Render-SAFE)
# ============================================================
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

if not GROQ_API_KEY:
    raise ValueError("❌ Missing GROQ_API_KEY in .env")

# FIX 4: Force Groq to use the clean HTTP client
client = Groq(
    api_key=GROQ_API_KEY,
    http_client=no_proxy_client
)

MODEL = "llama-3.1-8b-instant"


# ============================================================
# SAFE CALL WRAPPER
# ============================================================
def _call_groq(prompt: str, max_tokens: int = 3000):
    try:
        response = client.chat.completions.create(
            model=MODEL,
            temperature=0.2,
            max_tokens=max_tokens,
            messages=[{"role": "user", "content": prompt}]
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        return f"[AI Error] {str(e)}"


# ============================================================
# REST OF YOUR FUNCTIONS (UNCHANGED)
# ============================================================

def generate_notes(topic: str):
    prompt = f"""
Generate detailed, high-quality study notes for **{topic}**.

Follow EXACT format:

# {topic}

## 1. Introduction
- Background
- Importance

## 2. Key Concepts
- Bullet points
- Definitions
- ASCII diagrams

## 3. Examples
- 3 solved examples

## 4. Summary Table

## 5. ASCII Diagram

## 6. Applications

## 7. Exam Revision Notes
"""
    return _call_groq(prompt)


def generate_plan(topic: str):
    prompt = f"""
Create a structured study plan for **{topic}**.

Sections:
- Daily timetable
- Pomodoro plan
- Weekly revision
- Exam strategy
"""
    return _call_groq(prompt)


def answer_question(question: str):
    prompt = f"""
Answer the question step-by-step:

Question: {question}

Required:
1. Direct answer
2. Explanation
3. Example
4. One-line summary
"""
    return _call_groq(prompt)


def generate_quiz(topic: str):
    prompt = f"""
Generate 10 MCQs for **{topic}**
Return JSON ONLY.
"""
    text = _call_groq(prompt)

    try:
        text = text[text.index("["): text.rindex("]") + 1]
        raw = json.loads(text)
    except:
        return [{"q": "Error generating quiz", "options": ["", "", "", ""], "answer": 0}]

    quiz = []
    for q in raw:
        opts = q["options"]
        quiz.append({
            "q": q["q"],
            "options": [opts["A"], opts["B"], opts["C"], opts["D"]],
            "answer": "ABCD".index(q["answer"])
        })
    return quiz


def generate_flashcards(topic, count=8):
    prompt = f"Generate {count} flashcards for {topic}. JSON only."
    text = _call_groq(prompt)

    try:
        text = text[text.index("["): text.rindex("]") + 1]
        return json.loads(text)
    except:
        return [{"q": f"What is {topic}?", "a": "Definition"}]


def generate_mindmap_from_text(title, text):
    prompt = f"""
Create a hierarchical mindmap.
Return JSON only.
"""
    resp = _call_groq(prompt)

    try:
        return json.loads(resp[resp.index("{"): resp.rindex("}") + 1])
    except:
        return {"title": title, "children": []}


def extract_pdf_text(file):
    try:
        reader = PyPDF2.PdfReader(file)
        return "\n".join([p.extract_text() or "" for p in reader.pages])
    except:
        return ""


def notes_to_pdf_bytes(title: str, text: str):
    buf = BytesIO()
    pdf = canvas.Canvas(buf, pagesize=letter)

    pdf.setTitle(title)
    width, height = letter
    y = height - 40

    pdf.setFont("Helvetica-Bold", 18)
    pdf.drawString(40, y, title)
    y -= 30

    pdf.setFont("Helvetica", 11)
    for line in text.splitlines():
        if y < 40:
            pdf.showPage()
            pdf.setFont("Helvetica", 11)
            y = height - 40

        while len(line) > 95:
            pdf.drawString(40, y, line[:95])
            line = line[95:]
            y -= 14

        pdf.drawString(40, y, line)
        y -= 14

    pdf.save()
    buf.seek(0)
    return buf.getvalue()


def chat_with_tutor(message: str):
    prompt = f"You are an AI tutor. Explain simply.\nUser: {message}"
    return _call_groq(prompt)
