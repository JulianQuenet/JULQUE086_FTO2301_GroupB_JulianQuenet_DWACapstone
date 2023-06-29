
import React from "react";
import Shows from "./list";
import Carousel from "./carousel";

const URL: String = "https://podcast-api.netlify.app/shows";

const App = () => {
  const [list, setList] = React.useState<any[]>([]);

  React.useEffect(() => {
    const getList = async () => {
        const res = await fetch(`${URL}`)
        const data = await res.json()
        setList(data)
    }
    getList()
}, [])

const lists = list.map((item)=> {
  return (
    <Shows
    key={item.id}
    item={item}
/>

  )
})  
  
  return (
    <>
    <section className="hero">
      
    <Carousel item={lists}/>
    </section>
    </>
  );
};

export default App;
