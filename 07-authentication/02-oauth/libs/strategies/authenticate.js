const User = require('../../models/User');

module.exports = async function authenticate(strategy, email, displayName, done) {
  if (!email) {
    return done(null, false, 'Не указан email');
  }

  try {
    const existingUser = await User.findOne({email});

    if (!existingUser) {
      const newUser = new User({email, displayName});
      const user = await User.create(newUser);
      done(null, user);
    } else {
      done(null, existingUser);
    }
  } catch (err) {
    if (err && err.name === 'ValidationError') {
      return done(err, false, 'Некорректный email.');
    }
  }
};
