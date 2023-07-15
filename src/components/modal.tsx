import React, { useRef } from "react";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { styled } from "@mui/material/styles";
import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { WATCHLIST, COMPLETED } from "./watched";

const FAVORITES: any = [];
const TIMESTAMPS: any = [];

interface cardProps {
  toggle: () => void;
  on: boolean;
  path: string;
}
const Modal = (props: cardProps) => {
  const { toggle, on, path } = props;
  const [seasons, setSeasons] = React.useState<any[]>([]);
  const [episodes, setEpisodes] = React.useState<any[]>([]);
  const [image, setImage] = React.useState<string>("");
  const [index, setIndex] = React.useState<number>(0);
  const [episodeIndex, setEpisodeIndex] = React.useState<number>(0);
  const [open, setOpen] = React.useState<boolean>(false);
  const [favorites, setFavorites] = React.useState<any[]>(FAVORITES);
  const [isPlaying, setIsPlaying] = React.useState<boolean>(false);
  const audioRef = useRef<AudioPlayer>(null);

  React.useEffect(() => {
    const URL: String = `https://podcast-api.netlify.app/id/${path}`;
    const getCard = async () => {
      const res = await fetch(`${URL}`);
      const data = await res.json();
      setSeasons(data.seasons);
      setEpisodes(data.seasons[0].episodes);
      setImage(data.seasons[0].image);
      setEpisodeIndex(0);
    };
    getCard();
  }, []);

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
  };

  const nextEpisode = () => {
    if (episodeIndex === episodes.length - 1) {
      setEpisodeIndex(0);
      return;
    }
    setEpisodeIndex((prev) => prev + 1);
  };

  const prevEpisode = () => {
    if (episodeIndex === 0) {
      setEpisodeIndex(episodes.length - 1);
      return;
    }
    setEpisodeIndex((prev) => prev - 1);
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

  const addToFavorites = () => {
    const selectedEpisode = episodes[episodeIndex];

    if (favorites.includes(selectedEpisode)) {
      setFavorites(favorites.filter((item) => item !== selectedEpisode));
      const index = FAVORITES.indexOf(selectedEpisode);
      if (index !== -1) {
        FAVORITES.splice(index, 1);
      }
    } else {
      setFavorites([...favorites, selectedEpisode]);
      FAVORITES.push(selectedEpisode);
    }
  };

  const handleClick = () => {
    if (isPlaying) {
      const confirmation = window.confirm(
        "You are about to leave while this episode is playing"
      );
      if (confirmation) toggle();
      else return;
    }
    toggle();
  };

  const handleListen = () => {
    const selectedEpisode = episodes[episodeIndex];
    if (audioRef.current?.audio?.current) {
      const timeStamp = audioRef.current.audio.current.currentTime;
      selectedEpisode.timeStamp = timeStamp;
      if (TIMESTAMPS.includes(selectedEpisode)) {
        const index = TIMESTAMPS.indexOf(selectedEpisode);
        TIMESTAMPS[index] = selectedEpisode;
      } else TIMESTAMPS.push(selectedEpisode);
    }
  };

  const handleLoad = () => {
    setIsPlaying(false);
    const selectedEpisode = episodes[episodeIndex];
    const time = TIMESTAMPS.includes(selectedEpisode)
      ? selectedEpisode.timeStamp
      : 0;
    if (audioRef.current?.audio?.current) {
      audioRef.current.audio.current.currentTime = time;
    }
  };

  const handlePLay = () => {
    const selectedEpisode = episodes[episodeIndex];
    let isInArray: boolean = false;
    WATCHLIST.forEach((item: any) => {
      if (item.title === selectedEpisode.title) {
        isInArray = true;
      }
    });
    if (!isInArray) WATCHLIST.push(selectedEpisode);
  };

  const handleEnded = () => {
    nextEpisode();
    const selectedEpisode = episodes[episodeIndex];
    let isInArray: boolean = false;
    WATCHLIST.forEach((item: any) => {
      if (item.title === selectedEpisode.title) {
        isInArray = true;
      }
    });
    if (!isInArray) COMPLETED.push(selectedEpisode);
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
          {favorites.includes(episodes[episodeIndex]) ? (
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
          onListen={handleListen}
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
          onPause={() => setIsPlaying(false)}
        />
      </div>
    );
  })[episodeIndex];

  const episodeList = episodes.map((item, index) => {
    return (
      <div
        key={index}
        className="episode"
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
        <section className="modal-container">
          <div className="inputs">
            <button onClick={handleClick}>return</button>
            <select onChange={getEpisode}>{options}</select>
          </div>
          <div style={getBackground(image)}>{player}</div>
        </section>
        <p style={{ margin: "0 15px" }}>Episodes: {episodes.length}</p>
        <div className="list">{episodeList}</div>
      </dialog>
    </>
  );
};
export default Modal;
