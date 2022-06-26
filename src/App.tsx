import { useState } from "react";
import "./App.css";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import Services from "./components/Services";
import Transactions from "./components/Transactions";
import Welcome from "./components/Welcome";

const App = () => (
 
   <div className="min-h-screen bg-gray-700">
     
          <Navbar/>
          <Welcome/>
        

        <Services/>
         <Transactions/>
         <Footer/>
   </div>

)

export default App;
