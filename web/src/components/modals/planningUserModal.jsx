import React, { useState } from "react";
import { ChevronLeft, ChevronRight, MessageCircleWarning } from "lucide-react";
import { Modal } from "../modals/modal";

export default function PlanningUserModal({
  PlanningModalOpen,
  PlanningModalSetOpen,
  user,
  expanded,
}) {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentDay, setCurrentDay] = useState(new Date().getDate());

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
    const date = new Date();
    date.setMonth(month);
    let monthName = date.toLocaleString("en-US", { month: "long" });
    monthName = monthName.charAt(0).toUpperCase() + monthName.slice(1);
    return monthName;
  };
  const handleDayClick = (day) => {
    setCurrentDay(day);
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
                  className={`py-1 flex flex-row justify-center ${day === currentDay - 1 ? "bg-AshinBlue text-white" : ""
                    } hover:bg-blue-200 hover:text-white cursor-pointer rounded`}
                  onClick={() => handleDayClick(day + 1)}
                >
                  {day + 1}
                  {[1, 2, 16, 20, 11].includes(day) && (
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
        <div className={`bg-gray-200 ${expanded ? "h-[60vh] w-[70vh]" : ""}`}>
          {/* GET Activities by ID,  */}
          <p className="font-bold">
            This section will display the events with a dropdown with all
            the extras
          </p>
          <p>No fetch for now, but needed for :</p>
          <p> - events section </p>
          <p> - pings dates</p>
        </div>
      </div>
    </Modal>
  );
}
