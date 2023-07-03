import React from "react";
import Shows from "./show";
import Carousel from "./carousel";
import Modal from "./modal";
import Genres from "./genres";

const URL: String = "https://podcast-api.netlify.app/shows";


const App = () => {
  const [list, setList] = React.useState<any[]>([]);
  const [on, setOn] = React.useState<boolean>(false);
  const [id, setId] = React.useState<string>("");

  React.useEffect(() => {
    const getList = async () => {
      const res = await fetch(`${URL}`);
      const data = await res.json();
      data[12].title = "Truth & Justice with Bob Ruff";
      setList(data);
    };
    getList();
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!e.target) {
      throw new Error(`${e.target} returned null`);
    }
    const targetId = e.currentTarget.id;

    setId(targetId);
    toggleOn();
  };

  const toggleOn = () => {
    setOn(!on);
  };

  const lists = list.map((item) => {
    return <Shows key={item.id} item={item} handleClick={handleClick} />;
  });

  return (
    <>
      <section className="hero">
        <Carousel item={lists} />
      </section>
      {on && <Modal on={on} toggle={toggleOn} path={id} />}
      <Genres />
    </>
  );
};

export default App;


