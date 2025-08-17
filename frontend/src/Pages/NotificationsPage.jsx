import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { acceptFriendRequest, getFriendRequests } from "../lib/api";
import {
  BellIcon,
  ClockIcon,
  MessageSquareIcon,
  UserCheckIcon,
} from "lucide-react";
import NoNotificationsFound from "../components/NoNotificationsFound";
import { formatDistanceToNow } from "date-fns";
import useCancelRequest from "../Hooks/useCancelRequest";
import { useRequestStore } from "../store/useThemeStore ";
import useReceivedRequest from "../Hooks/useReceivedRequest";
import useAcceptRequest from "../Hooks/useAcceptRequest";

const NotificationsPage = () => {
  const { friendRequests, isLoading } = useReceivedRequest();
  const { acceptRequestMutation, isPending } = useAcceptRequest();
  const { cancelRequestMutation, pendingCancel } = useCancelRequest();
  const incomingRequests = friendRequests?.data?.incomingReqs || [];
  const acceptedRequests = friendRequests?.data?.acceptedReqs || [];
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto max-w-4xl space-y-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-6">
          Notifications
        </h1>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : (
          <>
            {incomingRequests.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <UserCheckIcon className="h-5 w-5 text-primary" />
                  Friend Requests
                  <span className="badge badge-primary ml-2">
                    {incomingRequests.length}
                  </span>
                </h2>

                <div className="space-y-3">
                  {incomingRequests.map((request) => (
                    <div
                      key={request.id}
                      className="card bg-base-200 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="card-body p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="avatar size-14 rounded-full bg-base-300 overflow-hidden">
                              <img
                                src={request.requester.profilePic}
                                alt={request.requester.fullName}
                                className="object-cover"
                              />
                            </div>
                            <div>
                              <h3 className="font-semibold">
                                {request.requester.fullName}
                              </h3>
                              <div className="flex flex-wrap gap-1.5 mt-1">
                                <span className="badge badge-secondary badge-sm">
                                  Native: {request.requester.nativeLanguage}
                                </span>
                                <span className="badge badge-outline badge-sm">
                                  Learning: {request.requester.learningLanguage}
                                </span>
                              </div>

                              {/* Time ago */}
                              <p className="text-xs flex items-center opacity-70 mt-2">
                                <ClockIcon className="h-3 w-3 mr-1" />
                                {formatDistanceToNow(
                                  new Date(request.createdAt),
                                  {
                                    addSuffix: true,
                                  }
                                )}
                              </p>
                            </div>
                          </div>

                          {/* buttons for accepting or rejecting request */}
                          <div className="flex flex-row gap-2">
                            <button
                              className="btn btn-error btn-sm"
                              onClick={() => cancelRequestMutation(request.id)}
                              disabled={pendingCancel}
                            >
                              Reject
                            </button>
                            <button
                              className="btn btn-primary btn-sm"
                              onClick={() => acceptRequestMutation(request.id)}
                              disabled={isPending}
                            >
                              Accept
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* ACCEPTED REQS NOTIFICATONS */}
            {acceptedRequests.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <BellIcon className="h-5 w-5 text-success" />
                  New Connections
                </h2>

                <div className="space-y-3">
                  {acceptedRequests.map((notification) => (
                    <div
                      key={notification.id}
                      className="card bg-base-200 shadow-sm"
                    >
                      <div className="card-body p-4">
                        <div className="flex items-start gap-3">
                          <div className="avatar mt-1 size-10 rounded-full">
                            <img
                              src={notification.receiver.profilePic}
                              alt={notification.receiver.fullName}
                            />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold">
                              {notification.receiver.fullName}
                            </h3>
                            <p className="text-sm my-1">
                              {notification.receiver.fullName} accepted your
                              friend request
                            </p>
                            <p className="text-xs flex items-center opacity-70">
                              <ClockIcon className="h-3 w-3 mr-1" />
                              {formatDistanceToNow(
                                new Date(notification.updatedAt),
                                {
                                  addSuffix: true,
                                }
                              )}
                            </p>
                          </div>
                          <div className="badge badge-success">
                            <MessageSquareIcon className="h-3 w-3 mr-1" />
                            New Friend
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {incomingRequests.length === 0 && acceptedRequests.length === 0 && (
              <NoNotificationsFound />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
