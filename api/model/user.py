from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column
from api.model.base import Base

class User(Base):
    __tablename__ = "user"
    
    user_id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    first_name: Mapped[str] = mapped_column(String(30))
    last_name: Mapped[str] = mapped_column(String(30))
    mail: Mapped[str] = mapped_column(String(320), unique=True)
    phone: Mapped[str] = mapped_column(String(15))
    role: Mapped[str] = mapped_column(String(15)) # volunteer / beneficiary / admin

