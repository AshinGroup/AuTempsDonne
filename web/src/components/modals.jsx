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

export function Modal({ open, onClose, children }) {
  return (
    <div
      onClick={onClose}
      className={`fixed inset-0 flex justify-center items-center transition-colors ${
        open ? "visible bg-black/40" : "invisible"
      }`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`bg-white rounded-xl shadow p-8 transition-all ${
          open ? "scale-100 opacity-100" : "scale-125 opacity-0"
        }`}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 p-1 rounded-lg text-gray-400 bg-white hover:bg-gray-50 hover:text-gray-600"
        >
          <X />
        </button>
        {children}
      </div>
    </div>
  );
}

export function DeleteModal({ open, onClose, fetchUsers }) {
  return (
    <Modal open={open} onClose={onClose}>
      <div className="text-center w-64">
        <Trash2 size={40} className="mx-auto text-red-500" />
        <div className="mx-auto my-4 w-48">
          <h3 className="text-lg font-back text-gray-800">
            <FormattedMessage
              id="deleteModal.confirmDelete"
              defaultMessage="Confirm Delete"
            />
          </h3>
          <p className="text-sm text-gray-500">
            <FormattedMessage
              id="deleteModal.confirmDeleteMessage"
              defaultMessage="Are you sure you want to delete this user ?"
            />
          </p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={fetchUsers}
            className="w-full py-2 border border-red-400 rounded transition-all hover:text-red-600"
          >
            <FormattedMessage id="deleteModal.delete" defaultMessage="Delete" />
          </button>
          <button
            onClick={onClose}
            className="w-full py-2 border border-AshinBlue rounded transition-all hover:text-AshinBlue"
          >
            <FormattedMessage id="deleteModal.cancel" defaultMessage="Cancel" />
          </button>
        </div>
      </div>
    </Modal>
  );
}

export function AddUserModal({ AddModalOpen, AddModalSetOpen, fetchUsers }) {
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
    fetch("http://127.0.0.1:5000/role")
      .then((response) => response.json())
      .then((data) => {
        setRoles(data);
        if (data && data.length > 0) {
          setSelectedRoles([data[0].role_id]);
        }
      })
      .catch((error) => console.error("Error fetching roles:", error));
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

    // First Request
    try {
      let response = await fetch("http://localhost:5000/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...data, role_id: firstRoleId, status: status }),
      });

      const newUser = await response.json();

      if (!response.ok) {
        setResponseMessage(newUser.message);
        setIsErrorMessage(false);
      } else {
        setResponseMessage(newUser.message);
        setIsErrorMessage(true);
      }

      // Request for each role
      if (newUser.user_id) {
        for (const roleId of additionalRoleIds) {
          response = await fetch(
            `http://localhost:5000/user/${newUser.user_id}/role/${roleId}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          if (!response.ok)
            throw new Error(`Problem assigning role ${roleId} to user`);
        }

        fetchUsers();
        reset();
      }
    } catch (error) {
      console.error("An error occurred:", error);
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
                  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
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
            value={addUser}
            className="bg-AshinBlue text-white px-4 py-2 rounded hover:opacity-90 transition"
          />
        </form>
      </div>
    </Modal>
  );
}

export function UpdateUserModal({
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

export function PlanningUserModal({
  PlanningModalOpen,
  PlanningModalSetOpen,
  user,
  expanded,
}) {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentDay, setCurrentDay] = useState(new Date().getDate());

  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const daysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (month, year) => new Date(year, month, 0).getDay();

  const prevMonth = () => {
    setCurrentMonth((prev) => (prev === 0 ? 11 : prev - 1));
    if (currentMonth === 0) {
      setCurrentYear(currentYear - 1);
    }
  };
  const nextMonth = () => {
    setCurrentMonth((prev) => (prev === 11 ? 0 : prev + 1));
    if (currentMonth === 11) {
      setCurrentYear(currentYear + 1);
    }
  };
  const monthToString = (month) => {
    const date = new Date();
    date.setMonth(month);
    let monthName = date.toLocaleString("en-US", { month: "long" });
    monthName = monthName.charAt(0).toUpperCase() + monthName.slice(1);
    return monthName;
  };
  const handleDayClick = (day) => {
    setCurrentDay(day);
  };

  return (
    <Modal open={PlanningModalOpen} onClose={PlanningModalSetOpen}>
      {/* Main Div */}
      <div className={`${expanded ? "flex" : ""} mt-5`}>
        {/* Calendar */}
        <div className="flex flex-col items-center justify-center p-5 bg-white rounded-lg shadow">
          {/* Select Month */}
          <div className="flex items-center justify-center w-full mb-6">
            <button
              className="text-gray-600 hover:text-gray-800"
              onClick={prevMonth}
            >
              <ChevronLeft size={25} />
            </button>
            <span className="text-lg text-gray-800 mx-5 font-semibold">
              {monthToString(currentMonth)} {currentYear}
            </span>
            <button
              className="text-gray-600 hover:text-gray-800"
              onClick={nextMonth}
            >
              <ChevronRight size={25} />
            </button>
          </div>

          {/* Days of Week */}
          <div className="grid grid-cols-7 gap-4 text-center w-full">
            {daysOfWeek.map((day) => (
              <div key={day} className="font-semibold text-sm">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-4 text-center w-full border-2 p-2 mt-1 border-AshinBlue rounded ">
            {/* Empty slots */}
            {Array.from(
              { length: firstDayOfMonth(currentMonth, currentYear) },
              (_, i) => (
                <div key={`empty-${i}`} className="py-1"></div>
              )
            )}
            {/* Month Pills */}
            {Array.from(
              { length: daysInMonth(currentMonth, currentYear) },
              (_, day) => (
                <div
                  key={`${day}`}
                  className={`py-1 flex flex-row justify-center ${
                    day === currentDay - 1 ? "bg-AshinBlue text-white" : ""
                  } hover:bg-blue-200 hover:text-white cursor-pointer rounded`}
                  onClick={() => handleDayClick(day + 1)}
                >
                  {day + 1}
                  {[1, 2, 16, 20, 11].includes(day) && (
                    <MessageCircleWarning
                      className="text-yellow-600"
                      size={15}
                    />
                  )}
                </div>
              )
            )}
          </div>
        </div>
        {/* Day Information of the User */}
        <div className={`bg-gray-200 ${expanded ? "h-[60vh] w-[70vh]" : ""}`}>
          {/* GET Activities by ID,  */}
          <p className="font-bold">
            This section will display the activities with a dropdown with all
            the extras
          </p>
          <p>No fetch for now, but needed for :</p>
          <p> - activities section </p>
          <p> - pings dates</p>
        </div>
      </div>
    </Modal>
  );
}
