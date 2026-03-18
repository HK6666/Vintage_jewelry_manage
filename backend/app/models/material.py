from datetime import datetime, timezone
from ..extensions import db


class Material(db.Model):
    __tablename__ = 'materials'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    name_en = db.Column(db.String(100), default='')
    category = db.Column(db.String(50), default='')
    description = db.Column(db.Text, default='')
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc),
                           onupdate=lambda: datetime.now(timezone.utc))

    @property
    def collection_count(self):
        from .collection import Collection
        return Collection.query.filter(
            Collection.is_deleted == False,
            db.or_(
                Collection.material == self.name,
                Collection.material.like(self.name + '/%'),
                Collection.material.like('%/' + self.name),
                Collection.material.like('%/' + self.name + '/%'),
            )
        ).count()

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'nameEn': self.name_en,
            'category': self.category,
            'description': self.description,
            'count': self.collection_count,
            'createdAt': self.created_at.isoformat() + 'Z' if self.created_at else None,
            'updatedAt': self.updated_at.isoformat() + 'Z' if self.updated_at else None,
        }
