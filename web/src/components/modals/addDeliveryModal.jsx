import React, { useState, useEffect } from "react";
import { useIntl, FormattedMessage } from "react-intl";
import { v4 as uuidv4 } from "uuid";
import { format, set } from "date-fns";
import { PackageOpen, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { Modal } from "./modal";
import handleFetch from "../handleFetch";

export default function AddDeliveryModal({
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

  const [storages, setStorages] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [locations, setLocations] = useState([]);
  const [packages, setPackages] = useState([]);

  const [selectedLocation, setSelectedLocation] = useState([]);
  const [selectedPackages, setSelectedPackages] = useState([]);

  const [responseMessage, setResponseMessage] = useState("");
  const [isErrorMessage, setIsErrorMessage] = useState(false);

  const intl = useIntl();

  const submit = intl.formatMessage({
    id: "addLocationModal.submit",
    defaultMessage: "Add a Location",
  });
  const date_required = intl.formatMessage({
    id: "addDemandModal.date_required",
    defaultMessage: "The date is required ..",
  });

  const env_path = process.env.REACT_APP_API_PATH;

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

  // Fetch packages from the API
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const data = await handleFetch(`${env_path}/package`);
        if (data) {
          setPackages(data);
        }
      } catch (error) {
        console.error("Error fetching packages:", error);
      }
    };

    fetchPackages();
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

  // Fetch locations from the API
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const data = await handleFetch(`${env_path}/location`);
        if (data) {
          setLocations(data);
        }
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    };

    fetchLocations();
  }, []);

  const handleRemoveFood = (locationId) => {
    const updatedFoods = selectedLocation.filter(
      (location) => location.id !== locationId
    );
    setSelectedLocation(updatedFoods);
  };

  const handleRemovePackage = (packageID) => {
    const updatedPackages = selectedPackages.filter(
      (pack) => pack.id !== packageID
    );
    setSelectedPackages(updatedPackages);
  };

  const onPostSubmit = async (data) => {
    if (selectedLocation.length === 0) {
      setResponseMessage(
        <FormattedMessage
          id="addCollectModal.oneLocation"
          defaultMessage="Please select at least one Location"
        />
      );
      setIsErrorMessage(false);
      return;
    }
    if (selectedPackages.length === 0) {
      setResponseMessage(
        <FormattedMessage
          id="addCollectModal.onePackage"
          defaultMessage="Please select at least one Package"
        />
      );
      setIsErrorMessage(false);
      return;
    }
    try {
      const newEvent = await handleFetch(`${env_path}/delivery`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          datetime: `${data.date} 23:59:59`,
          status: 0,
          locations: [
            parseInt(data.storage_location_id),
            ...selectedLocation.map((location) => parseInt(location.id)),
          ],
          packages: selectedPackages.map((pack) => parseInt(pack.id)),
          vehicle_id: data.vehicle_id,
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
      setSelectedLocation([]);
      setSelectedPackages([]);
      reset();
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  return (
    <Modal open={AddModalOpen} onClose={AddModalSetOpen}>
      <div className="text-center mt-5 w-full ">
        <PackageOpen size={40} className="mx-auto text-AshinBlue" />
        <p
          className={` my-2 font-medium ${
            isErrorMessage ? "text-green-500" : "text-red-500"
          }`}
        >
          {responseMessage}
        </p>
        {/* Location Selection */}
        {LocationManager({ locations, selectedLocation, setSelectedLocation })}
        <div className="opacity-0 text-xs">Hisshiden</div>
        {/* Location Selection */}
        {PackageManager({ packages, selectedPackages, setSelectedPackages })}
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
              id="addLocationModal.date"
              defaultMessage="Day of The Collect :"
            />
          </label>
          <input
            type="date"
            {...register("date", {
              required: "date_is_required ...",
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
          {/*  Locations  */}
          <div className="p-2 bg-AshinBlue-dark border-0 rounded">
            {selectedLocation.map((location) => (
              <div
                key={location.id}
                className="flex justify-between p-2 text-white font-semibold"
              >
                <span>
                  {location.id} - {location.address}, {location.zip_code}{" "}
                  {location.city}
                </span>
                <span>{location.expiration_date}</span>
                <button
                  className="hover:scale-110"
                  onClick={() => handleRemoveFood(location.id)}
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>
          {/*  Packages  */}
          <div className="p-2 bg-AshinBlue-light border-0 rounded">
            {selectedPackages.map((pack) => (
              <div
                key={pack.id}
                className="flex justify-between p-2 text-white font-semibold"
              >
                {pack.id} - {pack.food_name}, {pack.weight}kg{" expires - "}
                {pack.expiration_date}
                <button
                  className="hover:scale-110"
                  onClick={() => handleRemovePackage(pack.id)}
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
        id="storage_location_id"
        {...register("storage_location_id", { required: true })}
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
          <option key={storage.id} value={storage.warehouse.location.id}>
            {storage.name}, {storage.warehouse.name},{" "}
            {storage.warehouse.location.address},{" "}
            {storage.warehouse.location.zip_code}
          </option>
        ))}
      </select>
      {errors.storage_location_id && (
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

function LocationManager({ locations, selectedLocation, setSelectedLocation }) {
  const [selectedLocationId, setSelectedLocationId] = useState("");
  const [selectedLocationIds, setSelectedLocationIds] = useState([]);

  const [message, setMessage] = useState("");

  const selectedLocationObject = locations.find(
    (location) => location.id == selectedLocationId
  );

  const handleAddLocation = () => {
    if (selectedLocationId) {
      const newLocation = {
        id: selectedLocationId,
        address: selectedLocationObject.address,
        zip_code: selectedLocationObject.zip_code,
        city: selectedLocationObject.city,
      };

      setSelectedLocation([...selectedLocation, newLocation]);

      // Reset fields
      setSelectedLocationId("");
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
    setSelectedLocationIds(
      selectedLocation.map((location) => parseInt(location.id))
    );
  }, [selectedLocation]);

  return (
    <>
      <div className="p-2 bg-AshinBlue-dark border-0 w-96 rounded flex flex-col">
        <span className="text-red-500 font-semibold">{message}</span>

        <select
          value={selectedLocationId}
          onChange={(e) => setSelectedLocationId(e.target.value)}
          className="p-2 my-2 border border-gray-300 rounded focus:outline-none focus:border-AshinBlue transition"
        >
          <option value="">
            <FormattedMessage
              id="addDeliveryModal.selectLocation"
              defaultMessage="Select a Location"
            />
          </option>
          {locations
            .filter((location) => {
              const isExcluded = selectedLocationIds.includes(location.id);
              return !isExcluded;
            })
            .map((location) => (
              <option key={location.id} value={location.id}>
                {location.id} - {location.address}, {location.zip_code}{" "}
                {location.city}
              </option>
            ))}
        </select>
        <button
          onClick={handleAddLocation}
          className="bg-AshinBlue text-white px-4 py-2 rounded hover:opacity-90 transition"
        >
          <FormattedMessage
            id="addDeliveryModal.addLocation"
            defaultMessage="Add a Location"
          />
        </button>
      </div>
    </>
  );
}

function PackageManager({ packages, selectedPackages, setSelectedPackages }) {
  const [selectedPackagesId, setSelectedPackagesId] = useState("");
  const [selectedPackagesIds, setSelectedPackagesIds] = useState([]);

  const [message, setMessage] = useState("");

  const selectedPackagesObject = packages.find(
    (location) => location.id == selectedPackagesId
  );

  const handleAddPackage = () => {
    if (selectedPackagesId) {
      const newPackage = {
        id: selectedPackagesId,
        food_name: selectedPackagesObject.food.name,
        weight: selectedPackagesObject.weight,
        expiration_date: formatDate(selectedPackagesObject.expiration_date),
      };

      setSelectedPackages([...selectedPackages, newPackage]);

      // Reset fields
      setSelectedPackagesId("");
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
    setSelectedPackagesIds(
      selectedPackages.map((location) => parseInt(location.id))
    );
  }, [selectedPackages]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    let day = date.getDate().toString().padStart(2, "0");
    let month = (date.getMonth() + 1).toString().padStart(2, "0"); // Month is zero-based
    let year = date.getFullYear().toString().substr(-2); // Get last two digits

    return `${day}-${month}-${year}`;
  };

  return (
    <>
      <div className="p-2 bg-AshinBlue-light border-0 w-96 rounded flex flex-col">
        <span className="text-red-500 font-semibold">{message}</span>

        <select
          value={selectedPackagesId}
          onChange={(e) => setSelectedPackagesId(e.target.value)}
          className="p-2 my-2 border border-gray-300 rounded focus:outline-none focus:border-AshinBlue transition"
        >
          <option value="">
            <FormattedMessage
              id="addDeliveryModal.selectPackage"
              defaultMessage="Select the Package"
            />
          </option>
          {packages
            .filter((pack) => {
              const isExcluded = selectedPackagesIds.includes(pack.id);
              return !isExcluded;
            })
            .map((pack) => (
              <option key={pack.id} value={pack.id}>
                {pack.id} - {pack.food.name}, {pack.weight}kg
                {"  -  expires at "}
                {formatDate(pack.expiration_date)}
              </option>
            ))}
        </select>
        <button
          onClick={handleAddPackage}
          className="bg-AshinBlue text-white px-4 py-2 rounded hover:opacity-90 transition"
        >
          <FormattedMessage
            id="addDeliveryModal.selectPackage"
            defaultMessage="Select a Package"
          />
        </button>
      </div>
    </>
  );
}
