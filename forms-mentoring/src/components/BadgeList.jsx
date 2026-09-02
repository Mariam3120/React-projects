import React from 'react'
import BadgeCard from './BadgeCard'

const BadgeList = ({participants}) => {
  
  return (
    <div>
        <div className='list-header'>
            <h2>გენერირებული ბეჯები</h2>
        </div>

        <div className="badge-grid">
            {
              participants.map((user) => (
                <BadgeCard key={user.id} user={user}/>
              ))
            }
        </div>

    </div>
  )
}

export default BadgeList