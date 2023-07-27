import React from "react";
import supabase from "../../supabaseClient";
import { formattedDate } from "./show";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton } from "@mui/material";
import { FlagSpinner } from "react-spinners-kit";
import Tooltip from "@mui/material/Tooltip";

import "swiper/css";

interface episodeProps {
  title: string;
  episode: number;
  file: string;
  description: string;
  timeStamp?: number;
  created_at?: string;
  user_id?: string;
  id?: string;
  showTitle?: string;
  season?: number;
  episode_id?: string;
  image?: string;
  added?: string;
}

interface HistoryType {
  WATCHLIST: episodeProps[];
  COMPLETED: episodeProps[];
}

export const HISTORY: HistoryType = {
  //Used to communicate between the watched modal and the show component
  WATCHLIST: [],
  COMPLETED: [],
};

interface WatchedProps {
  user: any;
  open: boolean;
  toggle: () => void;
  handleClick: (e: React.MouseEvent<HTMLDivElement>) => void;
}

const WatchedModal = (props: WatchedProps) => {
  const [watched, setWatched] = React.useState<any[]>([]);
  const [completed, setCompleted] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const { user, toggle, open, handleClick } = props;

  /**
   * @description When the component mounts, this function gets the user's history from the database and sets the state
   * based on the user's retrieved data, the history is then sorted by the date it was added to the database in a descending order
   */
  React.useEffect(() => {
    const getHistory = async () => {
      try {
        setLoading(true);
        let { data, error } = await supabase
          .from("User history")
          .select("*")
          .eq("user_id", user.user.id)
          .order("added", { ascending: false });

        if (data) {
          setWatched(data);
          HISTORY.WATCHLIST = data;
        }
        if (error) throw error;

        let { data: completedData, error: completedError } = await supabase
          .from("User completed")
          .select("*")
          .eq("user_id", user.user.id)
          .order("added", { ascending: false });

        if (completedData) {
          setCompleted(completedData);
          HISTORY.COMPLETED = completedData;
        }
        if (completedError) throw completedError;
      } catch (error) {
        alert("something went wrong, please refresh the page");
      } finally {
        setLoading(false);
      }
    };

    getHistory();
  }, []);

  /**
   * @description When the history is updated the local state is updated to reflect the changes
   */
  React.useEffect(() => {
    setWatched(HISTORY.WATCHLIST);
    setCompleted(HISTORY.COMPLETED);
  }, [HISTORY.WATCHLIST, HISTORY.COMPLETED]);

  /**
   * @description This is the function that clears the user's history, it deletes all the user's history from the database
   * and then reloads the page, only if confirmation is given by the user
   */
  const clearHistoryHandler = async () => {
    const confirmation = window.confirm(
      "This action will clear your history, are you sure you wish to continue?"
    );
    if (confirmation) {
      try {
        setLoading(true);
        const { error } = await supabase
          .from("User history")
          .delete()
          .eq("user_id", user.user.id);
        if (error) throw error;
      } catch (error) {
        alert("something went wrong, please refresh the page");
      }
      try {
        setLoading(true);
        const { error } = await supabase
          .from("User completed")
          .delete()
          .eq("user_id", user.user.id);
        if (error) throw error;
      } catch (error) {
        alert("something went wrong, please refresh the page");
      }
      try {
        setLoading(true);
        const { error } = await supabase
          .from("User timestamps")
          .delete()
          .eq("user_id", user.user.id);
        if (error) throw error;
      } catch (error) {
        alert("something went wrong, please refresh the page");
      } finally {
        setLoading(false);
        HISTORY.WATCHLIST = [];
        HISTORY.COMPLETED = [];
        setWatched([]);
        setCompleted([]);
      }
    }
  };

  /**
   * @description Maps over the watched and completed arrays and returns a div with the information of the show
   */
  const watchedList = watched.map((item, index) => {
    return (
      <div
        key={index}
        className="wrapper"
        id={item.episode_id}
        data-season={item.season}
        data-episode={item.episode}
        onClick={handleClick}
      >
        <div className="list-info">
          <img src={item.image} width={80} alt={item.title} />
          <div>
            <p className="list-title">{item.title}</p>
            <div className="list-season">Season {item.season}</div>
            <div className="list-season">Episode {item.episode}</div>
          </div>
        </div>
        <div className="updated">Watched:{formattedDate(item.added)}</div>
      </div>
    );
  });

  //Same principle as above but just for the completed array
  const completedList = completed.map((item, index) => {
    return (
      <div
        key={index}
        className="wrapper"
        id={item.episode_id}
        data-season={item.season}
        data-episode={item.episode}
        onClick={handleClick}
      >
        <div className="list-info">
          <img src={item.image} width={80} alt={item.title} />
          <div>
            <p className="list-title">{item.title}</p>
            <div className="list-season">Season {item.season}</div>
            <div className="list-season">Episode {item.episode}</div>
          </div>
        </div>
        <div className="updated">Completed:{formattedDate(item.added)}</div>
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

  const Message = () => {
    return (
      <div className="empty" style={messageStyle}>
        There are no items in this list
      </div>
    );
  };

  //The modal is rendered here and displays the watched and completed lists, if there are no items in the list then a message is displayed
  return (
    <>
      <div className="backdrop"></div>
      <dialog open={open} className="modal">
        {loading && (
          <div className="loading">
            <FlagSpinner size={40} color="#fff" loading={loading} />
          </div>
        )}
        {!loading && (
          <div style={{ height: "100%" }}>
            <div className="inputs">
              <IconButton onClick={toggle} color="info">
                <CloseIcon />
              </IconButton>
            </div>
            <div className="card-display">History</div>
            <div
              style={{
                width: "95%",
                margin: "0 auto",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                color:"white"
              }}
            >
              Viewed
              <Tooltip title="Clear History">
                <IconButton color="error" onClick={clearHistoryHandler}>
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </div>
            <div className="watched">
              {watchedList.length === 0 ? <Message /> : watchedList}
            </div>
            <div style={{ width: "95%", margin: "0 auto", color:"white" }}>Completed</div>
            <div className="watched completed">
              {completedList.length === 0 ? <Message /> : completedList}
            </div>
          </div>
        )}
      </dialog>
    </>
  );
};

export default WatchedModal;
