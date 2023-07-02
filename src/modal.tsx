import React from "react";

interface cardProps {
  card: any;
  toggle: () => void;
  on: boolean;
}

export const Modal = (props: cardProps) => {
  const { card, toggle, on } = props;
  const [showDatabase, setShowDatabase] = React.useState<any[]>([])
  
  
  React.useEffect(() => {
    setShowDatabase(prev => [card, ...prev])
  }, [card]);
  

  return (<dialog open={on} className="modal">
    <div className="modal-container">
    <button onClick={toggle}>return</button>
      <img src={card.image} width={50} className="modal-image"/>
      <div className="modal-info">{card.title}</div>
    </div>
  </dialog>);
};
export default Modal;

