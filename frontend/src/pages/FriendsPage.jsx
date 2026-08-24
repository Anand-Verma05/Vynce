import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, MapPin, Search, UserPlus } from "lucide-react";
import toast from "react-hot-toast";
import {
  getOutgoindFriendReqs,
  getRecommendedUsers,
  sendFriendRequest,
} from "../lib/api";

const FriendsPage = () => {
  const client = useQueryClient();
  const [search, setSearch] = useState("");
  const { data: users = [], isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: getRecommendedUsers,
  });
  const { data: outgoing = [] } = useQuery({
    queryKey: ["outgoingFriendReqs"],
    queryFn: getOutgoindFriendReqs,
  });
  const sent = new Set(outgoing.map((request) => request.recipient?._id));
  const request = useMutation({
    mutationFn: sendFriendRequest,
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["outgoingFriendReqs"] });
      toast.success("Friend request sent");
    },
    onError: (e) => toast.error(e.response?.data?.message || "Request failed"),
  });
  const filtered = users.filter((u) =>
    `${u.fullName} ${u.username} ${u.bio}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );
  return (
    <div className="min-h-full bg-base-200/40 px-4 py-6 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold text-primary">DISCOVER</p>
            <h1 className="text-3xl font-black">Explore people</h1>
            <p className="mt-1 opacity-65">
              Meet curious minds and grow your circle.
            </p>
          </div>
          <label className="input input-bordered flex w-full items-center gap-2 sm:max-w-xs">
            <Search size={17} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search people"
            />
          </label>
        </div>
        {isLoading ? (
          <div className="flex justify-center py-16">
            <span className="loading loading-spinner loading-lg text-primary" />
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((user) => (
              <div
                className="card border border-base-300 bg-base-100 shadow-sm"
                key={user._id}
              >
                <div className="card-body">
                  <div className="flex items-center gap-3">
                    <div className="avatar">
                      <div className="w-14 rounded-full">
                        <img src={user.profilePic || "/avatar.png"} alt="" />
                      </div>
                    </div>
                    <div>
                      <h2 className="font-bold">{user.fullName}</h2>
                      <p className="text-sm opacity-60">
                        @{user.username || "connecter"}
                      </p>
                    </div>
                  </div>
                  {user.location && (
                    <p className="mt-3 flex items-center gap-1 text-xs opacity-60">
                      <MapPin size={14} />
                      {user.location}
                    </p>
                  )}
                  {user.bio && (
                    <p className="mt-3 line-clamp-2 text-sm opacity-70">
                      {user.bio}
                    </p>
                  )}
                  <button
                    className={`btn mt-4 w-full ${sent.has(user._id) ? "btn-disabled" : "btn-primary"}`}
                    disabled={sent.has(user._id) || request.isPending}
                    onClick={() => request.mutate(user._id)}
                  >
                    {sent.has(user._id) ? (
                      <>
                        <Check size={16} /> Request sent
                      </>
                    ) : (
                      <>
                        <UserPlus size={16} /> Add friend
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default FriendsPage;
