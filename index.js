const { 
  GravatarClient, LoadNextImageUseCase
} = require('grav.client');

const getGravatarLogin = require('./get-gravatar-login');

const handler = async (event, context) => {

  try {

    const { email, password } = await getGravatarLogin();
    
    const useCase = new LoadNextImageUseCase();

    useCase.client = new GravatarClient(email, password);

    const result = await useCase.execute();

    console.log(result);

  } catch (err) {
    console.log(err);
    throw err;
  }

};

exports.handler = handler;
