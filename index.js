const { 
  AvbxGravatarClient, 
  LoadNextImageUseCase 
} = require('avatarbox.sdk');

const handler = async (event) => {
  
  if(!event || !event.Records){
    console.info('ping!');
    return;
  }

  const client = new AvbxGravatarClient();

  const useCase = new LoadNextImageUseCase();

  const record = event.Records.shift();

  const email = record.body;

  try {
    useCase.client = await client.fetch(email);
    const result = await useCase.execute();
    const imageUrl = `${result.url.replace("http:", "https:")}?size=450`;

    // TODO: image compare
    //       push message to front-end via web sockets API

    await client.reset({
      email,
      imageUrl
    })
  } catch (err) {
    console.error('update failed: ', err);
    await client.off(email);
    
    // TODO: notify user via SES message

    throw err;
  }

};

exports.handler = handler;
