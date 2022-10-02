import { useState } from "react"
import Nav from "../components/Nav"
import { useCookies } from "react-cookie"
import axios from "axios"
import { useNavigate } from "react-router-dom"

const OnBoarding= () =>{
    const [cookies, setCookie, removeCookie] = useCookies(null)
    const [formData, setFormData] = useState({
        user_id: cookies.UserId,
        first_name:'',
        last_name:'',
        dob_day:'',
        dob_month:'',
        dob_year:'',
        show_gender: false,
        offer: 'coffee chat',
        interest:'conference buddy',
        email: cookies.Email,
        url:'',
        about:'',
        matches: []
    })

    let navigate= useNavigate()

    const handleSubmit= async (e) => {
        console.log('submitted')
        //prevent from reloading because its a form
        e.preventDefault()
        try {
            const response= await axios.put('/user', {formData})
            const success= response.status === 200
            if (success) navigate('/dashboard')
        } catch(err){
            console.log(err)
        }
    }

//pass through e for event  make sure name and value are correct on form inputs otherwise wont work (need to get the name and input of each
//value so we can save its name and value in our db)
//handle checked box if true get e.tagert.checked : e.target.value
    const handleChange= (e) => {
        const value= e.target.type === 'checkbox' ? e.target.checked : e.target.value
        const name= e.target.name

        //update new value to our db; get the previous state and update it to its current value using name
        //can now use formData with their values on our forms below 
        setFormData((prevState) => ({
            ...prevState,
            [name] : value
        })) 
    }
        console.log(formData)
    return(

        <>
      
          <Nav 
          minimal={true} 
          setShowModal={() => {}} 
          showModal={false} 
          />
            <div className="onboarding">
                <h2>CREATE ACCOUNT</h2>

                <form onSubmit={handleSubmit}>

                    <section>

                    <label htmlFor="first_name">First Name</label>
                    <input
                        id="first_name"
                        type="text"
                        name="first_name"
                        placeholder="First Name"
                        required={true}
                        value={formData.first_name}
                        onChange={handleChange}
                    />

                    
                    <label htmlFor="last_name">Last Name</label>
                    <input
                        id="last_name"
                        type="text"
                        name="last_name"
                        placeholder="Last Name"
                        required={true}
                        value={formData.last_name}
                        onChange={handleChange}
                    />


                    <label>Birthday</label>

                    <div className="multiple-input-container">

                    <input
                        id="dob_day"
                        type="number"
                        name="dob_day"
                        placeholder="DD"
                        required={true}
                        value={formData.dob_day}
                        onChange={handleChange}
                    />
                    <input
                        id="dob_month"
                        type="number"
                        name="dob_month"
                        placeholder="MM"
                        required={true}
                        value={formData.dob_month}
                        onChange={handleChange}
                    />
                    <input
                        id="dob_year"
                        type="number"
                        name="dob_year"
                        placeholder="YYYY"
                        required={true}
                        value={formData.dob_year}
                        onChange={handleChange}
                    />
                    </div>

                    <label>Link me with:</label>
                    <div className="multiple-input-container">
                    <input
                        id="interest-coffee-chat"
                        type="radio"
                        name="interest"
                        value="coffee chat"
                        onChange={handleChange}
                        checked={formData.interest === 'coffee chat'}
                    /> 
                        <label htmlFor="interest-coffee-chat">Coffee Chat</label>

                    <input
                        id="interest-conference-buddy"
                        type="radio"
                        name="interest"
                        value="conference buddy"
                        onChange={handleChange}
                        checked={formData.interest === 'conference buddy'}
                    />
                         <label htmlFor="woman-gender-identity">Conference Buddy</label>


                    <input
                        id="interest-both"
                        type="radio"
                        name="interest"
                        value="both"
                        onChange={handleChange}
                        checked={formData.interest === 'both'}
                    />
                         <label htmlFor="interest-both">Both</label>
                    </div>
                    
          
                    <label>I'm offering to link up for:</label>
                    <div className="multiple-input-container">
                    <input
                        id="offer-coffee"                                               
                        type="radio"
                        name="offer"                                                   
                        value="coffee chat"                                                           
                        onChange={handleChange}
                        checked={formData.offer === 'coffee chat'}
                    /> 
                        <label htmlFor="offer-coffee">Coffee Chat</label>
  
                    <input
                        id="offer-buddy"
                        type="radio"
                        name="interest"
                        value="conference buddy"
                        onChange={handleChange}
                        checked={formData.offer === 'conference buddy'}
                    />
                         <label htmlFor="offer-buddy">Conference Buddy</label>


                    <input
                        id="offer-both"
                        type="radio"
                        name="interest"
                        value="both"
                        onChange={handleChange}
                        checked={formData.offer === 'both'}
                    />
                         <label htmlFor="offer-both">Both</label>
                    </div>

                    <label htmlFor="about">About Me</label>
                    <input
                        id="about"
                        type="text"
                        name="about"
                        required={true}
                        placeholder="I'm a software engineer, I love to go hiking and find new trails."
                        value={formData.about}
                        onChange={handleChange}
                    />
                    <input type="submit"/>
                </section>

                <section>  
                    <label htmlFor="url">Profile Photo</label>
                         <input
                            type="url"
                            name="url"
                            id="url"
                            onChange={handleChange}
                            required={true}
                        />
                    <div className="photo-container">
                        {formData.url && <img src={formData.url} alt="profile picture preview" />}

                    </div>
                </section>
                   

                </form>

            </div>

     
        </>
    )
}

export default OnBoarding