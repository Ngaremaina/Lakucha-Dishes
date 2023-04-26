import firebase from "./firebase-config"
import { useEffect, useState } from 'react';
import './App.css';
import FoodList from "./customer/FoodList";


function App() {
  const [foods, setFoods] = useState([])
  // const [loading, setLoading] = useState(false)

  // const ref = collection(firebase, "lunch")

  const foodCollection = firebase.firestore().collection("lunch")

  useEffect(() => {
    foodCollection.onSnapshot(querySnapshot => {
      const foodlist = []
      querySnapshot.forEach(fooditem => {
        foodlist.push(fooditem.data())
      })
      setFoods(foodlist)
    })
  })

  // const displayFoods = foods.map(food => {
  //   return <div><p>{food.description}</p></div>
  // })
  

  
  // function getFoods(){
  //   setLoading(true)
  //   lunchCollection.onSnapshot((querysnapshot) => {
  //     const items = []
  //     querysnapshot.forEach(doc => {
  //       items.push(doc.data())
  //     })
  //     setFoods(items)
  //     setLoading(false)
  //   })
  // }
  // useEffect(() => {
  //   getFoods()
  // },[])
  

  // if (loading){
  //   return <h1>loading...</h1>
  // }


  
  return (
    <div className="container-fluid" style={{backgroundColor : "black"}}>
      {/* {displayFoods} */}
      <FoodList foods = {foods}/>
     
    </div>
  );
}

export default App;
