const { AvbxGravatarClient } = require('avatarbox.sdk');

const handler = async () => {

  try {
    
    const client = new AvbxGravatarClient();

    console.info('collecting all Gravatars not updated in the last 24 hours...');

    const emails = await client.collect();

    if(!emails){
      console.info('no Gravatars found');
      return;
    }

    emails.forEach(client.touch.bind(client))

    console.info(`found ${emails.length} Gravatars`);

  } catch (err) {
    console.error(err);
    throw err;
  }

};

exports.handler = handler;
