import { Link } from 'react-router-dom'
import { MessageCircle } from 'lucide-react'
import LanguageFlag from './LanguageFlag'
const FriendCard = ({friend}) => {
  return (
    <div className="card bg-base-200 hover:shadow-md transition-shadow">
            <div className="card-body p-4">
        {/* USER INFO */}
        <div className="flex items-center gap-3 mb-3">
          <div className="avatar"><div className="w-12 rounded-full">
            <img src={friend.profilePic || "/avatar.png"} alt={friend.fullName} />
          </div>
          </div>
          <h3 className="font-semibold truncate">{friend.fullName}</h3>
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

        <Link to={`/chat/${friend._id}`} className="btn btn-primary w-full gap-2">
          <MessageCircle size={17} /> Chat
        </Link>
      </div>

        </div>
  )
}

export default FriendCard