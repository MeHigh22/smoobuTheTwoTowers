import React from "react";
import { roomsData } from "../hooks/roomsData";
import { isRoomAvailable } from "../hooks/roomUtils";
import { extraCategories } from "../extraCategories";

export const PropertyDetails = ({
  formData,
  startDate,
  endDate,
  priceDetails,
  showPriceDetails,
  selectedExtras,
  appliedCoupon,
  onRoomSelect,
  availableDates,
}) => {
  const formatDate = (date) => {
    const d = new Date(date);
    const day = d.getDate();
    const month = d.getMonth() + 1;
    const year = d.getFullYear().toString().slice(-2);
    return `${day}.${month}.${year}`;
  };

  const groupedRooms = Object.values(roomsData).reduce(
    (acc, room) => {
      if (isRoomAvailable(room.id, startDate, endDate, availableDates)) {
        acc.available.push(room);
      } else {
        acc.unavailable.push(room);
      }
      return acc;
    },
    { available: [], unavailable: [] }
  );

  console.log("Grouped rooms:", {
    available: groupedRooms.available.length,
    unavailable: groupedRooms.unavailable.length,
  });

 const RoomCard = ({ room, isAvailable }) => {
   const roomPriceDetails = priceDetails && priceDetails[room.id];

   const calculateTotal = () => {
     if (!roomPriceDetails) return 0;
     let total = roomPriceDetails.originalPrice;

     // Add extras if any
     if (selectedExtras) {
       Object.entries(selectedExtras).forEach(([extraId, quantity]) => {
         if (quantity > 0) {
           const isExtraPerson = extraId.endsWith("-extra");
           const baseExtraId = isExtraPerson
             ? extraId.replace("-extra", "")
             : extraId;
           const extra = Object.values(extraCategories)
             .flatMap((category) => category.items)
             .find((item) => item.id === baseExtraId);

           if (extra) {
             if (isExtraPerson) {
               total += extra.extraPersonPrice * quantity;
             } else {
               total += extra.price * quantity;
             }
           }
         }
       });
     }

     // Subtract discounts
     if (roomPriceDetails.discount) {
       total -= roomPriceDetails.discount;
     }

     // Add fees
     total += roomPriceDetails.extraGuestsFee || 0;
     total += roomPriceDetails.extraChildrenFee || 0;
     total += roomPriceDetails.cleaningFee || 0;

     return total;
   };

   return (
     <div
       className={`p-6 border rounded shadow-sm ${
         isAvailable ? "border-[#668E73]" : "border-gray-300 opacity-75"
       }`}
     >
       {/* Room Image */}
       <img
         src={room.image}
         alt={room.name}
         className="w-full h-[250px] object-cover rounded-[0.3em] my-4"
       />

       {/* Room Title */}
       <h2 className="text-[18px] md:text-[23px] font-normal text-black mb-2">
         {room.name}
       </h2>
       <p className="text-gray-600">{room.description}</p>

       {/* Capacity and Dates Section */}
       <div className="flex items-center justify-between mt-6 mb-4">
         <div className="flex items-center space-x-2">
           <img src="/icons/group.png" alt="Profile Icon" className="w-6 h-6" />
           <span className="text-[16px] text-black">
             Max {room.maxGuests} personnes
           </span>
         </div>
         {formData.apartmentId === room.id && isAvailable && (
           <div className="flex items-center space-x-2">
             <img
               src="/icons/calendar.png"
               alt="Calendar Icon"
               className="w-6 h-6"
             />
             <span className="text-[16px] text-black">
               {startDate && formatDate(startDate)}
               {(startDate || endDate) && " → "}
               {endDate && formatDate(endDate)}
             </span>
           </div>
         )}
       </div>

       {/* Features and Amenities Grid */}
       <div className="grid grid-cols-2 gap-6 mt-6">
         <div>
           <h3 className="font-medium text-[#668E73] mb-3">Features:</h3>
           <ul className="pl-4 space-y-2 text-gray-600 list-disc">
             {room.features.map((feature, index) => (
               <li key={index} className="text-sm">
                 {feature}
               </li>
             ))}
           </ul>
         </div>
         <div>
           <h3 className="font-medium text-[#668E73] mb-3">Amenities:</h3>
           <ul className="pl-4 space-y-2 text-gray-600 list-disc">
             {room.amenities.map((amenity, index) => (
               <li key={index} className="text-sm">
                 {amenity}
               </li>
             ))}
           </ul>
         </div>
       </div>

       {/* Room Size */}
       <div className="mt-6 text-gray-600">
         <span className="font-medium">Size: </span>
         {room.size}
       </div>

       {/* Select Room Button */}
       <button
         type="button"
         onClick={() => {
           if (isAvailable) onRoomSelect(room.id);
         }}
         disabled={!isAvailable}
         className={`w-full mt-6 py-3 rounded font-medium transition-colors ${
           isAvailable
             ? formData.apartmentId === room.id
               ? "bg-[#445E54] text-white"
               : "bg-[#668E73] text-white hover:bg-opacity-90"
             : "bg-gray-300 text-gray-600 cursor-not-allowed"
         }`}
       >
         {formData.apartmentId === room.id
           ? "Sélectionné"
           : isAvailable
           ? "Sélectionner"
           : "Non disponible"}
       </button>

       {/* Price Details */}
       {showPriceDetails &&
         formData.apartmentId === room.id &&
         isAvailable &&
         roomPriceDetails && (
           <div className="mt-6 p-4 border-t border-[#668E73]">
             <div className="text-lg font-semibold text-[#445E54] mb-4">
               Prix pour {roomPriceDetails.numberOfNights} nuit(s):
             </div>

             <div className="space-y-3">
               <div className="flex justify-between">
                 <span>Prix de base</span>
                 <span>{roomPriceDetails.originalPrice}€</span>
               </div>

               {roomPriceDetails.priceElements.map((element, index) => (
                 <div
                   key={index}
                   className={`flex justify-between ${
                     element.type === "discount" ? "text-green-600" : ""
                   }`}
                 >
                   <span>{element.name}</span>
                   <span>{element.amount}€</span>
                 </div>
               ))}

               {/* Show selected extras */}
               {Object.entries(selectedExtras)
                 .filter(([_, quantity]) => quantity > 0)
                 .map(([extraId, quantity]) => {
                   const extra = Object.values(extraCategories)
                     .flatMap((category) => category.items)
                     .find((item) => item.id === extraId);
                   if (extra) {
                     return (
                       <div key={extraId} className="flex justify-between">
                         <span>
                           {extra.name} (x{quantity})
                         </span>
                         <span>{extra.price * quantity}€</span>
                       </div>
                     );
                   }
                   return null;
                 })}

               <div className="flex justify-between pt-3 mt-3 font-semibold border-t border-gray-200">
                 <span>Total</span>
                 <span>{calculateTotal()}€</span>
               </div>

               <div className="text-sm text-right text-gray-600">
                 ({roomPriceDetails.pricePerNight}€ par nuit)
               </div>
             </div>
           </div>
         )}
     </div>
   );
 };

  return (
    <div className="space-y-8">
      {/* Available Rooms */}
      {groupedRooms.available.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-[#668E73] mb-6">
            Chambres disponibles
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {groupedRooms.available.map((room) => (
              <RoomCard key={room.id} room={room} isAvailable={true} />
            ))}
          </div>
        </div>
      )}

      {/* Unavailable Rooms */}
      {groupedRooms.unavailable.length > 0 && (
        <div className="mt-8">
          <h2 className="mb-6 text-xl font-semibold text-gray-500">
            Chambres non disponibles
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {groupedRooms.unavailable.map((room) => (
              <RoomCard key={room.id} room={room} isAvailable={false} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
