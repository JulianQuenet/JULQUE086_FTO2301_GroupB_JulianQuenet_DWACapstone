import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "../../node_modules/swiper";

import "swiper/css";
import "swiper/css/navigation";

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
  const [filterResult, setFilterResult] = React.useState<any[]>([]);
  const [filtering, setFiltering] = React.useState<boolean>(false);
  const [none, setNone] = React.useState<boolean>(false);

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setNone(false);
    setFiltering(false);
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
    if (result.length === 0) {
      setNone(true);
    }
  };

  const message = none
    ? "No results found"
    : "Your search results will appear here";

  const sortBy = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setFiltering(true);
    let sortedResult;

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
          sortedResult = [...searchResult].sort((a, b) =>
          new Date(b.updated).getTime() - new Date(a.updated).getTime()
        );
        break;
        case "Oldest":
          sortedResult = [...searchResult].sort((a, b) =>
          new Date(a.updated).getTime() - new Date(b.updated).getTime()
        );
        break;
      default:
        sortedResult = searchResult;
    }

    setFilterResult(sortedResult);
  };

  const options = SORTING__OPTIONS.map((item, index) => {
    return (
      <option key={index} value={item}>
        {item}
      </option>
    );
  });

  const toMap = filtering ? filterResult : searchResult;

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
        {searchResult.length === 0 && <div className="holder">{message}</div>}
        <Swiper
          slidesPerView={"auto"}
          initialSlide={searchResult.length < 4 ? 1 : 0}
          spaceBetween={10}
          navigation={true}
          modules={[Navigation]}
          centeredSlides={searchResult.length < 4 ? true : false}
        >
          {toMap.map((item) => {
            return (
              <SwiperSlide key={item.id} className="filterSlide">
                <div onClick={handleClick} id={item.id} className="result">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="search-image"
                  />
                  <p className="search-title">{item.title}</p>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </>
  );
};

export default Search;
