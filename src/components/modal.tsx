import React, { useRef } from "react";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { styled } from "@mui/material/styles";
import {
  TooltipProps,
  tooltipClasses,
  Tooltip,
  IconButton,
} from "@mui/material";
import Typography from "@mui/material/Typography";
import { HISTORY } from "./modal.watched";
import { FlagSpinner } from "react-spinners-kit";
import supabase from "../../supabaseClient";
import CloseIcon from "@mui/icons-material/Close";

export const INDEX: { [key: string]: number } = {
  episode: 0,
  season: 0,
};

interface cardProps {
  toggle: () => void;
  on: boolean;
  path: string;
  shows: any;
  user: any;
}

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

const Modal = (props: cardProps) => {
  const { toggle, on, path, shows, user } = props;
  const [seasons, setSeasons] = React.useState<any[]>([]);
  const [episodes, setEpisodes] = React.useState<episodeProps[]>([]);
  const [image, setImage] = React.useState<string>("");
  const [index, setIndex] = React.useState<number>(0);
  const [episodeIndex, setEpisodeIndex] = React.useState<number>(0);
  const [open, setOpen] = React.useState<boolean>(false);
  const [favorites, setFavorites] = React.useState<episodeProps[]>([]);
  const [isPlaying, setIsPlaying] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [showData, setShowData] = React.useState<any>({});
  const [currentTime, setCurrentTime] = React.useState<number>(0);
  const [TIMESTAMPS, setTIMESTAMPS] = React.useState<episodeProps[]>([]);
  const audioRef = useRef<AudioPlayer>(null);

  React.useEffect(() => {
    const URL: String = `https://podcast-api.netlify.app/id/${path}`;
    const getCard = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${URL}`);
        const show = await res.json();
        setSeasons(show.seasons);
        setEpisodes(show.seasons[INDEX.season].episodes);
        setImage(show.seasons[INDEX.season].image);
        setEpisodeIndex(INDEX.episode);
        setIndex(INDEX.season);
        const showInfo = shows.filter((item: any) => {
          return item.id === path;
        });
        setShowData(showInfo[0]);
        let { data, error } = await supabase
          .from("User favorites")
          .select("*")
          .eq("user_id", user.user.id);
        if (data) setFavorites(data);
        let { data: timestamps, error: timestampError } = await supabase
          .from("User timestamps")
          .select("*")
          .eq("user_id", user.user.id);
        if (timestamps) setTIMESTAMPS(timestamps);
        if (!res) throw new Error("No response from server");
        if (error) throw error;
        if (timestampError) throw timestampError;
      } catch (error) {
        alert("Something went wrong please refresh the page and try again");
      } finally {
        setLoading(false);
      }
    };
    getCard();
  }, []);

  const isEpisodeIncluded = favorites.some(
    (favorite: any) =>
      favorite.title === episodes[episodeIndex].title &&
      favorite.episode === episodes[episodeIndex].episode
  );

  React.useEffect(() => {
    if (seasons.length >= 1) {
      setImage(seasons[index].image);
    }
  }, [index, seasons]);

  React.useEffect(() => {
    setOpen(false);
  }, [episodeIndex]);

  const options = seasons.map((item, index) => {
    return (
      <option key={index} value={index}>
        Season {index + 1}
      </option>
    );
  });
  const getEpisode = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const index: number = Number(e.target.value);
    setEpisodes(seasons[index].episodes);
    setIndex(index);
    setEpisodeIndex(0);
  };

  const getBackground = (props: string) => {
    return {
      margin: "0 auto",
      padding: "10px",
      borderRadius: "10px",
      width: "90%",
      backgroundImage: `url(${props})`,
      backgroundSize: "cover",
      repeat: "no-repeat",
    };
  };

  const chooseEpisode = (e: React.MouseEvent<HTMLDivElement>) => {
    const targetId: number = parseInt(e.currentTarget.id);
    setEpisodeIndex(targetId);
    if (isPlaying) {
      handlePause();
    }
  };

  const toggleTooltip = () => {
    setOpen(!open);
    return {
      transform: "rotate(180deg)",
    };
  };

  const DescriptionTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: "#f5f5f9",
      color: "rgba(0, 0, 0, 0.87)",
      maxWidth: 200,
      fontSize: theme.typography.pxToRem(12),
      border: "1px solid #dadde9",
      textAlign: "center",
    },
  }));

  const addToFavorites = async () => {
    const selectedEpisode = episodes[episodeIndex];
    selectedEpisode.showTitle = showData.title;
    selectedEpisode.season = seasons[index].season;
    selectedEpisode.user_id = user.user.id;
    selectedEpisode.episode_id = showData.id;
    selectedEpisode.image = image;

    if (isEpisodeIncluded) {
      setFavorites(
        favorites.filter((item) => {
          return (
            item.title !== selectedEpisode.title &&
            item.episode !== selectedEpisode.episode
          );
        })
      );
      try {
        const { error } = await supabase
          .from("User favorites")
          .delete()
          .eq("user_id", user.user.id)
          .eq("title", selectedEpisode.title);
        if (error) throw error;
      } catch (error) {
        alert("Something went wrong please refresh the page and try again");
      }
    } else {
      setFavorites([...favorites, selectedEpisode]);
      try {
        const { error } = await supabase
          .from("User favorites")
          .insert(selectedEpisode);
        if (error) throw error;
      } catch (error) {
        alert("Something went wrong please refresh the page and try again");
      }
    }
  };

  const handleClick = () => {
    if (isPlaying) {
      handlePause();
      const confirmation = window.confirm(
        "The video has been paused as you were about to leave while playing an audio file. Are you sure you want to leave?"
      );
      if (confirmation) toggle();
      else return;
    }
    toggle();
  };

  const handleTime = () => {
    if (audioRef.current?.audio?.current) {
      const timeStamp = audioRef.current.audio.current.currentTime;
      setCurrentTime(timeStamp);
    }
  };

  const timeIsIncluded = TIMESTAMPS.some((item: any) => {
    return (
      item.title === episodes[episodeIndex].title &&
      item.episode === episodes[episodeIndex].episode
    );
  });

  const handleLoad = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    const selectedEpisode = TIMESTAMPS.find((item: any) => {
      return (
        item.title === episodes[episodeIndex].title &&
        item.episode === episodes[episodeIndex].episode
      );
    });

    const time: any = selectedEpisode ? selectedEpisode?.timeStamp : 0;

    if (audioRef.current?.audio?.current)
      audioRef.current.audio.current.currentTime = time;
  };

  const handlePLay = async () => {
    const selectedEpisode = episodes[episodeIndex];
    selectedEpisode.episode_id = showData.id;
    selectedEpisode.user_id = user.user.id;
    selectedEpisode.season = seasons[index].season;
    selectedEpisode.image = image;
    let isInArray: boolean = false;
    HISTORY.WATCHLIST.forEach((item: any) => {
      if (item.title === selectedEpisode.title) {
        isInArray = true;
      }
    });
    if (isInArray) {
      const index = HISTORY.WATCHLIST.findIndex(
        (item: any) => item.title === selectedEpisode.title
      );
      HISTORY.WATCHLIST.splice(index, 1);
      HISTORY.WATCHLIST = [selectedEpisode, ...HISTORY.WATCHLIST];
      try {
        const { error } = await supabase
          .from("User history")
          .delete()
          .eq("user_id", user.user.id)
          .eq("title", selectedEpisode.title);
        if (error) throw error;
      } catch (error) {
        alert("Something went wrong please refresh the page and try again");
      }
      try {
        const { error } = await supabase
          .from("User history")
          .insert(selectedEpisode);
        if (error) throw error;
      } catch (error) {
        alert("Something went wrong please refresh the page and try again");
      }
    }
    if (!isInArray) {
      HISTORY.WATCHLIST = [selectedEpisode, ...HISTORY.WATCHLIST];
      try {
        const { error } = await supabase
          .from("User history")
          .insert(selectedEpisode);
        if (error) throw error;
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handlePause = async () => {
    setIsPlaying(false);
    const selectedEpisode = episodes[episodeIndex];
    selectedEpisode.timeStamp = currentTime;
    selectedEpisode.user_id = user.user.id;
    if (audioRef.current?.audio?.current) {
      audioRef.current.audio.current.pause();
    }
    if (timeIsIncluded) {
      setTIMESTAMPS(
        TIMESTAMPS.filter((item) => {
          return (
            item.title !== selectedEpisode.title &&
            item.episode !== selectedEpisode.episode
          );
        })
      );
      try {
        const { error } = await supabase
          .from("User timestamps")
          .delete()
          .eq("user_id", user.user.id)
          .eq("title", selectedEpisode.title);
        if (error) throw error;
      } catch (error) {
        alert("Something went wrong please refresh the page and try again");
      }
    } else {
      TIMESTAMPS.push(selectedEpisode);
      try {
        const { error } = await supabase
          .from("User timestamps")
          .insert(selectedEpisode);
        if (error) throw error;
      } catch (error) {
        alert("Something went wrong please refresh the page and try again");
      }
    }
  };

  const nextEpisode = () => {
    if (isPlaying) {
      handlePause();
    }
    if (episodeIndex === episodes.length - 1) {
      setEpisodeIndex(0);
      return;
    }
    setEpisodeIndex((prev) => prev + 1);
  };

  const prevEpisode = () => {
    if (isPlaying) {
      handlePause();
    }
    if (episodeIndex === 0) {
      setEpisodeIndex(episodes.length - 1);
      return;
    }
    setEpisodeIndex((prev) => prev - 1);
  };

  const handleEnded = async () => {
    const selectedEpisode = episodes[episodeIndex];
    selectedEpisode.timeStamp = 0;
    selectedEpisode.user_id = user.user.id;
    selectedEpisode.episode_id = showData.id;
    selectedEpisode.season = seasons[index].season;
    selectedEpisode.image = image;
    let isInArray: boolean = false;
    HISTORY.COMPLETED.forEach((item: any) => {
      if (item.title === selectedEpisode.title) {
        isInArray = true;
      }
    });

    if (isInArray) {
      const index = HISTORY.COMPLETED.findIndex(
        (item: any) => item.title === selectedEpisode.title
      );
      HISTORY.COMPLETED.splice(index, 1);
      HISTORY.COMPLETED = [selectedEpisode, ...HISTORY.COMPLETED];
      try {
        const { error } = await supabase
          .from("User completed")
          .delete()
          .eq("user_id", user.user.id)
          .eq("title", selectedEpisode.title);
        if (error) throw error;
      } catch (error) {
        alert("Something went wrong please refresh the page and try again");
      }
      try {
        const { error } = await supabase
          .from("User completed")
          .insert(selectedEpisode);
        if (error) throw error;
      } catch (error) {
        alert("Something went wrong please refresh the page and try again");
      }
    }
    if (!isInArray) {
      HISTORY.COMPLETED = [selectedEpisode, ...HISTORY.COMPLETED];
      try {
        const { error } = await supabase
          .from("User completed")
          .insert(selectedEpisode);
        if (error) throw error;
      } catch (error) {
        console.log(error);
      }
    }
  };

  const player = episodes.map((item, index) => {
    return (
      <div key={index} className="card-display">
        <div className="icons">
          <DescriptionTooltip
            open={open}
            onClick={toggleTooltip}
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
            title={
              <React.Fragment>
                <Typography color="green">Description</Typography>
                {item.description}
              </React.Fragment>
            }
          >
            <ExpandMoreIcon style={{ cursor: "pointer" }} />
          </DescriptionTooltip>
          {isEpisodeIncluded ? (
            <FavoriteIcon
              onClick={addToFavorites}
              style={{ cursor: "pointer" }}
            />
          ) : (
            <FavoriteBorderIcon
              onClick={addToFavorites}
              style={{ cursor: "pointer" }}
            />
          )}
        </div>
        <div className="card-episode">Episode {index + 1}</div>
        <img style={{ margin: "0 auto" }} src={image} width={100} />
        <div className="card-title">{item.title}</div>
        <AudioPlayer
          ref={audioRef}
          onListen={handleTime}
          onLoadStart={handleLoad}
          onClickNext={nextEpisode}
          onClickPrevious={prevEpisode}
          autoPlayAfterSrcChange={false}
          src={item.file}
          showSkipControls={true}
          showJumpControls={false}
          onPlay={handlePLay}
          onEnded={handleEnded}
          onPlaying={() => setIsPlaying(true)}
          onPause={handlePause}
        />
      </div>
    );
  })[episodeIndex];

  const episodeList = episodes.map((item, index) => {
    return (
      <div
        key={index}
        className="episode wrapper"
        onClick={chooseEpisode}
        id={index.toString()}
      >
        <div className="episode-title">{item.title}</div>
        <div className="episode-number">Ep:{item.episode}</div>
      </div>
    );
  });

  return (
    <>
      <div className="backdrop"></div>
      <dialog open={on} className="modal primary">
        {loading && (
          <div className="loading">
            <FlagSpinner size={40} color="#fff" loading={loading} />
          </div>
        )}
        {!loading && (
          <div>
            <section className="modal-container">
              <div className="inputs">
                <IconButton color="info">
                  <CloseIcon color="info" onClick={handleClick} />
                </IconButton>
                <select onChange={getEpisode} value={index}>
                  {options}
                </select>
              </div>
              <div style={getBackground(image)}>{player}</div>
            </section>
            <p style={{ margin: "5px 15px", fontFamily:"monospace", color:"darkorange" }}>Episodes: {episodes.length}</p>
            <div className="list">{episodeList}</div>
          </div>
        )}
      </dialog>
    </>
  );
};
export default Modal;
