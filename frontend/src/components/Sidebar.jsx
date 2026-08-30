import useAuthUser from "../hooks/useAuthUser";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import {
  ShipWheelIcon,
  HomeIcon,
  UsersIcon,
  BellIcon,
  UserCircle,
  PlusCircle,
  Bookmark,
  X,
  Compass,
} from "lucide-react";
const Sidebar = ({ mobileOpen = false, onClose = () => {} }) => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const currentPath = location.pathname;
  console.log(currentPath);

  const closeOnMobile = () => onClose();
  return (
    <>
      {mobileOpen && (
        <button
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={onClose}
          aria-label="Close navigation menu"
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-screen w-72 flex-col border-r border-base-300 bg-base-200 shadow-xl transition-transform duration-300 lg:sticky lg:top-0 lg:z-auto lg:w-64 lg:translate-x-0 lg:shadow-none ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:flex"}`}
      >
        <div className="p-5 border-b border-base-300">
          <button
            onClick={onClose}
            className="btn btn-ghost btn-circle btn-sm float-right lg:hidden"
            aria-label="Close navigation menu"
          >
            <X size={19} />
          </button>
          <Link to="/" className="flex items-center gap-2.5">
            <ShipWheelIcon className="size-9 text-primary" />
            <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary  tracking-wider">
              Vynce
            </span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <Link
            onClick={closeOnMobile}
            to="/"
            className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${
              currentPath === "/" ? "btn-active" : ""
            }`}
          >
            <HomeIcon className="size-5 text-base-content opacity-70" />
            <span>Home</span>
          </Link>

          <Link
            onClick={closeOnMobile}
            to="/saved-posts"
            className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${currentPath === "/saved-posts" ? "btn-active" : ""}`}
          >
            <Bookmark className="size-5 text-base-content opacity-70" />
            <span>Saved posts</span>
          </Link>

          <Link
            onClick={closeOnMobile}
            to="/create-post"
            className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${currentPath === "/create-post" ? "btn-active" : ""}`}
          >
            <PlusCircle className="size-5 text-primary" />
            <span>Create post</span>
          </Link>

          <Link
            onClick={closeOnMobile}
            to="/explore"
            className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${
              currentPath === "/explore" ? "btn-active" : ""
            }`}
          >
            <Compass className="size-5 text-base-content opacity-70" />
            <span>Explore people</span>
          </Link>

          <Link
            onClick={closeOnMobile}
            to="/friends"
            className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${
              currentPath === "/friends" ? "btn-active" : ""
            }`}
          >
            <UsersIcon className="size-5 text-base-content opacity-70" />
            <span>Conversations</span>
          </Link>

          <Link
            onClick={closeOnMobile}
            to="/notifications"
            className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${
              currentPath === "/notifications" ? "btn-active" : ""
            }`}
          >
            <BellIcon className="size-5 text-base-content opacity-70" />
            <span>Notifications</span>
          </Link>

          <Link
            onClick={closeOnMobile}
            to="/profile"
            className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${currentPath === "/profile" ? "btn-active" : ""}`}
          >
            <UserCircle className="size-5 text-base-content opacity-70" />
            <span>Profile</span>
          </Link>
        </nav>

        {/* userprogile */}
        <div className="p-4 border-t border-base-300 mt-auto">
          <div className="flex items-center gap-3">
            <div className="avatar">
              <div className="w-10 rounded-full">
                <img src={authUser?.profilePic} alt="User Avatar" />
              </div>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm">{authUser?.fullName}</p>
              <p className="text-xs text-success flex items-center gap-1">
                <span className="size-2 rounded-full bg-success inline-block" />
                Online
              </p>
            </div>
            <Link to="/profile" className="btn btn-ghost btn-circle btn-sm">
              <UserCircle className="size-5" />
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
