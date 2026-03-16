from datetime import datetime, timezone
from ..extensions import db


collection_tag = db.Table(
    'collection_tag',
    db.Column('collection_id', db.Integer, db.ForeignKey('collections.id'), primary_key=True),
    db.Column('tag_id', db.Integer, db.ForeignKey('tags.id'), primary_key=True),
)


class Image(db.Model):
    __tablename__ = 'images'

    id = db.Column(db.Integer, primary_key=True)
    collection_id = db.Column(db.Integer, db.ForeignKey('collections.id'), nullable=False)
    url = db.Column(db.String(512), nullable=False)
    sort = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    def to_dict(self):
        return {
            'id': self.id,
            'url': self.url,
            'sort': self.sort,
        }


class Collection(db.Model):
    __tablename__ = 'collections'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    era_id = db.Column(db.Integer, db.ForeignKey('eras.id'), nullable=True)
    category_id = db.Column(db.Integer, db.ForeignKey('categories.id'), nullable=True)
    material = db.Column(db.String(200), default='')
    brand_id = db.Column(db.Integer, db.ForeignKey('brands.id'), nullable=True)
    color_id = db.Column(db.Integer, db.ForeignKey('colors.id'), nullable=True)
    purchase_price = db.Column(db.Float, default=0)
    estimated_value = db.Column(db.Float, default=0)
    status = db.Column(db.String(20), default='完好')
    description = db.Column(db.Text, default='')
    source = db.Column(db.String(200), default='')
    date = db.Column(db.String(20), default='')
    is_deleted = db.Column(db.Boolean, default=False, nullable=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc),
                           onupdate=lambda: datetime.now(timezone.utc))

    tags = db.relationship('Tag', secondary=collection_tag, backref='collections', lazy='subquery')
    images = db.relationship('Image', backref='collection', lazy='subquery',
                             order_by='Image.sort', cascade='all, delete-orphan')

    def to_dict(self):
        era = self.era_rel
        category = self.category_rel
        brand = self.brand_rel
        color = self.color_rel
        return {
            'id': self.id,
            'name': self.name,
            'era': era.name if era else '',
            'cat': category.name if category else '',
            'material': self.material,
            'brand': brand.name if brand else '',
            'colorScheme': color.name if color else '',
            'purchasePrice': self.purchase_price,
            'estimatedValue': self.estimated_value,
            'status': self.status,
            'description': self.description,
            'source': self.source,
            'date': self.date,
            'tags': [t.name for t in self.tags],
            'images': [img.to_dict() for img in self.images],
            'createdAt': self.created_at.isoformat() + 'Z' if self.created_at else None,
            'updatedAt': self.updated_at.isoformat() + 'Z' if self.updated_at else None,
        }
