module.exports = {
    stage: process.env.NODE_ENV || 'develop',
    databaseUrl: process.env.MONGODB_URI || 'mongodb://localhost:27017/smieci',
    port: process.env.PORT || 3001,
    secret: process.env.JWT_SECRET || 'smieci'
};
