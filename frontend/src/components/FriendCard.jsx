import { Link } from 'react-router-dom'
import { MessageCircle, MoreHorizontal, Trash2 } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { removeFriend } from '../lib/api'
import LanguageFlag from './LanguageFlag'
const FriendCard = ({friend, canRemove = true}) => {
  const client = useQueryClient();
  const [menuOpen, setMenuOpen] = useState(false);
  const removal = useMutation({ mutationFn: removeFriend, onSuccess: () => { client.invalidateQueries({ queryKey: ["friends"] }); client.invalidateQueries({ queryKey: ["authUser"] }); toast.success("Friend removed"); }, onError: (error) => toast.error(error.response?.data?.message || "Could not remove friend") });
  return (
    <div className="card bg-base-200 hover:shadow-md transition-shadow">
            <div className="card-body p-4">
        {/* USER INFO */}
        <div className="flex items-center gap-3 mb-3">
          <Link to={`/profile/${encodeURIComponent(friend.username)}`} className="avatar"><div className="w-12 rounded-full">
            <img src={friend.profilePic || "/avatar.png"} alt={friend.fullName} />
          </div></Link>
          <Link to={`/profile/${encodeURIComponent(friend.username)}`} className="truncate font-semibold hover:text-primary">{friend.fullName}</Link>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-3">
          <span className="badge badge-secondary text-xs">
            <LanguageFlag language={friend.nativeLanguage} />
            Native: {friend.nativeLanguage}
          </span>
          <span className="badge badge-outline text-xs">
            <LanguageFlag language={friend.learningLanguage} />
            Learning: {friend.learningLanguage}
          </span>
        </div>

        <div className="flex gap-2"><Link to={`/chat/${friend._id}`} className="btn btn-primary flex-1 gap-2"><MessageCircle size={17} /> Chat</Link>{canRemove && <div className={`dropdown dropdown-end ${menuOpen ? "dropdown-open" : ""}`}><button type="button" className="btn btn-outline btn-square" aria-label={`Options for ${friend.fullName}`} aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}><MoreHorizontal size={18} /></button>{menuOpen && <ul className="dropdown-content menu z-20 mt-2 w-44 rounded-box border border-base-300 bg-base-100 p-2 text-base-content shadow-xl"><li><button className="text-error" onClick={() => { setMenuOpen(false); if (window.confirm(`Remove ${friend.fullName} from your friends?`)) removal.mutate(friend._id); }} disabled={removal.isPending}><Trash2 size={15} /> Remove friend</button></li></ul>}</div>}</div>
      </div>

        </div>
  )
}

export default FriendCard