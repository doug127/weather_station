from sqlalchemy import Column, Integer, String, JSON, DateTime
from sqlalchemy.sql import func
from app.db.base import Base

class TrainedModel(Base):
    __tablename__ = "trained_models"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    version = Column(String, default="1.0")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    input_data = Column(JSON, nullable=False)
    model_path = Column(String, nullable=False)