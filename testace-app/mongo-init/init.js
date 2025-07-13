// Initialize the testace database
db = db.getSiblingDB('testace');

// Create collections if they don't exist
db.createCollection('users');
db.createCollection('questions');
db.createCollection('sessions');
db.createCollection('analytics');

print('Database initialized successfully');
