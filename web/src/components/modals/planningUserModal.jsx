import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  MessageCircleWarning,
  Trash2,
} from "lucide-react";
import { Modal } from "../modals/modal";
import DeleteModal from "../modals/deleteModal";
import handleFetch from "../handleFetch";
import { set } from "date-fns";

export default function PlanningUserModal({
  PlanningModalOpen,
  PlanningModalSetOpen,
  user,
  expanded,
}) {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentDay, setCurrentDay] = useState(new Date().getDate());
  const [Events, setEvents] = useState([]);
  const [slectedEventIdForDelete, setSelectedEventIdForDelete] = useState(null);
  const env_path = process.env.REACT_APP_API_PATH;

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

  // Fetch the events from the API
  const fetchUserEvents = async () => {
    try {
      const eventsData = [];
      // Fetch each event individually
      for (const event of user.events) {
        const eventData = await handleFetch(`${env_path}/event/${event.id}`);
        if (eventData) {
          eventsData.push(eventData);
        }
      }
      setEvents(eventsData);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  // Fetch the users when we change Page
  useEffect(() => {
    fetchUserEvents();
  }, []);

  // Check if there are events for the day
  const eventsForDay = (day) => {
    return Events.filter((event) => {
      const eventDate = new Date(event.datetime);
      return (
        eventDate.getDate() === day &&
        eventDate.getMonth() === currentMonth &&
        eventDate.getFullYear() === currentYear
      );
    });
  };

  // Remove an event for an user
  const deleteUserEvent = async (eventId) => {
    try {
      const response = await handleFetch(
        `${env_path}/user/${user.id}/event/${eventId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      // Refresh the users list and quit the modal
      setEvents((prevEvents) =>
        prevEvents.filter((event) => event.id !== eventId)
      );
    } catch (error) {
      console.error("Error deleting event:", error);
      setResponseMessage("An error occurred while deleting the event.");
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
                  {eventsForDay(day + 1).length > 0 && (
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
              {eventsForDay(currentDay).map((event, index) => (
                <li
                  key={index}
                  className="mb-2 flex bg-white border-2 p-2 border-AshinBlue rounded shadow-md"
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
                    <button
                      className="text-red-600 hover:text-red-800"
                      onClick={() => handleDeleteClick(event.id)}
                    >
                      {<Trash2 size={22} />}
                    </button>
                    <DeleteModal
                      open={slectedEventIdForDelete === event.id}
                      onClose={() => setSelectedEventIdForDelete(null)}
                      fetchUsers={() => deleteUserEvent(event.id)}
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
