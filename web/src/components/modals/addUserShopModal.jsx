import React, { useState, useEffect } from "react";
import { useIntl, FormattedMessage } from "react-intl";
import { v4 as uuidv4 } from "uuid";
import { format } from "date-fns";
import { Store } from "lucide-react";
import { useForm } from "react-hook-form";
import { Modal } from "./modal";
import handleFetch from "../handleFetch";
import Shops from "../contents/shops";

export default function addUserShopModal({
  UpdateModalOpen,
  UpdateModalSetOpen,
  shop,
  fetchShops,
}) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm();

  const [users, setUsers] = useState([]);
  const [responseMessage, setResponseMessage] = useState("");
  const [isErrorMessage, setIsErrorMessage] = useState(false);

  const intl = useIntl();

  const selectLocation = intl.formatMessage({
    id: "addUserShopModal.selectUser",
    defaultMessage: "Select an User :",
  });
  const submit = intl.formatMessage({
    id: "addUserShopModal.submit",
    defaultMessage: "Add a User to the Shop",
  });

  // Fetch locations from the API
  useEffect(() => {
    const fetchShops = async () => {
      try {
        const data = await handleFetch("http://127.0.0.1:5000/api/user");
        if (data) {
          const filteredUsers = data.filter(
            (user) => !shop.users.some((shopUser) => shopUser.id === user.id)
          );
          setUsers(filteredUsers);
        }
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    };

    fetchShops();
  }, []);

  const onPostSubmit = async (data) => {
    try {
      const url = `http://localhost:5000/api/user/${data.user_id}/shop/${shop.id}`;
      const response = await handleFetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        setResponseMessage(response.message);
        setIsErrorMessage(false);
      } else {
        fetchShops();
        reset();
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  return (
    <Modal open={UpdateModalOpen} onClose={UpdateModalSetOpen}>
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
            value={shop.name}
            readOnly
            className="p-2 text-gray-500 border border-gray-300 rounded focus:outline-none focus:border-AshinBlue transition"
          />

          {/* Company Selection */}
          {UserSelect(register, errors, users)}

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

function UserSelect(register, errors, users) {
  return (
    <>
      <select
        id="user_id"
        {...register("user_id", { required: true })}
        className="p-2 border border-gray-300 rounded focus:outline-none focus:border-AshinBlue transition"
      >
        <option value="">
          {" "}
          <FormattedMessage
            id="addUserShopModal.selectUser"
            defaultMessage="Select an User :"
          />
        </option>
        {/* For SELECT * FROM COMPANIES */}
        {users.map((user) => (
          <option key={user.id} value={user.id}>
            {user.email}
          </option>
        ))}
      </select>
      {errors.user_id && (
        <span className="text-red-500 mt-1">
          <FormattedMessage
            id="addUserShopModal.selectUser"
            defaultMessage="Select an User"
          />
        </span>
      )}
    </>
  );
}
