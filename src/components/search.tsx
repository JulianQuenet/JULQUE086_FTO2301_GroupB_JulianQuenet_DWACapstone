import React from "react";
import { formattedDate } from "./show";
import { DominoSpinner } from "react-spinners-kit";
import { Button, IconButton } from "@mui/material";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import SearchIcon from "@mui/icons-material/Search";
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';

interface SearchProps {
  filter: any[];
  handleClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  openGenre: (e: React.MouseEvent<HTMLDivElement>) => void;
}

//The genre is displayed in a button when the user clicks on the button the shows are filtered based on the genre
const GENRES: { [key: number]: string } = {
  1: "Personal Growth",
  2: "True Crime and Investigative Journalism",
  3: "History",
  4: "Comedy",
  5: "Entertainment",
  6: "Business",
  7: "Fiction",
  8: "News",
  9: "Kids and Family",
};

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
  const [submitted, setSubmitted] = React.useState<boolean>(false);
  const [invalid, setInvalid] = React.useState<boolean>(false);
  const [value, setValue] = React.useState<string>("Default");
  const [isPending, startTransition] = React.useTransition()

  /**
   * @description Sets the local state to the list of shows retrieved form the api in the homepage component
   */
  React.useEffect(() => {
    setSearchResult(filter);
    setDefaultResult(filter);
  }, [filter]);

  /**
   * Changes the value of the select element, sets the local state to the value of the search result if the filtered
   * list return true, the search result is then sorted based on the value of the select element
   * @param e :React.FormEvent<HTMLFormElement>
   * @returns void
   */
  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(false);
    setValue("Default");
    const formData = new FormData(e.currentTarget);
    const data: { [key: string]: string } = {};
    formData.forEach((value, key) => {
      data[key] = String(value).toLowerCase();
    });
    if (data.searchOutput === "") {
      setInvalid(true)
      setTimeout(() => {
        setInvalid(false)
      }, 2000);
      return;
    }else{
      startTransition(()=>{
      const result = filter.filter((item) => {
      return item.title.toLowerCase().includes(data.searchOutput);
    });
    setSearchResult(result);
    setDefaultResult(result);
    setSubmitted(true);
    e.currentTarget.reset()}
    )
  }
    
  };

  /**
   * Based on the value of the select element the search result is sorted and the local state is set to the sorted result
   * the default result is used to reset the search result to the original list of shows or to the original list of shows 
   * based on the search result 
   * @param e :React.ChangeEvent<HTMLSelectElement>
   */
  const sortBy = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    let sortedResult: any[] = [];
    setValue(value);
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
    
    startTransition(()=>{setSearchResult(sortedResult)}) //Creates a loading state essentially but only improves performance the larger the list of shows is
    
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

  /**
   * @description maps over the search result and displays the relevant information for each show
   */
  const podcastList = searchResult.map((item, index) => {
    return (
      <div key={index} className="search-result-item">
        <div className="item-content">
          <div className="item-preface" style={{ paddingBottom: "10px" }}>
            <img
              loading="lazy"
              srcSet={item.image}
              alt={item.title}
              style={{ display: "block", margin: "0 auto", width: "100%" }}
            />
            <div className="search-info">
              <div className="search-info-title">{item.title}</div>
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
              id={GENRES[item.genres[0]]}
              style={genreStyle}
            >
              Genre:{GENRES[item.genres[0]]}
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

  //The search component is displayed in the home page, and acts as a search bar for the user to search for shows
  //If is pending is true the loading spinner is displayed, if the user submits the form and the list of shows is empty, a message is displayed
  return (
    <> 
      <div style={{fontFamily:"arial", color:"Highlight", fontSize:"0.9rem", margin:"10px 0", textAlign:"center" }}>Discover new sounds</div>
      <div className="search" >
        <form style={{display:"flex", alignItems:"center"}} onSubmit={submitHandler} id="search">
          <div className="searchBar"><TextField label="Search" variant="outlined" name="searchOutput"/>
          {invalid &&<Alert severity="warning" style={{position:'absolute', zIndex:"10"}}>Invalid please try again</Alert>}</div>
          <IconButton 
            size="small"
            type="submit"
            form="search"
            color="success"
          >
            <SearchIcon/>
          </IconButton>
          <IconButton onClick={()=>{setSearchResult(filter)
          setDefaultResult(filter)
          setValue("Default")}} color="info" size="small">All</IconButton>
        </form>

        <div className="filter">
          <label htmlFor="filterBy">Sort by:</label>
          <select onChange={sortBy} name="filterBy" value={value}>
            {options}
          </select>
        </div>
      </div>
      <div className="search-result">
      {isPending ? <div className="loading"><DominoSpinner size={100} color="#686769" loading={isPending} /></div> : podcastList && (podcastList)}
      {!isPending && submitted && podcastList.length === 0 && <div style={noResultsStyle}>No results found</div>}
        </div>
    </>
  );
};

export default Search;
