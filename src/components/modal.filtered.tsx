import React from "react";
import { formattedDate } from "./show";

interface cardProps {
  toggle: () => void;
  open: boolean;
  handleClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  shows: any[];
  name: string;
}

const GENRES: { [key: string]: number } = {
  "Personal Growth": 1,
  "True Crime and Investigative Journalism": 2,
  History: 3,
  Comedy: 4,
  Entertainment: 5,
  Business: 6,
  Fiction: 7,
  News: 8,
  "Kids and Family": 9,
};

const FilteredModal = (props: cardProps) => {
  const { toggle, open, handleClick, shows, name } = props;

  const filteredShows = shows.filter((item) => {
    return item.genres.includes(GENRES[name]);
  });

  const list = filteredShows.map((item) => {
    return (
      <div key={item.id} onClick={handleClick} className="wrapper" id={item.id}>
        <div className="list-info">
          <img src={item.image} className="list-image" />
          <div>
            <p className="list-title">{item.title}</p>
            <div className="list-season">Seasons: {item.seasons}</div>
          </div>
        </div>
        <div className="updated">{formattedDate(item.updated)}</div>
      </div>
    );
  });

  return (
    <>
      <div className="backdrop"></div>
      <dialog open={open} className="modal">
        <div className="inputs">
          <button onClick={toggle}>return</button>
        </div>
          <div className="card-display">{name}</div>
        <div className="list filtered">{list}</div>
      </dialog>
    </>
  );
};
export default FilteredModal;
