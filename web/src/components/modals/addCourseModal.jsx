import React, { useState } from "react";
import { useIntl } from "react-intl";
import { GraduationCap } from "lucide-react";
import { useForm } from "react-hook-form";
import { Modal } from "../modals/modal";

export default function AddCourseModal({
  AddModalOpen,
  AddModalSetOpen,
  fetchUsers,
}) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm();

  const [responseMessage, setResponseMessage] = useState("");
  const [isErrorMessage, setIsErrorMessage] = useState(false);

  const intl = useIntl();

  const titlePlaceholder = intl.formatMessage({
    id: "addCourseModal.titlePlaceholder",
    defaultMessage: "Title of the course",
  });

  const titleRequired = intl.formatMessage({
    id: "addCourseModal.titleRequired",
    defaultMessage: "Title is required.",
  });

  const descriptionPlaceholder = intl.formatMessage({
    id: "addCourseModal.descriptionPlaceholder",
    defaultMessage: "Description of my course",
  });

  const descriptionRequired = intl.formatMessage({
    id: "addCourseModal.descriptionRequired",
    defaultMessage: "Description is required.",
  });

  const descriptionMax = intl.formatMessage({
    id: "addCourseModal.descriptionMax",
    defaultMessage: "Description must be less than 200 characters.",
  });

  const dateTimeRequired = intl.formatMessage({
    id: "addCourseModal.dateTimeRequired",
    defaultMessage: "Date & Time is required.",
  });

  const slotPlaceholder = intl.formatMessage({
    id: "addCourseModal.slotPlaceholder",
    defaultMessage: "Number of slots",
  });

  const slotRequired = intl.formatMessage({
    id: "addCourseModal.slotRequired",
    defaultMessage: "Number of slots is required (1 to 100).",
  });

  const locationPlaceholder = intl.formatMessage({
    id: "addCourseModal.locationPlaceholder",
    defaultMessage: "Location",
  });

  const locationRequired = intl.formatMessage({
    id: "addCourseModal.locationRequired",
    defaultMessage: "Location is required.",
  });

  const locationPattern = intl.formatMessage({
    id: "addCourseModal.locationPattern",
    defaultMessage: "Example: 10 rue des petits écuries",
  });

  const addCourse = intl.formatMessage({
    id: "addCourseModal.addCourse",
    defaultMessage: "Add Course",
  });

  // POST
  const onPostSubmit = async (data) => {
    try {
      //   let response = await fetch("http://localhost:5000/user", {
      //     method: "POST",
      //     headers: {
      //       "Content-Type": "application/json",
      //     },
      //     body: JSON.stringify({ ...data, role_id: firstRoleId, status: status }),
      //   });

      //   const newUser = await response.json();

      //   if (!response.ok) {
      //     setResponseMessage(newUser.message);
      //     setIsErrorMessage(false);
      //   } else {
      //     setResponseMessage(newUser.message);
      //     setIsErrorMessage(true);
      //   }

      fetchUsers();
      reset();
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  return (
    <Modal open={AddModalOpen} onClose={AddModalSetOpen}>
      <div className="text-center w-full ">
        <GraduationCap size={40} className="mx-auto text-AshinBlue" />
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
            {...register("title", {
              required: titleRequired,
            })}
            className="p-2 border border-gray-300 rounded focus:outline-none focus:border-AshinBlue transition"
          />
          {errors.title && (
            <p className="text-red-500">{errors.title.message}</p>
          )}
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
            {...register("slot", {
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
          {errors.slot && <p className="text-red-500">{errors.slot.message}</p>}
          {/* Location selection */}
          <input
            type="text"
            placeholder={locationPlaceholder}
            {...register("location", {
              required: locationRequired,
              pattern: {
                value: /^[A-Za-z0-9\s]+$/,
                message: locationPattern,
              },
            })}
            className="p-2 border border-gray-300 rounded focus:outline-none focus:border-AshinBlue transition"
          />
          {errors.location && (
            <p className="text-red-500">{errors.location.message}</p>
          )}

          {/* Submit Selection */}
          <input
            type="submit"
            value={addCourse}
            className="bg-AshinBlue text-white px-4 py-2 rounded hover:opacity-90 transition"
          />
        </form>
      </div>
    </Modal>
  );
}
