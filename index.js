const { AvbxGravatarClient } = require('avatarbox.sdk');

const handler = async () => {

  try {
    
    const client = new AvbxGravatarClient();

    console.log('collecting all Gravatars not updated in 24 hours...');

    const emails = await client.collect();

    const emailCount = emails.length;

    if(!emailCount){
      console.error('no Gravatars found');
      return;
    }

    emails.forEach(client.touch.bind(client))

    console.error(`found ${emailCount} Gravatars`);

  } catch (err) {
    console.log(err);
    throw err;
  }

};

exports.handler = handler;
