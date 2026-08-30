import useAuthUser from "../hooks/useAuthUser";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { ShipWheelIcon, BellIcon, Plus, Menu } from "lucide-react";
import { LogOutIcon } from "lucide-react";
import ThemeSelector from "./ThemeSelector";
import { useLogout } from "../hooks/useLogout";
const Navbar = ({ onMenuClick }) => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const isChatPage = location.pathname?.startsWith("/chat/");

  // const queryClient=useQueryClient();
  // const {mutate:logoutMutation}=useMutation({
  //     mutationFn:logout,
  //     onSuccess:()=>{
  //         queryClient.invalidateQueries({queryKey:["authUser"]});
  //     }
  // })

  const { logoutMutation } = useLogout();

  return (
    <nav className="bg-base-200 border-b border-base-300 sticky top-0 z-30 h-16 flex items-center">
      <div className="w-full px-2 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={onMenuClick}
              className="btn btn-ghost btn-circle lg:hidden"
              aria-label="Open navigation menu"
            >
              <Menu className="size-6" />
            </button>
            {/* LOGO - ONLY IN THE CHAT PAGE */}
            {isChatPage && (
              <div className="pl-5">
                <Link to="/" className="flex items-center gap-2.5">
                  <ShipWheelIcon className="size-9 text-primary" />
                  <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary  tracking-wider">
                    Vynce
                  </span>
                </Link>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1 sm:gap-4">
            <Link
              to="/create-post"
              className="btn btn-primary btn-sm gap-1.5 rounded-full px-3 sm:px-4"
            >
              <Plus className="size-5" />
              <span className="hidden sm:inline">Create</span>
            </Link>
            <Link to="/notifications" className="btn btn-ghost btn-circle">
              <BellIcon className="h-6 w-6 text-base-content opacity-70" />
            </Link>
            <ThemeSelector />
            <Link to="/profile" className="avatar" aria-label="Edit profile">
              <div className="w-9 rounded-full">
                <img
                  src={authUser?.profilePic || "/avatar.png"}
                  alt="User Avatar"
                  rel="noreferrer"
                />
              </div>
            </Link>
            <button
              className="btn btn-ghost btn-circle"
              onClick={logoutMutation}
              aria-label="Log out"
            >
              <LogOutIcon className="h-6 w-6 text-base-content opacity-70" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
