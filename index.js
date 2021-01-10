const { 
  GravatarClient, LoadNextImageUseCase
} = require('grav.client');

const getGravatarLogin = require('./get-gravatar-login');

const handler = async () => {

  try {

    console.log('getting Gravatar login...');

    const { email, password } = await getGravatarLogin();
    
    console.log('initializing Gravatar client...');

    const useCase = new LoadNextImageUseCase();

    useCase.client = new GravatarClient(email, password);

    console.log('loading next Gravatar icon...');

    const result = await useCase.execute();

    console.log('loaded new Gravatar icon:\n', result);

  } catch (err) {
    console.log(err);
    throw err;
  }

};

exports.handler = handler;
