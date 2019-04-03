import {fetchPostData} from '../tools/util';

export async function validateAppleIAPJSON(email, token, receipt) {
  let params = {
    receipt
  };

  let validation = await fetchPostData(`v1/apple/iap?email=${email}&accessToken=${token}`, params);
  return validation;
}
