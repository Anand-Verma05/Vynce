import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Bookmark, Check, Heart, MessageCircle, MoreHorizontal, Pencil, Send, Trash2, X } from "lucide-react";
import { createComment, deletePost, editComment, editPost, getPostComments, toggleLike, toggleSavePost } from "../lib/api";
import useAuthUser from "../hooks/useAuthUser";
import { useState } from "react";
import toast from "react-hot-toast";

const PostCard = ({ post, startEditing = false, showActions = false }) => {
  const queryClient = useQueryClient();
  const { authUser } = useAuthUser();
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingCommentText, setEditingCommentText] = useState("");
  const [editingPost, setEditingPost] = useState(startEditing);
  const [caption, setCaption] = useState(post.caption || "");
  const [menuOpen, setMenuOpen] = useState(false);
  const [savedOverride, setSavedOverride] = useState(null);
  const savedFromAuth = Boolean(authUser?.savedPosts?.some((id) => (id?._id || id).toString() === post._id));
  const saved = savedOverride ?? savedFromAuth;
  const refresh = () => queryClient.invalidateQueries({ queryKey: ["posts"] });
  const likeMutation = useMutation({ mutationFn: () => toggleLike(post._id), onSuccess: refresh });
  const saveMutation = useMutation({ mutationFn: () => toggleSavePost(post._id), onSuccess: (result) => { setSavedOverride(result.saved); refresh(); queryClient.invalidateQueries({ queryKey: ["savedPosts"] }); }, onError: () => toast.error("Could not save post") });
  const { data: comments = [], isLoading: commentsLoading } = useQuery({ queryKey: ["comments", post._id], queryFn: () => getPostComments(post._id), enabled: showComments });
  const commentMutation = useMutation({ mutationFn: () => createComment({ postId: post._id, content: commentText }), onSuccess: () => { setCommentText(""); queryClient.invalidateQueries({ queryKey: ["comments", post._id] }); queryClient.invalidateQueries({ queryKey: ["posts"] }); queryClient.invalidateQueries({ queryKey: ["savedPosts"] }); }, onError: (error) => toast.error(error.response?.data?.message || "Could not add comment") });
  const postEditMutation = useMutation({ mutationFn: editPost, onSuccess: (updatedPost) => { setCaption(updatedPost.caption || ""); setEditingPost(false); queryClient.invalidateQueries({ queryKey: ["posts"] }); queryClient.invalidateQueries({ queryKey: ["savedPosts"] }); queryClient.invalidateQueries({ queryKey: ["userPosts"] }); toast.success("Post updated"); }, onError: (error) => toast.error(error.response?.data?.message || "Could not update post") });
  const commentEditMutation = useMutation({ mutationFn: editComment, onSuccess: () => { setEditingCommentId(null); queryClient.invalidateQueries({ queryKey: ["comments", post._id] }); toast.success("Comment updated"); }, onError: (error) => toast.error(error.response?.data?.message || "Could not update comment") });
  const postDeleteMutation = useMutation({ mutationFn: deletePost, onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["posts"] }); queryClient.invalidateQueries({ queryKey: ["savedPosts"] }); queryClient.invalidateQueries({ queryKey: ["userPosts"] }); toast.success("Post deleted"); }, onError: (error) => toast.error(error.response?.data?.message || "Could not delete post") });
  const liked = post.likes?.some((id) => (id?._id || id).toString() === authUser?._id);
  const isOwner = post.author?._id?.toString() === authUser?._id?.toString() || post.author?.toString() === authUser?._id?.toString();

  return <article className="card border border-base-300 bg-base-100 shadow-sm overflow-hidden">
    <div className="flex items-center gap-3 p-4">
      <div className="avatar"><div className="w-10 rounded-full bg-primary/10"><img src={post.author?.profilePic || "/avatar.png"} alt="" /></div></div>
      <div className="flex-1"><p className="font-bold">{post.author?.fullName}</p><p className="text-xs opacity-60">@{post.author?.username || "connecter"} · {new Date(post.createdAt).toLocaleDateString()}</p></div>
      {showActions && isOwner && <div className={`dropdown dropdown-end ${menuOpen ? "dropdown-open" : ""}`}><button type="button" className="btn btn-ghost btn-circle btn-sm" aria-label="Post options" aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}><MoreHorizontal size={18} /></button>{menuOpen && <ul className="dropdown-content menu z-20 mt-2 w-44 rounded-box border border-base-300 bg-base-100 p-2 shadow-xl"><li><button onClick={() => { setMenuOpen(false); setEditingPost(true); }}><Pencil size={15} /> Edit post</button></li><li><button className="text-error" onClick={() => { setMenuOpen(false); if (window.confirm("Delete this post? This cannot be undone.")) postDeleteMutation.mutate(post._id); }}><Trash2 size={15} /> Delete post</button></li></ul>}</div>}
    </div>
    {post.mediaType === "video" ? <video src={post.mediaUrl} controls className="max-h-[620px] w-full bg-base-300 object-contain" /> : <img src={post.mediaUrl} alt={post.caption || "Post"} className="max-h-[620px] w-full bg-base-300 object-contain" />}
    <div className="p-4">
      {editingPost && <form onSubmit={(event) => { event.preventDefault(); postEditMutation.mutate({ postId: post._id, caption }); }} className="mb-4 rounded-2xl border border-primary/20 bg-primary/5 p-3"><div className="mb-2 flex items-center justify-between"><p className="text-sm font-bold">Edit your caption</p><button type="button" className="btn btn-ghost btn-circle btn-xs" onClick={() => setEditingPost(false)}><X size={15} /></button></div><textarea value={caption} onChange={(event) => setCaption(event.target.value)} maxLength={500} className="textarea textarea-bordered min-h-20 w-full bg-base-100" placeholder="Write a caption..." /><div className="mt-2 flex items-center justify-between"><span className="text-xs opacity-50">{caption.length}/500</span><button className="btn btn-primary btn-sm gap-2" disabled={postEditMutation.isPending}><Check size={15} />{postEditMutation.isPending ? "Saving..." : "Save caption"}</button></div></form>}
      <div className="flex items-center gap-1"><button onClick={() => likeMutation.mutate()} className="btn btn-ghost btn-circle btn-sm" disabled={likeMutation.isPending}><Heart size={21} className={liked ? "fill-error text-error" : ""} /></button><button onClick={() => setShowComments(!showComments)} className={`btn btn-ghost btn-circle btn-sm ${showComments ? "text-primary" : ""}`}><MessageCircle size={21} /></button><button onClick={() => saveMutation.mutate()} className="btn btn-ghost btn-circle btn-sm ml-auto" disabled={saveMutation.isPending}><Bookmark size={21} className={saved ? "fill-primary text-primary" : ""} /></button></div>
      <p className="mt-1 text-sm font-semibold">{post.likes?.length || 0} likes</p>
      <button onClick={() => setShowComments(true)} className="text-sm opacity-60 hover:opacity-100">{post.commentsCount || 0} {post.commentsCount === 1 ? "comment" : "comments"}</button>
      {caption && <p className="mt-2 text-sm"><span className="font-bold mr-2">{post.author?.username}</span>{caption}</p>}
      {showComments && <div className="mt-4 border-t border-base-300 pt-3"><div className="max-h-48 space-y-3 overflow-y-auto">{commentsLoading ? <span className="loading loading-spinner loading-xs" /> : comments.length ? comments.map((comment) => { const ownsComment = comment.author?._id?.toString() === authUser?._id?.toString(); return <div key={comment._id} className="group rounded-xl px-2 py-1 text-sm hover:bg-base-200/60"><div className="flex items-start gap-2"><div className="min-w-0 flex-1">{editingCommentId === comment._id ? <form onSubmit={(event) => { event.preventDefault(); if (editingCommentText.trim()) commentEditMutation.mutate({ commentId: comment._id, content: editingCommentText }); }}><textarea autoFocus value={editingCommentText} onChange={(event) => setEditingCommentText(event.target.value)} className="textarea textarea-bordered textarea-sm min-h-16 w-full" /><div className="mt-1 flex justify-end gap-1"><button type="button" className="btn btn-ghost btn-xs" onClick={() => setEditingCommentId(null)}>Cancel</button><button className="btn btn-primary btn-xs" disabled={!editingCommentText.trim() || commentEditMutation.isPending}>Save</button></div></form> : <><span className="font-semibold">{comment.author?.username || comment.author?.fullName}</span> <span>{comment.content}</span></>}</div>{ownsComment && editingCommentId !== comment._id && <button aria-label="Edit comment" className="btn btn-ghost btn-circle btn-xs opacity-0 transition group-hover:opacity-100" onClick={() => { setEditingCommentId(comment._id); setEditingCommentText(comment.content); }}><Pencil size={13} /></button>}</div></div>; }) : <p className="text-sm opacity-60">No comments yet. Start the conversation.</p>}</div><form onSubmit={(event) => { event.preventDefault(); if (commentText.trim()) commentMutation.mutate(); }} className="mt-3 flex gap-2"><input value={commentText} onChange={(event) => setCommentText(event.target.value)} placeholder="Add a comment..." className="input input-bordered input-sm min-w-0 flex-1" /><button className="btn btn-primary btn-sm btn-square" disabled={!commentText.trim() || commentMutation.isPending}><Send size={15} /></button></form></div>}
    </div>
  </article>;
};
export default PostCard;
