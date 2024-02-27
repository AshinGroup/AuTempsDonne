import React, { useEffect, useState } from "react";
import { X, Trash2, UserPlusIcon, UserRoundCog, UserRound } from "lucide-react";
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
          <h3 className="text-lg font-back text-gray-800">Confirm Delete</h3>
          <p className="text-sm text-gray-500">
            Are you sure you want to delete this user?
          </p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={fetchUsers}
            className="w-full py-2 border border-red-400 rounded transition-all hover:text-red-600"
          >
            Delete
          </button>
          <button
            onClick={onClose}
            className="w-full py-2 border border-AshinBlue rounded transition-all hover:text-AshinBlue"
          >
            Cancel
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

        console.log("User created and roles assigned successfully");
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
            placeholder="Email"
            {...register("email", {
              required: "Email is required.",
              pattern: {
                value: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                message: "Please enter a valid email address.",
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
            placeholder="First Name"
            {...register("first_name", {
              required: "First Name is required.",
              pattern: {
                value: /^[A-Za-z]+$/,
                message: "First Name should contain characters only.",
              },
              maxLength: {
                value: 30,
                message: "First Name must be less than 30 characters.",
              },
            })}
            className="p-2 border border-gray-300 rounded focus:outline-none focus:border-AshinBlue transition"
          />
          {errors.first_name && (
            <p className="text-red-500">{errors.first_name.message}</p>
          )}
          <input
            type="text"
            placeholder="Last Name"
            {...register("last_name", {
              required: "Last Name is required.",
              pattern: {
                value: /^[A-Za-z]+$/,
                message: "Last Name should contain characters only.",
              },
              maxLength: {
                value: 30,
                message: "Last Name must be less than 30 characters.",
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
            placeholder="+1234567890"
            {...register("phone", {
              required: "Phone is required.",
              pattern: {
                value: /^\+\d{6,}$/,
                message:
                  "Phone should be in international format and contain at least 6 numbers.",
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
            placeholder="Password"
            {...register("password", {
              required: "Password is required.",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters.",
              },
              pattern: {
                value:
                  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                message:
                  "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character.",
              },
            })}
            className="p-2 border border-gray-300 rounded focus:outline-none focus:border-AshinBlue transition"
          />
          {errors.password && (
            <p className="text-red-500">{errors.password.message}</p>
          )}
          {/* Status selection */}
          <div>
            <label className="font-bold text-gray-500">Status:</label>
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
                Active
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
                Unactive
              </button>
            </div>
          </div>

          {/* Roles Pills */}
          <div>
            <label className="font-bold text-gray-500">Roles:</label>
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
            value="Add User"
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
      tel: user.tel,
    },
  });

  const [roles, setRoles] = useState([]);
  const [status, setStatus] = useState(user.status);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [responseMessage, setResponseMessage] = useState("");
  const [isErrorMessage, setIsErrorMessage] = useState(false);

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
    const firstRoleId = selectedRoles[0];

    try {
      let response = await fetch(`http://localhost:5000/user/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...data, role_id: firstRoleId, status: status }),
      });

      const req = await response.json();

      if (!response.ok) {
        setResponseMessage(req.message);
        setIsErrorMessage(false);
      } else {
        setResponseMessage(req.message);
        setIsErrorMessage(true);
      }
      console.log("User updated successfully");
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
            placeholder="First Name"
            {...register("first_name", {
              required: "First Name is required.",
              pattern: {
                value: /^[A-Za-z]+$/,
                message: "First Name should contain characters only.",
              },
              maxLength: {
                value: 30,
                message: "First Name must be less than 30 characters.",
              },
            })}
            className="p-2 border border-gray-300 rounded focus:outline-none focus:border-AshinBlue transition"
          />
          {errors.first_name && (
            <p className="text-red-500">{errors.first_name.message}</p>
          )}
          <input
            type="text"
            placeholder="Last Name"
            {...register("last_name", {
              required: "Last Name is required.",
              pattern: {
                value: /^[A-Za-z]+$/,
                message: "Last Name should contain characters only.",
              },
              maxLength: {
                value: 30,
                message: "Last Name must be less than 30 characters.",
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
            placeholder="+1234567890"
            {...register("phone", {
              required: "Phone is required.",
              pattern: {
                value: /^\+\d{6,}$/,
                message:
                  "Phone should be in international format and contain at least 6 numbers.",
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
            placeholder="Password"
            {...register("password", {
              required: "Password is required.",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters.",
              },
              pattern: {
                value:
                  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                message:
                  "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character.",
              },
            })}
            className="p-2 border border-gray-300 rounded focus:outline-none focus:border-AshinBlue transition"
          />
          {errors.password && (
            <p className="text-red-500">{errors.password.message}</p>
          )}
          {/* Status selection */}
          <div>
            <label className="font-bold text-gray-500">Status:</label>
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
                Active
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
                Unactive
              </button>
            </div>
          </div>

          {/* Roles Pills */}
          <div>
            <label className="font-bold text-gray-500">Roles:</label>
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
            value="Modify User"
            className="bg-AshinBlue text-white px-4 py-2 rounded hover:opacity-90 transition"
          />
        </form>
      </div>
    </Modal>
  );
}
