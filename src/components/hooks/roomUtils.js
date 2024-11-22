export const isRoomAvailable = (roomId, startDate, endDate, availableDates) => {
  // Add debugging logs
  console.log("Checking room availability:", {
    roomId,
    startDate,
    endDate,
    hasAvailableDates: !!availableDates,
    availableData: availableDates?.[roomId],
  });

  if (!availableDates || !startDate || !endDate) return false;

  const roomData = availableDates[roomId];
  if (!roomData) return false;

  let currentDate = new Date(startDate);
  const endDateTime = new Date(endDate);

  while (currentDate <= endDateTime) {
    const dateStr = currentDate.toISOString().split("T")[0];
    if (!roomData[dateStr] || roomData[dateStr].available === 0) {
      return false;
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return true;
};
