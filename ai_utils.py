# ai_utils.py
import os
import json
import tempfile
import PyPDF2
from groq import Groq


# ============================================================
# GROQ CLIENT
# ============================================================
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

if not GROQ_API_KEY:
    raise ValueError("❌ GROQ_API_KEY not found. Add it to your .env file.")

# Initialize Groq client
client = Groq(api_key=GROQ_API_KEY)

MODEL = "llama-3.1-8b-instant"   # Fast + Free


# ============================================================
# INTERNAL CALL WRAPPER
# ============================================================
def _call_groq(prompt: str, max_tokens: int = 3000):
    """Internal safe wrapper for Groq API."""
    try:
        resp = client.chat.completions.create(
            model=MODEL,
            temperature=0.3,
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

FORMAT STRICTLY:

# {topic}

## 1. Introduction  
- Clear background  
- Why is this topic important  

## 2. Key Concepts (Detailed Explanation)  
- Use bullet points  
- Include formulas, definitions, diagrams (ASCII)

## 3. Examples  
- At least 3 real exam-level examples  
- Show solutions step-by-step  

## 4. Table Summary  
- Create a helpful comparison table  

## 5. ASCII Diagram  
- Provide flowchart / architecture / steps  

## 6. Real-life Applications  

## 7. Exam-oriented Short Notes  
- Bullet points  
- Must be crisp and useful for revision  

## 8. Keywords / Important Terms  

Make it:
- Long and structured  
- Very student-friendly  
- Easy to understand  
"""
    return _call_groq(prompt)


# ============================================================
# 2) STUDY PLAN
# ============================================================
def generate_plan(topic: str):
    prompt = f"""
Create a structured study plan for **{topic}**:
- Hour-by-hour schedule
- Pomodoro cycles
- Breaks
- Revision strategy
- Final summary
"""
    return _call_groq(prompt)


# ============================================================
# 3) ANSWER QUESTION
# ============================================================
def answer_question(question: str):
    prompt = f"""
Answer this question clearly and simply:

{question}

FORMAT:
1. Direct Answer
2. Step-by-step Breakdown
3. Simple Example
4. One-line Summary
"""
    return _call_groq(prompt)


# ============================================================
# 4) QUIZ GENERATOR
# ============================================================
def generate_quiz(topic: str):
    prompt = f"""
Generate a high-quality MCQ quiz for the topic **{topic}**.

Return STRICT JSON only:

[
  {{
    "q": "question text",
    "options": {{
        "A": "option text",
        "B": "option text",
        "C": "option text",
        "D": "option text"
    }},
    "answer": "A",
    "explanation": "explain why this is correct"
  }}
]

Rules:
- Generate EXACTLY 10 questions.
- Ensure only one correct answer.
- DO NOT add anything outside JSON.
"""
    text = _call_groq(prompt)

    try:
        start = text.find("[")
        end = text.rfind("]") + 1
        raw = json.loads(text[start:end])
    except:
        return [{
            "q": "Quiz parsing error.",
            "options": ["", "", "", ""],
            "answer": 0,
            "explanation": ""
        }]

    fixed_quiz = []
    for q in raw:
        opts = q.get("options", {})
        options_list = [
            opts.get("A", ""),
            opts.get("B", ""),
            opts.get("C", ""),
            opts.get("D", "")
        ]

        correct_letter = q.get("answer", "A").strip()
        correct_index = "ABCD".index(correct_letter) if correct_letter in "ABCD" else 0

        fixed_quiz.append({
            "q": q.get("q", ""),
            "options": options_list,
            "answer": correct_index,
            "explanation": q.get("explanation", "")
        })

    return fixed_quiz


# ============================================================
# 5) FLASHCARDS
# ============================================================
def generate_flashcards(topic: str, count=8):
    prompt = f"""
Generate {count} flashcards for **{topic}**.

Return JSON ONLY:
[
  {{"q":"", "a":""}}
]
"""
    text = _call_groq(prompt)

    try:
        start = text.find("[")
        end = text.rfind("]") + 1
        return json.loads(text[start:end])
    except:
        return [{"q": f"What is {topic}?", "a": "Definition"}]


# ============================================================
# 6) MINDMAP FROM TEXT
# ============================================================
def generate_mindmap_from_text(title: str, text: str):
    prompt = f"""
Create a mindmap for the following content:

{text[:2000]}

RETURN JSON:
{{
 "title": "",
 "ascii": "",
 "nodes": []
}}
"""
    resp = _call_groq(prompt)

    try:
        start = resp.find("{")
        return json.loads(resp[start:])
    except:
        return {
            "title": title,
            "ascii": f"{title}\n |\\\n A  B  C",
            "nodes": []
        }


# ============================================================
# 7) PDF → TEXT
# ============================================================
def extract_pdf_text(file):
    try:
        reader = PyPDF2.PdfReader(file)
        text = ""
        for p in reader.pages:
            if p.extract_text():
                text += p.extract_text() + "\n"
        return text.strip()
    except:
        return ""


# ============================================================
# 8) TEXT → PDF
# ============================================================
def notes_to_pdf_bytes(title: str, notes_text: str):
    from reportlab.pdfgen import canvas
    from reportlab.lib.pagesizes import A4

    tmp = tempfile.NamedTemporaryFile(delete=False, suffix=".pdf")
    path = tmp.name
    tmp.close()

    c = canvas.Canvas(path, pagesize=A4)
    width, height = A4
    y = height - 60

    c.setFont("Helvetica-Bold", 18)
    c.drawString(40, y, title)
    y -= 30

    c.setFont("Helvetica", 11)
    for line in notes_text.splitlines():
        if y < 50:
            c.showPage()
            y = height - 60
            c.setFont("Helvetica", 11)

        while len(line) > 95:
            c.drawString(40, y, line[:95])
            line = line[95:]
            y -= 14

        c.drawString(40, y, line)
        y -= 14

    c.save()

    with open(path, "rb") as f:
        pdf = f.read()

    os.unlink(path)
    return pdf


# ============================================================
# 9) TUTOR CHAT
# ============================================================
def chat_with_tutor(message: str):
    prompt = f"""
You are a friendly AI tutor. Explain simply and step-by-step.

User: {message}
"""
    return _call_groq(prompt)
