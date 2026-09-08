import React from "react";
import Navbar from "../components/Navbar";
import Card from "../components/Card";


const Home = () => {
  
  return (
    <div>
      <Navbar/>
      <div className="grid grid-cols-5 h-screen flex flex-wrap items-start p-16 justify-start gap-7 ">
        <Card />
      </div>
    </div>
  );
};

export default Home;
