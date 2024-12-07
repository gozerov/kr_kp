from pydantic import BaseModel

class DeviceBase(BaseModel):
    name: str
    status: bool = False

class DeviceCreate(DeviceBase):
    pass

class Device(DeviceBase):
    id: int

    class Config:
        orm_mode = True
