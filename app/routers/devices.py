from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import models, schemas
from ..database import get_db

router = APIRouter()

@router.get("/devices/", response_model=list[schemas.Device])
def read_devices(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    return db.query(models.Device).offset(skip).limit(limit).all()

@router.post("/devices/", response_model=schemas.Device)
def create_device(device: schemas.DeviceCreate, db: Session = Depends(get_db)):
    db_device = models.Device(name=device.name, status=device.status)
    db.add(db_device)
    db.commit()
    db.refresh(db_device)
    return db_device

@router.delete("/devices/{device_id}", response_model=schemas.Device)
def delete_device(device_id: int, db: Session = Depends(get_db)):
    db_device = db.query(models.Device).filter(models.Device.id == device_id).first()
    if not db_device:
        raise HTTPException(status_code=404, detail="Device not found")
    db.delete(db_device)
    db.commit()
    return db_device

@router.patch("/devices/{device_id}/toggle", response_model=schemas.Device)
def toggle_device_status(device_id: int, db: Session = Depends(get_db)):
    db_device = db.query(models.Device).filter(models.Device.id == device_id).first()
    if not db_device:
        raise HTTPException(status_code=404, detail="Device not found")
    db_device.status = not db_device.status
    db.commit()
    db.refresh(db_device)
    return db_device
