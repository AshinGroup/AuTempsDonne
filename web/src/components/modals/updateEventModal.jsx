import React, { useState, useEffect } from "react";
import { useIntl, FormattedMessage } from "react-intl";
import { SquarePen } from "lucide-react";
import { format } from "date-fns";

import { useForm } from "react-hook-form";
import { Modal } from "./modal";

export default function UpdateCourseModal({
  UpdateModalOpen,
  UpdateModalSetOpen,
  event,
  fetchUsers,
}) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      name: event.name,
      description: event.description,
      datetime: event.datetime,
      capacity: event.capacity,
      place: event.place,
    },
  });

  const [types, setTypes] = useState([]);
  const [group, setGroup] = useState(event.group);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [responseMessage, setResponseMessage] = useState("");
  const [isErrorMessage, setIsErrorMessage] = useState(false);

  const intl = useIntl();

  const titlePlaceholder = intl.formatMessage({
    id: "EventModal.titlePlaceholder",
    defaultMessage: "Title of the Event",
  });

  const titleRequired = intl.formatMessage({
    id: "EventModal.titleRequired",
    defaultMessage: "Title is required.",
  });

  const descriptionPlaceholder = intl.formatMessage({
    id: "EventModal.descriptionPlaceholder",
    defaultMessage: "Description of my Event",
  });

  const descriptionRequired = intl.formatMessage({
    id: "EventModal.descriptionRequired",
    defaultMessage: "Description is required.",
  });

  const descriptionMax = intl.formatMessage({
    id: "EventModal.descriptionMax",
    defaultMessage: "Description must be less than 200 characters.",
  });

  const dateTimeRequired = intl.formatMessage({
    id: "EventModal.dateTimeRequired",
    defaultMessage: "Date & Time is required.",
  });

  const slotPlaceholder = intl.formatMessage({
    id: "EventModal.slotPlaceholder",
    defaultMessage: "Number of slots",
  });

  const slotRequired = intl.formatMessage({
    id: "EventModal.slotRequired",
    defaultMessage: "Number of slots is required (1 to 100).",
  });

  const locationPlaceholder = intl.formatMessage({
    id: "EventModal.locationPlaceholder",
    defaultMessage: "Location",
  });

  const locationRequired = intl.formatMessage({
    id: "EventModal.locationRequired",
    defaultMessage: "Location is required.",
  });

  const locationPattern = intl.formatMessage({
    id: "EventModal.locationPattern",
    defaultMessage: "Example: 10 rue des petits écuries",
  });

  const updateEvent = intl.formatMessage({
    id: "EventModal.updateEvent",
    defaultMessage: "Update Event",
  });

  useEffect(() => {
    console.log(event.type.id);
    fetch("http://127.0.0.1:5000/api/type")
      .then((response) => response.json())
      .then((fetchedTypes) => {
        setTypes(fetchedTypes);
        setSelectedTypes([event.type.id]);
      })
      .catch((error) => console.error("Error fetching types:", error));
  }, [event.type]);

  // Register in the Hook
  useEffect(() => {
    register("type_id");
  }, [register]);

  useEffect(() => {
    register("group");
  }, [register]);

  // Change the status and set the value in the form
  const toggleGroup = (newGroup) => {
    setGroup(newGroup);
    setValue("group", newGroup);
  };

  // Change the type and set the value in the form
  const toggleTypesSelection = (roleId) => {
    setSelectedTypes([roleId]);
    // Minimum 1 role
    // if (selectedTypes.length === 1 && selectedTypes.includes(roleId)) {
    //   return;
    // }
    // const currentIndex = selectedTypes.indexOf(roleId);
    // const newSelectedTypes = [...selectedTypes];
    // if (currentIndex === -1) {
    //   newSelectedTypes.push(roleId);
    // } else {
    //   newSelectedTypes.splice(currentIndex, 1);
    // }
    // setSelectedTypes(newSelectedTypes);
  };

  // POST
  const onPostSubmit = async (data) => {
    try {
      console.log(data);
      data.datetime = format(new Date(data.datetime), "yyyy-MM-dd HH:mm:ss");
      data.type_id = selectedTypes[0];
      data.group = group;
      let response = await fetch(
        `http://localhost:5000/api/event/${event.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...data }),
        }
      );

      const newEvent = await response.json();

      if (!response.ok) {
        setResponseMessage(newEvent.message);
        setIsErrorMessage(false);
      } else {
        setResponseMessage(newEvent.message);
        setIsErrorMessage(true);
      }

      fetchUsers();
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  return (
    <Modal open={UpdateModalOpen} onClose={UpdateModalSetOpen}>
      <div className="text-center mt-5 w-full ">
        <SquarePen size={40} className="mx-auto text-AshinBlue" />
        <p
          className={` my-2 font-medium ${
            isErrorMessage ? "text-green-500" : "text-red-500"
          }`}
        >
          {responseMessage}
        </p>

        <form
          onSubmit={handleSubmit(onPostSubmit)}
          className="flex flex-col gap-4 w-96 mx-auto mt-4"
        >
          {/* Title Selection  */}
          <input
            type="text"
            placeholder={titlePlaceholder}
            {...register("name", {
              required: titleRequired,
            })}
            className="p-2 border border-gray-300 rounded focus:outline-none focus:border-AshinBlue transition"
          />
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}
          {/* Description */}
          <textarea
            placeholder={descriptionPlaceholder}
            {...register("description", {
              required: descriptionRequired,
              maxLength: {
                value: 200,
                message: descriptionMax,
              },
            })}
            className="p-2 border border-gray-300 rounded focus:outline-none focus:border-AshinBlue transition"
            rows="4"
          ></textarea>
          {errors.description && (
            <p className="text-red-500">{errors.description.message}</p>
          )}

          {errors.description && (
            <p className="text-red-500">{errors.description.message}</p>
          )}
          {/* Date & Time Selection */}
          <input
            type="datetime-local"
            {...register("datetime", {
              required: dateTimeRequired,
            })}
            min={(() => {
              const now = new Date();
              const year = now.getFullYear();
              const month = now.getMonth() + 1;
              const day = now.getDate();
              const hours = now.getHours();
              const minutes = now.getMinutes();

              const formattedMonth = month < 10 ? `0${month}` : month;
              const formattedDay = day < 10 ? `0${day}` : day;
              const formattedHours = hours < 10 ? `0${hours}` : hours;
              const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

              return `${year}-${formattedMonth}-${formattedDay}T${formattedHours}:${formattedMinutes}`;
            })()}
            className="p-2 border border-gray-300 rounded focus:outline-none focus:border-AshinBlue transition"
          />
          {errors.datetime && (
            <p className="text-red-500">{errors.datetime.message}</p>
          )}
          {/* Max Slots Selection */}
          <input
            type="number"
            placeholder={slotPlaceholder}
            {...register("capacity", {
              required: slotRequired,
              min: {
                value: 1,
                message: slotRequired,
              },
              max: {
                value: 100,
                message: slotRequired,
              },
            })}
            className="p-2 border border-gray-300 rounded focus:outline-none focus:border-AshinBlue transition"
          />
          {errors.capacity && (
            <p className="text-red-500">{errors.capacity.message}</p>
          )}
          {/* Location selection */}
          <input
            type="text"
            placeholder={locationPlaceholder}
            {...register("place", {
              required: locationRequired,
              pattern: {
                value: /^[A-Za-z0-9\s]+$/,
                message: locationPattern,
              },
            })}
            className="p-2 border border-gray-300 rounded focus:outline-none focus:border-AshinBlue transition"
          />
          {errors.place && (
            <p className="text-red-500">{errors.place.message}</p>
          )}
          {/* Group selection */}
          <div>
            <label className="font-bold text-gray-500">
              {" "}
              <FormattedMessage id="event.group" defaultMessage="Group" />:
            </label>
            <div className="flex flex-wrap gap-2 my-3 justify-center">
              <button
                type="button"
                onClick={() => toggleGroup(1)}
                className={`px-4 mx-1 py-1 border ${
                  group === 1
                    ? "bg-gradient-to-tr from-blue-300 to-blue-600 border-blue-700 bg-blue-500 text-white"
                    : "border-gray-300 bg-gray-200 text-gray-400"
                } rounded-full transition focus:outline-none`}
              >
                <FormattedMessage
                  id="event.activity"
                  defaultMessage="Activity"
                />
              </button>
              <button
                type="button"
                onClick={() => toggleGroup(2)}
                className={`px-4 mx-1 py-1 border ${
                  group === 2
                    ? "bg-gradient-to-tr from-yellow-300 to-yellow-600 border-yellow-700 bg-yellow-500 text-white"
                    : "border-gray-300 bg-gray-200 text-gray-400"
                } rounded-full transition focus:outline-none`}
              >
                <FormattedMessage id="event.course" defaultMessage="Course" />
              </button>
              <button
                type="button"
                onClick={() => toggleGroup(3)}
                className={`px-4 mx-1 border ${
                  group === 3
                    ? "bg-gradient-to-tr from-orange-300 to-orange-600 border-orange-700 bg-orange-500 text-white"
                    : "border-gray-300 bg-gray-200 text-gray-400"
                } rounded-full transition focus:outline-none`}
              >
                <FormattedMessage id="event.service" defaultMessage="Service" />
              </button>
            </div>
          </div>
          {/* Roles Pills */}
          <div>
            <label className="font-bold text-gray-500">
              <FormattedMessage id="Event.type" defaultMessage="Type" />:
            </label>
            <div className="flex flex-wrap gap-2 my-3 justify-center">
              {types.map((type) => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => toggleTypesSelection(type.id)}
                  className={`px-4 py-1 border transition-all ${
                    selectedTypes.includes(type.id)
                      ? "border-white bg-AshinBlue text-white"
                      : "border-gray-300 bg-gray-200 text-gray-400"
                  } rounded-full focus:outline-none`}
                >
                  {type.name}
                </button>
              ))}
            </div>
          </div>
          {errors.types && (
            <p className="text-red-500">{errors.types.message}</p>
          )}

          {/* Submit Selection */}
          <input
            type="submit"
            value={updateEvent}
            className="bg-AshinBlue text-white px-4 py-2 rounded hover:opacity-90 transition"
          />
        </form>
      </div>
    </Modal>
  );
}
