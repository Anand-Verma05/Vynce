import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Bookmark, Heart, MessageCircle, MoreHorizontal, Send } from "lucide-react";
import { createComment, getPostComments, toggleLike, toggleSavePost } from "../lib/api";
import useAuthUser from "../hooks/useAuthUser";
import { useState } from "react";
import toast from "react-hot-toast";

const PostCard = ({ post }) => {
  const queryClient = useQueryClient();
  const { authUser } = useAuthUser();
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [savedOverride, setSavedOverride] = useState(null);
  const savedFromAuth = Boolean(authUser?.savedPosts?.some((id) => (id?._id || id).toString() === post._id));
  const saved = savedOverride ?? savedFromAuth;
  const refresh = () => queryClient.invalidateQueries({ queryKey: ["posts"] });
  const likeMutation = useMutation({ mutationFn: () => toggleLike(post._id), onSuccess: refresh });
  const saveMutation = useMutation({ mutationFn: () => toggleSavePost(post._id), onSuccess: (result) => { setSavedOverride(result.saved); refresh(); queryClient.invalidateQueries({ queryKey: ["savedPosts"] }); }, onError: () => toast.error("Could not save post") });
  const { data: comments = [], isLoading: commentsLoading } = useQuery({ queryKey: ["comments", post._id], queryFn: () => getPostComments(post._id), enabled: showComments });
  const commentMutation = useMutation({ mutationFn: () => createComment({ postId: post._id, content: commentText }), onSuccess: () => { setCommentText(""); queryClient.invalidateQueries({ queryKey: ["comments", post._id] }); queryClient.invalidateQueries({ queryKey: ["posts"] }); queryClient.invalidateQueries({ queryKey: ["savedPosts"] }); }, onError: (error) => toast.error(error.response?.data?.message || "Could not add comment") });
  const liked = post.likes?.some((id) => (id?._id || id).toString() === authUser?._id);

  return <article className="card border border-base-300 bg-base-100 shadow-sm overflow-hidden">
    <div className="flex items-center gap-3 p-4">
      <div className="avatar"><div className="w-10 rounded-full bg-primary/10"><img src={post.author?.profilePic || "/avatar.png"} alt="" /></div></div>
      <div className="flex-1"><p className="font-bold">{post.author?.fullName}</p><p className="text-xs opacity-60">@{post.author?.username || "connecter"} · {new Date(post.createdAt).toLocaleDateString()}</p></div>
      <button className="btn btn-ghost btn-circle btn-sm"><MoreHorizontal size={18} /></button>
    </div>
    {post.mediaType === "video" ? <video src={post.mediaUrl} controls className="max-h-[620px] w-full bg-base-300 object-contain" /> : <img src={post.mediaUrl} alt={post.caption || "Post"} className="max-h-[620px] w-full bg-base-300 object-contain" />}
    <div className="p-4">
      <div className="flex items-center gap-1"><button onClick={() => likeMutation.mutate()} className="btn btn-ghost btn-circle btn-sm" disabled={likeMutation.isPending}><Heart size={21} className={liked ? "fill-error text-error" : ""} /></button><button onClick={() => setShowComments(!showComments)} className={`btn btn-ghost btn-circle btn-sm ${showComments ? "text-primary" : ""}`}><MessageCircle size={21} /></button><button onClick={() => saveMutation.mutate()} className="btn btn-ghost btn-circle btn-sm ml-auto" disabled={saveMutation.isPending}><Bookmark size={21} className={saved ? "fill-primary text-primary" : ""} /></button></div>
      <p className="mt-1 text-sm font-semibold">{post.likes?.length || 0} likes</p>
      <button onClick={() => setShowComments(true)} className="text-sm opacity-60 hover:opacity-100">{post.commentsCount || 0} {post.commentsCount === 1 ? "comment" : "comments"}</button>
      {post.caption && <p className="mt-2 text-sm"><span className="font-bold mr-2">{post.author?.username}</span>{post.caption}</p>}
      {showComments && <div className="mt-4 border-t border-base-300 pt-3"><div className="max-h-48 space-y-3 overflow-y-auto">{commentsLoading ? <span className="loading loading-spinner loading-xs" /> : comments.length ? comments.map((comment) => <div key={comment._id} className="text-sm"><span className="font-semibold">{comment.author?.username || comment.author?.fullName}</span> <span>{comment.content}</span></div>) : <p className="text-sm opacity-60">No comments yet. Start the conversation.</p>}</div><form onSubmit={(event) => { event.preventDefault(); if (commentText.trim()) commentMutation.mutate(); }} className="mt-3 flex gap-2"><input value={commentText} onChange={(event) => setCommentText(event.target.value)} placeholder="Add a comment..." className="input input-bordered input-sm min-w-0 flex-1" /><button className="btn btn-primary btn-sm btn-square" disabled={!commentText.trim() || commentMutation.isPending}><Send size={15} /></button></form></div>}
    </div>
  </article>;
};
export default PostCard;
