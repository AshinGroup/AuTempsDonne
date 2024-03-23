import React, { useEffect, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import {
  Settings,
  Trash2,
  UserCheck2,
  UserRoundX,
  CalendarDays,
} from "lucide-react";

import DeleteModal from "../modals/deleteModal";
import AddUserModal from "../modals/addUserModal";
import UpdateUserModal from "../modals/updateUserModal";
import PlanningUserModal from "../modals/planningUserModal";

const Users = () => {
  // Display the users and Pagination
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [maxPages, setMaxPages] = useState(0);
  const pageNumbers = [];
  const pagesToShow = 2;
  const [expanded, setExpanded] = useState(() => window.innerWidth > 980);
  const [searchInput, setSearchInput] = useState("");

  // Handle all the modals
  const [slectedUserIdForDelete, setSelectedUserIdForDelete] = useState(null);
  const [AddModalOpen, AddModalSetOpen] = useState(false);
  const [selectedUserIdForUpdate, setSelectedUserIdForUpdate] = useState(null);
  const [selectedUserIdForPlanning, setSelectedUserIdForPlanning] =
    useState(null);

  const intl = useIntl();

  const searchPlaceholder = intl.formatMessage({
    id: "users.searchPlaceholder",
    defaultMessage: "Search by email or name ...",
  });

  // Fetch the users from the API
  const fetchUsers = () => {
    let url =
      searchInput != ""
        ? `http://127.0.0.1:5000/api/user/page/${currentPage}/search/${searchInput}`
        : `http://127.0.0.1:5000/api/user/page/${currentPage}`;
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setUsers(data.users);
        const usersLength = data.users.length;
        for (let i = 0; i < 10 - usersLength; i++) {
          data.users.push({
            id: `placeholder-${i}`,
            first_name: "",
            last_name: "",
            email: "",
            status: null,
            role: [],
          });
        }
        setMaxPages(data.max_pages);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  };

  // Remove a user from the API
  const deleteUser = (userId) => {
    fetch(`http://127.0.0.1:5000/api/user/${userId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      // Refresh the users list and quit the modal
      fetchUsers();
      setSelectedUserIdForDelete(null);
    });
  };

  // Set the user id to delete
  const handleDeleteClick = (userId) => {
    setSelectedUserIdForDelete(userId);
  };
  // Set the user id to update
  const handleUpdateClick = (userId) => {
    setSelectedUserIdForUpdate(userId);
  };

  // Set the user id to update
  const handlePlanningClick = (userId) => {
    setSelectedUserIdForPlanning(userId);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchInput(e.target.value);
    if (e.keyCode == 13) {
      fetchUsers;
    }
  };

  const handleClickSearch = (e) => {
    if (e.type == "click" || e.keyCode == 13) fetchUsers();
  };

  // Fetch the users when we change Page
  useEffect(() => {
    fetchUsers();
  }, [currentPage]);

  // Function to handle window resize
  useEffect(() => {
    const handleResize = () => {
      setExpanded(window.innerWidth > 740);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
  });

  // Array of pagination [1,2,3,...,maxPages]
  let startPage = Math.max(currentPage - pagesToShow, 1);
  let endPage = Math.min(currentPage + pagesToShow, maxPages);
  if (startPage !== 1) {
    pageNumbers.push(1);
    if (startPage > 2) pageNumbers.push("...");
  }
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }
  if (endPage < maxPages) {
    if (endPage < maxPages - 1) pageNumbers.push("...");
    pageNumbers.push(maxPages);
  }

  return (
    <div className={`h-screen p-8 pt-8 ${expanded ? "mx-6" : "mx-1"}`}>
      <div className="flex mb-6 items-center">
        <h1
          className={`${
            expanded ? "text-3xl" : "text-2xl"
          } font-bold flex-grow`}
        >
          <FormattedMessage
            id="users.usersManagement"
            defaultMessage="Users Management"
          />
        </h1>
        <button
          className={`text-base bg-gradient-to-tr from-AshinBlue-light to-AshinBlue-dark text-white px-4 ${
            expanded ? "py-3" : "py-2"
          } rounded transition hover:opacity-90 text-sm`}
          onClick={() => {
            AddModalSetOpen(true);
          }}
        >
          <FormattedMessage
            id="users.addANewUser"
            defaultMessage="+ Add a new user"
          />
        </button>
        <AddUserModal
          AddModalOpen={AddModalOpen}
          AddModalSetOpen={() => AddModalSetOpen(false)}
          fetchUsers={fetchUsers}
        />
      </div>
      {/* Searchbar */}
      <div className="flex gap-4 mb-6 items-stretch">
        <input
          type="text"
          placeholder={searchPlaceholder}
          className="p-2 border border-gray-300 rounded flex-grow focus:outline-none focus:border-AshinBlue transition"
          onChange={handleSearch}
          onKeyDown={handleClickSearch}
          value={searchInput}
        />
        <button
          className="bg-gradient-to-tr from-AshinBlue-light to-AshinBlue-dark text-white px-4 py-2 rounded hover:opacity-90 transition self-end"
          onClick={handleClickSearch}
        >
          <FormattedMessage id="users.search" defaultMessage="Search" />
        </button>
      </div>
      {/* List of Users */}
      <div className="overflow-x-auto">
        {/* Table of Users */}
        <table className="w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              {expanded && (
                <th className="p-4 w-2/6 max-w-xs">
                  {" "}
                  <FormattedMessage id="users.email" defaultMessage="email" />
                </th>
              )}{" "}
              {expanded && (
                <th>
                  {" "}
                  <FormattedMessage id="users.name" defaultMessage="name" />
                </th>
              )}
              {!expanded && (
                <th className="p-4 w-2/5 max-w-xs">
                  {" "}
                  <FormattedMessage id="users.user" defaultMessage="user" />
                </th>
              )}
              <th>
                {" "}
                <FormattedMessage id="users.roles" defaultMessage="roles" />
              </th>
              <th>
                {" "}
                <FormattedMessage id="users.status" defaultMessage="status" />
              </th>
              <th>
                {" "}
                <FormattedMessage id="users.actions" defaultMessage="actions" />
              </th>
            </tr>
          </thead>
          <tbody>
            {/* For each user ... */}
            {console.log(users)}
            {users.map((user) => (
              <tr key={user.id} className="border-b">
                {/* email & name */}
                {expanded && (
                  <td className="p-4 w-1/3 max-w-xs whitespace-nowrap overflow-hidden text-ellipsis">
                    {user.email}
                  </td>
                )}{" "}
                {expanded && (
                  <td className="w-1/5">
                    {user.first_name} {user.last_name}
                  </td>
                )}
                {!expanded && (
                  <td className="flex flex-col py-4">
                    <span className="text-sm font-normal">{user.email}</span>
                    <span className="text-sm font-light text-gray-400">
                      {user.first_name} {user.last_name}
                    </span>
                  </td>
                )}
                {/* roles */}
                <td className={`w-1/6 ${!expanded ? "text-sm" : ""}`}>
                  {user.roles?.map((role) => role.name).join(", ") ?? ""}
                </td>
                {/* status */}
                <td className="py-4">
                  {user.status === 0 ? (
                    <UserRoundX
                      size={20}
                      style={{ color: "red", marginLeft: "0.7em" }}
                    />
                  ) : user.status === 1 ? (
                    <UserCheck2
                      size={20}
                      style={{ color: "green", marginLeft: "0.7em" }}
                    />
                  ) : (
                    <>
                      <span className="opacity-0 cursor-default">.</span>
                    </>
                  )}
                </td>
                {/* actions */}
                <td>
                  {user.status != null && (
                    <>
                      <button
                        className="text-blue-600 hover:text-blue-800 mr-2"
                        onClick={() => handlePlanningClick(user.id)}
                      >
                        {<CalendarDays size={20} />}
                      </button>
                      {selectedUserIdForPlanning === user.id && (
                        <PlanningUserModal
                          PlanningModalOpen={
                            selectedUserIdForPlanning === user.id
                          }
                          PlanningModalSetOpen={() =>
                            setSelectedUserIdForPlanning(null)
                          }
                          user={user}
                          expanded={expanded}
                        />
                      )}
                      <button
                        className="text-blue-600 hover:text-blue-800 mr-2"
                        onClick={() => handleUpdateClick(user.id)}
                      >
                        {<Settings size={20} />}
                      </button>
                      {selectedUserIdForUpdate === user.id && (
                        <UpdateUserModal
                          UpdateModalOpen={selectedUserIdForUpdate === user.id}
                          UpdateModalSetOpen={() =>
                            setSelectedUserIdForUpdate(null)
                          }
                          user={user}
                          fetchUsers={fetchUsers}
                        />
                      )}
                      <button
                        className="text-red-600 hover:text-red-800 mr-2"
                        onClick={() => handleDeleteClick(user.id)}
                      >
                        {<Trash2 size={20} />}
                      </button>
                      <DeleteModal
                        open={slectedUserIdForDelete === user.id}
                        onClose={() => setSelectedUserIdForDelete(null)}
                        fetchUsers={() => deleteUser(user.id)}
                      />{" "}
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      <div className="flex justify-center mt-4">
        {pageNumbers.map((pageNum, index) =>
          pageNum === "..." ? (
            <span key={index} className="mx-1 px-4 py-2">
              ...
            </span>
          ) : (
            <button
              key={pageNum}
              className={`mx-1 px-4 py-2  bg-gray-200 rounded bg-gradient-to-tr hover:from-AshinBlue-light hover:to-AshinBlue-dark hover:text-white ${
                currentPage === pageNum
                  ? "from-AshinBlue-light to-AshinBlue-dark text-white"
                  : ""
              }`}
              onClick={() => setCurrentPage(pageNum)}
            >
              {pageNum}
            </button>
          )
        )}
      </div>
    </div>
  );
};

export default Users;
