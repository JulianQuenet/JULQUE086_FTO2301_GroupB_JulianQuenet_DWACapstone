import React from "react";
import Shows from "./components/show";
import Carousel from "./components/carousel";
import Modal from "./components/modal";
import Genres from "./components/genres";
import FilteredModal from "./components/modal.filtered";
import Search from "./components/search";
import Watched from "./components/watched";
import supabase from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import "./index.css";

const URL: String = "https://podcast-api.netlify.app/shows";

const Homepage = () => {
  const [list, setList] = React.useState<any[]>([]);
  const [on, setOn] = React.useState<boolean>(false);
  const [id, setId] = React.useState<string>("");
  const [filtered, setFiltered] = React.useState<boolean>(false);
  const [genre, setGenre] = React.useState<string>("");

  const navigate = useNavigate();

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
    setGenre(genre);
    toggleFiltered();
  };

  const toggleOn = () => {
    setOn(!on);
  };

  const toggleFiltered = () => {
    setFiltered(!filtered);
  };

  const lists = list.map((item) => {
    return <Shows key={item.id} item={item} handleClick={handleClick} />;
  });

  if (on) {
    document.body.style.overflowY = "hidden";
  } else if (filtered) {
    document.body.style.overflowY = "hidden";
  } else document.body.style.overflowY = "scroll";

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      sessionStorage.removeItem("user");
      navigate("/");
      if (error) throw error;
    } catch (error) {
      alert(error);
    }
  };

  return (
    <>
      <section className="hero">
        <Search filter={list} handleClick={handleClick} />
        <button onClick={signOut}>Sign out </button>
      </section>
      {on && <Modal on={on} toggle={toggleOn} path={id} />}
      {filtered && (
        <FilteredModal
          name={genre}
          open={filtered}
          toggle={toggleFiltered}
          handleClick={handleClick}
          shows={list}
        />
      )}
      <Carousel items={lists} />
      <Genres toggle={handleFiltered} />
      <Watched />
    </>
  );
};

export default Homepage;
