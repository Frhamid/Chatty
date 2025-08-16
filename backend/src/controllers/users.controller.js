import prisma from "../prismaClient/prismaClient.js";

export const getrecomendedusers = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const currentUser = req.user;
    const relatedFriendships = await prisma.friendship.findMany({
      where: {
        status: "ACCEPTED",
        OR: [{ requesterId: currentUserId }, { receiverId: currentUserId }],
      },
      select: {
        requesterId: true,
        receiverId: true,
      },
    });

    // Extract all related user IDs
    const relatedUserIds = new Set();
    relatedFriendships.forEach((friend) => {
      relatedUserIds.add(friend.requesterId);
      relatedUserIds.add(friend.receiverId);
    });

    // Also exclude current user
    relatedUserIds.add(currentUserId);

    // Step 2: Get all users not in that list (i.e., recommended users)
    const recommendedUsers = await prisma.user.findMany({
      where: {
        id: {
          notIn: Array.from(relatedUserIds),
        },
        isOnboarded: true,
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        profilePic: true,
        bio: true,
        nativeLanguage: true,
        learningLanguage: true,
        // Exclude password and other private fields
      },
    });
    res.status(200).json({ success: true, recommendedUsers });
  } catch (error) {
    console.error("Error fetching all users", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getMyFriends = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const friendships = await prisma.friendship.findMany({
      where: {
        status: "ACCEPTED",
        OR: [{ requesterId: currentUserId }, { receiverId: currentUserId }],
      },
      include: {
        requester: {
          select: {
            id: true,
            fullName: true,
            email: true,
            profilePic: true,
            // omit password and anything else sensitive
          },
        },
        receiver: {
          select: {
            id: true,
            fullName: true,
            email: true,
            profilePic: true,
            bio: true,
            nativeLanguage: true,
            learningLanguage: true,
            // omit password and anything else sensitive
          },
        },
      },
    });

    // Map to get actual friend (excluding self)
    const friends = friendships.map((f) =>
      f.requesterId === currentUserId ? f.receiver : f.requester
    );
    res.status(200).json({ success: true, friends: friends });
  } catch (error) {
    console.error("Error fetching friends", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const sendFriendRequest = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const { id: recepientId } = req.params;

    //prevent sending request to urself
    if (currentUserId === recepientId) {
      res
        .status(400)
        .json({ message: "You cannot send friend request to yourself" });
    }

    //checking if recepient exsist
    const recepient = await prisma.user.findUnique({
      where: {
        id: recepientId,
      },
    });
    if (!recepient) {
      res.status(400).json({ message: "Invalid Recepient" });
    }

    // 3. Check if a friendship already exists or request already sent/received
    const existingFriendship = await prisma.friendship.findFirst({
      where: {
        OR: [
          {
            requesterId: currentUserId,
            receiverId: recepientId,
          },
          {
            requesterId: recepientId,
            receiverId: currentUserId,
          },
        ],
      },
    });

    if (existingFriendship) {
      return res.status(400).json({
        message: "Friend request already sent or you're already friends",
      });
    }

    // 4. Create friend request (status: PENDING)
    const newFriendRequest = await prisma.friendship.create({
      data: {
        requesterId: currentUserId,
        receiverId: recepientId,
      },
    });

    res.status(201).json({ success: true, Frequest: newFriendRequest });
  } catch (error) {
    console.error("Error creating friend request", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const acceptFriendRequest = async (req, res) => {
  try {
    const currentUserId = req?.user.id;
    const { id: RequestId } = req?.params;

    const friendRequest = await prisma.friendship.findUnique({
      where: {
        id: RequestId,
        status: "PENDING",
      },
    });

    if (!friendRequest) {
      res.status(404).json({ message: "Friend Request not found" });
    }

    if (friendRequest.receiverId !== currentUserId) {
      res
        .status(403)
        .json({ message: "You are not authorized to accept this request" });
    }

    const acceptReq = await prisma.friendship.update({
      where: {
        id: RequestId,
      },
      data: {
        status: "ACCEPTED",
      },
    });
    res.status(201).json({ success: true, acceptReq });
  } catch (error) {
    console.error("Error accepting friend request", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const rejectFriendRequest = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const { id: RequestId } = req.params;

    const friendship = await prisma.friendship.findUnique({
      where: { id: RequestId },
    });

    if (!friendship) {
      return res.status(404).json({ message: "Friendship not found" });
    }

    // Only requester or receiver can delete
    if (
      friendship.receiverId !== currentUserId &&
      friendship.requesterId !== currentUserId
    ) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this friendship" });
    }

    await prisma.friendship.delete({
      where: { id: RequestId },
    });

    let message = "Friendship removed";
    if (friendship.status === "PENDING") {
      message =
        friendship.receiverId === currentUserId
          ? "Friend request rejected"
          : "Friend request cancelled";
    } else if (friendship.status === "ACCEPTED") {
      message = "Unfriended successfully";
    }

    res.status(200).json({ success: true, message });
  } catch (error) {
    console.error("Error deleting friendship", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getFriendRequests = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const myFriendRequest = await prisma.friendship.findMany({
      where: {
        receiverId: currentUserId,
        status: "PENDING",
      },
      include: {
        requester: {
          select: {
            id: true,
            fullName: true,
            email: true,
            profilePic: true,
            bio: true,
            nativeLanguage: true,
            learningLanguage: true,
            // omit password and anything else sensitive
          },
        },
      },
    });
    if (!myFriendRequest.length) {
      res.status(404).json({ message: "No Friend Requests found" });
    }
    res.status(200).json({ success: true, myFriendRequest });
  } catch (error) {
    console.error("Error fetching friend requests", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getSentFriendRequests = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const sentFriendRequests = await prisma.friendship.findMany({
      where: {
        requesterId: currentUserId,
        status: "PENDING",
      },
      include: {
        receiver: {
          select: {
            id: true,
            fullName: true,
            email: true,
            profilePic: true,
            bio: true,
            nativeLanguage: true,
            learningLanguage: true,
            // omit password and anything else sensitive
          },
        },
      },
    });
    res.status(200).json({ success: true, sentFriendRequests });
  } catch (error) {
    console.error("Error fetching Sent Requests", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
