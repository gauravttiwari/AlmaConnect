const mongoose = require('mongoose');

const uri = 'mongodb+srv://almaconnect03_db_user:Lucifer892482@ac-rfka2f0-shard-00-00.swyxgex.mongodb.net/almaconnect?retryWrites=true&w=majority';

const userSchema = new mongoose.Schema({}, { strict: false });
const User = mongoose.model('User', userSchema, 'users');

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => User.deleteMany({}))
  .then(() => {
    console.log('All users deleted from almaconnect.users');
    mongoose.disconnect();
  })
  .catch(err => {
    console.error('Error deleting users:', err);
    mongoose.disconnect();
  });
