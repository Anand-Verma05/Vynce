import { useState } from "react";
import { Heart, MoreHorizontal, Pencil, Play, Trash2, X } from "lucide-react";
import PostCard from "./PostCard";

const PostGrid = ({
  posts,
  emptyMessage = "No posts yet.",
  canManage = false,
  onDelete,
}) => {
  const [selectedPost, setSelectedPost] = useState(null);
  const [startEditing, setStartEditing] = useState(false);
  const [menuOpen, setMenuOpen] = useState(null);

  if (!posts.length)
    return (
      <div className="card border border-dashed border-base-300 bg-base-100 p-8 text-center">
        <p className="opacity-65">{emptyMessage}</p>
      </div>
    );

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {posts.map((post) => (
          <div
            role="button"
            tabIndex={0}
            key={post._id}
            className="group relative aspect-square cursor-pointer overflow-hidden rounded-box bg-base-300 text-left shadow-sm"
            onClick={() => {
              setMenuOpen(null);
              setStartEditing(false);
              setSelectedPost(post);
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                setStartEditing(false);
                setSelectedPost(post);
              }
            }}
          >
            {post.mediaType === "video" ? (
              <>
                <video
                  src={post.mediaUrl}
                  muted
                  className="h-full w-full object-cover"
                />
                <Play
                  size={24}
                  className="absolute left-3 top-3 fill-white text-white drop-shadow"
                />
              </>
            ) : (
              <img
                src={post.mediaUrl}
                alt={post.caption || "Post"}
                className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
              />
            )}
            <span className="absolute inset-0 flex flex-col justify-between bg-gradient-to-b from-black/60 via-transparent to-black/70 p-2 text-xs font-semibold text-white opacity-0 transition group-hover:opacity-100">
              <span className="flex justify-end gap-1">
                {canManage && (
                  <div
                    className={`dropdown dropdown-end ${menuOpen === post._id ? "dropdown-open" : ""}`}
                    onClick={(event) => event.stopPropagation()}
                  >
                    <button
                      type="button"
                      aria-label="Post options"
                      aria-expanded={menuOpen === post._id}
                      className="btn btn-circle btn-xs bg-base-100/90 text-base-content"
                      onClick={() =>
                        setMenuOpen((open) =>
                          open === post._id ? null : post._id,
                        )
                      }
                    >
                      <MoreHorizontal size={15} />
                    </button>
                    {menuOpen === post._id && (
                      <ul className="dropdown-content menu z-20 mt-2 w-40 rounded-box border border-base-300 bg-base-100 p-2 text-base-content shadow-xl">
                        <li>
                          <button
                            onClick={() => {
                              setMenuOpen(null);
                              setStartEditing(true);
                              setSelectedPost(post);
                            }}
                          >
                            <Pencil size={14} /> Edit post
                          </button>
                        </li>
                        <li>
                          <button
                            className="text-error"
                            onClick={() => {
                              setMenuOpen(null);
                              onDelete(post);
                            }}
                          >
                            <Trash2 size={14} /> Delete post
                          </button>
                        </li>
                      </ul>
                    )}
                  </div>
                )}
              </span>
              <span className="flex items-center">
                <span className="flex items-center gap-1">
                  <Heart size={13} />
                  {post.likes?.length || 0}
                </span>
                <span className="ml-3">{post.commentsCount || 0} comments</span>
              </span>
            </span>
          </div>
        ))}
      </div>
      {selectedPost && (
        <div
          className="modal modal-open"
          role="dialog"
          aria-modal="true"
          onClick={() => setSelectedPost(null)}
        >
          <div
            className="relative max-h-[92vh] w-11/12 max-w-2xl overflow-y-auto"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              aria-label="Close post"
              className="btn btn-circle btn-sm absolute right-3 top-3 z-10 bg-base-100/90"
              onClick={() => setSelectedPost(null)}
            >
              <X size={18} />
            </button>
            <PostCard
              post={selectedPost}
              startEditing={startEditing}
              showActions={canManage}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default PostGrid;
