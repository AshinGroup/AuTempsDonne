import React, { useState, useEffect } from "react";
import { useIntl, FormattedMessage } from "react-intl";
import { v4 as uuidv4 } from "uuid";
import { format, set } from "date-fns";
import { ShoppingBasket, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { Modal } from "./modal";
import handleFetch from "../handleFetch";

export default function AddDemandModal({
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

  const env_path = process.env.REACT_APP_API_PATH;

  const [storages, setStorages] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [demands, setDemands] = useState([]);

  const [selectedDemand, setSelectedDemand] = useState([]);

  const [responseMessage, setResponseMessage] = useState("");
  const [isErrorMessage, setIsErrorMessage] = useState(false);

  const intl = useIntl();

  const submit = intl.formatMessage({
    id: "addDemandModal.submit",
    defaultMessage: "Add a Demand",
  });

  // Fetch locations from the API
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const data = await handleFetch(`${env_path}/vehicle`);
        if (data) {
          setVehicles(data);
        }
      } catch (error) {
        console.error("Error fetching vehicles:", error);
      }
    };

    fetchVehicles();
  }, []);

  // Fetch storages from the API
  useEffect(() => {
    const fetchStorages = async () => {
      try {
        const data = await handleFetch(`${env_path}/storage`);
        if (data) {
          setStorages(data);
        }
      } catch (error) {
        console.error("Error fetching storages:", error);
      }
    };

    fetchStorages();
  }, []);

  // Fetch demands from the API
  useEffect(() => {
    const fetchDemands = async () => {
      try {
        const data = await handleFetch(`${env_path}/demand`);
        if (data) {
          setDemands(data);
        }
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    };

    fetchDemands();
  }, []);

  const handleRemoveFood = (demandId) => {
    const updatedFoods = selectedDemand.filter(
      (demand) => demand.id !== demandId
    );
    setSelectedDemand(updatedFoods);
  };

  const onPostSubmit = async (data) => {
    const [storage_id, storage_location_id] = data.storage.split("|");
    if (selectedDemand.length === 0) {
      setResponseMessage(
        <FormattedMessage
          id="addCollectModal.oneDemand"
          defaultMessage="Please select at least one demand"
        />
      );
      setIsErrorMessage(false);
      return;
    }
    try {
      const newEvent = await handleFetch(`${env_path}/collect`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          datetime: `${data.date} 23:59:59`,
          status: 0,
          demands: [
            parseInt(storage_location_id),
            ...selectedDemand.map((demand) => parseInt(demand.id)),
          ],
          vehicle_id: data.vehicle_id,
          storage_id: storage_id,
        }),
      });

      if (!newEvent) {
        setResponseMessage(newEvent.message);
        setIsErrorMessage(false);
      } else {
        setResponseMessage(newEvent.message);
        setIsErrorMessage(true);
      }

      fetchUsers();
      setSelectedDemand([]);
      reset();
    } catch (error) {
      console.error("An error occurred:", error);
      setResponseMessage(
        <FormattedMessage
          id="addCollectModal.error"
          defaultMessage="An error occurred, please contact a dev."
        />
      );
      setIsErrorMessage(false);
    }
  };

  return (
    <Modal open={AddModalOpen} onClose={AddModalSetOpen}>
      <div className="text-center mt-5 w-full ">
        <ShoppingBasket size={40} className="mx-auto text-AshinBlue" />
        <p
          className={` my-2 font-medium ${
            isErrorMessage ? "text-green-500" : "text-red-500"
          }`}
        >
          {responseMessage}
        </p>
        {/* Food Selection */}
        {DemandManager({ demands, selectedDemand, setSelectedDemand })}
        {/* Form */}
        <form
          onSubmit={handleSubmit(onPostSubmit)}
          className="flex flex-col gap-4 w-96 mx-auto mt-4"
        >
          {/* Storage Selection */}
          {StorageSelect(register, errors, storages)}
          {/* Vehicles Selection */}
          {VehicleSelect(register, errors, vehicles)}
          {/* Date Selection */}
          <label htmlFor="date" className="text-left">
            <FormattedMessage
              id="addDemandModal.date"
              defaultMessage="Day of The Collect :"
            />
          </label>
          <input
            type="date"
            {...register("date", {
              required: "Date required",
            })}
            min={(() => {
              const now = new Date();
              const year = now.getFullYear();
              const month = now.getMonth() + 1;
              const day = now.getDate();

              const formattedMonth = month < 10 ? `0${month}` : month;
              const formattedDay = day < 10 ? `0${day}` : day;

              return `${year}-${formattedMonth}-${formattedDay}`;
            })()}
            className="p-2 border border-gray-300 rounded focus:outline-none focus:border-AshinBlue transition"
          />
          {errors.date && <p className="text-red-500">{errors.date.message}</p>}
          {/*  Demands  */}
          <div className="p-2 bg-AshinBlue-dark border-0 rounded">
            {selectedDemand.map((demand) => (
              <div
                key={demand.id}
                className="flex justify-between p-2 text-white font-semibold"
              >
                <span>
                  {demand.id} - {demand.limit_datetime}, {demand.location}
                </span>
                <span>{demand.expirationDate}</span>
                <button
                  className="hover:scale-110"
                  onClick={() => handleRemoveFood(demand.id)}
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>
          {/* Submit Selection */}
          <input
            type="submit"
            value={submit}
            className="bg-AshinBlue text-white px-4 py-2 rounded hover:opacity-90 transition"
          />
        </form>
      </div>
    </Modal>
  );
}

function VehicleSelect(register, errors, vehicles) {
  return (
    <>
      <select
        id="vehicle_id"
        {...register("vehicle_id", { required: true })}
        className="p-2 border border-gray-300 rounded focus:outline-none focus:border-AshinBlue transition"
      >
        <option value="">
          {" "}
          <FormattedMessage
            id="addCollectModal.selectVehicle"
            defaultMessage="Select a Vehicle :"
          />
        </option>
        {/* For SELECT * FROM vehicles */}
        {vehicles.map((vehicle) => (
          <option key={vehicle.id} value={vehicle.id}>
            {vehicle.license_plate}, {vehicle.brand}
          </option>
        ))}
      </select>
      {errors.vehicle_id && (
        <span className="text-red-500 mt-1">
          <FormattedMessage
            id="addCollectModal.selectVehicle"
            defaultMessage="Select a Vehicle :"
          />
        </span>
      )}
    </>
  );
}

function StorageSelect(register, errors, storages) {
  return (
    <>
      <select
        id="storage"
        {...register("storage", { required: true })}
        className="p-2 border border-gray-300 rounded focus:outline-none focus:border-AshinBlue transition"
      >
        <option value="">
          {" "}
          <FormattedMessage
            id="addStockModal.selectStorage"
            defaultMessage="Select a Storage Location :"
          />
        </option>
        {/* For SELECT * FROM storages */}
        {storages.map((storage) => (
          <option
            key={storage.id}
            value={`${storage.id}|${storage.warehouse.location.id}`}
          >
            {storage.name}, {storage.warehouse.name},{" "}
            {storage.warehouse.location.address},{" "}
            {storage.warehouse.location.zip_code}
          </option>
        ))}
      </select>
      {errors.storage && (
        <span className="text-red-500 mt-1">
          <FormattedMessage
            id="addStockModal.selectStorage"
            defaultMessage="Select a Storage Location :"
          />
        </span>
      )}
    </>
  );
}

function DemandManager({ demands, selectedDemand, setSelectedDemand }) {
  const [selectedDemandId, setSelectedDemandId] = useState("");
  const [selectedDemandIds, setSelectedDemandIds] = useState([]);

  const [message, setMessage] = useState("");

  const selectedDemandObject = demands.find(
    (demand) => demand.id == selectedDemandId
  );

  const handleAddDemand = () => {
    if (selectedDemandId) {
      const newDemand = {
        id: selectedDemandId,
        limit_datetime: selectedDemandObject.limit_datetime,
        location: selectedDemandObject.shop.location.address,
      };

      setSelectedDemand([...selectedDemand, newDemand]);

      // Reset fields
      setSelectedDemandId("");
      setMessage("");
    } else {
      setMessage(
        <FormattedMessage
          id="addCollectModal.errorFill"
          defaultMessage="Please fill in all fields"
        />
      );
    }
  };

  useEffect(() => {
    setSelectedDemandIds(selectedDemand.map((demand) => parseInt(demand.id)));
  }, [selectedDemand]);

  return (
    <>
      <div className="p-2 bg-AshinBlue-light border-0 w-96 rounded flex flex-col">
        <span className="text-red-500 font-semibold">{message}</span>

        <select
          value={selectedDemandId}
          onChange={(e) => setSelectedDemandId(e.target.value)}
          className="p-2 my-2 border border-gray-300 rounded focus:outline-none focus:border-AshinBlue transition"
        >
          <option value="">
            <FormattedMessage
              id="addCollectModal.selectDemand"
              defaultMessage="Select a Demand"
            />
          </option>
          {demands
            .filter((demand) => {
              const isExcluded = selectedDemandIds.includes(demand.id);
              const hasNoCollectId = demand.collect === null;
              return !isExcluded && hasNoCollectId;
            })
            .map((demand) => (
              <option key={demand.id} value={demand.id}>
                {demand.id} - {demand.limit_datetime},{" "}
                {demand.shop.location.address}
              </option>
            ))}
        </select>
        <button
          onClick={handleAddDemand}
          className="bg-AshinBlue text-white px-4 py-2 rounded hover:opacity-90 transition"
        >
          <FormattedMessage
            id="addCollectModal.addDemand"
            defaultMessage="Add a Demand"
          />
        </button>
      </div>
    </>
  );
}
