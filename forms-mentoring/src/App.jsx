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

  return (
    <div className='app-container'>
      <Header />
      <RegistrationForm onAddUser={onAddUser} />
      <BadgeList participants={participants}/>
    </div>
  )
}

export default App
