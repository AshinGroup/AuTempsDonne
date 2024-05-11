import React, { useEffect, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { UserRoundCog } from "lucide-react";
import { useForm } from "react-hook-form";
import { Modal } from "../modals/modal";
import handleFetch from "../handleFetch";

export default function UpdateUserModal({
  UpdateModalOpen,
  UpdateModalSetOpen,
  user,
  fetchUsers,
}) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      phone: user.phone,
      password: "",
      role_id: user.roles[0].id,
      status: user.status,
    },
  });

  const [responseMessage, setResponseMessage] = useState("");
  const [isErrorMessage, setIsErrorMessage] = useState(false);
  const env_path = process.env.REACT_APP_API_PATH;

  const intl = useIntl();

  const firstNamePlaceholder = intl.formatMessage({
    id: "addUserModal.firstName",
    defaultMessage: "First Name",
  });
  const firstNameRequired = intl.formatMessage({
    id: "addUserModal.firstNameRequired",
    defaultMessage: "First Name is required.",
  });
  const firstNameValidPattern = intl.formatMessage({
    id: "addUserModal.firstNameValidPattern",
    defaultMessage: "First Name should contain characters only.",
  });
  const firstNameValidLength = intl.formatMessage({
    id: "addUserModal.firstNameValidPattern",
    defaultMessage: "First Name must be less than 30 characters.",
  });

  const lastNamePlaceholder = intl.formatMessage({
    id: "addUserModal.lastName",
    defaultMessage: "Last Name",
  });
  const lastNameRequired = intl.formatMessage({
    id: "addUserModal.lastNameRequired",
    defaultMessage: "Last Name is required.",
  });
  const lastNameValidPattern = intl.formatMessage({
    id: "addUserModal.lastNameValidPattern",
    defaultMessage: "Last Name should contain characters only.",
  });
  const lastNameValidLength = intl.formatMessage({
    id: "addUserModal.lastNameValidPattern",
    defaultMessage: "Last Name must be less than 30 characters.",
  });

  const phonePlaceholder = intl.formatMessage({
    id: "addUserModal.phone",
    defaultMessage: "+123456789",
  });
  const phoneRequired = intl.formatMessage({
    id: "addUserModal.phoneRequired",
    defaultMessage: "Phone is required.",
  });
  const phoneValidPattern = intl.formatMessage({
    id: "addUserModal.phoneValidPattern",
    defaultMessage:
      "Phone should be in international format and contain at least 6 numbers.",
  });

  const modifyUser = intl.formatMessage({
    id: "modifyUserModal.modifyUser",
    defaultMessage: "Modify User",
  });

  const onPutSubmit = async (data) => {
    try {
      if (data.password === "") {
        delete data.password;
      }
      delete data.role_id;

      const response = await handleFetch(`${env_path}/user/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
        }),
      });

      const req = await response;

      if (!response) {
        setResponseMessage(req.message);
        setIsErrorMessage(false);
      } else {
        setResponseMessage(req.message);
        setIsErrorMessage(true);
        fetchUsers();
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  return (
    <Modal open={UpdateModalOpen} onClose={UpdateModalSetOpen}>
      <div className="text-center w-full ">
        <UserRoundCog size={40} className="mx-auto text-AshinBlue" />
        <p className="text-center text-AshinBlue my-2">
          {" "}
          <FormattedMessage
            id="updateProfileModal.disclaimer"
            defaultMessage="If you want to change your roles, please contact the support."
          />
        </p>
        <p
          className={` my-2 font-medium ${
            isErrorMessage ? "text-green-500" : "text-red-500"
          }`}
        >
          {responseMessage}
        </p>

        <form
          onSubmit={handleSubmit(onPutSubmit)}
          className="flex flex-col gap-4 w-96 mx-auto mt-4"
        >
          {/* Email Selection  */}
          <input
            type="email"
            {...register("email", {})}
            className="p-2 border border-AshinBlue text-gray-400 focus:outline-none rounded"
            readOnly
          />
          {errors.email && (
            <p className="text-red-500">{errors.email.message}</p>
          )}
          {/*First Name and Last Name  */}
          <input
            type="text"
            placeholder={firstNamePlaceholder}
            {...register("first_name", {
              required: firstNameRequired,
              pattern: {
                value:
                  /^(?=[a-zA-ZÀ-ÿ\u4e00-\u9fa5]{1,50}$)[a-zA-ZÀ-ÿ\u4e00-\u9fa5'-]+(?: [a-zA-ZÀ-ÿ\u4e00-\u9fa5'-]+)*$/,
                message: firstNameValidPattern,
              },
              maxLength: {
                value: 30,
                message: firstNameValidLength,
              },
            })}
            className="p-2 border border-gray-300 rounded focus:outline-none focus:border-AshinBlue transition"
          />
          {errors.first_name && (
            <p className="text-red-500">{errors.first_name.message}</p>
          )}
          <input
            type="text"
            placeholder={lastNamePlaceholder}
            {...register("last_name", {
              required: lastNameRequired,
              pattern: {
                value:
                  /^(?=[a-zA-ZÀ-ÿ\u4e00-\u9fa5]{1,50}$)[a-zA-ZÀ-ÿ\u4e00-\u9fa5'-]+(?: [a-zA-ZÀ-ÿ\u4e00-\u9fa5'-]+)*$/,
                message: lastNameValidPattern,
              },
              maxLength: {
                value: 30,
                message: lastNameValidLength,
              },
            })}
            className="p-2 border border-gray-300 rounded focus:outline-none focus:border-AshinBlue transition"
          />
          {errors.last_name && (
            <p className="text-red-500">{errors.last_name.message}</p>
          )}
          {/* Tel Selection */}
          <input
            type="tel"
            placeholder={phonePlaceholder}
            {...register("phone", {
              required: phoneRequired,
              pattern: {
                value: /^\+?\d{6,}$/,
                message: phoneValidPattern,
              },
            })}
            className="p-2 border border-gray-300 rounded focus:outline-none focus:border-AshinBlue transition"
          />
          {errors.phone && (
            <p className="text-red-500">{errors.phone.message}</p>
          )}

          {/* Submit Selection */}
          <input
            type="submit"
            value={modifyUser}
            className="bg-AshinBlue text-white px-4 py-2 rounded hover:opacity-90 transition"
          />
        </form>
      </div>
    </Modal>
  );
}
