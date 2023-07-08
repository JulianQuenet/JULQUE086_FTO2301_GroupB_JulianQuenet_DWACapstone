import React from "react";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";

interface cardProps {
  toggle: () => void;
  on: boolean;
  path: string;
}
const Modal = (props: cardProps) => {
  const { toggle, on, path } = props;
  const [seasons, setSeasons] = React.useState<any[]>([]);
  const [episodes, setEpisodes] = React.useState<any[]>([]);
  const [image, setImage] = React.useState<string>("");
  const [index, setIndex] = React.useState<number>(0);
  const [episodeIndex, setEpisodeIndex] = React.useState<number>(0);

  React.useEffect(() => {
    const URL: String = `https://podcast-api.netlify.app/id/${path}`;
    const getCard = async () => {
      const res = await fetch(`${URL}`);
      const data = await res.json();
      setSeasons(data.seasons);
      setEpisodes(data.seasons[0].episodes);
      setImage(data.seasons[0].image);
      setEpisodeIndex(0);
    };
    getCard();
  }, []);

  React.useEffect(() => {
    if (seasons.length >= 1) {
      setImage(seasons[index].image);
    }
  }, [index, seasons]);

  const options = seasons.map((item, index) => {
    return (
      <option key={index} value={index}>
        Season {index + 1}
      </option>
    );
  });

  const getEpisode = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const index: number = Number(e.target.value);
    setEpisodes(seasons[index].episodes);
    setIndex(index);
    setEpisodeIndex(0);
  };

  const getBackground = (props: string) => {
    return {
      margin: "0 auto",
      padding: "10px",
      borderRadius: "10px",
      width: "90%",
      backgroundImage: `url(${props})`,
      backgroundSize: "cover",
      repeat: "no-repeat",
    };
  };

  const chooseEpisode = (e: React.MouseEvent<HTMLDivElement>) => {
    const targetId: number = parseInt(e.currentTarget.id);
    setEpisodeIndex(targetId);
  };

  const player = episodes.map((item, index) => {
    const nextEpisode = () => {
      if (episodeIndex === episodes.length - 1) {
        setEpisodeIndex(0);
        return;
      }
      setEpisodeIndex((prev) => prev + 1);
    };

    const prevEpisode = () => {
      if (episodeIndex === 0) {
        setEpisodeIndex(episodes.length - 1);
        return;
      }
      setEpisodeIndex((prev) => prev - 1);
    };

    return (
      <div key={index} className="card-display">
        <div className="card-episode">Episode {index + 1}</div>
          <img src={image} width={100} className="card-image" />
            <div className="card-title">{item.title}</div>
        <AudioPlayer
          onClickNext={nextEpisode}
          onClickPrevious={prevEpisode}
          autoPlayAfterSrcChange={false}
          src={item.file}
          showSkipControls={true}
          showJumpControls={false}
        />
      </div>
    );
  })[episodeIndex];

  const episodeList = episodes.map((item, index) => {
    return (
      <div
        key={index}
        className="episode"
        onClick={chooseEpisode}
        id={index.toString()}
      >
        <div className="episode-title">{item.title}</div>
        <div className="episode-number">Ep:{item.episode}</div>
      </div>
    );
  });



  return (
    <>
      <div className="backdrop"></div>
      <dialog open={on} className="modal primary">
        <section className="modal-container">
          <div className="inputs">
            <button onClick={toggle}>return</button>
            <select onChange={getEpisode}>{options}</select>
          </div>
          <div style={getBackground(image)}>{player}</div>
        </section>
        <p style={{margin: "0 15px"}}>Episodes: {episodes.length}</p>
        <div className="list">{episodeList}</div>
      </dialog>
    </>
  );
};
export default Modal;
