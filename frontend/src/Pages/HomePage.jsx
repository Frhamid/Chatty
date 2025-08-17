import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  getRecommendedUsers,
  getSentRequests,
  getUserFriends,
  sendFriendRequest,
} from "../lib/api";

import { capitialize } from "../Utility/helper";
import { getLanguageFlag } from "../Utility/utility";
import { Link } from "react-router";
import { MapPinIcon, UserPlusIcon, UsersIcon, CircleX } from "lucide-react";
import NoFriendsFound from "../components/NoFriendsFound";
import FriendCard from "../components/FriendCard";
import useCancelRequest from "../Hooks/useCancelRequest";
import { useRequestStore } from "../store/useThemeStore ";
import useReceivedRequest from "../Hooks/useReceivedRequest";
import useAcceptRequest from "../Hooks/useAcceptRequest";

const HomePage = () => {
  const [sentFriendRequestIds, setSentFriendRequestIds] = useState(new Set());
  const queryClient = useQueryClient();

  const { data: userFriends, isLoading: loadingFriends } = useQuery({
    queryKey: ["getFriends"],
    queryFn: getUserFriends,
  });

  const { data: recommendedUsers, isLoading: loadingUsers } = useQuery({
    queryKey: ["recomendedUsers"],
    queryFn: getRecommendedUsers,
  });
  const { data: sentRequests } = useQuery({
    queryKey: ["requestsSent"],
    queryFn: getSentRequests,
  });

  const { mutate: sendRequestMutation, isPending } = useMutation({
    mutationFn: sendFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["requestsSent"] });
    },
  });
  const { cancelRequestMutation } = useCancelRequest();
  const { Requests, setRequests } = useRequestStore();
  const { friendRequests } = useReceivedRequest();
  const { acceptRequestMutation } = useAcceptRequest();
  useEffect(() => {
    console.log("value of data");
    setRequests(friendRequests?.data?.incomingReqs?.length);
  }, [friendRequests?.data?.incomingReqs]);

  useEffect(() => {
    const outgoingRequestIds = new Set();
    if (
      sentRequests?.data?.sentFriendRequests &&
      sentRequests?.data?.sentFriendRequests?.length > 0
    ) {
      sentRequests?.data?.sentFriendRequests?.forEach((req) => {
        outgoingRequestIds.add(req.receiver.id);
      });
    }
    setSentFriendRequestIds(outgoingRequestIds);
  }, [sentRequests]);
  return (
    // friends section and and requests button
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto space-y-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Your Friends
          </h2>
          <Link to="/notifications" className="btn btn-outline btn-sm">
            <UsersIcon className="mr-2 size-4" />
            Friend Requests
            {Requests > 0 && (
              <span className="badge badge-primary">
                {Requests > 100 ? "100+" : Requests}
              </span>
            )}
          </Link>
        </div>

        {/* //showing all the loaded friends */}
        {loadingFriends ? (
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg" />
          </div>
        ) : userFriends?.data?.friends?.length === 0 ? (
          <NoFriendsFound />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {userFriends?.data?.friends?.map((friend) => (
              <FriendCard key={friend.id} friend={friend} />
            ))}
          </div>
        )}

        {/* section for recomended users */}
        <section>
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                  Meet New Learners
                </h2>
                <p className="opacity-70">
                  Discover perfect language exchange partners based on your
                  profile
                </p>
              </div>
            </div>
          </div>
          {/* //recomendedUser cards */}
          {loadingUsers ? (
            <div className="flex justify-center py-12">
              <span className="loading loading-spinner loading-lg" />
            </div>
          ) : recommendedUsers?.data?.recommendedUsers?.length === 0 ? (
            <div className="card bg-base-200 p-6 text-center">
              <h3 className="font-semibold text-lg mb-2">
                No recommendations available
              </h3>
              <p className="text-base-content opacity-70">
                Check back later for new language partners!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedUsers?.data?.recommendedUsers?.map((user) => {
                const hasRequestBeenSent = sentFriendRequestIds.has(user.id);
                const currentRequest =
                  sentRequests?.data?.sentFriendRequests?.find(
                    (req) => req.receiverId == user.id
                  );
                const hasRequestBeenReceived =
                  friendRequests?.data?.incomingReqs.find((friend) => {
                    return friend?.requesterId == user.id;
                  });

                return (
                  <div
                    key={user.id}
                    className="card bg-base-200 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="card-body p-5 space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="avatar size-16 rounded-full overflow-hidden">
                          <img src={user.profilePic} alt={user.fullName} />
                        </div>

                        <div>
                          <h3 className="font-semibold text-lg">
                            {user.fullName}
                          </h3>
                          {user.location && (
                            <div className="flex items-center text-xs opacity-70 mt-1">
                              <MapPinIcon className="size-3 mr-1" />
                              {user.location}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Languages with flags */}
                      <div className="flex flex-wrap gap-1.5">
                        <span className="badge badge-secondary">
                          {getLanguageFlag(user.nativeLanguage)}
                          Native: {capitialize(user.nativeLanguage)}
                        </span>
                        <span className="badge badge-outline">
                          {getLanguageFlag(user.learningLanguage)}
                          Learning: {capitialize(user.learningLanguage)}
                        </span>
                      </div>

                      {user.bio && (
                        <p className="text-sm opacity-70">{user.bio}</p>
                      )}

                      {/* Action button */}

                      {hasRequestBeenReceived?.requesterId == user.id ? (
                        <div className="flex flex-row gap-2 w-full mt-2">
                          <button
                            className="btn btn-error flex-1"
                            onClick={() =>
                              cancelRequestMutation(hasRequestBeenReceived.id)
                            }
                          >
                            Reject
                          </button>
                          <button
                            className="btn btn-primary flex-1"
                            onClick={() =>
                              acceptRequestMutation(hasRequestBeenReceived.id)
                            }
                          >
                            Accept
                          </button>
                        </div>
                      ) : (
                        <button
                          className={`btn w-full mt-2 ${
                            isPending
                              ? "btn-disabled"
                              : hasRequestBeenSent
                              ? " btn-error"
                              : "btn-primary"
                          }`}
                          onClick={
                            () =>
                              hasRequestBeenSent
                                ? cancelRequestMutation(currentRequest.id) // cancel if already sent
                                : sendRequestMutation(user.id) // send otherwise
                          }
                          disabled={isPending}
                        >
                          {hasRequestBeenSent ? (
                            <>
                              <CircleX className="size-4 mr-2" />
                              Cancel Request
                            </>
                          ) : (
                            <>
                              <UserPlusIcon className="size-4 mr-2" />
                              Send Friend Request
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default HomePage;
