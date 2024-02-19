from sqlalchemy import String, Column, ForeignKey, Table, Text, DateTime
from sqlalchemy.orm import Mapped, mapped_column

class Activity(Base):
    __tablename__ = "activity"
    
    activity_id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    type: Mapped[str] = mapped_column(String(30))
    date: Mapped[DateTime] = mapped_column(DateTime)
    activity_location: Mapped[str] = mapped_column(Text)


participate_table = Table(
    "user_participates_activity",
    Base.metadata,
    Column("user_id", ForeignKey("user.user_id"), primary_key=True),
    Column("activity_id", ForeignKey("activity.activity_id"),  primary_key=True)

)
