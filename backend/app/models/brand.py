from datetime import datetime, timezone
from ..extensions import db


class Brand(db.Model):
    __tablename__ = 'brands'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    name_en = db.Column(db.String(100), default='')
    country = db.Column(db.String(50), default='')
    description = db.Column(db.Text, default='')
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc),
                           onupdate=lambda: datetime.now(timezone.utc))

    collections = db.relationship('Collection', backref='brand_rel', lazy='dynamic')

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'nameEn': self.name_en,
            'country': self.country,
            'description': self.description,
            'count': self.collections.count(),
            'createdAt': self.created_at.isoformat() + 'Z' if self.created_at else None,
            'updatedAt': self.updated_at.isoformat() + 'Z' if self.updated_at else None,
        }
