import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ImagePlus, Send, Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import { createPost, getPosts, uploadMedia } from "../lib/api";
import PostCard from "../components/PostCard";
import useAuthUser from "../hooks/useAuthUser";

const HomePage = () => {
  const { authUser } = useAuthUser(); const client = useQueryClient(); const [caption, setCaption] = useState(""); const [file, setFile] = useState(null);
  const { data: posts = [], isLoading } = useQuery({ queryKey: ["posts"], queryFn: getPosts });
  const mutation = useMutation({ mutationFn: async () => { const media = await uploadMedia(file); return createPost({ caption, mediaUrl: media.mediaUrl, mediaType: media.mediaType }); }, onSuccess: () => { setCaption(""); setFile(null); client.invalidateQueries({ queryKey: ["posts"] }); toast.success("Post shared with your community"); }, onError: (e) => toast.error(e.response?.data?.message || "Could not create post") });
  return <div className="min-h-full w-full bg-base-200/40 px-4 py-6 sm:px-8"><div className="mx-auto w-full max-w-6xl space-y-5"><div><p className="text-sm font-semibold text-primary">YOUR COMMUNITY</p><h1 className="text-3xl font-black tracking-tight">A place to connect.</h1><p className="mt-1 text-sm opacity-65">Share moments, ideas, and conversations with your people.</p></div>
    <div className="card border border-base-300 bg-base-100 shadow-sm"><div className="card-body p-4"><div className="flex gap-3"><div className="avatar"><div className="w-11 rounded-full"><img src={authUser?.profilePic || "/avatar.png"} alt="" /></div></div><textarea value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="What’s on your mind?" className="textarea textarea-bordered min-h-20 flex-1 resize-none" /></div><div className="mt-3 flex items-center justify-between"><label className="btn btn-ghost btn-sm"><ImagePlus size={18} />{file ? file.name : "Add photo or video"}<input type="file" accept="image/*,video/*" className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} /></label><button className="btn btn-primary btn-sm px-5" disabled={!file || mutation.isPending} onClick={() => mutation.mutate()}>{mutation.isPending ? <span className="loading loading-spinner loading-xs" /> : <><Send size={16} /> Share</>}</button></div></div></div>
    {isLoading ? <div className="flex justify-center py-16"><span className="loading loading-spinner loading-lg text-primary" /></div> : posts.length ? posts.map((post) => <PostCard key={post._id} post={post} />) : <div className="card bg-base-100 p-10 text-center"><Sparkles className="mx-auto mb-3 text-primary" /><h2 className="text-xl font-bold">Your feed is waiting</h2><p className="mt-1 opacity-65">Add friends to start seeing their posts here.</p></div>}
  </div></div>;
}; export default HomePage;
