import React from 'react'
import BadgeCard from './BadgeCard'

//BadgeList კომპონენტი იღებს participants მასივს props-ით და ქმნის BadgeCard კომპონენტს თითოეული მონაწილისთვის. BadgeCard კომპონენტი იღებს user ობიექტს props-ით და აჩვენებს მომხმარებლის სახელს, როლს და თუ ის სპიკერია, აჩვენებს შესაბამის ნიშანს. BadgeList ასევე აჩვენებს სექციას სათაურით "გენერირებული ბეჯები" და იყენებს CSS კლასებს სტილიზაციისთვის.
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