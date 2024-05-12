import React, { useEffect, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { UserPlusIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { Modal } from "../modals/modal";
import handleFetch from "../handleFetch";

export default function AddUserModal({
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

  const [roles, setRoles] = useState([]);
  const [status, setStatus] = useState(0);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [responseMessage, setResponseMessage] = useState("");
  const [isErrorMessage, setIsErrorMessage] = useState(false);

  const intl = useIntl();
  const env_path = process.env.REACT_APP_API_PATH;

  const emailPlaceholder = intl.formatMessage({
    id: "addUserModal.email",
    defaultMessage: "Email",
  });

  const emailRequired = intl.formatMessage({
    id: "addUserModal.emailRequired",
    defaultMessage: "Email is required.",
  });
  const emailValid = intl.formatMessage({
    id: "addUserModal.emailValid",
    defaultMessage: "Please enter a valid email address.",
  });

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
    id: "addUserModal.password",
    defaultMessage: "Password",
  });
  const passwordRequired = intl.formatMessage({
    id: "addUserModal.passwordRequired",
    defaultMessage: "Password is required.",
  });
  const passwordValidPattern = intl.formatMessage({
    id: "addUserModal.passwordValidPattern",
    defaultMessage:
      "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character.",
  });
  const passwordValidLength = intl.formatMessage({
    id: "addUserModal.passwordValidLength",
    defaultMessage: "Password must be at least 8 characters.",
  });

  const addUser = intl.formatMessage({
    id: "addUserModal.addUser",
    defaultMessage: "Add User",
  });

  // Get the roles for the pills and set default role
  useEffect(() => {
    const env_path = process.env.REACT_APP_API_PATH;
    const fetchRoles = async () => {
      try {
        const data = await handleFetch(`${env_path}/role`);
        if (data && data.length > 0) {
          setRoles(data);
          setSelectedRoles([data[0].id]);
        }
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };

    fetchRoles();
  }, []);
  // Register in the Hook
  useEffect(() => {
    register("status");
  }, [register]);

  useEffect(() => {
    register("roles");
  }, [register]);

  // Change the status and set the value in the form
  const toggleStatus = (newStatus) => {
    setStatus(newStatus);
    setValue("status", newStatus);
  };

  // Change the roles and set the value in the form
  const toggleRoleSelection = (roleId) => {
    // Minimum 1 role
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

  // POST
  const onPostSubmit = async (data) => {
    const firstRoleId = selectedRoles[0];
    const additionalRoleIds = selectedRoles.slice(1);

    try {
      // First Request
      const newUserResponse = await handleFetch(`${env_path}/user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          role_id: firstRoleId,
          status: status,
        }),
      });

      if (!newUserResponse.ok) {
        setResponseMessage(newUserResponse.message);
        setIsErrorMessage(false);
        return;
      }

      const newUser = newUserResponse.user;

      // Request for each role
      for (const roleId of additionalRoleIds) {
        const response = await handleFetch(
          `${env_path}/user/${newUser.user_id}/role/${roleId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Problem assigning role ${roleId} to user`);
        }
      }

      fetchUsers();
      reset();

      setResponseMessage(newUserResponse.message);
      setIsErrorMessage(true);
    } catch (error) {
      setResponseMessage("The user already exist.");
      setIsErrorMessage(false);
    }
  };

  return (
    <Modal open={AddModalOpen} onClose={AddModalSetOpen}>
      <div className="text-center w-full ">
        <UserPlusIcon size={40} className="mx-auto text-AshinBlue" />
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
          {/* Email Selection  */}
          <input
            type="email"
            placeholder={emailPlaceholder}
            {...register("email", {
              required: emailRequired,
              pattern: {
                value: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                message: emailValid,
              },
            })}
            className="p-2 border border-gray-300 rounded focus:outline-none focus:border-AshinBlue transition"
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
                value: /^\d{6,}$/,
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
              required: passwordRequired,
              minLength: {
                value: 8,
                message: passwordValidLength,
              },
              pattern: {
                value:
                  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/,
                message: passwordValidPattern,
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
              {" "}
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
                  key={role.id}
                  type="button"
                  onClick={() => toggleRoleSelection(role.id)}
                  className={`px-4 py-1 border transition-all ${
                    selectedRoles.includes(role.id)
                      ? "border-white bg-AshinBlue text-white"
                      : "border-gray-300 bg-gray-200 text-gray-400"
                  } rounded-full focus:outline-none`}
                >
                  {role.name}
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
            value={addUser}
            className="bg-AshinBlue text-white px-4 py-2 rounded hover:opacity-90 transition"
          />
        </form>
      </div>
    </Modal>
  );
}
