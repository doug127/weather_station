from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.schemas.trained_model import TrainedModelCreate, TrainedModelResponse
from app.crud.trained_model import create_trained_model
from app.db.session import get_db
from app.services.training import train_model

router = APIRouter()

@router.post("/", response_model=TrainedModelResponse)
def train_model_endpoint(
    model_data: TrainedModelCreate,
    db: Session = Depends(get_db)
):
    try:
        model_path = train_model(model_data.input_data)
        return create_trained_model(db, model_data, model_path)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
