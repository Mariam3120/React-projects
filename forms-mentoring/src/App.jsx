import './App.css'
import BadgeList from './components/BadgeList'
import Header from './components/Header'
import RegistrationForm from './components/RegistrationForm'
import { useState } from 'react'

function App() {
  const [participants, setParticipants] = useState([]);

    function onAddUser(newUser){
        setParticipants((prevUsers) => [...prevUsers, newUser])
    }

    //onAddUser ფუნქცია იღებს ახალ მომხმარებელს (newUser) და განაახლებს participants მასივს, რათა დაემატოს ახალი მომხმარებელი. ეს ფუნქცია გადაეცემა RegistrationForm კომპონენტს, რათა ფორმამ შეძლოს ახალი მომხმარებლის დამატება.

  return (
    <div className='app-container'>
      <Header />
      <RegistrationForm onAddUser={onAddUser} /> 
      <BadgeList participants={participants}/>
    </div>
  )
}
//რეგისტრაციის ფორმას ვატანთ პროპსით onAddUser ფუნქციას, რომელიც საშუალებას აძლევს ფორმას დაამატოს ახალი მომხმარებელი
//BadgeList კომპონენტს ვატანთ პროპსით participants მასივს, რომელიც შეიცავს ყველა მონაწილეს, რათა BadgeList შეძლოს მათი ჩვენება.
export default App
