
interface ShowItem {
  title: string;
  image: string;
  seasons: number;
  description: string;
  id: string;
}

interface ShowsProps {
  item: ShowItem;
  handleClick: (e: React.MouseEvent<HTMLDivElement>) => void;
}

  
  export const Shows = (props: ShowsProps) => {
    const { item, handleClick } = props;

    
    return (
        <>
        <div className = "show" id={item.id} onClick={handleClick}>
        <img src={item.image}  className="show-image"/>
        <div className="show-info">
          <p className="show-title">{item.title}</p>
          <div className="show-season">Seasons:{item.seasons}</div>
          </div> 
          </div>
        </>  
    )
}

export default Shows







// "id": "10716",
//     "title": "Something Was Wrong",
//     "description": "Something Was Wrong is an Iris Award-winning true-crime docuseries about the discovery, trauma, and recovery from shocking life events and abusive relationships.",
//     "seasons": 14,
//     "image": "https://content.production.cdn.art19.com/images/cc/e5/0a/08/cce50a08-d77d-490e-8c68-17725541b0ca/9dcebd4019d57b9551799479fa226e2a79026be5e2743c7aef19eac53532a29d66954da6e8dbdda8219b059a59c0abe6dba6049892b10dfb2f25ed90d6fe8d9a.jpeg",
//     "genres": [1, 2],
//     "updated": "2022-11-03T07:00:00.000Z"


{/* <p className="preview__description">{item.description}</p> */}