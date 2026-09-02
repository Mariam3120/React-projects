// BadgeCard იღებს user ობიექტს, რომელიც შეიცავს მომხმარებლის მონაცემებს, და აჩვენებს მათ ბადჯის ფორმატში. თუ მომხმარებელი სპიკერია, ბადჯი მიიღებს დამატებით სტილს და გამოჩნდება "სპიკერი" პილა. 
const BadgeCard = ({user}) => {
  return (
    <div className={user.isSpeaker ? 'badge-card  speaker' : 'badge-card'}>
        <h2>{user.name}</h2>
        <p>{user.role}</p>
        {user.isSpeaker && <span className="speaker-pill">🌟 სპიკერი</span>}
        <button className="delete-btn">X</button>
    </div>
  )
}

export default BadgeCard