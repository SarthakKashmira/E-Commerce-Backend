const passport = require("passport");

exports.isAuth = (req,res,done) => {
  return passport.authenticate('jwt');
};

exports.filterUser=(user)=>{
    return {id:user.id,role:user.role};
}

exports.extractor=(req,res)=>{
  let token=null;
  if(req && req.cookies)
  {
    token=req.cookies["jwt_token"];
    console.log("Helllllo",token);
  }
  return token;
}