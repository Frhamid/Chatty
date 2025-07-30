import { StreamChat } from "stream-chat";
import "dotenv/config";

const apiKey = process.env.STREAM_API;
const apiSecret = process.env.STREAM_API_SECRET;

if (!apiKey || !apiSecret) {
  console.error("Stream Api key or Secret is missing");
}

// creating a client for stream
const streamClient = StreamChat.getInstance(apiKey, apiSecret);

///function for creating/updating user in stream
export const upsertStreamUser = async (userData) => {
  try {
    await streamClient.upsertUsers([userData]);
    return userData;
  } catch (error) {
    console.error("Error upserting Stream user", error);
  }
};

//TODO
export const generateStreamToken = () => {};
