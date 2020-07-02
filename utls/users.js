const users = [];
//join new user

function userJoin(id , username , room){
    const user = {id , username , room}
    users.push(user)
    return user;
}

//get current user
function getCurrentUserId(id){
    return users.find(user => user.id == id)
}

//User has left the chat
function userLeave(id){
    const index = users.findIndex(user => user.id == id)
    if (index !== -1){
        return users.splice(index , 1)[0]
    }

}

//get room
function getRoom(room){
    return users.filter(user => user.room == room)
}


module.exports={
    userJoin,
    getCurrentUserId,
    userLeave,
    getRoom
}