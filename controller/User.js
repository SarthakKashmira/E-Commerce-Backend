const { Category } = require('../model/Category');
const { User } = require('../model/User');

exports.fetchUserById = async (req, res) => {
  console.log(req.user);
  const { id } = req.user;
  try {
    console.log("Id by req,.user",id);
    const user = await User.findById(id);
    console.log("login own");
    res.status(200).json({id:user.id,addresses:user.addresses,email:user.email,role:user.role});
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.updateUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json(err);
  }
};

