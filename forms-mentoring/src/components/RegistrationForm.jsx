import { useState } from 'react'

const RegistrationForm = ({onAddUser}) => {
    const [formData, setFormData] = useState({ name: '', role: 'Frontend', isSpeaker: false })

    const handleChange = (event) => {
        const {name, value, type, checked} = event.target; 
        //checked ვიყენებთ მხოლოდ ჩექბოქსისთვის რადგან ჩექბოქსს აქვს checked ატრიბუტი, რომელიც გვიჩვენებს არის თუ არა ის მონიშნული. სხვა ტიპის ინპუტებისთვის (მაგალითად ტექსტური ველი ან რადიო ბტონი) ჩვენ ვიყენებთ value ატრიბუტს.
        // console.log(event);
        setFormData((prevData) => ({
            ...prevData,
            [name]: type === "checkbox" ? checked : value
            //ეს [name] სინტაქსი საშუალებას გვაძლევს დინამიურად განვსაზღვროთ რომელი ველი უნდა განახლდეს formData ობიექტში. მაგალითად, თუ name არის "role", მაშინ ეს განახლებს formData.role-ს.
        }));

    };

    function handleSubmit(e){
        e.preventDefault();
        if (!formData.name || !formData.role) {
            alert("გთხოვთ შეავსოთ ყველა ველი");
            return;
        }
        //აქ ვქმნით ახალ ობიექტს, რომელიც შეიცავს მომხმარებლის მონაცემებს, და ვიძახებთ onAddUser ფუნქციას, რათა დავამატოთ ეს მონაცემები participants სიაში.
        //ზუსტად იმ სტრუქტურის მქონე ობიექტია რაც მანამდე გვაქვს ფორმდატას სთეითში!
        const newUser = {
            id: Date.now(),
            name: formData.name,
            role: formData.role,
            isSpeaker: formData.isSpeaker
        }
        onAddUser(newUser); //ვიძახებთ onAddUser ფუნქციას, რომელიც მიღებულია props-ით, რათა დავამატოთ ახალი მომხმარებელი participants სიაში.
        setFormData({ name: '', role: 'Frontend', isSpeaker: false }); //ვასულებთ ფორმის ველებს საწყის მდგომარეობაში, რათა მომხმარებელმა შეძლოს ახალი მონაცემების შეყვანა.
    }

    return (
        <form className="form-card" onSubmit={handleSubmit}>
            <h2 className="form-title">📝 სარეგისტრაციო ფორმა</h2>
            <div className="form-group">
                <label className="form-label" htmlFor="name">სახელი და გვარი</label>
                <input className="form-input" type="text" id="name" 
                    placeholder="მაგ: გიორგი ხელაძე" 
                    value={formData.name} 
                    name="name"
                    onChange={handleChange}/>
            </div>
            <div  className="form-group">
                <label className="form-label">მიმართულება</label>
                <div style={{ display: "flex", gap: "15px", marginTop: "10px" }}>
                    <label>
                        <input type="radio" className="checkbox-input" name="role" value="frontend" 
                            checked={formData.role === 'frontend'} 
                            onChange={handleChange} />
                        Frontend
                    </label>
                    
                    <label>
                        <input type="radio" className="checkbox-input" name="role" value="backend"
                        checked={formData.role === 'backend'}
                        onChange={handleChange} />
                        Backend
                    </label>
                </div>
            </div>
                
            <div className="checkbox-group">
                <input type="checkbox" className="checkbox-input" id="speaker" name="isSpeaker"
                checked={formData.isSpeaker} 
                onChange={handleChange} />
                <label className="form-label" htmlFor="speaker">ვარ ღონისძიების სპიკერი</label>
            </div>
            <button type="submit" className="submit-btn">ბეჯის გენერაცია</button>
        </form>
    )
}

export default RegistrationForm