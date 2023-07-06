import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Navigation,
} from "../../node_modules/swiper";

import "swiper/css";
import "swiper/css/navigation";

interface SearchProps {
  filter: any[];
  handleClick: (e: React.MouseEvent<HTMLDivElement>) => void;
}

const Search = (props: SearchProps) => {
  const { filter, handleClick } = props;
  const [searchResult, setSearchResult] = React.useState<any[]>([]);
  const [none, setNone] = React.useState<boolean>(false);
  
  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setNone(false);
    const formData = new FormData(e.currentTarget);
    const data: { [key: string]: string } = {};
    formData.forEach((value, key) => {
      if(value === "" || value === null) return;
      data[key] = String(value).toLowerCase();
    });
        
    const result = filter.filter((item) => {
        return item.title.toLowerCase().includes(data.searchResult);
    });
    setSearchResult(result);
    if (result.length === 0) {
        setNone(true);
    }
};

const list = searchResult.map((item) => {
    return (
        <SwiperSlide key={item.id} className="filterSlide"><div onClick={handleClick} id={item.id} className="result">
        <img src={item.image} alt={item.title} className="search-image" />
        <p className="search-title">{item.title}</p>
    </div></SwiperSlide>
    )
});

const message = none? 'No results found' : 'Your search results will appear here';

  return (
    <>
      <div className="search">
        <form onSubmit={submitHandler} id="search">
        <input type="text" placeholder="Search" name="searchResult" />
        <button type="submit" form="search">Search</button>
        </form>
        <select name="filter">
          <option value="all">All</option>
        </select>
      </div>
      <div className="search-result">
        {(searchResult.length === 0) &&<div className="holder">{message}</div>}
        <Swiper
          slidesPerView={"auto"} 
          spaceBetween={10}
          navigation={true}
          modules={[Navigation]}
          >{list}</Swiper>
      </div>
    </>
  );
};

export default Search;
