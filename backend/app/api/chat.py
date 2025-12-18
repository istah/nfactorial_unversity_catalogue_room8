"""
Chat endpoint for the university admissions assistant.

This module exposes a /chat POST endpoint that accepts user messages
and returns responses from the LangChain agent.
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from ..agent import create_university_agent
from ..core.config import get_settings

router = APIRouter()


class ChatRequest(BaseModel):
    """Request body for chat endpoint."""
    message: str
    chat_history: list[dict] | None = None


class ChatResponse(BaseModel):
    """Response body for chat endpoint."""
    response: str
    tool_calls: list[str] | None = None


# Cache agent instance (created on first request)
_agent = None


def get_agent():
    """Get or create the agent instance."""
    global _agent
    if _agent is None:
        settings = get_settings()
        if not settings.openai_api_key:
            raise HTTPException(
                status_code=500,
                detail="OPENAI_API_KEY not configured. Please set it in .env file."
            )
        _agent = create_university_agent(
            openai_api_key=settings.openai_api_key,
            model=settings.openai_model
        )
    return _agent


@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Send a message to the university admissions assistant.

    The assistant uses tools to search universities, get details,
    and compare options. It will never guess - always uses real data.

    Args:
        request: ChatRequest with user message and optional chat history

    Returns:
        ChatResponse with assistant's reply and list of tools used
    """
    if not request.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty")

    agent = get_agent()

    # Build messages list for LangChain v1 API
    messages = []
    if request.chat_history:
        for msg in request.chat_history:
            role = msg.get("role", "")
            content = msg.get("content", "")
            if role in ("user", "assistant"):
                messages.append({"role": role, "content": content})

    # Add current message
    messages.append({"role": "user", "content": request.message})

    try:
        result = agent.invoke({"messages": messages})

        # Extract response from messages
        response_text = ""
        if "messages" in result and result["messages"]:
            last_message = result["messages"][-1]
            if hasattr(last_message, "content"):
                response_text = last_message.content
            elif hasattr(last_message, "text"):
                response_text = last_message.text
            elif isinstance(last_message, dict):
                response_text = last_message.get("content", str(last_message))
            else:
                response_text = str(last_message)

        return ChatResponse(
            response=response_text,
            tool_calls=None  # Tool calls tracking simplified for v1 API
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Agent error: {str(e)}"
        )
