var ObjectId = require('mongodb').ObjectID;
const Annotation = require('../../models/User');


const getUserById = async (userId) => {
    try{
        const user = await User.findOne({_id: ObjectId(userId)});       
        return Promise.resolve({name: user.name, email: user.email});
    }catch (err){
        console.log(err.message);
        return Promise.reject("Server Error");
    } 
}   

module.exports = {
    getUserById
}