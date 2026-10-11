import { useEffect, useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { Link, NavLink, useLocation, useNavigate, useParams } from "react-router-dom";
import api from "../services/api.js";
import toast from "react-hot-toast";
import { VscAccount } from "react-icons/vsc";
import { LogIn, UserPlus, ShoppingCart, ShoppingBag } from "lucide-react";
import { CiLogout } from "react-icons/ci";
import { RiShoppingBag3Line } from "react-icons/ri";

const Navbar = () => {
  const location = useLocation();
  const [showDropDown, setShowDropDown] = useState(false);
  const param = useParams();
  const Navigate = useNavigate();

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  };

  useEffect(() => {
    return () => {
      setShowDropDown(false);
    };
  }, []);

  const token = getCookie("token");

  if (
    location.pathname === "/login" ||
    location.pathname === "/sign-up" ||
    location.pathname === "/otp" ||
    location.pathname === `/profile` ||
    location.pathname === "/seller" ||
    location.pathname === `bdb` ||
    location.pathname === "/seller-login" ||
    location.pathname === "/seller-signup" ||
    location.pathname === "/add-product"
  ) {
    return null; // Don't render the navbar on the login, sign-up, or OTP pages
  }

  const handelLogout = () => {
    api
      .post("/auth/logout")
      .then((res) => {
        if (res.status === 200) {
          toast("Logout successful");
          window.location.href = "/";
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handelDelete = () => {
    let value = confirm("Are you sure to delete account");
    if (!value) return;

    api
      .delete(`/auth/delete/${param.id}`, {
        headers: {
          Authorization: `Bearer token`,
        },
      })
      .then((res) => {
        if (res.status === 200) {
          toast("Account deleted successfully");
          window.location.href = "/";
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <header className="w-full bg-purple-500 h-20 flex items-center justify-between gap-2 px-30 py-2">
      <div>
        
          <Link to="/" className="flex items-center gap-2">
            <div className="rounded-xl bg-black p-2 text-white">
              <ShoppingBag size={25} />
            </div>

            <span className="text-2xl font-extrabold tracking-tight text-white">
              Shop<span className="text-white">Ease</span>
            </span>
          </Link>
      </div>
      <nav className="w50 h-12 p-1 rounded-md font-medium flex items-center justify-between gap-2">
        {token ? (
          <>
           <NavLink
                to="/cart"
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-all ${
                    isActive
                      ? "bg-red-50 border-red-200 text-red-600"
                      : "border-gray-200 text-gray-700 hover:border-red-200 hover:text-red-500 hover:bg-red-50"
                  }`
                }
              >
                <ShoppingCart size={17} />
                <span>Cart</span>
              </NavLink>
           
            {
              <div
                className="w-10 h-10 -black relative ml-auto flex items-center justify-center"
                onMouseLeave={() => setShowDropDown(false)}
              >
                <GiHamburgerMenu
                  className="hover:cursor-pointer"
                  onMouseEnter={() => setShowDropDown(!showDropDown)}
                />
                {showDropDown && (
                  <ul className="absolute top-full right-0 me-5 w-30 flex flex-col justify-center items-center hover:cursor-pointer absolute overflow-hidden rounded-lg shadow-lg top-5 right-0 bg-gray-50 text-black ">
                    <li
                      className="px-5 py-1 mb-1 hover:bg-gray-200 flex items-center gap-1"
                      onClick={() => Navigate(`/profile/${param.id}`)}
                    >
                      <VscAccount /> Profile
                    </li>
                    <li 
                    className='w-max px-5 py-1 mb-1 hover:bg-gray-200 flex items-center gap-1'
                    onClick={() => Navigate("/order-history")}
                    >
                      <RiShoppingBag3Line /> My order
                    </li>
                    <li
                      onClick={handelDelete}
                      className="px-5 py-1 mb-1 hover:bg-gray-200 flex items-center gap-1"
                    >
                      Delete
                    </li>
                    <li
                      onClick={handelLogout}
                      className="px-5 py-1 mb-1 hover:bg-gray-200 flex items-center gap-1"
                    >
                      <CiLogout /> Logout
                    </li>
                    <li
                      className="px-4 py-1 mb-1 hover:bg-gray-200 flex items-center gap-1"
                      onClick={() => Navigate("/seller-login")}
                    >
                      Seller Login
                    </li>
                  </ul>
                )}
              </div>
            }
          </>
        ) : (
          <>
            <div className="flex items-center gap-3">
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-all ${
                    isActive
                      ? "bg-red-50 border-red-200 text-red-600"
                      : "border-gray-200 text-gray-700 hover:border-red-200 hover:text-red-500 hover:bg-red-50"
                  }`
                }
              >
                <LogIn size={17} />
                <span>Login</span>
              </NavLink>

              <NavLink
                to="/sign-up"
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-all ${
                    isActive
                      ? "bg-red-50 border-red-200 text-red-600"
                      : "border-gray-200 text-gray-700 hover:border-red-200 hover:text-red-500 hover:bg-red-50"
                  }`
                }
              >
                <UserPlus size={17} />
                <span>Sign Up</span>
              </NavLink>

              <NavLink
                to="/cart"
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-all ${
                    isActive
                      ? "bg-red-50 border-red-200 text-red-600"
                      : "border-gray-200 text-gray-700 hover:border-red-200 hover:text-red-500 hover:bg-red-50"
                  }`
                }
              >
                <ShoppingCart size={17} />
                <span>Cart</span>
              </NavLink>
            </div>
          </>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
