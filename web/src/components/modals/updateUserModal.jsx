import React, { useEffect, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import {
  X,
  Trash2,
  UserPlusIcon,
  UserRoundCog,
  ChevronLeft,
  ChevronRight,
  MessageCircleWarning,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { Modal } from "../modals/modal";

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
    },
  });

  const [roles, setRoles] = useState([]);
  const [status, setStatus] = useState(user.status);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [responseMessage, setResponseMessage] = useState("");
  const [isErrorMessage, setIsErrorMessage] = useState(false);

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

  const passwordPlaceholder = intl.formatMessage({
    id: "modifyUserModal.password",
    defaultMessage: "Password (leave empty to keep the same)",
  });
  const passwordValidPattern = intl.formatMessage({
    id: "addUserModal.passwordValidPattern",
    defaultMessage:
      "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character.",
  });

  const modifyUser = intl.formatMessage({
    id: "modifyUserModal.modifyUser",
    defaultMessage: "Modify User",
  });

  useEffect(() => {
    fetch("http://127.0.0.1:5000/role")
      .then((response) => response.json())
      .then((fetchedRoles) => {
        setRoles(fetchedRoles);
        const defaultSelectedRoles = user.role
          .map((userRole) => userRole.role_id)
          .filter((roleId) =>
            fetchedRoles.some((fetchedRole) => fetchedRole.role_id === roleId)
          );
        setSelectedRoles(defaultSelectedRoles);
      })
      .catch((error) => console.error("Error fetching roles:", error));
  }, [user.role]);

  useEffect(() => {
    register("status");
  }, [register]);

  useEffect(() => {
    register("roles");
  }, [register]);

  const toggleStatus = (newStatus) => {
    setStatus(newStatus);
    setValue("status", newStatus); // Update form value
  };

  const toggleRoleSelection = (roleId) => {
    if (selectedRoles.length === 1 && selectedRoles.includes(roleId)) {
      return;
    }

    const currentIndex = selectedRoles.indexOf(roleId);
    const newSelectedRoles = [...selectedRoles];

    if (currentIndex === -1) {
      newSelectedRoles.push(roleId);
    } else {
      newSelectedRoles.splice(currentIndex, 1);
    }

    setSelectedRoles(newSelectedRoles);
  };

  const onPutSubmit = async (data) => {
    try {
      if (data.password === "") {
        delete data["password"];
      }

      data["status"] = status;

      let response = await fetch(`http://localhost:5000/user/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
        }),
      });

      const req = await response.json();

      if (!response.ok) {
        setResponseMessage(req.message);
        setIsErrorMessage(false);
      } else {
        setResponseMessage(req.message);
        setIsErrorMessage(true);
      }
      const userInitialRoles = user.role.map((userRole) => userRole.role_id);

      for (const selectedRole of selectedRoles) {
        if (!userInitialRoles.includes(selectedRole)) {
          await fetch(
            `http://localhost:5000/user/${user.id}/role/${selectedRole}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
        }
      }

      for (const userInitialRole of userInitialRoles) {
        if (!selectedRoles.includes(userInitialRole)) {
          await fetch(
            `http://localhost:5000/user/${user.id}/role/${userInitialRole}`,
            {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
        }
      }

      fetchUsers();
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  return (
    <Modal open={UpdateModalOpen} onClose={UpdateModalSetOpen}>
      <div className="text-center w-full ">
        <UserRoundCog size={40} className="mx-auto text-AshinBlue" />
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
            className="p-2 border border-AshinBlue text-gray-800 focus:outline-none rounded"
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
                value: /^[A-Za-z]+$/,
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
                value: /^[A-Za-z]+$/,
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
          {/* Password Selection */}
          <input
            type="password"
            placeholder={passwordPlaceholder}
            {...register("password", {
              validate: {
                custom: (value) =>
                  value === "" ||
                  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
                    value
                  ) ||
                  passwordValidPattern,
              },
            })}
            className="p-2 border border-gray-300 rounded focus:outline-none focus:border-AshinBlue transition"
          />
          {errors.password && (
            <p className="text-red-500">{errors.password.message}</p>
          )}
          {/* Status selection */}
          <div>
            <label className="font-bold text-gray-500">
              <FormattedMessage
                id="addUserModal.status"
                defaultMessage="Status"
              />
              :
            </label>
            <div className="flex flex-wrap gap-2 my-3 justify-center">
              <button
                type="button"
                onClick={() => toggleStatus(1)}
                className={`px-4 mx-1 py-1 border ${
                  status === 1
                    ? "border-green-600 bg-green-500 text-white"
                    : "border-gray-300 bg-gray-200 text-gray-400"
                } rounded-full transition focus:outline-none`}
              >
                <FormattedMessage
                  id="addUserModal.active"
                  defaultMessage="Active"
                />
              </button>
              <button
                type="button"
                onClick={() => toggleStatus(0)}
                className={`px-4 mx-1 py-1 border ${
                  status === 0
                    ? "border-red-700 bg-red-500 text-white"
                    : "border-gray-300 bg-gray-200 text-gray-400"
                } rounded-full transition focus:outline-none`}
              >
                <FormattedMessage
                  id="addUserModal.inactive"
                  defaultMessage="Inactive"
                />
              </button>
            </div>
          </div>

          {/* Roles Pills */}
          <div>
            <label className="font-bold text-gray-500">
              <FormattedMessage
                id="addUserModal.roles"
                defaultMessage="Roles"
              />
              :
            </label>
            <div className="flex flex-wrap gap-2 my-3 justify-center">
              {roles.map((role) => (
                <button
                  key={role.role_id}
                  type="button"
                  onClick={() => toggleRoleSelection(role.role_id)}
                  className={`px-4 py-1 border transition-all ${
                    selectedRoles.includes(role.role_id)
                      ? "border-white bg-AshinBlue text-white"
                      : "border-gray-300 bg-gray-200 text-gray-400"
                  } rounded-full focus:outline-none`}
                >
                  {role.role_name}
                </button>
              ))}
            </div>
          </div>
          {errors.roles && (
            <p className="text-red-500">{errors.roles.message}</p>
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
