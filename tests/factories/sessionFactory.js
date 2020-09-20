let Buffer = require('safe-buffer').Buffer;
let Keygrip = require('keygrip');
let keys = require('../../config/keys');
let keygrip = new Keygrip([keys.cookieKey]);

module.exports = (user) => {
  let sessionObject = {
    passport: {
      user: user._id.toString(),
    },
  };
  let session = Buffer.from(JSON.stringify(sessionObject)).toString('base64');

  let sig = keygrip.sign('session=' + session);
  return { session, sig };
};
