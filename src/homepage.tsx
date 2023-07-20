import React from "react";
import Shows from "./components/show";
import Carousel from "./components/carousel";
import Modal from "./components/modal";
import Genres from "./components/genres";
import FilteredModal from "./components/modal.filtered";
import Search from "./components/search";
import ModalWatched from "./components/modal.watched";
import Header from "./components/header";
import FavoritesModal from "./components/modal.favorites";
import ModalSettings from "./components/modal.settings";
import { INDEX } from "./components/modal";
import "./index.css";

const URL: String = "https://podcast-api.netlify.app/shows";

interface homePageProps {
  user: any;
}

const Homepage = (props: homePageProps) => {
  const [list, setList] = React.useState<any[]>([]);
  const [on, setOn] = React.useState<boolean>(false);
  const [id, setId] = React.useState<string>("");
  const [filtered, setFiltered] = React.useState<boolean>(false);
  const [showSettings, setShowSettings] = React.useState<boolean>(false);
  const [showFavorites, setShowFavorites] = React.useState<boolean>(false);
  const [showViewed, setShowViewed] = React.useState<boolean>(false);
  const [genre, setGenre] = React.useState<string>("");
  const { user } = props;

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
    if (e.currentTarget.dataset.season && e.currentTarget.dataset.episode) {
      INDEX.season = Number(e.currentTarget.dataset.season) - 1;
      INDEX.episode = Number(e.currentTarget.dataset.episode) - 1;
    } else {
      INDEX.season = 0;
      INDEX.episode = 0;
    }

    const targetId = e.currentTarget.id;

    setId(targetId);
    toggleOn();
    setShowFavorites(false);
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
  const toggleFavorites = () => {
    setShowFavorites(!showFavorites);
    setShowSettings(false);
  };

  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  const toggleViewed = () => {
    setShowViewed(!showViewed);
    setShowSettings(false);
  };

  const lists = list.map((item) => {
    return <Shows key={item.id} item={item} handleClick={handleClick} />;
  });

  if (on) {
    document.body.style.overflowY = "hidden";
  } else if (filtered) {
    document.body.style.overflowY = "hidden";
  } else if (showFavorites) {
    document.body.style.overflowY = "hidden";
  } else if (showViewed) {
    document.body.style.overflowY = "hidden";
  } else document.body.style.overflowY = "scroll";

  return (
    <>
      <section className="hero">
      <Header user={user} toggle={toggleSettings} />
        <Search openGenre={handleFiltered} filter={list} handleClick={handleClick} />
      </section>
      {on && (
        <Modal on={on} toggle={toggleOn} path={id} shows={list} user={user} />
      )}
      {filtered && (
        <FilteredModal
          name={genre}
          open={filtered}
          toggle={toggleFiltered}
          handleClick={handleClick}
          shows={list}
        />
      )}
      {showSettings && (
        <ModalSettings
          toggle={toggleSettings}
          open={showSettings}
          user={user}
          toggleFavorites={toggleFavorites}
          toggleViewed={toggleViewed}
        />
      )}
      {showFavorites && (
        <FavoritesModal
          toggle={toggleFavorites}
          open={showFavorites}
          user={user}
          handleClick={handleClick}
        />
      )}
      {showViewed && (
        <ModalWatched
          handleClick={handleClick}
          toggle={toggleViewed}
          open={showViewed}
          user={user}
        />
      )}
       <Carousel items={lists} />
       <Genres toggle={handleFiltered} />
    </>
  );
};

export default Homepage;
