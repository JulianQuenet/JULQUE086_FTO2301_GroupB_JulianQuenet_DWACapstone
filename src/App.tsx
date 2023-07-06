import React from "react";
import Shows from "./components/show";
import Carousel from "./components/carousel";
import Modal from "./components/modal";
import Genres from "./components/genres";
import FilteredModal from "./components/modal.filtered";
import Search from "./components/search";

const URL: String = "https://podcast-api.netlify.app/shows";

const App = () => {
  const [list, setList] = React.useState<any[]>([]);
  const [on, setOn] = React.useState<boolean>(false);
  const [id, setId] = React.useState<string>("");
  const [filtered, setFiltered] = React.useState<boolean>(false);

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

  const handleFiltered = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!e.target) {
      throw new Error(`${e.target} returned null`);
    }

    const genre = e.currentTarget.id;
    setId(genre);
    toggleFiltered();
  };

  const toggleOn = () => {
    setOn(!on);
    setFiltered(false);
  };

  const toggleFiltered = () => {
    setFiltered(!filtered);
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
      {filtered && (
        <FilteredModal
          name={id}
          open={filtered}
          toggle={toggleFiltered}
          handleClick={handleClick}
          shows={list}
        />
      )}
      <Search filter={list} handleClick={handleClick}/>
      <Genres toggle={handleFiltered} />
    </>
  );
};

export default App;
