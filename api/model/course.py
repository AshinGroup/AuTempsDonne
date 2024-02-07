from sqlalchemy import String, Column, ForeignKey, Table, Text
from sqlalchemy.orm import Mapped, mapped_column
from api.model.base import Base

class Course(Base):
    __tablename__ = "course"
    
    course_id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    title: Mapped[str] = mapped_column(String(30))
    description: Mapped[str] = mapped_column(Text)


follow_table = Table(
    "user_follows_course",
    Base.metadata,
    Column("user_id", ForeignKey("user.user_id"), primary_key=True),
    Column("course_id", ForeignKey("course.course_id"),  primary_key=True)

)
