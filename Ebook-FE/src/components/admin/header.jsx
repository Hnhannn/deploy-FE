import { useState, useEffect } from "react";
import { getUserFromToken, getUserByUsername } from "../../service/AuthService";

const Header = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userFromToken = getUserFromToken(token);
    if (userFromToken) {
      getUserByUsername(userFromToken.sub)
        .then((userData) => {
          setUser(userData);
        })
        .catch((error) => {
          console.error("Error fetching user:", error);
        });
    }
  }, []);

  return (
    <header className="w-[calc(100%-240px)] ml-[240px] py-4 bg-gray-800 shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center px-6">
        {/* Title */}
        <div className="text-xl font-semibold text-white">Bảng điều khiển</div>

        {/* User Icon */}
        <div className="flex items-center space-x-4">
          <div className="text-white">
            Xin chào, {user ? user?.fullName : "!"}
          </div>
          <img
            src={
              user && user.userImage
                ? user.userImage
                : "https://s3v2.interdata.vn:9000/s3-586-15343-storage/dienthoaigiakho/wp-content/uploads/2024/01/16101418/trend-avatar-vo-danh-14.jpg"
            }
            alt="User Icon"
            className="w-10 h-10 rounded-full border border-gray-300"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
