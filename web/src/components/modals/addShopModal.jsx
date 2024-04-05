import React, { useState, useEffect } from "react";
import { useIntl, FormattedMessage } from "react-intl";
import { format } from "date-fns";
import { Store } from "lucide-react";
import { useForm } from "react-hook-form";
import { Modal } from "./modal";

export default function AddShopModal({
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

  const [locations, setLocations] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [responseMessage, setResponseMessage] = useState("");
  const [isErrorMessage, setIsErrorMessage] = useState(false);

  // const intl = useIntl();

  // const titlePlaceholder = intl.formatMessage({
  //   id: "EventModal.titlePlaceholder",
  //   defaultMessage: "Title of the event",
  // });

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/location")
      .then((response) => response.json())
      .then((data) => {
        setLocations(data);
      })
      .catch((error) => console.error("Error fetching locations:", error));
  }, []);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/company")
      .then((response) => response.json())
      .then((data) => {
        setCompanies(data);
      })
      .catch((error) => console.error("Error fetching locations:", error));
  }, []);

  // POST
  const onPostSubmit = async (data) => {
    try {
      data.datetime = format(new Date(data.datetime), "yyyy-MM-dd HH:mm:ss");
      data.type_id = selectedTypes[0];
      data.group = group;
      let response = await fetch("http://localhost:5000/api/event", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...data }),
      });

      const newEvent = await response.json();

      if (!response.ok) {
        setResponseMessage(newEvent.message);
        setIsErrorMessage(false);
      } else {
        setResponseMessage(newEvent.message);
        setIsErrorMessage(true);
      }

      fetchUsers();
      reset();
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  return (
    <Modal open={AddModalOpen} onClose={AddModalSetOpen}>
      <div className="text-center mt-5 w-full ">
        <Store size={40} className="mx-auto text-AshinBlue" />
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
          {/* Shop Name Selection  */}
          <input
            type="text"
            placeholder={"Name of the shop"}
            {...register("name", {
              required: "Name of the shop required",
            })}
            className="p-2 border border-gray-300 rounded focus:outline-none focus:border-AshinBlue transition"
          />
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}
          {/* Company Selection */}
            {CompanySelect(register)}
            {errors.company_id && (
  <p className="text-red-500 text-sm mt-1">
    Select a Company
  </p>
)}     
          {/* location Selection */}
        {LocationSelect(register)}
        {errors.location_id && (
          <p className="text-red-500 text-sm mt-1">
            Select a Location
          </p>
        )}         
          {/* Submit Selection */}
          <input
            type="submit"
            value={"Submit"}
            className="bg-AshinBlue text-white px-4 py-2 rounded hover:opacity-90 transition"
          />
        </form>
      </div>
    </Modal>
  );
}

function CompanySelect(register){
  return(

  <select
  id="company_id"
  {...register("company_id", { required: true })}
  className="p-2 border border-gray-300 rounded focus:outline-none focus:border-AshinBlue transition"
  >
  <option value="">
    Select a Company : 
  </option>
  {
    /* For SELECT * FROM COMPANIES */
  }
</select>
  )
}

function LocationSelect(register){
  return(
    <select
    id="location_id"
    {...register("location_id", { required: true })}
    className="p-2 border border-gray-300 rounded focus:outline-none focus:border-AshinBlue transition"
    >
    <option value="">
      Select a location : 
    </option>
    {
      /* For SELECT * FROM locations */
    }
  </select>
  )
}