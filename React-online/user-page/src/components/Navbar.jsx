import { useEffect, useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { NavLink, useLocation, useNavigate, useParams } from "react-router-dom";
import api from "../services/api.js";
import toast from "react-hot-toast";
import { VscAccount } from "react-icons/vsc";
import { LogIn, UserPlus, ShoppingCart } from "lucide-react";
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
    <header className="w-full bg-purple-500 h-fit flex items-center justify-between gap-2 px-4 py-2">
      <div>
        <img
          className="w-18 h-18 rounded-full cursor-pointer"
          src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxIREhUSEhMWFhIVGRcbGBUVFRYYFxYYFxUXGBUYFxgZHSggGholHhkVITEiJSkrLjAuGB8zODMtNygtLisBCgoKDg0NGg8PFy0mHx01KystKy03LS0tKy4tLS0tLTErKy0yMC0tLS0wLS0rNS0tNy8tNy0rNy0rMS0tLS0tMv/AABEIAOEA4QMBIgACEQEDEQH/xAAbAAEAAgMBAQAAAAAAAAAAAAAAAwUBBAYCB//EADwQAAIBAgMFBQYFAgYDAQAAAAECAAMRBBIhBTFBUWEGIjJxkROBobHB0SNCUmLwBxQzcoKSouE0s/FT/8QAGAEBAQEBAQAAAAAAAAAAAAAAAAECAwT/xAAdEQEBAQEAAgMBAAAAAAAAAAAAARECAyESMUET/9oADAMBAAIRAxEAPwD4bERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBEyRMQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEmo4csL7l58zyA4mYw1HOwHr5SyNdb5V0VRq3LovUwNens/ixyr8ffwEjqV1XSmv+o6n3X3TziMQ1Q2G7gPvzMVKHsxr4j6D7n4QNdiTv3zElNE720vz3n3b5HaBiTUcMz7hpz4TcwuBAGap6cvOecTUdxp3aY4nS/38hA1npqu9sx/bu9T9pCZibGHo3VmO4D4wPFBfEeSn46fWRTadciWPiex8gN01YCIiAiIgIiICIiAiIgIiICIiAiIgIiIEtOrlUgb23np/39JjNcBRz9THsu7fy9Df6iZo1cuo8XDp184Fng6Kpvtn49L8BI8fWVW01fmfyj7zTw1XKSx1IBtfmePzkDNfU74GWYk3Opk+EIXvEXO5RzPOa0nwrBSWPAaDqd31gXTAW71tNTylPjcSXP7RuH1k+JqkU1F+8+pP893pK+Ue6VMsbCWVOsiqRvRbAfubeT8pX+0sLLx3nn0HSRyCRmao195MYhArEDhp8NZu7OAU/utc/tHLzmlV7zd3W538yTvgRRPVRbEjkSJ5gIiICIiAiIgIiICIiAiIgIiICIlvsHYT4okg5UXex+XD4mBEjL7MpxCX+Ob7Stl/t3s3UwqioGz0zpmtuvpwJBHC4mt2a2YMRWCtf2ags3C4Fha/UlR5Ey4NHCUUY2aoE6lWI/4y1HZioy56VSlUXmrH7W+M6Sh2aoXLVFzsdeKqOiqttB1mxT2JSQ5qWam3NWNj0KtcES/FNfPcThHp+NSOu8HyI0Mgn07H7MSupDjvEWLLoenmOhvOG2vsKphzuzJvDgfMcD/OclhK0sa126AAegnihh2c2VST04dSeA85t7N2VVxDAKNDvc7hzP8APvO52XsanQUW7zDXM3Pmo3L7tYk01ydLsvWy53anTXiWbd7xp8ZW4zDImi1Q5/arAep3zv8AEbISqc1YtU5Lcqi+Sqfibma+I7M4dh3VKNwZSTa27Q3Blw1wAqG1huO/r5zawDKt2I3Df8gOpm32m2b7CoLAWdQbDcDuYDpfX3yTs92cq4sMwOWmpsWtfXfYDThqTflJiqRmuSecxLzbvZ1sOudWD09xItp6EgjheUcgREQEREBERAREQEREBERAREQE7qmaeH2arsockjKjeAu9yC4HiyjNYHTQdLcLPoGDwa4vAU6RbKe6VaxIDJmQggcCCfhLEqp7H4/2hfBVT+HiAwXdZKhBsV5X5c7Sz/pzTptTrFyFNM3YnSyMATcncPwzKTtRgVwWIoiidVp0nzWtdwT3rcL5QbSqpV3eo60yVFdspUHQhnBUH32jcPt023O2TCrbCn8Ifqp08reQK5rdSbnkJYbK7T0qoUYhfYM3hqC5pNY2N76rr5iQ7c7MH+3WmgvVw5cKQB+NSZi3+8EkW5huYlPQ2gHwv9lVyUijhg7Ulz6FzYvbN+c6E8F5Wk66sdPF453s3L+O9ytTIJAIPvVgeR4yF1Rmam1g2XMFbw1EJtmUnhrYg7j01nGYHbrYIBEqivSPipMO6OqN+U+XnLHae2xi0pDC4aqXps12IBAV0IdMwJ0Nxe9t01OpZrHfF46yrpkTDqlNQAx7q0xv7u8k8AOJ1950mxTQnQC56Tl9n7QbDM9TG0K2qqq1FUGxzMzC507zNc675r4ztKcSTSD/ANvRII01Z/8AO/AdBpvj5ZE54vVyLjau3qdIlKY9rVAJITVEtvzN05C/mJzmH7VVs96h7n6UVfqLn1Elw+0EwuHrUabU6r17C/s1Yr3WXusQSPGd3G1rWvNvs/sRqVKpVqJ+LVU06SMPCHFmqMDu0vYcgeYmZ1enTyeOePJb7/f1B2rxdOtTp1EYG9x1GoOo4bpnbm0DQweHwdM2z0xUqkbz7TvKp9bnoFnOYymUdqd7hWNvvLbYgXF45BVHccnT9qUzkHoqiVzWmy6iV8HWsqo6rlcLoraFqb5dwbusCRvsJxs78bKTBYWuBU9oXFy2UqAACEFjx7zE+6cBFIRESKREQEREBERAREQEREBERATu/wCnuMzK9G4DC+UkA2zDQ2O+zAes4SbWzMc1CotRN44cCOIMsqV62viqtWq7VyTVvZr2FiulrDQWtaSdn/8AysPf/wDWl/7Fl5tLaWArH+4ZHNcjWnchHa1gX09crC/KcsKhDZgbNe4I0sb30tugfYmcEMyMWAcgnTLmHitffYm1+h5SmxuGGJq5S9QU6QBrAVahDs/+HSALEDQFieRFrSu2XtsU9ns9tEZKaLzYU8xPvZnY9PKY2RhMfRdj7M1FfKauZlTv2v8AhliLlQQDwuCOAM1us4xiK+zQxpFKYtobK2h3eMa++8zitgkrfC13QWuF9oxS37SDcfGYHY5KyEo/s6l2Iz6cT3XU6i2guL+EnW/djwGxsZhrZatNkDLempY3BYBrZksN9zYjdIrGD7P4hh+PiHA4qrsfUk2+c1/ZbNVshYk7s2pF/wDMBb6Tf2ts3F4hnVaqJRvYKSwLDKpJOVTcXJGp4GRL2KWnSZqtVS1j4ScqaHXgWI0O4DS2t7gJdnYf+2xK0y9T2NUWp5atRQrnw3yMLgnT3gyx2pj/AGOVjqp8Q42/UCd9uPnOY25VrVPZ2pvTpJYIxuGvpZjy3DynrHbT9thVZv8AEpuFccwwIv77H3gxpij2s16zkbib/CQ4au1N1dCVZSCCOBEjJlxs3GYZCKj02NVdyg/hsRuYi2/pu6TLS+7X7QcYalSe3tnUGpZQup7xBA5aD/SZxE29p49q9Qu28zUltSEREikREBERAREQEREBERAREQEnw+Hzak2XiT9OsgnvIb248oE2KKbl168AOAH3muwtvllRw+VbqMznceA5kdOs0a6gG17nieF+n3gXnYqga2Jp02P4SMahXhmFlXz72Qes+h7SqFqh6aD6z5t2P2glDEpUqtlpgNc2Jv3TlFgCd5HoJ3Nbtbs9jcs3nkcTfP0zftPMotyBzIkNLbWz6nhxIU/vDAf8gPnIsZtvC0Bn9utQjUJT1LEbhcaKOplRJgnLU0ZvEVUnzIF5NNLZe1qeJUMhAe3epcVPHKOK8iOes3YHmpTDAqRcHeJ8+7SUDSrOq6K1jb4j0uJ3WMwSVRZgfMGxE4rtFst6RHeLLwvrp/LaTPSxRgSbDlQbNp15HqOIkdIAmx068pYnD5lIfxAaMNbjn1mWmrisOB3kN16cPOas9shBt/D755IgYiIgIiICIiAiIgIiICIiAiJsYKkGYX3DU/QetoEiUvZpnPiPhHLrNakuZgOZ+c2tqVLvbkPidftNMG0C1xOJAp93S+i+Q0vK7CUg7qpYKGZQWO5QSASeg3z1in8I/SoHwuZ5enZVP6r+g/hgfYaGwadBFXD01B4vpnbqXOvOYfA1DvF+hYfUz5AMVUtlztblmNvSd1h+w1GminEO5qMPChVVXmLkG9uc3Kxi0xux6Z0qUVvzKgH3ESkxnZGi3+GzIf8AcPQ6/GbtHZtSh/49VynGjWYMjDkCAMh6gS0BjFcBjuy+Ip6qvtF5pqf9u/0vNOhtSuhAFZ14asxA8wb/ACn1GnSDDRu9+mwF/Ik2ldjdm0MUWV1zOu8i6Vk6kEBrf5gRykvJqjwnaGrSsMSmZDuq07EH00PPgek0u0e3adZQtO5tfUi2+bVfAVMFrm9phmNs1vATuFReR9PlPGL2XRrglCKdT1U8dfnfrfWYvdnquk4lm8uSlps/E90g6lRceXGa+I2e9NilQWa1xya36Tx0vIcG9nHXQ+R0lZMUgDG27ePI6yanT9qv71/5Dh75qseHKTYCplcddPWBARMTc2nSAa447/Pj8wZpwEREBERAREQEREBERASbCNZl5Zh85DMg21gTYw99vOQkTZbvVQeDFT62v9Z5q0u+/S5+MCAmWOLoaIOARj6AfWV5XQHnLjD1BUDDpb3Mo+t4FRSfKQeRB9DPsBxPtqS1RqM9VfSoyj4L8RPkmMpZco/aPXW87D+n+36VNXw9dgqk5lZz3bkDMpJ0G4Ee+a5rPUdIqk7gT5C89vh2AuRbzmli+11PNlosq0gbGoQLuQNRSQkCw4u2nQ6Xr8V/UBU7tKmap4u7WB8gFF/RfKa2JlXM8YmitULnvmXwVFNqlM/tbl0OkoaX9QM2lagLfqptqPc2/wBZ6TtGlywbPTFs11tUS/5iBpUS/EAEcRuk2GVb1toth1IxlIVaLjL/AHFNe6wPCrTv3W6j3Th8TjKVKuf7d2fDm3iBBUchfU25zr9sdpsOmEemrio9VWUKuuUMLZmPC2+2+9p88wSZnAO7X5GZ69+mudnt14enUTLUAakdQT+XqDwlDtnYT0O+t2p/qtqv+YfWe9n1jRsrnuNx/Sx4HpLihiaqMKNMK4cHKHJtTA3kkb013e4cpx9816JP6fU9uNMzTOo8xL/bewUpIaq16TG+tMDId+vswWOYAyiojvDlcenGdOep1NjHl8Xfi6+Pc9p9pN32HDT1tNSe61TMxPMzxK5kREBERAREQEREBERAREQJsK3fXzHzlm1Ee1vwZSD5i1/hKcS0w+JDML/m1HRgLEe8QNPEUyFXoWB9ZFTqFb24j67/AISyxtmVl/Mve8xzHuleVul+Rt7iNPkYE+MqZ0V+IJB85G9K6Bxw0b3bj6WkGfS3C9/n95t7NrWJU7m58/8AuBq1FINjw/8As8SyxNEVFum9RYjjYcPOVsBPSg3sN5+s8ywwNEKPaPoOH3gQ0aFgzHct7dW3CetnsFzOfyj4kz3j6wyqgFuJHLkD14zSD6Ec7fC/3gSVKxfQ8yf56TYwm0WTzy5QddFv014/ATXpL3WbyHqfsJnD4fNvIAOlzxPQcYs1rnq83YmxBAuzOHdv03sB1JA4aACad5JiKeVit724yKDq7dIiIZIiICIiAiIgIiICIiAiIgJkGYiBtvVzgH86/Ec/MTGBsSUP5h8RqJrA23TObW40MCYYYkMLd5eHMdP5xkEt8JXDkHc4Fj1E1sVhw1yniHiX6iBqLVYHMDrzma7AnMNCd46/aRRA90rXudw4c+kzWrFjc+nAeQkcQMsxJud8m9gQmY7ybKOfWSYfDgDO+7gvFjN/FVFSzHxAd1evGBo4tciqnHxHz4TxRfKMx8W5Ry6yGpULG53meSbwBMxEQEREBERAREQEREBERAREQEREBERAREQMg2kj4gkhvzDiOPnIogbD1A/i0bmNx8xw8xIGW0xEDIEmRlTXxN/xH3+UgiBN/cNmzHU8L8PdI3ck3JuZ5iAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiB//9k="
          alt=""
        />
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
