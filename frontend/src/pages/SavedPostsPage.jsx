import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Bookmark } from "lucide-react";
import { Link } from "react-router-dom";
import { getSavedPosts } from "../lib/api";
import PostGrid from "../components/PostGrid";

const SavedPostsPage = () => {
  const { data: posts = [], isLoading } = useQuery({ queryKey: ["savedPosts"], queryFn: getSavedPosts });
  return <div className="min-h-full w-full bg-base-200/40 px-4 py-6 sm:px-8"><div className="mx-auto w-full max-w-6xl"><div className="mb-7 flex items-center gap-4"><div className="rounded-2xl bg-primary/10 p-3 text-primary"><Bookmark size={25} /></div><div><h1 className="text-3xl font-black">Saved posts</h1><p className="mt-1 opacity-65">Your collection of posts worth coming back to.</p></div></div>{isLoading ? <div className="flex justify-center py-16"><span className="loading loading-spinner loading-lg text-primary" /></div> : posts.length ? <PostGrid posts={posts} /> : <div className="card mx-auto max-w-xl border border-base-300 bg-base-100 p-10 text-center shadow-sm"><Bookmark className="mx-auto mb-3 text-primary" size={36} /><h2 className="text-xl font-bold">Nothing saved yet</h2><p className="mt-1 opacity-65">Tap the bookmark icon on a post to keep it here.</p><Link to="/" className="btn btn-primary mx-auto mt-5 gap-2"><ArrowLeft size={16} /> Browse feed</Link></div>}</div></div>;
};
export default SavedPostsPage;
