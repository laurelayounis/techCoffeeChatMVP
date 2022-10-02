import TinderCard from 'react-tinder-card'
import {useEffect, useState} from 'react'
import ChatContainer from '../components/ChatContainer'
import {useCookies} from 'react-cookie'
import axios from 'axios'


const Dashboard = () => {
    const [user, setUser] = useState(null)
    const [interestedUsers, setInterestedUsers] = useState(null)         //   interestedUsers setInterestedUsers
    const [lastDirection, setLastDirection] = useState()
    const [cookies, setCookie, removeCookie] = useCookies(['user'])

    const userId = cookies.UserId


    const getUser = async () => {
        try {
            const response = await axios.get('http://localhost:8000/user', {
                params: {userId}
            })
            setUser(response.data)
        } catch (error) {
            console.log(error)
        }
    }
    const getInterestedUsers = async () => {
        try {
            const response = await axios.get('http://localhost:8000/interested-users', {
                params: {interested: user?.interest}
            })
            setInterestedUsers(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getUser()

    }, [])

    useEffect(() => {
        if (user) {
            getInterestedUsers()
        }
    }, [user])

    const updateMatches = async (matchedUserId) => {
        try {
            await axios.put('http://localhost:8000/addmatch', {
                userId,
                matchedUserId
            })
            getUser()
        } catch (err) {
            console.log(err)
        }
    }


    const swiped = (direction, swipedUserId) => {
        if (direction === 'right') {
            updateMatches(swipedUserId)
        }
        setLastDirection(direction)
    }

    const outOfFrame = (name) => {
        console.log(name + ' left the screen!')
    }

    const matchedUserIds = user?.matches.map(({user_id}) => user_id).concat(userId)

    const filteredInterestedUsers = interestedUsers?.filter(interestedUser => !matchedUserIds.includes(interestedUser.user_id))


    console.log('filteredInterestedUsers ', filteredInterestedUsers)
    return (
        <>
            {user &&
            <div className="dashboard">
                <ChatContainer user={user}/>
                <div className="swipe-container">
                    <div className="card-container">

                        {filteredInterestedUsers?.map((interestedUser) =>
                            <TinderCard
                                className="swipe"
                                key={interestedUser.user_id}
                                onSwipe={(dir) => swiped(dir, interestedUser.user_id)}
                                onCardLeftScreen={() => outOfFrame(interestedUser.first_name)}>
                                <div
                                    style={{backgroundImage: "url(" + interestedUser.url + ")"}}
                                    className="card">
                                    <h3>{interestedUser.first_name}</h3>
                                </div>
                            </TinderCard>
                        )}
                        <div className="swipe-info">
                            {lastDirection ? <p>You swiped {lastDirection}</p> : <p/>}
                        </div>
                    </div>
                </div>
            </div>}
        </>
    )
}
export default Dashboard