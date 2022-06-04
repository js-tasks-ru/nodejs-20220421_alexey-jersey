const LocalStrategy = require('passport-local').Strategy;
const User = require('../../models/User');

module.exports = new LocalStrategy(
    {usernameField: 'email', session: false},
    async function(email, password, done) {
      if (!email) {
        return done(null, false, 'поле usernameField должно должно содержать email');
      }
      const userData = await User.findOne({email});

      if (!userData) {
        return done(null, false, 'Нет такого пользователя');
      }

      const user = new User(userData);
      const isValidPassword = await user.checkPassword(password);

      if (!isValidPassword) {
        return done(null, false, 'Неверный пароль');
      }

      return done(null, user);
    },
);
