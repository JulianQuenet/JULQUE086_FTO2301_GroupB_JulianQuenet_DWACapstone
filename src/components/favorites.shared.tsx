import React from "react";
import supabase from "../../supabaseClient";
import { DominoSpinner } from "react-spinners-kit";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { SORTING__OPTIONS } from "./search";
import { formattedDate } from "./show";
import { useNavigate } from "react-router-dom";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import TextField from "@mui/material/TextField";
import Alert from "@mui/material/Alert";

// Compare this snippet from src\components\modal.favorites.tsx, all the same except the delete Icon is removed
//and when the exit button is clicked the user is routed to the login section

const FavoritesShared = () => {
  const [favorites, setFavorites] = React.useState<any[]>([]);
  const [favReference, setFavReference] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [invalid, setInvalid] = React.useState<boolean>(false);
  const [value, setValue] = React.useState<string>("Default");
  const [submitted, setSubmitted] = React.useState<boolean>(false);

  const navigate = useNavigate();

  const miniInfoStyles: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    marginTop: "0.2rem",
    fontSize: "0.8rem",
    textAlign: "left",
  };

  const list = favReference.map((item, index) => {
    return (
      <div
        data-use-index={index}
        key={item.id}
        className="wrapper"
        style={{ cursor: "default" }}
      >
        <div
          className="list-info"
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <div
            id={item.episode_id}
            style={{
              display: "flex",
              gap: "0.5rem",
              alignItems: "center",
              width: "100%",
            }}
          >
            <img src={item.image} className="list-image favorites" />
            <div>
              <p className="list-title" style={{ color: "lightslategray" }}>
                {item.title}
              </p>
              <div style={miniInfoStyles}>
                <div
                  style={{ display: "flex", gap: "1.5rem", color: "darkkhaki" }}
                >
                  <div className="list-season">Season: {item.season}</div>
                  <p className="list-episode">Episode: {item.episode}</p>
                </div>
                <h4 style={{ fontWeight: "350", fontFamily: "monospace" }}>
                  Show: {item.showTitle}
                </h4>
                <div
                  style={{
                    color: "gray",
                    fontSize: "0.75rem",
                    fontFamily: "monospace",
                  }}
                >
                  Added:{formattedDate(item.created_at)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  });
  const messageStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "80%",
    width: "100%",
    color: "darkgray",
  };

  const empty = list.length === 0;

  const Message = () => {
    return (
      <div className="empty" style={messageStyle}>
        Seems like there are no favorites yet.
      </div>
    );
  };

  const options = SORTING__OPTIONS.map((item, index) => {
    return (
      <option key={index} value={item}>
        {item}
      </option>
    );
  });

  const sortBy = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const valueSelect = e.target.value;
    let sortedResult: any[] = [];
    setValue(valueSelect);
    switch (valueSelect) {
      case "A-Z":
        sortedResult = [...favReference].sort((a, b) =>
          a.title.localeCompare(b.title, undefined, { sensitivity: "base" })
        );
        break;
      case "Z-A":
        sortedResult = [...favReference].sort((a, b) =>
          b.title.localeCompare(a.title, undefined, { sensitivity: "base" })
        );
        break;
      case "Newest":
        sortedResult = [...favReference].sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        break;
      case "Oldest":
        sortedResult = [...favReference].sort(
          (a, b) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
        break;
      default:
        sortedResult = favorites;
    }
    setFavReference(sortedResult);
  };

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const searchOutput = e.currentTarget.searchOutput.value;

    if (searchOutput === "") {
      setInvalid(true);
      setTimeout(() => {
        setInvalid(false);
      }, 2000);
      return;
    }
    try {
      setLoading(true);
      let { data, error } = await supabase
        .from("User favorites")
        .select("*")
        .eq("user_id", searchOutput.toString())
        .order("showTitle", { ascending: true })
        .order("season", { ascending: true })
        .order("episode", { ascending: true });

      if (data) {
        setFavorites(data);
        setFavReference(data);
      }
      if (error) throw error;
    } catch (error) {
      alert(
        "Something went wrong please refresh the page, consider checking the code again"
      );
    } finally {
      setLoading(false);
      setSubmitted(true);
    }
  };

  const authStyles: React.CSSProperties = {
    height: "100vh",
    width: "100vw",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  return (
    <>
      {!submitted && (
        <form
          className="authenticator"
          style={authStyles}
          onSubmit={submitHandler}
          id="search"
        >
          {loading && (
            <div className="loading">
              <DominoSpinner size={100} color="#686769" loading={loading} />
            </div>
          )}
          {!loading && (
            <div style={authStyles}>
              <TextField
                label="Input code"
                variant="outlined"
                name="searchOutput"
              />
              {invalid && (
                <Alert
                  severity="warning"
                  style={{ position: "absolute", zIndex: "10" }}
                >
                  Invalid please try again
                </Alert>
              )}
              <IconButton type="submit" form="search" color="success">
                <KeyboardArrowRightIcon />
              </IconButton>
            </div>
          )}
        </form>
      )}

      {submitted && (
        <dialog open={true} className="modal">
          {!loading && (
            <div style={{ height: "100%", width: "100%" }}>
              <div className="inputs">
                <IconButton onClick={() => navigate("/")} color="info">
                  <CloseIcon />
                </IconButton>
              </div>
              <div className="card-display">Favorite episodes</div>
              <label style={{ marginLeft: "10px" }} htmlFor="sort">
                Sort by:
              </label>
              <select
                className="sort"
                onChange={sortBy}
                value={value}
                name="sort"
              >
                {options}
              </select>
              {empty ? (
                <Message />
              ) : (
                <div className="list favorite">{list}</div>
              )}
            </div>
          )}
        </dialog>
      )}
    </>
  );
};

export default FavoritesShared;
