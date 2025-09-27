import React from 'react';
import { IoIosArrowRoundBack } from 'react-icons/io';
import { MdOutlineKeyboardArrowLeft } from 'react-icons/md';
import { Link } from "react-router-dom";

const ButtonBack = ({ onClick, link }) => {
  return (
    <Link to={link}
      onClick={onClick}
      className="group flex items-center gap-2 h-6 w-6 justify-center text-white rounded-full bg-blue-500 transition-transform duration-200 transform hover:-translate-x-1 cursor-pointer"
    >
     <MdOutlineKeyboardArrowLeft className='text-xl'/>
    </Link>
  );
};

export default ButtonBack;
