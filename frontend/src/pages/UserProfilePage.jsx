import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, MapPin, MessageCircle } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { getUserPosts, getUserProfile } from "../lib/api";
import PostGrid from "../components/PostGrid";

const UserProfilePage = () => {
  const { username } = useParams();
  const {
    data: user,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["userProfile", username],
    queryFn: () => getUserProfile(username),
    enabled: Boolean(username),
  });
  const { data: posts = [], isLoading: postsLoading } = useQuery({
    queryKey: ["userPosts", user?._id],
    queryFn: () => getUserPosts(user._id),
    enabled: Boolean(user?._id),
  });

  if (isLoading)
    return (
      <div className="flex justify-center py-20">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  if (isError || !user)
    return (
      <div className="mx-auto max-w-xl p-8 text-center">
        <h1 className="text-2xl font-black">Profile not found</h1>
        <Link to="/friends" className="btn btn-primary mt-5 gap-2">
          <ArrowLeft size={16} /> Back to conversations
        </Link>
      </div>
    );

  return (
    <div className="min-h-full bg-base-200/40 px-4 py-6 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <Link to="/friends" className="btn btn-ghost btn-sm mb-4 gap-2">
          <ArrowLeft size={16} /> Back
        </Link>
        <div className="card mb-8 border border-base-300 bg-base-100 shadow-sm">
          <div className="card-body p-5 sm:p-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <div className="avatar">
                <div className="w-24 rounded-full bg-base-300 ring ring-primary ring-offset-2 ring-offset-base-100">
                  <img
                    src={user.profilePic || "/avatar.png"}
                    alt={user.fullName}
                  />
                </div>
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-black">{user.fullName}</h1>
                <p className="text-sm opacity-60">
                  @{user.username || "connecter"}
                </p>
                {user.location && (
                  <p className="mt-2 flex items-center gap-1 text-sm opacity-60">
                    <MapPin size={15} />
                    {user.location}
                  </p>
                )}
                {user.bio && (
                  <p className="mt-2 text-sm opacity-75">{user.bio}</p>
                )}
              </div>
              <Link
                to={`/chat/${user._id}`}
                className="btn btn-primary btn-sm gap-2"
              >
                <MessageCircle size={15} /> Chat
              </Link>
            </div>
            <div className="mt-2 border-t border-base-300 pt-4 text-sm">
              <strong>{posts.length}</strong>{" "}
              {posts.length === 1 ? "post" : "posts"}
            </div>
          </div>
        </div>
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-black">Posts</h2>
            <span className="text-sm opacity-60">Click a post to view</span>
          </div>
          {postsLoading ? (
            <div className="flex justify-center py-12">
              <span className="loading loading-spinner loading-lg text-primary" />
            </div>
          ) : (
            <PostGrid
              posts={posts}
              emptyMessage="This user has not posted yet."
            />
          )}
        </section>
      </div>
    </div>
  );
};
export default UserProfilePage;
