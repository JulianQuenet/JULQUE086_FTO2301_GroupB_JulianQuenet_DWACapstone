import React from "react";
import { formattedDate } from "./show";
import { GENRES } from "./genres";
import { Button, IconButton } from "@mui/material";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import SearchIcon from "@mui/icons-material/Search";
import TextField from '@mui/material/TextField';

interface SearchProps {
  filter: any[];
  handleClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  openGenre: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export const SORTING__OPTIONS: string[] = [
  "Default",
  "A-Z",
  "Z-A",
  "Newest",
  "Oldest",
];

const Search = (props: SearchProps) => {
  const { filter, handleClick, openGenre } = props;
  const [searchResult, setSearchResult] = React.useState<any[]>([]);
  const [defaultResult, setDefaultResult] = React.useState<any[]>([]);

  React.useEffect(() => {
    setSearchResult(filter);
    setDefaultResult(searchResult);
  }, [filter]);

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: { [key: string]: string } = {};
    formData.forEach((value, key) => {
      data[key] = String(value).toLowerCase();
    });
    if (data.searchOutput === "") {
      setSearchResult(defaultResult);
      return;
    }
    const result = filter.filter((item) => {
      return item.title.toLowerCase().includes(data.searchOutput);
    });
    setSearchResult(result);
    setDefaultResult(result);
  };

  const sortBy = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    let sortedResult: any[] = [];

    switch (value) {
      case "A-Z":
        sortedResult = [...searchResult].sort((a, b) =>
          a.title.localeCompare(b.title, undefined, { sensitivity: "base" })
        );
        break;
      case "Z-A":
        sortedResult = [...searchResult].sort((a, b) =>
          b.title.localeCompare(a.title, undefined, { sensitivity: "base" })
        );
        break;
      case "Newest":
        sortedResult = [...searchResult].sort(
          (a, b) =>
            new Date(b.updated).getTime() - new Date(a.updated).getTime()
        );
        break;
      case "Oldest":
        sortedResult = [...searchResult].sort(
          (a, b) =>
            new Date(a.updated).getTime() - new Date(b.updated).getTime()
        );
        break;
      default:
        sortedResult = defaultResult;
    }

    setSearchResult(sortedResult);
  };

  const options = SORTING__OPTIONS.map((item, index) => {
    return (
      <option key={index} value={item}>
        {item}
      </option>
    );
  });

  const genreStyle: React.CSSProperties = {
    border: "solid 1px darkgrey",
    borderRadius: "10px",
    fontSize: "0.7rem",
    padding: "2px",
    cursor: "pointer",
    fontFamily: "Arial, Helvetica, sans-serif",
  };

  const podcastList = searchResult.map((item, index) => {
    return (
      <div key={index} className="search-result-item">
        <div className="item-content">
          <div className="item-preface" style={{ paddingBottom: "10px" }}>
            <img
              src={item.image}
              alt={item.title}
              style={{ display: "block", margin: "0 auto", width: "100%" }}
            />
            <div className="search-info">
              {item.title}
              <div>
                <div className="show-season">Seasons: {item.seasons}</div>
                <p className="updated">
                  Updated: {formattedDate(item.updated)}
                </p>
              </div>
            </div>
          </div>
          <div className="item-backface" style={{ textAlign: "center" }}>
            <div onClick={handleClick} id={item.id}>
              <Button
                size="small"
                variant="outlined"
                endIcon={<PlayCircleOutlineIcon />}
              >
                Play
              </Button>
            </div>
            <div
              onClick={openGenre}
              className="user-button"
              id={GENRES[item.genres[0] - 1]}
              style={genreStyle}
            >
              Genre:{GENRES[item.genres[0] - 1]}
            </div>
            <div style={{ margin: "5px", color: "green" }}>DESCRIPTION</div>
            <p className="item-description" style={{ fontSize: "0.75rem" }}>
              {item.description}
            </p>
          </div>
        </div>
      </div>
    );
  });

  const noResultsStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    width: "100%",
  };

  return (
    <>
      <div className="search" >
        <form style={{display:"flex", alignItems:"center"}} onSubmit={submitHandler} id="search">
          <TextField label="Search" variant="outlined" name="searchOutput"/>
          <IconButton
            type="submit"
            form="search"
            color="success"
          >
            <SearchIcon/>
          </IconButton>
        </form>
        <div className="filter">
          <label htmlFor="filter">Sort by:</label>
          <select onChange={sortBy} name="filter">
            {options}
          </select>
        </div>
      </div>
      <div className="search-result">
      {podcastList.length === 0 && <div style={noResultsStyle}>No results found</div>}
      {podcastList && (podcastList)}
        </div>
    </>
  );
};

export default Search;
