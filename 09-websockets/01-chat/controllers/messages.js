const Message = require('../models/Message');

module.exports.messageList = async function messages(ctx, next) {
  if (!ctx.user) {
    ctx.status = 401;
    ctx.body = {error: 'Пользователь не залогинен'};
    return next();
  }

  const data = await Message.find({
    chat: ctx.user._id,
  }).limit(20);

  const messages = data.map((message) => {
    return {
      date: message.date,
      text: message.text,
      id: message._id,
      user: message.user,
    };
  });

  ctx.body = {messages};
};
