import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Camera, MapPin, Pencil, Save, X } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  deletePost,
  getUserFriends,
  getUserPosts,
  updateProfile,
} from "../lib/api";
import useAuthUser from "../hooks/useAuthUser";
import PostGrid from "../components/PostGrid";
import FriendCard from "../components/FriendCard";

const ProfilePage = () => {
  const { authUser } = useAuthUser();
  const client = useQueryClient();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    bio: "",
    profilePic: "",
    location: "",
  });
  const { data: posts = [], isLoading: postsLoading } = useQuery({
    queryKey: ["userPosts", authUser?._id],
    queryFn: () => getUserPosts(authUser._id),
    enabled: Boolean(authUser?._id),
  });
  const { data: friends = [], isLoading: friendsLoading } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
    enabled: Boolean(authUser?._id),
  });

  useEffect(() => {
    // Auth data arrives asynchronously; hydrate the edit draft after it resolves.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (authUser)
      setForm({
        fullName: authUser.fullName || "",
        bio: authUser.bio || "",
        profilePic: authUser.profilePic || "",
        location: authUser.location || "",
      });
  }, [authUser]);

  const profileMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["authUser"] });
      setEditing(false);
      toast.success("Profile updated");
    },
    onError: (error) =>
      toast.error(error.response?.data?.message || "Could not update profile"),
  });
  const deleteMutation = useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["userPosts", authUser?._id] });
      client.invalidateQueries({ queryKey: ["posts"] });
      client.invalidateQueries({ queryKey: ["savedPosts"] });
      toast.success("Post deleted");
    },
    onError: (error) =>
      toast.error(error.response?.data?.message || "Could not delete post"),
  });
  const change = (key) => (event) =>
    setForm({ ...form, [key]: event.target.value });

  return (
    <div className="min-h-full bg-base-200/40 px-4 py-6 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="card mb-8 border border-base-300 bg-base-100 shadow-sm">
          <div className="card-body p-5 sm:p-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <div className="avatar">
                <div className="w-24 rounded-full bg-base-300 ring ring-primary ring-offset-2 ring-offset-base-100">
                  <img
                    src={authUser?.profilePic || "/avatar.png"}
                    alt={authUser?.fullName || "Profile"}
                  />
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-2xl font-black">{authUser?.fullName}</h1>
                  <span className="badge badge-ghost">
                    @{authUser?.username || "connecter"}
                  </span>
                </div>
                {authUser?.location && (
                  <p className="mt-2 flex items-center gap-1 text-sm opacity-60">
                    <MapPin size={15} />
                    {authUser.location}
                  </p>
                )}
                {authUser?.bio && (
                  <p className="mt-2 line-clamp-2 text-sm opacity-75">
                    {authUser.bio}
                  </p>
                )}
              </div>
              <button
                className="btn btn-outline btn-sm gap-2 self-start sm:self-center"
                onClick={() => setEditing(true)}
              >
                <Pencil size={15} /> Edit profile
              </button>
            </div>
            <div className="mt-2 flex gap-6 border-t border-base-300 pt-4 text-sm">
              <span>
                <strong>{posts.length}</strong> posts
              </span>
              <span>
                <strong>{friends.length}</strong> friends
              </span>
            </div>
          </div>
        </div>
        <section className="mb-9">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-black">Your posts</h2>
            <span className="text-sm opacity-60">Click a post to view</span>
          </div>
          {postsLoading ? (
            <div className="flex justify-center py-12">
              <span className="loading loading-spinner loading-lg text-primary" />
            </div>
          ) : (
            <PostGrid
              posts={posts}
              canManage
              onDelete={(post) => {
                if (window.confirm("Delete this post? This cannot be undone."))
                  deleteMutation.mutate(post._id);
              }}
              emptyMessage="Your next creation will appear here."
            />
          )}
        </section>
        <section>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black">Your friends</h2>
              <p className="text-sm opacity-60">
                Open a profile, start a chat, or manage your circle.
              </p>
            </div>
            <Link to="/friends" className="btn btn-ghost btn-sm">
              See all
            </Link>
          </div>
          {friendsLoading ? (
            <div className="flex justify-center py-10">
              <span className="loading loading-spinner loading-lg text-primary" />
            </div>
          ) : friends.length ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {friends.map((friend) => (
                <FriendCard key={friend._id} friend={friend} />
              ))}
            </div>
          ) : (
            <div className="card border border-dashed border-base-300 bg-base-100 p-8 text-center">
              <p className="opacity-65">No friends yet.</p>
            </div>
          )}
        </section>
      </div>
      {editing && (
        <div className="modal modal-open" role="dialog" aria-modal="true">
          <div className="modal-box">
            <button
              className="btn btn-circle btn-ghost btn-sm absolute right-3 top-3"
              onClick={() => setEditing(false)}
            >
              <X size={18} />
            </button>
            <h3 className="text-xl font-black">Edit profile</h3>
            <form
              onSubmit={(event) => {
                event.preventDefault();
                profileMutation.mutate(form);
              }}
              className="mt-5 space-y-4"
            >
              <label className="form-control">
                <span className="label-text mb-1 font-semibold">
                  Profile picture URL
                </span>
                <div className="input input-bordered flex items-center gap-2">
                  <Camera size={16} className="opacity-50" />
                  <input
                    value={form.profilePic}
                    onChange={change("profilePic")}
                    placeholder="https://..."
                    className="grow"
                  />
                </div>
              </label>
              <label className="form-control">
                <span className="label-text mb-1 font-semibold">Full name</span>
                <input
                  value={form.fullName}
                  onChange={change("fullName")}
                  required
                  className="input input-bordered"
                />
              </label>
              <label className="form-control">
                <span className="label-text mb-1 font-semibold">Location</span>
                <input
                  value={form.location}
                  onChange={change("location")}
                  placeholder="City, country"
                  className="input input-bordered"
                />
              </label>
              <label className="form-control">
                <span className="label-text mb-1 font-semibold">Bio</span>
                <textarea
                  value={form.bio}
                  onChange={change("bio")}
                  className="textarea textarea-bordered"
                />
              </label>
              <button
                className="btn btn-primary w-full gap-2"
                disabled={profileMutation.isPending}
              >
                <Save size={16} />
                {profileMutation.isPending ? "Saving..." : "Save changes"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default ProfilePage;
