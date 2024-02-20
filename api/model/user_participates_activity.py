

participate_table = Table(
    "user_participates_activity",
    Base.metadata,
    Column("user_id", ForeignKey("user.user_id"), primary_key=True),
    Column("activity_id", ForeignKey("activity.activity_id"),  primary_key=True)

)