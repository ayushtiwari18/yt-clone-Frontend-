const channelReducer = (channels = [], action) => {
  switch (action.type) {
    case "UPDATE_CHANNEL":
      return channels.map((channel) =>
        channel._id === action.payload._id ? action.payload : channel
      );
    case "FETCH_CHANNELS":
      return action.payload;
    case "ADD_CHANNEL":
      return [...channels, action.payload];
    case "DELETE_CHANNEL":
      return channels.filter((channel) => channel._id !== action.payload);
    default:
      return channels;
  }
};

export default channelReducer;
