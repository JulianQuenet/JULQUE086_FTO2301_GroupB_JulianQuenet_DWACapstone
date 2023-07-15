import React from "react";
import { formattedDate } from "./show";

interface SearchProps {
  filter: any[];
  handleClick: (e: React.MouseEvent<HTMLDivElement>) => void;
}

const SORTING__OPTIONS: string[] = [
  "Default",
  "A-Z",
  "Z-A",
  "Newest",
  "Oldest",
];

const Search = (props: SearchProps) => {
  const { filter, handleClick } = props;
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
      if (value === "" || value === null) return;
      data[key] = String(value).toLowerCase();
    });

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

  const podcastList = searchResult.map((item, index) => {
    return (
      <div
        key={index}
        className="search-result-item"
        id={item.id}
        onClick={handleClick}
      >
        <div className="item-content">
          <div className="item-preface">
            <img
              src={item.image}
              alt={item.title}
              style={{ display: "block", margin: "0 auto", width: "100%" }}
            />
            <div className="search-info">
              {item.title}
              <div>
                {" "}
                <div className="show-season">Seasons: {item.seasons}</div>
                <p className="updated">{formattedDate(item.updated)}</p>
              </div>
            </div>
          </div>
          <div className="item-backface">
            <p className="item-description" style={{ fontSize: "0.75rem" }}>
              {item.description}
            </p>
          </div>
        </div>
      </div>
    );
  });

  return (
    <>
      <div className="search">
        <form onSubmit={submitHandler} id="search">
          <input type="text" placeholder="Search" name="searchOutput" />
          <button type="submit" form="search">
            Search
          </button>
        </form>
        <div className="filter">
          <label htmlFor="filter">Sort by:</label>
          <select onChange={sortBy} name="filter">
            {options}
          </select>
        </div>
      </div>
      <div className="search-result">
        {podcastList}
      </div>
    </>
  );
};

export default Search;
