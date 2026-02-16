def register_blueprints(app):
    from .auth import bp as auth_bp
    from .collections import bp as collections_bp
    from .eras import bp as eras_bp
    from .categories import bp as categories_bp
    from .materials import bp as materials_bp
    from .brands import bp as brands_bp
    from .colors import bp as colors_bp
    from .dashboard import bp as dashboard_bp
    from .analytics import bp as analytics_bp
    from .correlations import bp as correlations_bp
    from .knowledge import bp as knowledge_bp
    from .upload import bp as upload_bp
    from .tags import bp as tags_bp
    from .export import bp as export_bp

    prefix = '/api/v1'
    app.register_blueprint(auth_bp, url_prefix=f'{prefix}/auth')
    app.register_blueprint(collections_bp, url_prefix=f'{prefix}/collections')
    app.register_blueprint(eras_bp, url_prefix=f'{prefix}/eras')
    app.register_blueprint(categories_bp, url_prefix=f'{prefix}/categories')
    app.register_blueprint(materials_bp, url_prefix=f'{prefix}/materials')
    app.register_blueprint(brands_bp, url_prefix=f'{prefix}/brands')
    app.register_blueprint(colors_bp, url_prefix=f'{prefix}/colors')
    app.register_blueprint(dashboard_bp, url_prefix=f'{prefix}/dashboard')
    app.register_blueprint(analytics_bp, url_prefix=f'{prefix}/analytics')
    app.register_blueprint(correlations_bp, url_prefix=f'{prefix}/correlations')
    app.register_blueprint(knowledge_bp, url_prefix=f'{prefix}/knowledge')
    app.register_blueprint(upload_bp, url_prefix=f'{prefix}/upload')
    app.register_blueprint(tags_bp, url_prefix=f'{prefix}/tags')
    app.register_blueprint(export_bp, url_prefix=f'{prefix}/export')
