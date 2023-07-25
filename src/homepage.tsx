import React from "react";
import Shows from "./components/show";
import Carousel from "./components/carousel";
import Modal from "./components/modal";
import Genres from "./components/genres";
import FilteredModal from "./components/modal.filtered";
import Search from "./components/search";
import WatchedModal from "./components/modal.watched";
import Header from "./components/header";
import FavoritesModal from "./components/modal.favorites";
import Footer from "./components/footer";
import SettingsModal from "./components/modal.settings";
import { INDEX } from "./components/modal";
import { WaveSpinner } from "react-spinners-kit";
import { useNavigate } from "react-router-dom";
import "./index.css";

const URL: String = "https://podcast-api.netlify.app/shows";

/**The main functional component for the application, it contains the state for the modal, the filtered modal, the favorites modal and
for the history modal, in terms of whether they are open or closed, also houses most of the onCLick events for the application
and does the main api call to pass down the data to the necessary child components
*/

const Homepage = () => {
  const [list, setList] = React.useState<any[]>([]);
  const [on, setOn] = React.useState<boolean>(false);
  const [id, setId] = React.useState<string>("");
  const [filtered, setFiltered] = React.useState<boolean>(false);
  const [showSettings, setShowSettings] = React.useState<boolean>(false);
  const [showFavorites, setShowFavorites] = React.useState<boolean>(false);
  const [showViewed, setShowViewed] = React.useState<boolean>(false);
  const [genre, setGenre] = React.useState<string>("");
  const [loading, setLoading] = React.useState<boolean>(false);
  const [user, setUser] = React.useState<any>(null);

const navigate = useNavigate();//Will be used to navigate to the login page if the user is not logged in
  /**
   * @description This is the main api call for the application, it gets the data from the api and sets the state
   * based on the data retrieved, it also sets the title of the show at index 12 to the correct title
   */
  React.useEffect(() => {
    const getList = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${URL}`);
        const data = await res.json();
        data[12].title = "Truth & Justice with Bob Ruff";
        setList(data);
        if (!res) {
          throw new Error(`${res} returned null`);
        }
        const userOld = sessionStorage.getItem("user");
    if (userOld) {
      setUser(JSON.parse(userOld));
    }
      } catch (error) {
        alert(error);
      } finally {
        setTimeout(() => {
          //Fake loading time as the api call is very fast
          setLoading(false);
        }, 1000);
      }
    };
    getList();
  }, []);

  /**
   * If the show is clicked the modal player is opened with the relevant data based on the id, the index is also
   * used if the data sets are available in order to set the player to the correct episode and season, this only comes
   * into play in the favorites modal and history modal
   * @param e :React.MouseEvent<HTMLDivElement>
   */
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

  //Brings up the genres modal and set the genre to the name of the genre clicked which will be displayed in the modal
  const handleFiltered = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!e.target) {
      throw new Error(`${e.target} returned null`);
    }

    const genre = e.currentTarget.id;
    setGenre(genre);
    toggleFiltered();
  };

  //Opens and closes the played modal
  const toggleOn = () => {
    setOn(!on);
  };

  //Opens and closes the genres modal
  const toggleFiltered = () => {
    setFiltered(!filtered);
  };
  //Opens and closes the favorites modal
  const toggleFavorites = () => {
    setShowFavorites(!showFavorites);
    setShowSettings(false);
  };

  //Opens and closes the settings modal
  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  //Opens and closes the history modal
  const toggleViewed = () => {
    setShowViewed(!showViewed);
    setShowSettings(false);
  };

  //Maps the list of shows to create preview cards for the carousel, lists is then passed to the carousel component
  const lists = list.map((item) => {
    return <Shows key={item.id} item={item} handleClick={handleClick} />;
  });

  if (on) {
    //If any of the modals are open the body is set to overflow hidden to prevent scrolling, except for the settings modal
    document.body.style.overflowY = "hidden";
  } else if (filtered) {
    document.body.style.overflowY = "hidden";
  } else if (showFavorites) {
    document.body.style.overflowY = "hidden";
  } else if (showViewed) {
    document.body.style.overflowY = "hidden";
  } else document.body.style.overflowY = "scroll";

  const loadingStyles: React.CSSProperties = {
    height: "100vh",
    width: "100vw",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  const {protocol, host} = window.location

  //All components are rendered here, the loading spinner is rendered if the loading state is true and all the modals are rendered conditionally
  //Except for the settings modal and filtered modal as the don't make any calls to the database
  return (
    <>
      {user && (
        <>
          {loading && (
            <div className="loading" style={loadingStyles}>
              <WaveSpinner size={30} color="#fff" loading={loading} />
            </div>
          )}
          {!loading && (
            <section>
              <section className="hero">
                <Header user={user} toggle={toggleSettings} />
                <Search
                  openGenre={handleFiltered}
                  filter={list}
                  handleClick={handleClick}
                />
              </section>

              {on && (
                <Modal
                  on={on}
                  toggle={toggleOn}
                  path={id}
                  shows={list}
                  user={user}
                />
              )}

              <FilteredModal
                name={genre}
                open={filtered}
                toggle={toggleFiltered}
                handleClick={handleClick}
                shows={list}
              />
              <SettingsModal
                toggle={toggleSettings}
                open={showSettings}
                user={user}
                toggleFavorites={toggleFavorites}
                toggleViewed={toggleViewed}
              />
              {showFavorites && (
                <FavoritesModal
                  toggle={toggleFavorites}
                  open={showFavorites}
                  user={user}
                  handleClick={handleClick}
                />
              )}

              {showViewed && (
                <WatchedModal
                  handleClick={handleClick}
                  toggle={toggleViewed}
                  open={showViewed}
                  user={user}
                />
              )}
              <div className="lowerMain">
                <Carousel items={lists} />
                <Genres toggle={handleFiltered} />
              </div>

              <Footer />
            </section>
          )}
        </>
      )}
      {!user && (<div className="loading" style={{width:"300px", height:"100vh", textAlign:"center", margin:"0 auto"}}>Fetching some data, if you still see this page after
      a few minutes please return to the login section
      <button className="user-button" onClick={()=>navigate("/")}>{protocol}//{host}</button></div>)}
    </>
  );
};

export default Homepage;
