import React, { useState, useEffect } from "react";
import { useIntl, FormattedMessage } from "react-intl";
import { v4 as uuidv4 } from "uuid";
import { format } from "date-fns";
import { PackagePlus } from "lucide-react";
import { useForm } from "react-hook-form";
import { Modal } from "./modal";
import handleFetch from "../handleFetch";

export default function AddPackageModal({
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

  const [categories, setCategories] = useState([]);
  const [foods, setFoods] = useState([]);
  const [storages, setStorages] = useState([]);
  const [responseMessage, setResponseMessage] = useState("");
  const [isErrorMessage, setIsErrorMessage] = useState(false);
  const [foodSwitch, setFoodSwitch] = useState(true);

  const intl = useIntl();

  const env_path = process.env.REACT_APP_API_PATH;

  const submit = intl.formatMessage({
    id: "addStockModal.submit",
    defaultMessage: "Add a Package",
  });
  const selectFood = intl.formatMessage({
    id: "addStockModal.selectFood",
    defaultMessage: "Add a Food",
  });
  const CreateFood = intl.formatMessage({
    id: "addStockModal.CreateFood",
    defaultMessage: "Create a Food",
  });
  const weightPlaceholder = intl.formatMessage({
    id: "addStockModal.weightPlaceholder",
    defaultMessage: "Weight of the Package (in KG)",
  });
  const weightRequired = intl.formatMessage({
    id: "addStockModal.weightRequired",
    defaultMessage: "Weight is Required",
  });
  const descriptionPlaceholder = intl.formatMessage({
    id: "addStockModal.descriptionPlaceholder",
    defaultMessage: "Description of the Package",
  });
  const descriptionRequired = intl.formatMessage({
    id: "addStockModal.descriptionRequired",
    defaultMessage: "Description is Required",
  });
  const expirationRequired = intl.formatMessage({
    id: "addStockModal.expirationRequired",
    defaultMessage: "Expiration_Date is Required is Required",
  });

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

  // Fetch foods from the API
  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const data = await handleFetch(`${env_path}/food`);
        if (data) {
          setFoods(data);
        }
      } catch (error) {
        console.error("Error fetching foods:", error);
      }
    };

    fetchFoods();
  }, []);

  // Fetch categories from the API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await handleFetch(`${env_path}/category`);
        if (data) {
          setCategories(data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // POST
  const onPostSubmit = async (data) => {
    try {
      if (!foodSwitch) {
        const newFood = await handleFetch(`${env_path}/food`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: data.food_name,
            description: data.food_description,
            category_id: data.category_id,
          }),
        });

        if (!newFood) {
          setResponseMessage(newFood.message);
          setIsErrorMessage(false);
        }
        data.food_id = newFood.food_id;
      }

      data.expiration_date = format(
        new Date(data.expiration_date),
        "yyyy-MM-dd HH:mm:ss"
      );

      const newPackage = await handleFetch(`${env_path}/package`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          weight: data.weight,
          description: data.description,
          expiration_date: data.expiration_date,
          storage_id: data.storage_id,
          food_id: data.food_id,
        }),
      });

      if (!newPackage) {
        setResponseMessage(newPackage.message);
        setIsErrorMessage(false);
      } else {
        setResponseMessage(newPackage.message);
        setIsErrorMessage(true);
      }

      fetchUsers();
      reset();
    } catch (error) {
      console.error("An error occurred:", error);
      setResponseMessage("An error occurred while adding the package.");
      setIsErrorMessage(true);
    }
  };

  return (
    <Modal open={AddModalOpen} onClose={AddModalSetOpen}>
      <div className="text-center mt-5 w-full ">
        <PackagePlus size={40} className="mx-auto text-AshinBlue" />
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
          {/* Storage Selection */}
          {StorageSelect(register, errors, storages)}
          {/* Food Selection */}
          <ToggleSwitch
            leftLabel={selectFood}
            rightLabel={CreateFood}
            itemSwitch={foodSwitch}
            setItemSwitch={setFoodSwitch}
          />
          {foodSwitch
            ? FoodSelect(register, errors, foods)
            : FoodForm(register, errors, categories)}
          {/* Weight Selection */}
          <input
            type="number"
            placeholder={weightPlaceholder}
            {...register("weight", {
              required: weightRequired,
            })}
            step="any"
            className="p-2 border border-gray-300 rounded focus:outline-none focus:border-AshinBlue transition"
          />
          {errors.weight && (
            <p className="text-red-500">{errors.weight.message}</p>
          )}
          {/* Description Selection  */}
          <textarea
            placeholder={descriptionPlaceholder}
            {...register("description", {
              required: descriptionRequired,
            })}
            className="p-2 border border-gray-300 rounded focus:outline-none focus:border-AshinBlue transition"
          />
          {errors.description && (
            <p className="text-red-500">{errors.description.message}</p>
          )}
          {/* Date & Time Selection */}
          <span className="self-start font-semibold">
            <FormattedMessage
              id="addStockModal.expirationDate"
              defaultMessage="Expiration Date :"
            />
          </span>
          <input
            type="datetime-local"
            {...register("expiration_date", {
              required: expirationRequired,
            })}
            className="px-2 pb-2 border border-gray-300 rounded focus:outline-none focus:border-AshinBlue transition"
          />
          {errors.expiration_date && (
            <p className="text-red-500">{errors.expiration_date.message}</p>
          )}

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

function FoodSelect(register, errors, foods) {
  return (
    <>
      <select
        id="food_id"
        {...register("food_id", { required: true })}
        className="p-2 border border-gray-300 rounded focus:outline-none focus:border-AshinBlue transition"
      >
        <option value="">
          {" "}
          <FormattedMessage
            id="addStockModal.selectFood"
            defaultMessage="Select a Food :"
          />
        </option>
        {/* For SELECT * FROM COMPANIES */}
        {foods.map((food) => (
          <option key={food.id} value={food.id}>
            {food.name}
          </option>
        ))}
      </select>
      {errors.food_id && (
        <span className="text-red-500 mt-1">
          <FormattedMessage
            id="addStockModal.selectFood"
            defaultMessage="Select a Food"
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
        id="storage_id"
        {...register("storage_id", { required: true })}
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
          <option key={storage.id} value={storage.id}>
            {storage.name}, {storage.warehouse.name},{" "}
            {storage.warehouse.location.address},{" "}
            {storage.warehouse.location.zip_code}
          </option>
        ))}
      </select>
      {errors.storage_id && (
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

function ToggleSwitch({ leftLabel, rightLabel, itemSwitch, setItemSwitch }) {
  const handleToggle = () => {
    setItemSwitch(!itemSwitch);
  };
  const uniqueId = uuidv4();

  return (
    <div className="toggle-switch self-center relative w-3/4 inline-block align-middle select-none text-left">
      <input
        type="checkbox"
        className="toggle-switch-checkbox hidden"
        checked={itemSwitch}
        onChange={handleToggle}
        id={uniqueId}
      />
      <label
        className=" block overflow-hidden border rounded-full"
        htmlFor={uniqueId}
      >
        <span
          className={`block float-left w-1/2 p-2 text-white text-center font-semibold  ${
            itemSwitch ? "bg-sky-500" : "bg-gray-400"
          }`}
        >
          {leftLabel}
        </span>
        <span
          className={`block float-left w-1/2 p-2 text-white text-center font-semibold ${
            itemSwitch ? "bg-gray-400" : "bg-sky-500"
          }`}
        >
          {rightLabel}
        </span>
      </label>
    </div>
  );
}

function FoodForm(register, errors, categories) {
  const Foodintl = useIntl();

  const FoodName = Foodintl.formatMessage({
    id: "addStockModal.FoodName",
    defaultMessage: "Food Name",
  });
  const FoodNameRequired = Foodintl.formatMessage({
    id: "addStockModal.FoodNameRequired",
    defaultMessage: "Food Name is Required",
  });
  const FoodDescription = Foodintl.formatMessage({
    id: "addStockModal.FoodDescription",
    defaultMessage: "Food Description",
  });
  const FoodDescriptionRequired = Foodintl.formatMessage({
    id: "addStockModal.FoodDescriptionRequired",
    defaultMessage: "Food Description is Required",
  });
  const FoodDescriptionLength = Foodintl.formatMessage({
    id: "addStockModal.FoodDescriptionLength",
    defaultMessage: "Food Description is too long (100 max)",
  });

  return (
    <div className="bg-AshinBlue flex flex-col p-2 border rounded">
      <input
        type="text"
        placeholder={FoodName}
        {...register("food_name", {
          required: FoodNameRequired,
        })}
        className="p-2 my-1 border border-gray-300 rounded focus:outline-none focus:border-AshinBlue transition"
      />
      {errors.food_name && (
        <p className="text-red-500">{errors.food_name.message}</p>
      )}
      {/* Description */}
      <textarea
        placeholder={FoodDescription}
        {...register("food_description", {
          required: FoodDescriptionRequired,
          maxLength: {
            value: 100,
            message: FoodDescriptionLength,
          },
        })}
        maxLength={100}
        className="p-2 my-1 border border-gray-300 rounded focus:outline-none focus:border-AshinBlue transition"
      />
      {errors.food_description && (
        <p className="text-red-500">{errors.food_description.message}</p>
      )}
      {/* Category */}
      <select
        id="category_id"
        {...register("category_id", { required: true })}
        className="p-2 my-1 border border-gray-300 rounded focus:outline-none focus:border-AshinBlue transition"
      >
        <option value="">
          {" "}
          <FormattedMessage
            id="addStockModal.selectCategory"
            defaultMessage="Select a Category :"
          />
        </option>
        {/* For SELECT * FROM CATEGORIES */}
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>
    </div>
  );
}
