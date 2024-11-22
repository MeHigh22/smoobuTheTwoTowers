// utils/roomUtils.js
export const isRoomAvailable = (roomId, startDate, endDate, availableDates) => {
  console.log("Checking room availability:", {
    roomId,
    startDate,
    endDate,
    hasAvailableDates: !!availableDates,
    availableData: availableDates?.[roomId],
    fullAvailableDates: availableDates,
  });

  // Guard clauses
  if (!availableDates || !startDate || !endDate) {
    console.log("Missing basic required data");
    return false;
  }

  const roomData = availableDates[roomId];
  if (!roomData) {
    console.log(`No room data found for room ID: ${roomId}`);
    return false;
  }

  // Convert dates to ISO strings for comparison
  const start = new Date(startDate).toISOString().split("T")[0];
  const end = new Date(endDate).toISOString().split("T")[0];

  let currentDate = new Date(start);
  const endDateTime = new Date(end);

  while (currentDate <= endDateTime) {
    const dateStr = currentDate.toISOString().split("T")[0];
    const dayData = roomData[dateStr];

    console.log(`Checking availability for ${dateStr}:`, dayData);

    if (!dayData || dayData.available === 0) {
      console.log(`Date ${dateStr} is not available for room ${roomId}`);
      return false;
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  console.log(`Room ${roomId} is available for all selected dates`);
  return true;
};
