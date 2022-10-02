import Chat from './Chat'
import ChatInput from './ChatInput'
import axios from 'axios'
import { useEffect, useState } from 'react'



const ChatDisplay = ({user, clickedUser}) => {

    const userId= user?.user_id
    const clickedUserId= clickedUser?.user_id
    const [usersMessages, setUsersMessages]= useState(null)
    const [clickedUsersMessages, setClickedUsersMessages] = useState(null)


//get any messages associated with my user id first
     const getUsersMessages= async () => {
            try{
                const response= await axios.get(`/messages`,{
                    params: {userId: userId, correspondingUserId: clickedUserId}
                })
                  setUsersMessages(response.data) 
    
            }
            catch(error){
                console.log(error)
            }
        } 

//get any messages associated with my user id first
        const getClickedUsersMessages= async () => {
            try{
                const response= await axios.get(`/messages`,{
                    params: {userId: clickedUserId, correspondingUserId: userId}
                })
                  setClickedUsersMessages(response.data) 
    
            }
            catch(error){
                console.log(error)
            }
        } 


    useEffect(() => {
        getUsersMessages()
        getClickedUsersMessages()
    }, [])

    //console.log(usersMessages)
    const messages= []

    usersMessages?.forEach(message => {
        const formattedMessage= {}
        formattedMessage['name']= user?.first_name
        formattedMessage['img']= user?.url
        formattedMessage['message']= message.message
        formattedMessage['timestamp']= message.timestamp
        messages.push(formattedMessage)
    })

    //console.log('usersMessages', usersMessages)
    //console.log('formattedMessages', messages)
    clickedUsersMessages?.forEach(message => {
        const formattedMessage= {}
        formattedMessage['name']= clickedUser?.first_name
        formattedMessage['img']= clickedUser?.url
        formattedMessage['message']= message.message
        formattedMessage['timestamp']= message.timestamp
        messages.push(formattedMessage)
    })

    //sort the messages in descending order
    const descendingOrderMessages= messages?.sort((a, b) => a.timestamp.localeCompare(b.timestamp))

    return (
        <>
        <Chat descendingOrderMessages={descendingOrderMessages}/>
        <ChatInput 
        user={user} 
        clickedUser={clickedUser}
        getUserMessages={getUsersMessages}
        getClickedUsersMessages={getClickedUsersMessages} />
        </>
   
    )
}

export default ChatDisplay