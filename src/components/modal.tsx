import React from "react";

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
      <option key={item.title} value={index}>
        Season {index + 1}
      </option>
    );
  });

  const getEpisode = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const index: number = Number(e.target.value);
    setEpisodes(seasons[index].episodes);
    setIndex(index);
  };

  const episodeList = episodes.map((item, index) => {
    return (
      <div key={index} className="episode">
        <div className="episode-title">{item.title}</div>
        <div className="episode-number">Ep:{item.episode}</div>
      </div>
    );
  });

  return (
    <>
      <div className="backdrop"></div>
      <dialog open={on} className="modal">
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
    </>
  );
};
export default Modal;
