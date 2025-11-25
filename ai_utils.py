import os
import json
from io import BytesIO
from dotenv import load_dotenv
from groq import Groq
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter

load_dotenv()

# ============================================================
# GROQ CLIENT
# ============================================================
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

if not GROQ_API_KEY:
    raise ValueError("❌ GROQ_API_KEY missing in .env")

client = Groq(api_key=GROQ_API_KEY)
MODEL = "llama-3.1-8b-instant"   # Fast + good output


# ============================================================
# SAFE GROQ CALL WRAPPER
# ============================================================
def _call_groq(prompt: str, max_tokens: int = 3000):
    try:
        resp = client.chat.completions.create(
            model=MODEL,
            temperature=0.2,
            max_tokens=max_tokens,
            messages=[{"role": "user", "content": prompt}]
        )
        return resp.choices[0].message.content.strip()
    except Exception as e:
        return f"[AI Error] {str(e)}"


# ============================================================
# 1) NOTES GENERATOR
# ============================================================
def generate_notes(topic: str):
    prompt = f"""
Generate detailed, high-quality study notes for **{topic}**.

Follow EXACT format:

# {topic}

## 1. Introduction  
- Clear background  
- Why important  

## 2. Key Concepts  
- Bullet points  
- Definitions  
- Diagrams (ASCII)

## 3. Examples  
- 3 exam-level examples with solutions  

## 4. Summary Table  
- A comparison table  

## 5. Diagram  
- ASCII Flowchart  

## 6. Applications  

## 7. Exam Revision Notes  
- Crisp, bullet points

Write in student-friendly language.
"""
    return _call_groq(prompt)


# ============================================================
# 2) STUDY PLAN
# ============================================================
def generate_plan(topic: str):
    prompt = f"""
Create a fully structured study plan for **{topic}**.

Required sections:
- Daily timetable
- Pomodoro schedule
- Weekly revision plan
- Exam strategy
- Final summary
"""
    return _call_groq(prompt)


# ============================================================
# 3) ANSWER QUESTION
# ============================================================
def answer_question(question: str):
    prompt = f"""
Explain the answer step-by-step:

Question: {question}

Required output:
1. Direct answer  
2. Explanation  
3. Example  
4. One-line summary  
"""
    return _call_groq(prompt)


# ============================================================
# 4) QUIZ GENERATOR
# ============================================================
def generate_quiz(topic: str):
    prompt = f"""
Generate a 10-question MCQ quiz on **{topic}**.

Return STRICT JSON ONLY:

[
  {{
    "q": "question?",
    "options": {{
      "A": "",
      "B": "",
      "C": "",
      "D": ""
    }},
    "answer": "A",
    "explanation": ""
  }}
]
"""
    text = _call_groq(prompt)

    try:
        text = text[text.index("[") : text.rindex("]") + 1]
        raw = json.loads(text)
    except:
        return [{"q": "Quiz Error", "options": ["", "", "", ""], "answer": 0, "explanation": ""}]

    quiz = []
    for q in raw:
        opts = q.get("options", {})
        quiz.append({
            "q": q.get("q", ""),
            "options": [
                opts.get("A", ""),
                opts.get("B", ""),
                opts.get("C", ""),
                opts.get("D", ""),
            ],
            "answer": "ABCD".index(q.get("answer", "A")),
            "explanation": q.get("explanation", "")
        })
    return quiz


# ============================================================
# 5) FLASHCARDS
# ============================================================
def generate_flashcards(topic: str, count=8):
    prompt = f"""
Generate {count} flashcards for **{topic}**.

Return JSON ONLY:
[
  {{"q": "", "a": ""}}
]
"""
    text = _call_groq(prompt)

    try:
        text = text[text.index("[") : text.rindex("]") + 1]
        return json.loads(text)
    except:
        return [{"q": f"What is {topic}?", "a": "Definition"}]


# ============================================================
# 6) MINDMAP GENERATOR (IMPROVED)
# ============================================================
def generate_mindmap_from_text(title: str, text: str):
    prompt = f"""
Create a hierarchical mindmap for this text:

{text[:2000]}

Return STRICT JSON ONLY:

{{
  "title": "{title}",
  "children": [
    {{
      "title": "Subtopic",
      "children": [
         "point1",
         "point2"
      ]
    }}
  ]
}}
No extra text. No explanation.
"""
    resp = _call_groq(prompt)

    try:
        resp = resp[resp.index("{") : resp.rindex("}") + 1]
        return json.loads(resp)
    except:
        return {
            "title": title,
            "children": [
                {"title": "Mindmap generation failed", "children": []}
            ]
        }


# ============================================================
# 7) PDF → TEXT
# ============================================================
import PyPDF2
def extract_pdf_text(file):
    try:
        reader = PyPDF2.PdfReader(file)
        text = ""
        for page in reader.pages:
            if page.extract_text():
                text += page.extract_text() + "\n"
        return text.strip()
    except:
        return ""


# ============================================================
# 8) TEXT → PDF (Improved)
# ============================================================
def notes_to_pdf_bytes(title: str, notes_text: str):
    """Generate PDF and return bytes directly (no temp files)."""
    buffer = BytesIO()
    pdf = canvas.Canvas(buffer, pagesize=letter)

    pdf.setTitle(title)
    width, height = letter
    y = height - 50

    pdf.setFont("Helvetica-Bold", 18)
    pdf.drawString(40, y, title)
    y -= 30

    pdf.setFont("Helvetica", 11)
    for line in notes_text.splitlines():
        if y < 40:
            pdf.showPage()
            pdf.setFont("Helvetica", 11)
            y = height - 50

        # wrap long lines
        while len(line) > 95:
            pdf.drawString(40, y, line[:95])
            line = line[95:]
            y -= 14

        pdf.drawString(40, y, line)
        y -= 14

    pdf.save()
    buffer.seek(0)
    return buffer.getvalue()


# ============================================================
# 9) TUTOR CHAT
# ============================================================
def chat_with_tutor(message: str):
    prompt = f"""
You are a very friendly AI tutor. Explain concepts simply.

User: {message}
"""
    return _call_groq(prompt)
