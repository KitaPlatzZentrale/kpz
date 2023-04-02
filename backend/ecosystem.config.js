module.exports = {
    apps: [{
        name: 'KPZ',
        script: 'dist/index.js',
        instances: 'max',
        max_memory_restart: '256M',
        env: {
            NODE_ENV: 'development'
        },
        env_production: {
            NODE_ENV: 'production'
        }
    }]
};