


follow_table = Table(
    "user_follows_course",
    Base.metadata,
    Column("user_id", ForeignKey("user.user_id"), primary_key=True),
    Column("course_id", ForeignKey("course.course_id"),  primary_key=True)

)