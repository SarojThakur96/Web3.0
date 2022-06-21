import React from "react";

import logo from "../../images/logo.png";

import { HiMenuAlt4 } from "react-icons/hi";
import { AiOutlineClose } from "react-icons/ai";

const Navbar = () => {
  const [toggleMenu, setToggleMenu] = React.useState(false);

  return (
    <nav className="w-full flex justify-between items-center p-4 md:justify-center">
      <div className="md:flex-[0.5] flex-initial justify-center items-center">
        <img src={logo} alt="logo" className="w-32 cursor-pointer" />
      </div>
      <ul className="text-white md:flex hidden list-none flex-row justify-between items-center flex-initial">
        {["Market", "Exchange", "Tutorial", "Wallets"].map((item, index) => {
          return (
            <li key={index + item} className={`mx-4 cursor-pointer`}>
              {item}
            </li>
          );
        })}
        <li className="bg-[#2952e3] px-7 py-2 mx-4 rounded-full cursor-pointer hover:bg-[#2546bd]">
          {" "}
          Logout{" "}
        </li>
      </ul>

      <div className="flex relative">
        {!toggleMenu ? (
          <HiMenuAlt4
            fontSize={28}
            className="text-white md:hidden cursor-pointer"
            onClick={() => setToggleMenu(!toggleMenu)}
          />
        ) : (
          <AiOutlineClose
            fontSize={28}
            className="text-white md:hidden cursor-pointer"
            onClick={() => setToggleMenu(!toggleMenu)}
          />
        )}
        {toggleMenu && (
          <ul
            className="z-10 fixed -top-0 -right-2 p-3 w-[70vw] h-screen shadow-2xl md:hidden list-none 
                   flex flex-col justify-start items-end rounded-md blue-glassmorphism text-white animate-slide-in"
          >
            <li className="text-xl w-full cursor-pointer">
              <AiOutlineClose onClick={() => setToggleMenu(!toggleMenu)} />
            </li>
            {["Market", "Exchange", "Tutorial", "Wallets"].map(
              (item, index) => {
                return (
                  <li
                    key={index + item}
                    className={`my-2 mx-4 text-lg cursor-pointer`}
                  >
                    {item}
                  </li>
                );
              }
            )}
          </ul>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
