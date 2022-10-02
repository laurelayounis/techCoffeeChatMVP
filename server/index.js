const PORT = process.env.PORT || 8000  //updated port to use env
const express= require('express')
const {MongoClient}= require('mongodb')
const {v4: uuidv4}= require('uuid')
const jwt= require('jsonwebtoken')
const bcrypt= require('bcrypt')
const cors= require('cors')
require('dotenv').config()

const uri= process.env.URI

//
const app= express()
app.use(cors())
app.use(express.json())





//heroku route use static build
app.use(express.static('build'))

//DEFAULT
app.get('/', (req, res) => {
    res.json('hello to my app')
})

//sign up to the databse
//POST:   send data POST request; how we're passing through data from the front end to the back end signup form
app.post('/signup', async (req, res) => {

    console.log("hello")
    
    const client= new MongoClient(uri)
    const {email, password}= req.body
    //generate a unique user id using the uuid package
    const generatedUserId= uuidv4()
    const hashedPassword= await bcrypt.hash(password, 10)

    //send the data to the db
    try{
        await client.connect()
        const database= client.db('app-data')
        const users= database.collection('users')

        //check to make sure user doesn't already exist when they signup
        const existingUser= await users.findOne({email})

        if(existingUser){
            return res.status(409).send('User already exists, please login')
        }
        //if user doesn't exist start by sanitizing the email
        const sanitizedEmail= email.toLowerCase()

        //create data obj this will be the data we want to send to our db
        const data= {
            user_id: generatedUserId,
            email: sanitizedEmail,
            hashed_password: hashedPassword
        }

        //insert our new users into the db
       const insertedUser= await users.insertOne(data)

       //create token for user with jwt package
       const token= jwt.sign(insertedUser, sanitizedEmail, {
        expiresIn: 60 *24,
       })
       //this is what we'll send back
       res.status(201).json({ token, userId: generatedUserId})
    }catch(err){
        console.log(err)
    } finally {
        await client.close()
    }
})



//Login to the database POST 
app.post('/login', async (req, res) => {
    const client= new MongoClient(uri)
    const {email, password} = req.body

    try{
        await client.connect()
        const database= client.db('app-data')
        const users= database.collection('users')

        const user= await users.findOne({email})

        const correctPassword= await bcrypt.compare(password, user.hashed_password)

        if(user && correctPassword){
            const token= jwt.sign(user, email, {
                expiresIn: 60* 24
            })
            res.status(201).json({ token, userId: user.user_id})
        }
        res.status(400).send('Invalid Credentials')
    } catch(err){
        console.log(err)
    } finally {
        await client.close()
    }
})



//Get individual user  GET

app.get('/user', async (req, res) => {
    const client= new MongoClient(uri)
    const userId= req.query.userId

    try{
        await client.connect()
        const database= client.db('app-data')
        const users= database.collection('users')

        const query= {user_id: userId}
        const user= await users.findOne(query)
        res.send(user)
    } finally{
        await client.close()
    }
})

// Update User with a match
app.put('/addmatch', async (req, res) => {
    const client = new MongoClient(uri)
    const {userId, matchedUserId} = req.body

    try {
        await client.connect()
        const database = client.db('app-data')
        const users = database.collection('users')

        const query = {user_id: userId}
        const updateDocument = {
            $push: {matches: {user_id: matchedUserId}}
        }
        const user = await users.updateOne(query, updateDocument)
        res.send(user)
    } finally {
        await client.close()
    }
})

//Get all the users by userIds in the Database GET

app.get('/users', async (req, res) => {
    const client= new MongoClient(uri)
    const userIds= JSON.parse(req.query.userIds)

    try{
        await client.connect()
        const database= client.db('app-data')
        const users= database.collection('users')

        const pipeline=
        [
            {
                '$match':{
                    'user_id':{
                        '$in': userIds
                    }
                }
            }
        ]
        const foundUsers= await users.aggregate(pipeline).toArray()
        console.log(foundUsers)
        res.send(foundUsers)
    }finally{
        await client.close()
    }
})




// Get all the interests Users in the Database                 

app.get('/interested-users', async (req, res) => {
    const client = new MongoClient(uri)
    const interested = req.query.interested

    try {
        await client.connect()
        const database = client.db('app-data')
        const users = database.collection('users')
        const query = {offer: {$eq: interested}}
        const foundUsers = await users.find(query).toArray()
        res.json(foundUsers)

    } finally {
        await client.close()
    }
})

//update a User in the Database     PUT
app.put('/user', async (req, res) => {
    const client= new MongoClient(uri)
    const formData= req.body.formData

    try{
        await client.connect()
        const database= client.db('app-data')
        const users= database.collection('users')
        //query the db
        const query= {user_id: formData.user_id}

        const updateDocument= {
            $set:{
                first_name: formData.first_name,
                dob_day: formData.dob_day,
                dob_month: formData.dob_month,
                dob_year: formData.dob_year,
                show_gender: formData.show_gender,
                offer: formData.offer,  
                interest: formData.interest,                
                url: formData.url,
                about: formData.about,
                matches: formData.matches

            },
        }
        const insertedUser= await users.updateOne(query, updateDocument)

        res.json(insertedUser)

    } finally {
        await client.close()
    }
})

//Get messages by: from_userId and to_userId
app.get('/messages', async (req, res) => {
    const {userId, correspondingUserId}= req.query
    const client= new MongoClient(uri)

    try{
        await client.connect()
        const database= client.db('app-data')
        const messages= database.collection('messages')

        const query= {
            from_userId: userId, to_userId: correspondingUserId
        }
        const foundMessages= await messages.find(query).toArray()
        res.send(foundMessages)
    }finally{
        await client.close()
    }
})


//Add a message to our Database POST
app.post('/message', async (req, res) => {
    const client= new MongoClient(uri)
    const message= req.body.message

    try{
        await client.connect()
        const database= client.db('app-data')
        const messages= database.collection('messages')

        const insertedMessage= await messages.insertOne(message)
        res.send(insertedMessage)
    }finally{
        await client.close()
    }
})


app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`))
