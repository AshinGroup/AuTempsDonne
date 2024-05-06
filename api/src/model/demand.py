from database.db import db
import os


class Demand(db.Model):
    __tablename__ = "demand"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    submitted_datetime = db.Column(db.DateTime)
    limit_datetime = db.Column(db.DateTime)
    status = db.Column(db.Integer) # 0 = Submitted / 1 = In Progress / 2 = Demanded
    additional = db.Column(db.Text)
    collect_id = db.Column(db.Integer, db.ForeignKey('collect.id'))
    shop_id = db.Column(db.Integer, db.ForeignKey('shop.id'), nullable=False)
    qr_code = db.Column(db.String(200))
    pdf = db.Column(db.String(200))
 

    def json(self):
        return {'id': self.id,
                'submitted_datetime': self.submitted_datetime.strftime("%Y-%m-%d %H:%M:%S"),
                'limit_datetime': self.limit_datetime.strftime("%Y-%m-%d %H:%M:%S"),
                'status': self.status,
                'additional': self.additional,
                'qr_code': self.qr_code,
                'pdf': self.pdf,
                'shop' : self.shop.json_rest_demand(),
                'collect': self.collect.json_rest_demand() if self.collect else None
                }


    def json_rest_shop(self):
        return {'url': f"{os.getenv('API_PATH')}/demand/{self.id}",
                'id': self.id,
                'submitted_datetime': self.submitted_datetime.strftime("%Y-%m-%d %H:%M:%S"),
                'limit_datetime': self.limit_datetime.strftime("%Y-%m-%d %H:%M:%S"),
                'status': self.status,
                'additional': self.additional,
                'qr_code': self.qr_code,
                'pdf': self.pdf,
                'collect': self.collect.json_rest_demand() if self.collect else None
                }
    

    def json_rest_collect(self):
        return {'url': f"{os.getenv('API_PATH')}/demand/{self.id}",
                'id': self.id,
                'submitted_datetime': self.submitted_datetime.strftime("%Y-%m-%d %H:%M:%S"),
                'limit_datetime': self.limit_datetime.strftime("%Y-%m-%d %H:%M:%S"),
                'status': self.status,
                'additional': self.additional,
                'shop' : self.shop.json_rest_demand(),
                'qr_code': self.qr_code,
                'pdf': self.pdf,
                }


