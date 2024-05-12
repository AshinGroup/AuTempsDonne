import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  MessageCircleWarning,
  Trash2,
  Map,
} from "lucide-react";
import { Modal } from "../modals/modal";
import DeleteModal from "../modals/deleteModal";
import handleFetch from "../handleFetch";
import { set } from "date-fns";
import ShowRoadmapModal from "../modals/showRoadmapModal";

export default function PlanningUserModal({
  PlanningModalOpen,
  PlanningModalSetOpen,
  user,
  expanded,
  fetchUser,
}) {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentDay, setCurrentDay] = useState(new Date().getDate());
  const [slectedEventIdForDelete, setSelectedEventIdForDelete] = useState(null);
  const env_path = process.env.REACT_APP_API_PATH;
  const [responseMessage, setResponseMessage] = useState("");
  const [isErrorMessage, setIsErrorMessage] = useState(false);
  const [selectedRMId, setSelectedRMId] = useState(null);
  const [selectedRMId2, setSelectedRMId2] = useState(null);

  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const daysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (month, year) => new Date(year, month, 0).getDay();

  const prevMonth = () => {
    setCurrentMonth((prev) => (prev === 0 ? 11 : prev - 1));
    if (currentMonth === 0) {
      setCurrentYear(currentYear - 1);
    }
  };
  const nextMonth = () => {
    setCurrentMonth((prev) => (prev === 11 ? 0 : prev + 1));
    if (currentMonth === 11) {
      setCurrentYear(currentYear + 1);
    }
  };
  const monthToString = (month) => {
    const date = new Date(currentYear, month, 1);

    // Get the month name using toLocaleString()
    let monthName = date.toLocaleString("en-US", { month: "long" });

    // Capitalize the first letter of the month name
    monthName = monthName.charAt(0).toUpperCase() + monthName.slice(1);

    return monthName;
  };
  const handleDayClick = (day) => {
    setCurrentDay(day);
  };
  // Check if there are events for the day
  const eventsForDay = (day) => {
    return user.events.filter((event) => {
      const eventDate = new Date(event.datetime);
      return (
        eventDate.getDate() === day &&
        eventDate.getMonth() === currentMonth &&
        eventDate.getFullYear() === currentYear
      );
    });
  };
  // Check if there are collects for the day
  const collectsForDay = (day) => {
    return user.collects.filter((collect) => {
      const parts = collect.datetime.split("/");
      const collectDay = parseInt(parts[0]);
      const collectMonth = parseInt(parts[1]) - 1;
      const collectYear = parseInt(parts[2]);

      const collectDate = new Date(collectYear, collectMonth, collectDay);

      return (
        collectDate.getDate() == day &&
        collectDate.getMonth() == currentMonth &&
        collectDate.getFullYear() == currentYear
      );
    });
  };
  // Check if there are deliveries for the day
  const deliveriesForDay = (day) => {
    return user.deliveries.filter((delivery) => {
      const deliveryDate = new Date(delivery.datetime);

      return (
        deliveryDate.getDate() == day &&
        deliveryDate.getMonth() == currentMonth &&
        deliveryDate.getFullYear() == currentYear
      );
    });
  };

  const handleRMClick = (itemId) => {
    setSelectedRMId(itemId);
  };
  const handleRMClick2 = (itemId) => {
    setSelectedRMId2(itemId);
  };

  // Remove an event for an user
  const deleteUserEvent = async (eventId, event = "event") => {
    try {
      const response = await handleFetch(
        `${env_path}/user/${user.id}/${event}/${eventId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response) {
        throw new Error("Network response was not ok");
      }

      // Refresh the users list
      fetchUser();
    } catch (error) {
      console.error("Error deleting :", error);
      setResponseMessage("An error occurred while deleting.");
      setIsErrorMessage(true);
    } finally {
      // Close the delete modal
      setSelectedEventIdForDelete(null);
    }
  };

  // Set the user id to delete
  const handleDeleteClick = (eventId) => {
    setSelectedEventIdForDelete(eventId);
  };

  const isDatePassed = (datetime) => {
    const itemDate = new Date(datetime);
    const today = new Date();
    return itemDate < today;
  };

  return (
    <Modal open={PlanningModalOpen} onClose={PlanningModalSetOpen}>
      {/* Main Div */}
      <div className={`${expanded ? "flex" : ""} mt-5`}>
        {/* Calendar */}
        <div className="flex flex-col items-center justify-center p-5 bg-white rounded-lg shadow">
          {/* Select Month */}
          <div className="flex items-center justify-center w-full mb-6">
            <button
              className="text-gray-600 hover:text-gray-800"
              onClick={prevMonth}
            >
              <ChevronLeft size={25} />
            </button>
            <span className="text-lg text-gray-800 mx-5 font-semibold">
              {monthToString(currentMonth)} {currentYear}
            </span>
            <button
              className="text-gray-600 hover:text-gray-800"
              onClick={nextMonth}
            >
              <ChevronRight size={25} />
            </button>
          </div>

          {/* Days of Week */}
          <div className="grid grid-cols-7 gap-4 text-center w-full">
            {daysOfWeek.map((day) => (
              <div key={day} className="font-semibold text-sm">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-4 text-center w-full border-2 p-2 mt-1 border-AshinBlue rounded ">
            {/* Empty slots */}
            {Array.from(
              { length: firstDayOfMonth(currentMonth, currentYear) },
              (_, i) => (
                <div key={`empty-${i}`} className="py-1"></div>
              )
            )}
            {/* Month Pills */}
            {Array.from(
              { length: daysInMonth(currentMonth, currentYear) },
              (_, day) => (
                <div
                  key={`${day}`}
                  className={`py-1 flex flex-row justify-center ${
                    day === currentDay - 1 ? "bg-AshinBlue text-white" : ""
                  } hover:bg-blue-200 hover:text-white cursor-pointer rounded`}
                  onClick={() => handleDayClick(day + 1)}
                >
                  {day + 1}
                  {(collectsForDay(day + 1).length > 0 ||
                    eventsForDay(day + 1).length > 0 ||
                    deliveriesForDay(day + 1).length > 0) && (
                    <MessageCircleWarning
                      className="text-yellow-600"
                      size={15}
                    />
                  )}
                </div>
              )
            )}
          </div>
        </div>
        {/* Day Information of the User */}
        <div
          className={`bg-gray-200  border-2 rounded border-AshinBlue-light ${
            expanded ? "h-[60vh] w-[60vh]" : ""
          }`}
        >
          <div className="p-4">
            <h2 className="text-lg font-bold text-center mb-5 py-2 border-b-2 border-AshinBlue">
              {`${currentDay} ${monthToString(currentMonth)} ${currentYear}`}
            </h2>
            {/* Display a list of events for the selected day */}
            <ul>
              {responseMessage && (
                <li
                  className={`mb-2 flex bg-white border-2 p-2 ${
                    isErrorMessage ? "border-red-500" : "border-green-500"
                  } rounded shadow-md`}
                >
                  <span>{responseMessage}</span>
                </li>
              )}
              {eventsForDay(currentDay).map((event, index) => (
                <li
                  key={index}
                  className={`mb-2 flex bg-white border-2 p-2 ${
                    !isDatePassed(event.datetime)
                      ? "border-AshinBlue"
                      : "border-gray-500"
                  } rounded shadow-md`}
                >
                  <div className=" flex flex-col w-5/6">
                    <span className="font-bold">{event.name}</span>
                    <span>
                      {event.place} -{" "}
                      {event.datetime
                        .split(" ")[1]
                        .split(":")
                        .splice(0, 2)
                        .join(":")}{" "}
                    </span>
                  </div>
                  <div className=" flex justify-center align-center w-1/6">
                    {!isDatePassed(event.datetime) && (
                      <button
                        className="text-red-600 hover:text-red-800"
                        onClick={() => handleDeleteClick(`e-${event.id}`)}
                      >
                        {<Trash2 size={22} />}
                      </button>
                    )}
                    <DeleteModal
                      open={slectedEventIdForDelete === `e-${event.id}`}
                      onClose={() => setSelectedEventIdForDelete(null)}
                      fetchUsers={() => deleteUserEvent(event.id, "event")}
                    />{" "}
                  </div>
                </li>
              ))}
              {collectsForDay(currentDay).map((collect, index) => (
                <li
                  key={`COLLECT_${index}`}
                  className={`mb-2 flex bg-white border-2 p-2 ${
                    !isDatePassed(collect.datetime)
                      ? "border-AshinBlue"
                      : "border-gray-500"
                  } rounded shadow-md`}
                >
                  <div className=" flex flex-col w-5/6">
                    <span className="font-bold">Collect #{collect.id}</span>
                    <span>
                      {collect.storage.warehouse.location.address}{" "}
                      {collect.storage.warehouse.location.zip_code} -{" "}
                      {collect.datetime}
                    </span>
                  </div>
                  <div className=" flex justify-center align-center w-1/6">
                    <button
                      className="me-2"
                      onClick={() => handleRMClick(collect.id)}
                    >
                      <Map
                        size={25}
                        className="hover:scale-110 text-AshinBlue"
                      />
                    </button>
                    {!isDatePassed(collect.datetime) && (
                      <button
                        className="text-red-600 hover:text-red-800"
                        onClick={() => handleDeleteClick(`c-${collect.id}`)}
                      >
                        {<Trash2 size={22} />}
                      </button>
                    )}
                    <ShowRoadmapModal
                      open={selectedRMId === collect.id}
                      onClose={() => setSelectedRMId(null)}
                      item={collect}
                    />{" "}
                    <DeleteModal
                      open={slectedEventIdForDelete === `c-${collect.id}`}
                      onClose={() => setSelectedEventIdForDelete(null)}
                      fetchUsers={() => deleteUserEvent(collect.id, "collect")}
                    />{" "}
                  </div>
                </li>
              ))}
              {deliveriesForDay(currentDay).map((delivery, index) => (
                <li
                  key={`COLLECT_${index}`}
                  className={`mb-2 flex bg-white border-2 p-2 ${
                    !isDatePassed(delivery.datetime)
                      ? "border-AshinBlue"
                      : "border-gray-500"
                  } rounded shadow-md`}
                >
                  <div className=" flex flex-col w-5/6">
                    <span className="font-bold">Delivery #{delivery.id}</span>
                    <span>
                      {delivery.locations[0].address}{" "}
                      {delivery.locations[0].zip_code} - {delivery.datetime}
                    </span>
                  </div>
                  <div className=" flex justify-center align-center w-1/6">
                    <button
                      className="me-2"
                      onClick={() => handleRMClick2(delivery.id)}
                    >
                      <Map
                        size={25}
                        className="hover:scale-110 text-AshinBlue"
                      />
                    </button>
                    {!isDatePassed(delivery.datetime) && (
                      <button
                        className="text-red-600 hover:text-red-800"
                        onClick={() => handleDeleteClick(`d-${delivery.id}`)}
                      >
                        {<Trash2 size={22} />}
                      </button>
                    )}
                    <ShowRoadmapModal
                      open={selectedRMId2 === delivery.id}
                      onClose={() => setSelectedRMId2(null)}
                      item={delivery}
                    />{" "}
                    <DeleteModal
                      open={slectedEventIdForDelete === `d-${delivery.id}`}
                      onClose={() => setSelectedEventIdForDelete(null)}
                      fetchUsers={() =>
                        deleteUserEvent(delivery.id, "delivery")
                      }
                    />{" "}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Modal>
  );
}
