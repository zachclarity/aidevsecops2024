import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from mangum import Mangum
import anthropic


app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

class Question(BaseModel):
    text: str

class Response(BaseModel):
    message: str

@app.post("/api/ask", response_model=Response)
async def ask_question(question: Question):
    if not question.text:
        raise HTTPException(status_code=400, detail="Question cannot be empty")


    client = anthropic.Anthropic(
     # defaults to os.environ.get("ANTHROPIC_API_KEY")
     api_key=os.environ.get("ANTHROPIC_API_KEY"),
    )

    aimessage = client.messages.create(
     model="claude-3-opus-20240229",
     max_tokens=1000,
     temperature=0,
     messages=[
        {"role": "user", "content": "Hello, world"}
     ]
    )
    
    # Here you would typically process the question or send it to another service
    # For now, we'll just return a simple response
    return Response(message=aimessage.content)

# Mangum handler to wrap the FastAPI app
handler = Mangum(app)

