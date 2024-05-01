import React, { useState, useEffect } from "react";
import { useIntl, FormattedMessage } from "react-intl";
import { v4 as uuidv4 } from "uuid";
import { format } from "date-fns";
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

  const [shops, setShops] = useState([]);
  const [foods, setFoods] = useState([]);

  const [selectedFood, setSelectedFood] = useState([]);

  const [responseMessage, setResponseMessage] = useState("");
  const [isErrorMessage, setIsErrorMessage] = useState(false);

  const intl = useIntl();

  const demandNamePlaceholder = intl.formatMessage({
    id: "addDemandModal.demandNamePlaceholder",
    defaultMessage: "Demand Name",
  });
  const demandNameRequired = intl.formatMessage({
    id: "addDemandModal.demandNameRequired",
    defaultMessage: "Name of the demand required",
  });
  const submit = intl.formatMessage({
    id: "addDemandModal.submit",
    defaultMessage: "Add a Demand",
  });

  // Fetch locations from the API
  useEffect(() => {
    const fetchShops = async () => {
      try {
        const data = await handleFetch("http://127.0.0.1:5000/api/shop");
        if (data) {
          setShops(data);
        }
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    };

    fetchShops();
  }, []);

  // Fetch foods from the API
  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const data = await handleFetch("http://127.0.0.1:5000/api/food");
        if (data) {
          setFoods(data);
        }
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    };

    fetchFoods();
  }, []);

  const handleRemoveFood = (foodId) => {
    const updatedFoods = selectedFood.filter((food) => food.id !== foodId);
    setSelectedFood(updatedFoods);
  };

  const onPostSubmit = async (data) => {
    try {
      if (!companySwitch) {
        const newCompany = await handleFetch(
          "http://localhost:5000/api/company",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: data.company_name,
              description: data.company_description,
            }),
          }
        );

        if (!newCompany.ok) {
          setResponseMessage(newCompany.message);
          setIsErrorMessage(false);
        }
        data.company_id = newCompany.company_id;
      }

      if (!locationSwitch) {
        const newLocation = await handleFetch(
          "http://localhost:5000/api/location",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              address: data.location_address,
              zip_code: data.location_zip,
              city: data.location_city,
              country: data.location_country,
            }),
          }
        );

        if (!newLocation.ok) {
          setResponseMessage(newLocation.message);
          setIsErrorMessage(false);
        }
        data.location_id = newLocation.location_id;
      }

      const newEvent = await handleFetch("http://localhost:5000/api/shop", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          company_id: data.company_id,
          location_id: data.location_id,
        }),
      });

      if (!newEvent.ok) {
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
        <ShoppingBasket size={40} className="mx-auto text-AshinBlue" />
        <p
          className={` my-2 font-medium ${
            isErrorMessage ? "text-green-500" : "text-red-500"
          }`}
        >
          {responseMessage}
        </p>
        {/* Food Selection */}
        {FoodManager({ foods, selectedFood, setSelectedFood })}
        {/* Form */}
        <form
          onSubmit={handleSubmit(onPostSubmit)}
          className="flex flex-col gap-4 w-96 mx-auto mt-4"
        >
          {/* Shop Name Selection  */}
          <input
            type="text"
            placeholder={demandNamePlaceholder}
            {...register("name", {
              required: demandNameRequired,
            })}
            className="p-2 border border-gray-300 rounded focus:outline-none focus:border-AshinBlue transition"
          />
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}
          {/* Shop Selection */}
          {ShopSelect(register, errors, shops)}
          {/* Date Selection */}
          <label htmlFor="date" className="text-left">
            <FormattedMessage
              id="addDemandModal.date"
              defaultMessage="Limited Date :"
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
          {/*  Foods  */}
          <div className="p-2 bg-AshinBlue-dark border-0 rounded">
            {selectedFood.map((food) => (
              <div
                key={food.id}
                className="flex justify-between p-2 text-white font-semibold"
              >
                <span>
                  {food.name} - {food.weight}kg
                </span>
                <span>{food.expirationDate}</span>
                <button
                  className="transition-transform duration-200 ease-in-out transform hover:scale-110"
                  onClick={() => handleRemoveFood(food.id)}
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

function ShopSelect(register, errors, shops) {
  return (
    <>
      <select
        id="shop_id"
        {...register("shop_id", { required: true })}
        className="p-2 border border-gray-300 rounded focus:outline-none focus:border-AshinBlue transition"
      >
        <option value="">
          {" "}
          <FormattedMessage
            id="addDemandModal.selectShop"
            defaultMessage="Select a Shop :"
          />
        </option>
        {/* For SELECT * FROM shops */}
        {shops.map((shop) => (
          <option key={shop.id} value={shop.id}>
            {shop.name}, {shop.company?.name}, {shop.location?.address},{" "}
            {shop.location?.zip_code}
          </option>
        ))}
      </select>
      {errors.shop_id && (
        <span className="text-red-500 mt-1">
          <FormattedMessage
            id="addDemandModal.selectShop"
            defaultMessage="Select a Shop :"
          />
        </span>
      )}
    </>
  );
}

// ADD A TOGGLE SWITCH FOR THE FOODS SELECTION / CAN DELETE A FOOD SELECTION
function FoodManager({ foods, selectedFood, setSelectedFood }) {
  const [selectedFoodId, setSelectedFoodId] = useState("");
  const [foodWeight, setFoodWeight] = useState("");
  const [expirationDate, setExpirationDate] = useState("");

  const handleAddFood = () => {
    // Find the food object with the selectedFoodId
    const selectedFoodObject = foods.find((food) => food.id == selectedFoodId);

    // Check if the food object is found and add it to the selectedFood list
    if (selectedFoodObject?.name && selectedFoodId && expirationDate) {
      const newFood = {
        id: selectedFoodId,
        name: selectedFoodObject.name, // Use the name of the selected food
        weight: foodWeight,
        expirationDate: expirationDate, // Add the expiration date if available
      };

      setSelectedFood([...selectedFood, newFood]);

      setSelectedFoodId("");
      setFoodWeight("");
      setExpirationDate("");
    }
  };

  return (
    <>
      <div className="p-2 bg-AshinBlue-light border-0 w-96 rounded flex flex-col">
        <select
          value={selectedFoodId}
          onChange={(e) => setSelectedFoodId(e.target.value)}
          className="p-2 my-1 border border-gray-300 rounded focus:outline-none focus:border-AshinBlue transition"
        >
          <option value="">Select Food</option>
          {foods.map((food) => (
            <option key={food.id} value={food.id}>
              {food.name}
            </option>
          ))}
        </select>
        <input
          type="number"
          value={foodWeight}
          placeholder="Food Weight"
          onChange={(e) => setFoodWeight(e.target.value)}
          className="p-2 my-1 border border-gray-300 rounded focus:outline-none focus:border-AshinBlue transition"
        />
        {/* Date & Time Selection */}
        <span className="mt-1 self-start font-semibold">Expiration Date :</span>
        <input
          type="datetime-local"
          value={expirationDate}
          onChange={(e) => setExpirationDate(e.target.value)}
          className="px-2 mb-1 pb-2 border border-gray-300 rounded focus:outline-none focus:border-AshinBlue transition"
        />
        <button
          onClick={handleAddFood}
          className="bg-AshinBlue text-white px-4 py-2 rounded hover:opacity-90 transition"
        >
          Add Food
        </button>
      </div>
    </>
  );
}
