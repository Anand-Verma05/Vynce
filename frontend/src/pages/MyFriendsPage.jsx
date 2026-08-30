import { useQuery } from "@tanstack/react-query";
import { Users, UserRoundPlus } from "lucide-react";
import { Link } from "react-router-dom";
import { getUserFriends } from "../lib/api";
import FriendCard from "../components/FriendCard";

const MyFriendsPage = () => {
  const { data: friends = [], isLoading } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  });

  return (
    <div className="min-h-full w-full bg-base-200/40 px-4 py-6 sm:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold text-primary">
              YOUR CONVERSATIONS
            </p>
            <h1 className="text-3xl font-black">Chat & conversations</h1>
            <p className="mt-1 opacity-65">
              Start a conversation with a friend.
            </p>
          </div>
          <Link to="/explore" className="btn btn-primary btn-sm gap-2">
            <UserRoundPlus size={17} /> Find people
          </Link>
        </div>
        {isLoading ? (
          <div className="flex justify-center py-16">
            <span className="loading loading-spinner loading-lg text-primary" />
          </div>
        ) : friends.length ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {friends.map((friend) => (
              <FriendCard key={friend._id} friend={friend} canRemove={false} />
            ))}
          </div>
        ) : (
          <div className="card border border-base-300 bg-base-100 p-10 text-center shadow-sm">
            <Users className="mx-auto mb-3 text-primary" size={38} />
            <h2 className="text-xl font-bold">No conversations yet</h2>
            <p className="mt-1 opacity-65">
              Explore people and make a friend to start chatting.
            </p>
            <Link to="/explore" className="btn btn-primary mx-auto mt-5">
              Explore people
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
export default MyFriendsPage;
