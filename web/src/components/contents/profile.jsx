import React, { useState, useEffect } from "react";
import { Settings, Trash2, ArrowLeft, PenLine } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import atd_logo_ from "../../resources/atd_logo_.png";
import atd_logo_typo from "../../resources/atd_logo_typo.png";
import { FormattedMessage } from "react-intl";
import DeleteModal from "../modals/deleteModal";
import UpdateProfileModal from "../modals/updateProfileModal";
import handleFetch from "../handleFetch";

const Profile = () => {
  const env_path = process.env.REACT_APP_API_PATH
  const [user, setUser] = useState([]);
  const [expanded, setExpanded] = useState(() => window.innerWidth > 980);
  const [slectedEventIdForDelete, setSelectedEventIdForDelete] = useState(null);
  const [profileUpdate, setProfileUpdate] = useState(null);

  const userId = sessionStorage.getItem("user_id") || "";

  // Function to handle window resize
  useEffect(() => {
    const handleResize = () => {
      setExpanded(window.innerWidth > 980);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
  });

  // Fetch the user from the API
  const fetchUser = async () => {
    const url = `${env_path}/user/${userId}`;

    try {
      const data = await handleFetch(url);
      if (data) {
        setUser(data);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  // Delete an event
  const deleteEvent = async (eventId) => {
    const url = `${env_path}/user/${user.id}/event/${eventId}`;

    try {
      const response = await handleFetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response) {
        // Refresh the user data and quit the modal
        fetchUser();
        setSelectedEventIdForDelete(null);
      }
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  // Set the user id to delete
  const handleDeleteClick = (EventId) => {
    setSelectedEventIdForDelete(EventId);
  };

  // Set the user id to update
  const handleUpdateClick = (userId) => {
    setProfileUpdate(userId);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <>
      <div className="flex justify-center w-full bg-gradient-to-t from-AshinBlue-light to-AshinBlue-dark">
        <main className={`${expanded ? "w-4/6" : "w-full"} bg-white`}>
          {/* Profile */}
          <section>
            {/* Profile Image and Name */}
            <div className="flex items-center justify-center flex-col mt-5 pb-10 mx-32 border-b-4 border-AshinBlue">
              <img
                src={`https://ui-avatars.com/api/?name=${user.last_name}+${user.first_name}&background=40A1DD&color=FFFFFF&bold=true`}
                className="w-40 rounded-full border-2 border-AshinBlue-light shadow-lg"
              />
              <span className="mt-3 font-bold text-2xl">
                {user.first_name} {user.last_name}
              </span>
            </div>
            {/* Profile Information */}
            <div className="flex flex-col mt-5 border-b-4 ">
              <h3 className="text-3xl font-bold flex items-center my-5 ms-5">
                <FormattedMessage
                  id="updateProfileModal.userInfo"
                  defaultMessage="User Informations"
                />

                <button>
                  <PenLine
                    size={30}
                    className="ms-3 pt-1 hover:scale-125"
                    onClick={() => handleUpdateClick(user.id)}
                  />
                </button>
              </h3>
              <ul className="flex flex-col text-xl">
                <li className="py-2 border-t-2 border-gray-300 mx-5 ">
                  <span className="font-semibold text-AshinBlue-dark ms-3 ">
                    <FormattedMessage
                      id="updateProfileModal.fn"
                      defaultMessage="First Name :"
                    />
                  </span>
                  {user.first_name}
                </li>
                <li className="py-2 border-t-2 border-gray-300 mx-5">
                  <span className="font-semibold text-AshinBlue-dark ms-3 ">
                    <FormattedMessage
                      id="updateProfileModal.ln"
                      defaultMessage="Last Name :"
                    />
                  </span>{" "}
                  {user.last_name}
                </li>
                <li className="py-2 border-t-2 border-gray-300 mx-5">
                  <span className="font-semibold text-AshinBlue-dark ms-3 ">
                    <FormattedMessage
                      id="updateProfileModal.email"
                      defaultMessage="Email :"
                    />
                  </span>{" "}
                  {user.email}
                </li>
                <li className="py-2 border-t-2 border-gray-300 mx-5">
                  <span className="font-semibold text-AshinBlue-dark ms-3 ">
                    <FormattedMessage
                      id="updateProfileModal.phone"
                      defaultMessage="phone :"
                    />
                  </span>{" "}
                  {user.phone}
                </li>
                <li className="py-2 border-y-2 border-gray-300 mx-5">
                  <span className="font-semibold text-AshinBlue-dark ms-3 ">
                    <FormattedMessage
                      id="updateProfileModal.roles"
                      defaultMessage="role(s) :"
                    />
                  </span>
                  {user.roles ? (
                    <span>
                      {user.roles.map((role, index) => (
                        <span key={index}> {role.name} </span>
                      ))}
                    </span>
                  ) : (
                    <p>No roles found</p>
                  )}
                </li>
                {user.shop && (                
                <li className="py-2 border-y-2 border-gray-300 mx-5">
                  <span className="font-semibold text-AshinBlue-dark ms-3 ">
                    <FormattedMessage
                      id="shops.shopName"
                      defaultMessage="Shop"
                    />&nbsp;:&nbsp;
                  </span>
                  {user.shop.name}, {user.shop.address} {user.shop.zip_code}
                </li>)}
              </ul>
              <line className="border-AshinBlue border-b-4 mx-32 mt-10"></line>
            </div>
          </section>
          {/* Events */}
          <section className="pb-20">
            <h3 className="text-3xl font-bold flex items-center my-5 ms-5">
              <FormattedMessage
                id="updateProfileModal.events"
                defaultMessage="Event(s) :"
              />
            </h3>
            <div className="flex flex-col mt-5 border-b-4">
              <ul className="flex flex-col text-xl">
                <li className="py-2 mx-5">
                  {user.events ? (
                    <ul>
                      {user.events.map((event, index) => (
                        <li
                          key={index}
                          className="bg-AshinBlue p-2 border-0 rounded mb-4"
                        >
                          <div className="font-bold text-xl pb-2 mb-2 border-b-2 border-white flex items-center justify-between text-white">
                            <span>{event.name}</span>
                            <button
                              className="me-5"
                              onClick={() => handleDeleteClick(event.id)}
                            >
                              <Trash2 size={30} className="hover:scale-110" />
                            </button>{" "}
                          </div>
                          <DeleteModal
                            open={slectedEventIdForDelete === event.id}
                            onClose={() => setSelectedEventIdForDelete(null)}
                            fetchUsers={() => deleteEvent(event.id)}
                          />{" "}
                          <p className="text-white">
                            <span className="font-semibold">
                              {" "}
                              <FormattedMessage
                                id="updateProfileModal.place"
                                defaultMessage="Place :"
                              />
                            </span>{" "}
                            <span className="italic"> {event.place}</span>
                          </p>
                          <p className="text-white">
                            <span className="font-semibold">
                              {" "}
                              <FormattedMessage
                                id="updateProfileModal.datetime"
                                defaultMessage="DateTime :"
                              />
                            </span>{" "}
                            <span className="italic"> {event.datetime}</span>
                          </p>
                          <p className="text-white">
                            <span className="font-semibold">
                              <FormattedMessage
                                id="updateProfileModal.description"
                                defaultMessage="Description :"
                              />
                            </span>{" "}
                            <span className="italic"> {event.description}</span>
                          </p>
                          <p className="text-white">
                            <span className="font-semibold">
                              <FormattedMessage
                                id="updateProfileModal.group"
                                defaultMessage="group :"
                              />
                            </span>{" "}
                            <span className="italic">
                              {" "}
                              {event.group === 1 ? (
                                <FormattedMessage
                                  id="event.activity"
                                  defaultMessage="Activity"
                                />
                              ) : event.group === 2 ? (
                                <FormattedMessage
                                  id="event.course"
                                  defaultMessage="Course"
                                />
                              ) : (
                                <FormattedMessage
                                  id="event.service"
                                  defaultMessage="Service"
                                />
                              )}
                            </span>
                          </p>
                          <p className="text-white">
                            <span className="font-semibold">
                              <FormattedMessage
                                id="updateProfileModal.type"
                                defaultMessage="type :"
                              />
                            </span>{" "}
                            <span className="italic"> {event.type.name}</span>
                          </p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No events found</p>
                  )}
                </li>
              </ul>
            </div>
          </section>
        </main>
        {profileUpdate === user.id && (
          <UpdateProfileModal
            UpdateModalOpen={profileUpdate === user.id}
            UpdateModalSetOpen={() => setProfileUpdate(null)}
            user={user}
            fetchUsers={() => fetchUser()}
          />
        )}
      </div>      
    </>
  );
};
export default Profile;
