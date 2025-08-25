import { generateStreamToken } from "../lib/stream.js";

export const getStreamToken = async (req, res) => {
  try {
    const token = generateStreamToken(req.user.id);

    res.status(200).json({ token });
  } catch (error) {
    console.log("Error in getStreamToken controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

////end point for deleting call
// streamController.js
import { StreamClient } from "@stream-io/node-sdk";

const apiKey = process.env.STREAM_API;
const apiSecret = process.env.STREAM_API_SECRET; // only use server-side
const client = new StreamClient(apiKey, apiSecret);

export const deleteCall = async (req, res) => {
  try {
    const { type, id } = req.params;

    // delete the call with hard:true
    await client.video.call(type, id).delete({ hard: true });

    res.status(200).json({
      success: true,
      message: `Call ${id} deleted successfully`,
    });
  } catch (error) {
    console.error("Error deleting call:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete call",
      error: error.message,
    });
  }
};
