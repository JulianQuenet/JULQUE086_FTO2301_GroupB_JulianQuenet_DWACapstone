import React from "react";
import Stream from "./stream";

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
  const [streaming, setStreaming] = React.useState<boolean>(false);
  const [watchEpisode, setWatchEpisode] = React.useState<any[]>([]);

  React.useEffect(() => {
    const URL: String = `https://podcast-api.netlify.app/id/${path}`;
    const getCard = async () => {
      const res = await fetch(`${URL}`);
      const data = await res.json();
      setSeasons(data.seasons);
      setEpisodes(data.seasons[0].episodes);
      setImage(data.seasons[0].image);
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
  };

  const toggleStream = () => {
    setStreaming(!streaming);
  }


  const startStream = (e: React.MouseEvent<HTMLDivElement>) => {
      const targetId: number = parseInt(e.currentTarget.id)
      const episode = episodes[targetId];
      setWatchEpisode([episode]);
      toggleStream();
  }

  const episodeList = episodes.map((item, index) => {
    return (
      <div key={index} className="episode" onClick={startStream} id={index.toString()}>
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
          <div className="card-display">
            <img className="card-image" src={image} width="100" />
            <div className="card-info">{episodes.length}</div>
          </div>
        </section>
        <div className="list">{episodeList}</div>
      </dialog>
      {streaming && <Stream open={streaming} closeStream={toggleStream} playing={watchEpisode}/>}
    </>
  );
};
export default Modal;
