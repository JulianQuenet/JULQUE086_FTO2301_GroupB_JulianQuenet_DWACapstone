import Homepage from "./homepage";
import Landing from "./components/landing";
import React from "react";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import FavoritesShared from "./components/favorites.shared";
import "./index.css";
import "./form.css";

//This is the main app component, it contains the routes for the application and if there is a valid user
//it will set the user in the session storage and will then be used to check if the user is logged in or not and 
//keep the relevant data in the session storage
const App = () => {
   const [user, setUser] = React.useState<any>(null);

   if(user){
    sessionStorage.setItem('user', JSON.stringify(user));
   }

   React.useEffect(() => {
    const user = sessionStorage.getItem('user');
    if(user){
      setUser(JSON.parse(user));
    }
   }, []);
   

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing setUser={setUser}/>} />
        {user && <Route path="/homepage/*" element={<Homepage user={user}/>} />}
        <Route path="/favorites" element={<FavoritesShared />} />
      </Routes>
    </BrowserRouter>
  );
};



export default App;