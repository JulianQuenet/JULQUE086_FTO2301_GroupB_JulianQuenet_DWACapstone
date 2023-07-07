
interface StreamProps {
    playing: any[];
    open: boolean;
    closeStream: () => void;
}





const Stream = (props: StreamProps) => {
  const { playing, open, closeStream } = props;
  const episode = playing[0];

  console.log(episode.file);
    
    return (  
        <>
        <dialog open={open} className="modal streaming">
         <button onClick={closeStream}>return</button>
        </dialog>
        </>
     );
};



export default Stream;