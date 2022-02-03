const userData=require('../util/user.json')

module.exports=()=>{
    var length=userData.usersList.length
    const randomValue = Math.floor(Math.random() * length);
    const user=userData.usersList[randomValue]
    return user
}