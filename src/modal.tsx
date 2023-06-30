import React from "react";

interface ID {
  card: any;
}

export const Modal = (props: ID) => {
  const { card } = props;
  
  console.log(card)
  

  return <dialog className="show modal">{card.id}</dialog>;
};
export default Modal;

