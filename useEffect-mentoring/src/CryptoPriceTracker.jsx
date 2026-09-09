import { useState, useEffect } from "react";
export const CryptoPriceTracker = () => {
  const [price, setPrice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAutoRefresh, setIsAutoRefresh] = useState(true);

  useEffect(() => {
    async function fetchPrice() {
      try {
        const response = await fetch ("https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT");
        if (!response.ok) {
          throw new Error ("Failed to fetch price");
        }
        const data = await response.json();
        setPrice(data.price); //ამოიღო ფასის მნიშვნელობა JSON ობიექტიდან და შეინახა state-ში
        setLoading(false) //მიუთითებს რომ მონაცემები უკვე ჩაიტვირთა
        
      } catch (error){
        console.log(error)

      }
    }

    fetchPrice();
    let intervalId; //ეს ცვლადი გამოიყენება setInterval-ის ID-ს შესანახად, რათა მოგვიანებით შეგვეძლოს მისი გაწმენდა clearInterval-ის გამოყენებით.
    if(isAutoRefresh) {
      intervalId = setInterval(() => {
        fetchPrice();
      }, 5000);
    }

    return () =>{
      clearInterval(intervalId);
    }
  }, [isAutoRefresh]); //დეფენდენსში სიაში ჩასმულია isAutoRefresh, რათა useEffect გამოიძახოს მხოლოდ მაშინ, როდესაც isAutoRefresh იცვლება

  function handleRefresh() { //ეს ფუნქცია გამოიყენება ავტომატური განახლების სტატუსის შეცვლისთვის. როდესაც მომხმარებელი დააჭერს ღილაკს, ეს ფუნქცია გამოიძახება და შეცვლის isAutoRefresh-ის მნიშვნელობას.
    setIsAutoRefresh(prev => !prev); // შეცვლა ავტომატური განახლების სტატუსის previos მნიშვნელობის საპირისპიროდ. თუ ის იყო true, გახდება false, და პირიქით.
  }


  // ეს არის კომპონენტის მთავარი კონტეინერი, რომელიც შეიცავს ფასის ჩვენების და ავტომატური
  return (
        <div className="crypto-card"> 
          {loading ? ( //თუ loading არის true, მაშინ ჩვენება "ფასი იტვირთება..." ტექსტი
            <div className="loading-status">🔄 ფასი იტვირთება...</div>
          ) : ( //თუ loading არის false, მაშინ ჩვენება- ფასის მნიშვნელობა
                <div className="price-display">
                    ${Number(price).toFixed(2)} USD {//ფასის მნიშვნელობა გადაკეთდება რიცხვად და შემდეგ ფორმატირდება ორ ათწილეულზე}
}
                </div>
          )}
          <button className={`toggle-btn ${isAutoRefresh ? "active" : "inactive"}`} onClick={handleRefresh}>Auto-Refresh: {isAutoRefresh ? 'ON' : 'OFF'}</button>
          {// ღილაკი ავტომატური განახლების სტატუსის შეცვლისთვის. ღილაკის ტექსტი იცვლება სტატუსის მიხედვით (ON ან OFF) და კლასიც იცვლება აქტიური ან არააქტიური სტატუსის მიხედვით.
          }
          </div>
          );
}
