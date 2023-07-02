import React from "react";
import { ID } from "./App";

interface cardProps {
  toggle: () => void;
  on: boolean;
}

interface CardItem {
  title: string;
  image: string;
  seasons: Array<any>;
  description: string;
  id: string;
}

export const Modal = (props: cardProps) => {
  const { toggle, on } = props;
  const [card, setCard] = React.useState<CardItem | any>([]);
  const [season, setSeason] = React.useState<any[]>([]);
  const id = ID.id;
  const URL: String = `https://podcast-api.netlify.app/id/${id}`;
  React.useEffect(() => {
    const getCard = async () => {
      const res = await fetch(`${URL}`)
      const data = await res.json()
      setCard(data)
      setSeason(data.seasons)
  }
  getCard()
  }, []);
 
  
  
  return (
    <>
    <div className="backdrop"></div>
  <dialog open={on} className="modal">
    <div className="modal-container">
    <button onClick={toggle}>return</button>
      <div className="card-display">
      <img className="card-image" width={100}/>
      <h3 className="card-info">{season.length}</h3>
      <div className="card-info">kdjnfkjndf</div>
      <div className="card-info">dkjfndkjfnkd</div>
      </div>
      </div>
  </dialog>
  </>);
};
export default Modal;


