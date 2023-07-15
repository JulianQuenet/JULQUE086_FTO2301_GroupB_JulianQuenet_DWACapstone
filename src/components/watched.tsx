import React from "react";


export const WATCHLIST: any = []
export const COMPLETED: any = []

const Watched = () => {
  const [watched, setWatched] = React.useState<any[]>([WATCHLIST]);
  const [completed, setCompleted] = React.useState<any[]>([COMPLETED]);

  React.useEffect(() => {
    setWatched(WATCHLIST);
    setCompleted(COMPLETED);
  }, [WATCHLIST, COMPLETED]);

  const watchedList = watched.map((item, index) => {
    return (
        <div key={index} className="watched">
            <h3>{item.title}</h3>
        </div>
    )
  });

  const completedList = completed.map((item, index) => {
    return (
        <div key={index} className="watched">
            <h3>{item.title}</h3>
        </div>
    )
  });

  const historyStyle = {
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "black",
  }


  return(
        <>
            <div className="history" style={historyStyle}>
                {watchedList}
                {completedList}
            </div>
        </>
  )
};

export default Watched;