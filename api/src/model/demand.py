from database.db import db
import os


class Demand(db.Model):
    __tablename__ = "demand"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    submitted_datetime = db.Column(db.DateTime)
    limit_datetime = db.Column(db.DateTime)
    status = db.Column(db.Integer) # 0 = Submitted / 1 = In Progress / 2 = Demanded
    additional = db.Column(db.Text)
    collects = db.relationship(
        'Collect', secondary='collects_demand', back_populates='demands')
    shop_id = db.Column(db.Integer, db.ForeignKey('shop.id'), nullable=False)
 

    def json(self):
        return {'id': self.id,
                'submitted_datetime': self.submitted_datetime.strftime("%Y-%m-%d %H:%M:%S"),
                'limit_datetime': self.limit_datetime.strftime("%Y-%m-%d %H:%M:%S"),
                'status': self.status,
                'additional': self.additional,
                'shop' : self.shop.json_shop()
                }


    def json_rest_shop(self):
        return {'url': f"{os.getenv('API_PATH')}/demand/{self.id}",
                'id': self.id,
                'submitted_datetime': self.submitted_datetime.strftime("%Y-%m-%d %H:%M:%S"),
                'limit_datetime': self.limit_datetime.strftime("%Y-%m-%d %H:%M:%S"),
                'status': self.status,
                'additional': self.additional
                }
    

    def json_rest_collect(self):
        return {'url': f"{os.getenv('API_PATH')}/demand/{self.id}",
                'id': self.id,
                'submitted_datetime': self.submitted_datetime.strftime("%Y-%m-%d %H:%M:%S"),
                'limit_datetime': self.limit_datetime.strftime("%Y-%m-%d %H:%M:%S"),
                'status': self.status,
                'additional': self.additional,
                'shop' : self.shop.json_shop()
                }


