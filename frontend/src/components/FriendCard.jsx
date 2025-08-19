import { Link } from "react-router";
import { getLanguageFlag } from "../Utility/utility";
import ConfirmPopup from "./ConfirmPopup";
import { useState } from "react";
import useCancelRequest from "../Hooks/useCancelRequest";

const FriendCard = ({ friend }) => {
  console.log("friend", friend);
  //hook for removing friend
  const { cancelRequestMutation } = useCancelRequest();
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleConfirmRemove = () => {
    cancelRequestMutation(friend.requestId);
    setIsPopupOpen(false);
  };

  const handleCancel = () => {
    console.log("inside cancel");
    setIsPopupOpen(false);
  };
  return (
    <div className="card bg-base-200 hover:shadow-md transition-shadow">
      <div className="card-body p-4">
        {/* USER INFO */}
        <div className="flex items-center gap-3 mb-3">
          <div className="avatar size-12 rounded-full overflow-hidden">
            <img src={friend.profilePic} alt={friend.fullName} />
          </div>
          <h3 className="font-semibold truncate">{friend.fullName}</h3>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-3">
          <span className="badge badge-secondary text-xs">
            {getLanguageFlag(friend.nativeLanguage)}
            Native: {friend.nativeLanguage}
          </span>
          <span className="badge badge-outline text-xs">
            {getLanguageFlag(friend.learningLanguage)}
            Learning: {friend.learningLanguage}
          </span>
        </div>

        <div className="flex gap-2">
          <Link to={`/chat/${friend.id}`} className="btn btn-outline flex-1">
            Message
          </Link>
          <button
            className="btn btn-outline flex-1"
            onClick={() => setIsPopupOpen(true)}
          >
            Remove
          </button>
        </div>
      </div>
      {/* ///confirm popup */}
      <ConfirmPopup
        isOpen={isPopupOpen}
        friendName={friend.fullName}
        onConfirm={handleConfirmRemove}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default FriendCard;
