import React from "react";
import supabase from "../../supabaseClient";
import { FlagSpinner } from "react-spinners-kit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { IconButton } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import CloseIcon from "@mui/icons-material/Close";
import { SORTING__OPTIONS } from "./search";
import { formattedDate } from "./show";

interface modalProps {
  toggle: () => void;
  open: boolean;
  user: any;
  handleClick: (e: React.MouseEvent<HTMLDivElement>) => void;
}







const FavoritesModal = (props: modalProps) => {
  const { toggle, open, user, handleClick } = props;
  const [favorites, setFavorites] = React.useState<any[]>([]);
  const [favReference, setFavReference] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [value, setValue] = React.useState<string>("Default");

  React.useEffect(() => {
    const getFavorites = async () => {
      try {
        setLoading(true);
        let { data, error } = await supabase
          .from("User favorites")
          .select("*")
          .eq("user_id", user.user.id)
          .order('showTitle', { ascending: true })
          .order('season', { ascending: true })
          .order('episode', { ascending: true });

        if (data) {setFavorites(data)
        setFavReference(data)
      }
        if (error) throw error;
      } catch (error) {
        alert("Something went wrong please refresh the page");
      } finally {
        setLoading(false);
      }
    };

    getFavorites();
  }, []);

  const miniInfoStyles: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    marginTop: "0.2rem",
    fontSize: "0.8rem",
    textAlign: "left",
  };

  const removeFavorite = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const index = e.currentTarget.dataset.index;
    const id = e.currentTarget.id;
    try {
        const { error } = await supabase
            .from("User favorites")
            .delete()
            .eq("id", id);
        if (error) throw error;
        const newFavorites = favorites.filter((item, i) => i !== Number(index));
        setFavorites(newFavorites);
        setFavReference(newFavorites);
        setValue("Default");
    } catch (error) {
        alert("Something went wrong please refresh the page")
    }
  };

  const list = favReference.map((item, index) => {
    return (
      <div key={item.id} className="wrapper">
        <div
          className="list-info"
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <div id={item.episode_id}
               data-season={item.season}
               data-episode={item.episode}
               onClick={handleClick} style={{ display: "flex", gap: "0.5rem", alignItems: "center", width:"100%" }}>
            <img src={item.image} className="list-image favorites" />
            <div>
              <h4 style={{ fontWeight: "350", fontFamily: "monospace" }}>
                Show: {item.showTitle}
              </h4>
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
          <Tooltip title="Remove from favorites" placement="top-end">
            <IconButton style={{zIndex:"55"}} color="error" id={item.id} data-index={index} onClick={removeFavorite}>
              <DeleteOutlineIcon />
            </IconButton>
          </Tooltip>
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
        You have no favorites
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
  }

  return (
    <>
      {" "}
      <div className="backdrop"></div>
      <dialog open={open} className="modal">
        {loading && (
          <div className="loading">
            <FlagSpinner size={40} color="#fff" loading={loading} />
          </div>
        )}
        {!loading && (
          <div style={{ height: "100%", width: "100%" }}>
            <div className="inputs">
              <IconButton onClick={toggle} color="info"><CloseIcon/></IconButton>
            </div>
            <div className="card-display">
              {user.user.user_metadata.full_name}'s favorites
            </div>
            <label htmlFor="sort">Sort by:</label>
            <select className="sort" onChange={sortBy} value={value} name="sort">{options}</select>
            {empty ? <Message /> : <div className="list favorite">{list}</div>}
          </div>
        )}
      </dialog>
    </>
  );
};

export default FavoritesModal;
