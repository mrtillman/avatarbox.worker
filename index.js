const { 
  AvbxGravatarClient, 
  LoadNextImageUseCase 
} = require('avatarbox.sdk');

const handler = async (event) => {
  
  if(!event || !event.Records){
    console.log('no records found. aborting...');
    return;
  }

  const client = new AvbxGravatarClient();

  const useCase = new LoadNextImageUseCase();

  const record = event.Records.shift();

  const email = record.body;

  try {
    useCase.client = await client.fetch(email);
    await useCase.execute();
    
    // TODO: image compare
    //       push message to front-end via web sockets API

    await client.renew(email);
  } catch (err) {
    console.error('update failed: ', err);
    await client.off(email);
    
    // TODO: notify user via SES message

    throw err;
  }

};

exports.handler = handler;
