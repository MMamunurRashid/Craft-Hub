import { useState } from "react";
import control from '../../assets/control.png'
import logo from '../../assets/logo.png'
import Dashboard from '../../assets/Chart_fill.png'
import Inbox from '../../assets/Chat.png'
import User from '../../assets/User.png'
import Calendar from '../../assets/Calendar.png'
import Search from '../../assets/Search.png'
import Chart from '../../assets/Chart.png'
import Folder from '../../assets/Folder.png'
import Setting from '../../assets/Setting.png'

const App = () => {
  const [open, setOpen] = useState(true);
  const Menus = [
    { title: "Dashboard", src: Dashboard },
    { title: "Inbox", src: Inbox },
    { title: "Accounts", src: User, gap: true },
    { title: "Schedule ", src: Calendar },
    { title: "Search", src: Search },
    { title: "Analytics", src: Chart },
    { title: "Files ", src: Folder, gap: true },
    { title: "Setting", src: Setting },
  ];

  return (
    <div className="flex bg-purple-700">
      <div
        className={` ${
          open ? "w-72" : "w-20 "
        } bg-dark-purple h-screen p-5  pt-8 relative duration-300`}
      >
        <img alt=""
          src={control}
          className={`absolute cursor-pointer -right-3 top-9 w-7 border-purple-700
           border-2 rounded-full  ${!open && "rotate-180"}`}
          onClick={() => setOpen(!open)}
        />
        <div className="flex gap-x-4 items-center">
          <img alt=""
            src={logo}
            className={`cursor-pointer duration-500 w-20 ${
              open && "rotate-[360deg]"
            }`}
          />
          <h1
            className={`text-white origin-left font-medium text-xl duration-200 ${
              !open && "scale-0"
            }`}
          >
            Creative Hub
          </h1>
        </div>
        <ul className="pt-6">
          {Menus.map((Menu, index) => (
            <li
              key={index}
              className={`flex  rounded-md p-2 cursor-pointer hover:bg-light-white text-gray-300 text-sm items-center gap-x-4 
              ${Menu.gap ? "mt-9" : "mt-2"} ${
                index === 0 && "bg-light-white"
              } `}
            >
              <img alt="" src={`${Menu.src}`} />
              <span className={`${!open && "hidden"} origin-left duration-200`}>
                {Menu.title}
              </span>
            </li>
          ))}
        </ul>
      </div>
     
    </div>
  );
};
export default App;