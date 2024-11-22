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

  if (!availableDates || !startDate || !endDate) {
    console.log("Missing required data for availability check:", {
      hasAvailableDates: !!availableDates,
      hasStartDate: !!startDate,
      hasEndDate: !!endDate,
    });
    return false;
  }

  const roomData = availableDates[roomId];
  if (!roomData) {
    console.log("No room data found for room ID:", roomId);
    return false;
  }

  const start = new Date(startDate);
  const end = new Date(endDate);

  let currentDate = new Date(start);

  while (currentDate <= end) {
    const dateStr = currentDate.toISOString().split("T")[0];
    const dayData = roomData[dateStr];

    console.log(`Checking date ${dateStr}:`, dayData);

    if (!dayData || dayData.available === 0) {
      console.log(`Date ${dateStr} is not available for room ${roomId}`);
      return false;
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  console.log(`Room ${roomId} is available for the selected dates`);
  return true;
};
