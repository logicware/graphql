
async function authenticate({headers: {authorization}}, User, Token) {
  let loginRecord;
  if (authorization) {
    loginRecord = await Token.findOne({where: {accessToken: authorization} });
    //console.log(loginRecord.userId);
  }
  if (loginRecord) {
    return await User.findOne({where: {id: loginRecord.userId} });
  } else {
    return null;
  }
}

export default authenticate;