// TODO: clean up / refactor using DDD
require('dotenv').config();
const consumerKey = process.env.TWITTER_CONSUMER_KEY;
const consumerSecret = process.env.TWITTER_CONSUMER_SECRET;
const fetch = require('node-fetch');
const FormData = require('form-data');
const { v4 } = require('uuid');
const oauthSignature = require('oauth-signature');

const httpMethod = 'POST',
url = 'https://api.twitter.com/1.1/account/update_profile_image.json';

class TwitterService {
  constructor(token, tokenSecret){
    this.parameters = {
        oauth_consumer_key : consumerKey,
        oauth_nonce : v4(),
        oauth_signature_method : 'HMAC-SHA1',
        oauth_timestamp : Math.floor(Date.now() / 1000),
        oauth_token : token,
        oauth_version : '1.0'
    },
    this.encodedSignature = oauthSignature.generate(httpMethod, url, this.parameters, consumerSecret, tokenSecret);
  }
  async updateProfileIcon(imageUrl){
    const { parameters, encodedSignature } = this;
    const body = new FormData();
    const response = await fetch(imageUrl);
    const imageData = await response.buffer();
    body.append("image", imageData);
    return await fetch('https://api.twitter.com/1.1/account/update_profile_image.json',{
      method: 'POST',
      headers: {
        Authorization: `OAuth oauth_consumer_key="${parameters.oauth_consumer_key}", oauth_nonce="${parameters.oauth_nonce}", oauth_signature="${encodedSignature}", oauth_signature_method="HMAC-SHA1", oauth_timestamp="${parameters.oauth_timestamp}", oauth_token="${parameters.oauth_token}", oauth_version="1.0"`,
      },
      body
    })
    .then(async res => {
      if(res.ok){
        return res.json();
      } else {
        const message = await res.text();
        throw new Error(message);
      }
    }).catch(console.log);
  }

}

module.exports = { TwitterService };