const {v4: uuid} = require('uuid');
const User = require('../models/User');
const sendMail = require('../libs/sendMail');

module.exports.register = async (ctx, next) => {
  const token = uuid();

  const {displayName, email, password} = ctx.request.body;

  const isUserExist = await User.findOne({email});

  if (isUserExist) {
    ctx.status = 400;
    ctx.body = {errors: {
      email: 'Такой email уже существует',
    }};
  }

  const user = new User({displayName, email, verificationToken: token});
  await user.setPassword(password);
  await User.create(user);

  await sendMail({
    template: 'confirmation',
    locals: {token},
    to: 'newuser@mail.com',
    subject: 'Подтвердите почту',
  });

  ctx.status = 200;
  ctx.body = {status: 'ok'};
  next(ctx);
};

module.exports.confirm = async (ctx, next) => {
  const {verificationToken} = ctx.request.body;

  const user = await User.findOneAndUpdate(
      {verificationToken},
      {$unset: {verificationToken: ''}},
  );

  if (!user) {
    ctx.status = 400;
    ctx.body = {error: 'Ссылка подтверждения недействительна или устарела'};
  } else {
    ctx.body = {token: verificationToken};
  }
};
