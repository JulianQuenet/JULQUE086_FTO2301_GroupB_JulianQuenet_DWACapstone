
import React from "react";
import Shows from "./show";
import Carousel from "./carousel";
import Modal from "./modal";

const URL: String = "https://podcast-api.netlify.app/shows";

export const ID = {
  id:''
}

const App = () => {
  const [list, setList] = React.useState<any[]>([]);
  const [on, setOn] = React.useState<boolean>(false);
 
  React.useEffect(() => {
    const getList = async () => {
        const res = await fetch(`${URL}`)
        const data = await res.json()
        data[12].title = "Truth & Justice with Bob Ruff"
        setList(data)
    }
    getList()
}, [])


const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
  if (!e.target) {
    throw new Error(`${e.target} returned null`);
  }
  const targetId = e.currentTarget.id;
  
  ID.id = targetId;
  toggleOn();
};

const toggleOn = () => {
  setOn(!on);
}


const lists = list.map((item)=> {
  return (
    <Shows
    key={item.id}
    item={item}
    handleClick={handleClick}
/>

  )
})  
  
  return (
    <>
    <section className="hero">
      
    <Carousel item={lists}/>
    </section>
    { on && <Modal on={on} toggle={toggleOn}/>}
    </>
  );
};

export default App;
