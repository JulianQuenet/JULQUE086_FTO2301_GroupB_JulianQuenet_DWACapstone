import React from "react";
import { formattedDate } from "./show";
import CloseIcon from "@mui/icons-material/Close";
import { IconButton } from "@mui/material";

interface cardProps {
  toggle: () => void;
  open: boolean;
  handleClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  shows: any[];
  name: string;//Name is a prop passed from home page when the genre  is clicked, the name is based on the id of the genre
}

export const GENRES: { [key: string]: number } = { // This is the object that is used to filter the shows based on the genre
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
    return item.genres.includes(GENRES[name]);//This is where the shows are filtered based on the genre genres are stored as an array i.e [1,2,4]
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
        <div className="updated">Updated: {formattedDate(item.updated)}</div>
      </div>
    );
  });

  return (
    <>
      {open && <div className="backdrop"></div>}
      <dialog open={open} className="modal">
        <div className="inputs">
          <IconButton onClick={toggle} color="info"><CloseIcon /></IconButton>
        </div>
          <div className="card-display">{name}</div>
        <div className="list filtered">{list}</div>
      </dialog>
    </>
  );
};
export default FilteredModal;
