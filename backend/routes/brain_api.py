import os
import uuid
import json
from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Dict, List, Optional, Any

router = APIRouter()

brains = {}
memories = {}
training_status = {}

class BrainBase(BaseModel):
    name: str
    description: str
    training: Dict[str, Any]

class BrainCreate(BrainBase):
    pass

class BrainUpdate(BaseModel):
    active: bool

class BrainResponse(BrainBase):
    id: str
    active: bool = False

class TrainingConfig(BaseModel):
    brainId: str
    synthesisMode: str
    baseModel: str
    learningRate: float
    epochs: int
    threads: int
    enableGPU: bool
    thinkingModel: bool

class TrainingResponse(BaseModel):
    id: str
    status: str
    message: str

class MemoryUpload(BaseModel):
    brainId: str
    content: str = ""
    title: str = ""
    source: str = ""

@router.get("/second-me/roles", response_model=List[BrainResponse])
async def get_brains():
    """Get all brains"""
    return [
        BrainResponse(
            id=brain_id,
            name=brain["name"],
            description=brain["description"],
            training=brain["training"],
            active=brain.get("active", False)
        )
        for brain_id, brain in brains.items()
    ]

@router.post("/second-me/roles", response_model=BrainResponse)
async def create_brain(brain: BrainCreate):
    """Create a new brain"""
    brain_id = str(uuid.uuid4())
    brain_data = brain.dict()
    brain_data["active"] = False
    brains[brain_id] = brain_data
    
    return BrainResponse(id=brain_id, **brain_data)

@router.put("/second-me/roles/{brain_id}", response_model=BrainResponse)
async def update_brain(brain_id: str, update: BrainUpdate):
    """Update a brain's active status"""
    if brain_id not in brains:
        raise HTTPException(status_code=404, detail="Brain not found")
    
    brains[brain_id]["active"] = update.active
    
    return BrainResponse(
        id=brain_id,
        name=brains[brain_id]["name"],
        description=brains[brain_id]["description"],
        training=brains[brain_id]["training"],
        active=brains[brain_id]["active"]
    )

@router.post("/second-me/memory/upload")
async def upload_memory(
    file: Optional[UploadFile] = File(None),
    brainId: str = Form(...),
    content: str = Form(""),
    title: str = Form(""),
    source: str = Form("")
):
    """Upload a memory to a brain"""
    if brainId not in brains:
        raise HTTPException(status_code=404, detail="Brain not found")
    
    memory_id = str(uuid.uuid4())
    memory_data = {
        "id": memory_id,
        "brainId": brainId,
        "content": content,
        "title": title,
        "source": source,
        "filename": file.filename if file else None
    }
    
    if file:
        memory_data["file_content"] = file.file.read()
    
    memories[memory_id] = memory_data
    
    return JSONResponse({"id": memory_id, "status": "success"})

@router.delete("/second-me/memory/{filename}")
async def delete_memory(filename: str):
    """Delete a memory"""
    memory_id = None
    for mid, memory in memories.items():
        if memory.get("filename") == filename:
            memory_id = mid
            break
    
    if not memory_id:
        raise HTTPException(status_code=404, detail="Memory not found")
    
    del memories[memory_id]
    
    return JSONResponse({"status": "success"})

@router.post("/second-me/training/start", response_model=TrainingResponse)
async def start_training(config: TrainingConfig):
    """Start training a brain"""
    if config.brainId not in brains:
        raise HTTPException(status_code=404, detail="Brain not found")
    
    training_id = str(uuid.uuid4())
    training_status[training_id] = {
        "brainId": config.brainId,
        "status": "completed",  # Simulate immediate completion for demo
        "message": "Training completed successfully"
    }
    
    return TrainingResponse(
        id=training_id,
        status="completed",
        message="Training completed successfully"
    )

@router.get("/second-me/training/status")
async def get_training_status(brainId: str):
    """Get the status of a brain's training"""
    for training_id, training in training_status.items():
        if training["brainId"] == brainId:
            return JSONResponse({
                "id": training_id,
                "status": training["status"],
                "message": training["message"]
            })
    
    return JSONResponse({
        "status": "not_found",
        "message": "No training found for this brain"
    })
