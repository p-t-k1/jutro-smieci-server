module.exports = {
    stage: process.env.NODE_ENV || 'develop',
    databaseUrl: process.env.MONGODB_URI || 'mongodb+srv:/jutrosmieci:6XvaUBZ3hR8DsvpW@cluster0.m6ejjk6.mongodb.net:27017/jutrosmieci?retryWrites=true&w=majority',
    port: process.env.PORT || 3001,
    secret: process.env.JWT_SECRET || 'smieci'
};
