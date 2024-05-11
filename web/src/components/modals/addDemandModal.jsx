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
  shopData,
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

  const env_path = process.env.REACT_APP_API_PATH;

  const submit = intl.formatMessage({
    id: "addDemandModal.submit",
    defaultMessage: "Add a Demand",
  });
  const addInfoPlaceholder = intl.formatMessage({
    id: "addDemandModal.addInfoPlaceholder",
    defaultMessage: "Additional Informations ..",
  });

  // Fetch locations from the API
  useEffect(() => {
    const fetchShops = async () => {
      try {
        const data = await handleFetch(`${env_path}/shop`);
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
        const data = await handleFetch(`${env_path}/food`);
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
    if (selectedFood.length === 0) {
      setResponseMessage(
        <FormattedMessage
          id="addCollectModal.oneFood"
          defaultMessage="Please select at least one food"
        />
      );
      setIsErrorMessage(false);
      return;
    }
    try {
      const newEvent = await handleFetch(`${env_path}/demand`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: 0,
          shop_id: data.shop_id,
          additional:
            data.additional_info == "" ? "null" : data.additional_info,
          limit_datetime: `${data.date} 23:59:59`,
          packages: selectedFood.map((food) => ({
            food_id: food.id,
            weight: food.weight,
            expiration_date: food.expirationDate,
          })),
        }),
      });

      if (!newEvent) {
        setResponseMessage(newEvent.message);
        setIsErrorMessage(false);
      } else {
        console.log("DATATATATA:", data);
        const putEvent = await handleFetch(
          `${env_path}/demand/${newEvent.demand_id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              submitted_datetime: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
              limit_datetime: `${data.date} 23:59:59`,
              status: 0,
              shop_id: data.shop_id,
              additional: data.additional_info,
              qr_code: newEvent.qr_code,
              pdf: newEvent.pdf,
            }),
          }
        );

        if (!putEvent) {
          setResponseMessage(putEvent.message);
          setIsErrorMessage(false);
        } else {
          setResponseMessage(putEvent.message);
          setIsErrorMessage(true);
        }

        fetchUsers();
        setSelectedFood([]);
        reset();
      }
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
          {/* Shop Selection */}
          {ShopSelect(register, errors, shops, shopData)}
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
              required: intl.formatMessage({
                id: "addDemandModal.date_required",
                defaultMessage: "The date is required.",
              }),
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
          {/* Additional Info */}
          <textarea
            {...register("additional_info")}
            placeholder={addInfoPlaceholder}
            className="p-2 border border-gray-300 rounded focus:outline-none focus:border-AshinBlue transition"
          />

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

function ShopSelect(register, errors, shops, shopData) {
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
        {shopData ? (
          <option value={shopData.id}>
            {shopData.name}, {shopData.company?.name},{" "}
            {shopData.location?.address}, {shopData.location?.zip_code}
          </option>
        ) : (
          shops.map((shop) => (
            <option key={shop.id} value={shop.id}>
              {shop.name}, {shop.company?.name}, {shop.location?.address},{" "}
              {shop.location?.zip_code}
            </option>
          ))
        )}
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

function FoodManager({ foods, selectedFood, setSelectedFood }) {
  const env_path = process.env.REACT_APP_API_PATH;
  const [selectedFoodId, setSelectedFoodId] = useState("");
  const [foodWeight, setFoodWeight] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [manualEntry, setManualEntry] = useState(false);
  const [manualFoodName, setManualFoodName] = useState("");

  const [message, setMessage] = useState("");

  const intl = useIntl();

  const foodWeightPlaceholder = intl.formatMessage({
    id: "addDemandModal.weightPlaceholder",
    defaultMessage: "Food Weight",
  });
  const enterFoodName = intl.formatMessage({
    id: "addDemandModal.enterFoodName",
    defaultMessage: "Enter Food Name",
  });

  const handleAddFood = async () => {
    let foodName = manualFoodName;
    let food_id = selectedFoodId;

    if (!manualEntry) {
      const selectedFoodObject = foods.find(
        (food) => food.id == selectedFoodId
      );
      foodName = selectedFoodObject?.name;
    } else {
      // Créer un nouvel aliment via API en mode entrée manuelle
      const data = await handleFetch(`${env_path}/food`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: foodName,
          description: "generated via demands",
          category_id: 1,
        }),
      });

      if (!data.food_id) {
        setMessage("Failed to create food");
        return;
      }

      food_id = data.food_id;
    }

    if (foodName && foodWeight && expirationDate) {
      const newFood = {
        id: food_id,
        name: foodName,
        weight: foodWeight,
        expirationDate: expirationDate,
      };

      setSelectedFood([...selectedFood, newFood]);

      // Reset fields
      setSelectedFoodId("");
      setManualFoodName("");
      setFoodWeight("");
      setExpirationDate("");
      setMessage("");
      console.log(selectedFood);
    } else {
      setMessage(
        <FormattedMessage
          id="addCollectModal.errorFill"
          defaultMessage="Please fill in all fields"
        />
      );
    }
  };

  return (
    <>
      <div className="p-2 bg-AshinBlue-light border-0 w-96 rounded flex flex-col">
        <span className="text-red-500 font-semibold">{message}</span>
        <label
          htmlFor="toggleManual"
          className="flex items-center justify-center cursor-pointer"
        >
          <div className="relative">
            <input
              id="toggleManual"
              type="checkbox"
              className="sr-only"
              onChange={() => setManualEntry(!manualEntry)}
              checked={manualEntry}
            />
            <div
              className={`block  ${
                manualEntry ? "bg-blue-600" : "bg-gray-600"
              } w-14 h-8 rounded-full`}
            ></div>
            <div
              className={`dot absolute ${
                manualEntry ? "right-1" : "left-1"
              } top-1 bg-white w-6 h-6 rounded-full transition`}
            ></div>
          </div>
          <div className="ml-3 text-sm font-medium">
            {manualEntry ? (
              <FormattedMessage
                id="addDemandModal.manualEntry"
                defaultMessage="Manual Entry"
              />
            ) : (
              <FormattedMessage
                id="addDemandModal.selectFood"
                defaultMessage="Select a Food"
              />
            )}
          </div>
        </label>

        {manualEntry ? (
          <input
            type="text"
            value={manualFoodName}
            placeholder={enterFoodName}
            onChange={(e) => setManualFoodName(e.target.value)}
            className="p-2 my-2 border border-gray-300 rounded focus:outline-none focus:border-AshinBlue transition"
          />
        ) : (
          <select
            value={selectedFoodId}
            onChange={(e) => setSelectedFoodId(e.target.value)}
            className="p-2 my-2 border border-gray-300 rounded focus:outline-none focus:border-AshinBlue transition"
          >
            <option value="">
              {" "}
              <FormattedMessage
                id="addDemandModal.selectFood"
                defaultMessage="Select a Food"
              />
            </option>
            {foods.map((food) => (
              <option key={food.id} value={food.id}>
                {food.name}
              </option>
            ))}
          </select>
        )}

        <input
          type="number"
          value={foodWeight}
          placeholder={foodWeightPlaceholder}
          onChange={(e) => setFoodWeight(e.target.value)}
          className="p-2 my-1 border border-gray-300 rounded focus:outline-none focus:border-AshinBlue transition"
        />
        <span className="mt-1 self-start font-semibold">
          {" "}
          <FormattedMessage
            id="addDemandModal.expirationDate"
            defaultMessage="Expiration Date:"
          />
        </span>
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
          <FormattedMessage
            id="addDemandModal.addFood"
            defaultMessage="Add a Food"
          />
        </button>
      </div>
    </>
  );
}
