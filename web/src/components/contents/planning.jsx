import React, { useState, useEffect } from "react";
import { Trash2, PenLine, CalendarDays, Map } from "lucide-react";
import { Link } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import DeleteModal from "../modals/deleteModal";
import PlanningUserModal from "../modals/planningUserModal";
import ShowRoadmapModal from "../modals/showRoadmapModal";
import handleFetch from "../handleFetch";

const Planning = () => {
  const env_path = process.env.REACT_APP_API_PATH;
  const [user, setUser] = useState([]);
  const [slectedEventIdForDelete, setSelectedEventIdForDelete] = useState(null);
  const [selectedUserIdForPlanning, setSelectedUserIdForPlanning] =
    useState(null);
  const [expanded, setExpanded] = useState(() => window.innerWidth > 980);
  const [isPlanningModalOpen, setIsPlanningModalOpen] = useState(false);
  const [selectedRMId, setSelectedRMId] = useState(null);
  const [selectedRMId2, setSelectedRMId2] = useState(null);
  const [responseMessage, setResponseMessage] = useState("");
  const [isErrorMessage, setIsErrorMessage] = useState(false);

  const userId = sessionStorage.getItem("user_id") || "";

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

  // Remove an event for an user
  const deleteUserEvent = async (eventId, event = "event") => {
    try {
      const response = await handleFetch(
        `${env_path}/user/${user.id}/${event}/${eventId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response) {
        throw new Error("Network response was not ok");
      }

      // Refresh the users list
      fetchUser();
    } catch (error) {
      console.error("Error deleting :", error);
      setResponseMessage("An error occurred while deleting.");
      setIsErrorMessage(true);
    } finally {
      // Close the delete modal
      setSelectedEventIdForDelete(null);
    }
  };

  const handleDeleteClick = (eventId) => {
    setSelectedEventIdForDelete(eventId);
  };

  // Function to handle window resize
  useEffect(() => {
    const handleResize = () => {
      setExpanded(window.innerWidth > 980);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
  });

  const handlePlanningClick = (userId) => {
    setSelectedUserIdForPlanning(userId);
    setIsPlanningModalOpen(true);
  };

  const handleRMClick = (itemId) => {
    setSelectedRMId(itemId);
  };
  const handleRMClick2 = (itemId) => {
    setSelectedRMId2(itemId);
  };

  // Refresh page when close planning modal
  useEffect(() => {
    if (!isPlanningModalOpen) {
      fetchUser();
    }
  }, [isPlanningModalOpen]);

  useEffect(() => {
    fetchUser();
  }, []);

  const isDatePassed = (datetime) => {
    const itemDate = new Date(datetime);
    const today = new Date();
    return itemDate < today;
  };

  return (
    <>
      <div className="flex justify-center w-full bg-gradient-to-t from-AshinBlue-light to-AshinBlue-dark mb-24">
        <main className="w-full bg-white">
          <h1 className="text-3xl flex items-center justify-center my-2 mt-24 mb-4">
            <FormattedMessage
              id="planning.title"
              defaultMessage="See My Planning"
            />
          </h1>
          <div className="w-32 h-0.5 bg-black mx-auto mb-8"></div>
          <div className="flex items-center justify-center px-5 py-4 mt-16">
            <div className="flex items-center mr-8">
              <div className="bg-gray-200 rounded-full p-4">
                <span className="text-gray-800 font-semibold">
                  <p>
                    <FormattedMessage
                      id="planning.bubleTitle"
                      defaultMessage="To see your planning, it's just here ..."
                    />
                  </p>
                </span>
              </div>
            </div>
            <div className="flex items-center ml-8">
              <button
                className="text-blue-500 hover:text-blue-800"
                onClick={() => handlePlanningClick(userId)}
              >
                {<CalendarDays size={100} />}
              </button>
            </div>
          </div>
          {/* List of your events : */}
          <section className="pb-20 mt-40 mx-20">
            <h3 className="text-3xl flex items-center my-5 ms-5">
              <FormattedMessage
                id="updateProfileModal.events"
                defaultMessage="List of your events :"
              />
            </h3>
            {responseMessage && (
              <p className="text-red-400 text-center font-semibold p-4 border-2 border-red-500">
                {responseMessage}
              </p>
            )}
            <div className="flex flex-col mt-5 border-b-4">
              {user.deliveries ? (
                <ul className="flex flex-col text-xl">
                  <h3 className="my-2 mx-5 font-semibold text-xl text-AshinBlue border-b-2 border-AshinBlue">
                    <FormattedMessage
                      id="deliveries.deliveries"
                      defaultMessage="Deliveries"
                    />
                  </h3>
                  {user.deliveries.map((item, index) => (
                    <li
                      key={index}
                      className={`p-2 mx-5 border-0 rounded mb-4 ${
                        isDatePassed(item.datetime)
                          ? "bg-gray-600"
                          : "bg-AshinBlue"
                      }`}
                    >
                      <div className="font-bold text-xl pb-2 mb-2 border-b-2 border-white flex items-center justify-between text-white">
                        <span>
                          <FormattedMessage
                            id="cad.Delivery"
                            defaultMessage="Delivery"
                          />{" "}
                          #{item.id}
                        </span>
                        <div>
                          <button
                            className="me-2"
                            onClick={() => handleRMClick2(item.id)}
                          >
                            <Map size={30} className="hover:scale-110" />
                          </button>
                          {!isDatePassed(item.datetime) && (
                            <button
                              className="me-5"
                              onClick={() => handleDeleteClick(`d-${item.id}`)}
                            >
                              <Trash2 size={30} className="hover:scale-110" />
                            </button>
                          )}
                        </div>
                      </div>
                      <ShowRoadmapModal
                        open={selectedRMId2 === item.id}
                        onClose={() => setSelectedRMId2(null)}
                        item={item}
                      />{" "}
                      <DeleteModal
                        open={slectedEventIdForDelete === `d-${item.id}`}
                        onClose={() => setSelectedEventIdForDelete(null)}
                        fetchUsers={() => deleteUserEvent(item.id, "delivery")}
                      />{" "}
                      <p className="text-white">
                        <span className="font-semibold">
                          {" "}
                          <FormattedMessage
                            id="planning.departLocation"
                            defaultMessage="Depart Location :"
                          />
                        </span>{" "}
                        <span className="italic">
                          {item.locations.length > 0 && (
                            <span>
                              {item.locations[0].address}{" "}
                              {item.locations[0].zip_code}
                            </span>
                          )}
                        </span>
                      </p>
                      <p className="text-white">
                        <span className="font-semibold">
                          {" "}
                          <FormattedMessage
                            id="updateProfileModal.datetime"
                            defaultMessage="DateTime :"
                          />
                        </span>{" "}
                        <span className="italic"> {item.datetime}</span>
                      </p>
                      <p className="text-white">
                        <span className="font-semibold">
                          <FormattedMessage
                            id="updateProfileModal.group"
                            defaultMessage="group :"
                          />
                        </span>{" "}
                        <span className="italic">
                          <FormattedMessage
                            id="planning.delivery"
                            defaultMessage="Delivery"
                          />
                        </span>
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No deliveries found</p>
              )}
              {user.collects ? (
                <ul className="flex flex-col text-xl">
                  <h3 className="my-2 mx-5 font-semibold text-xl text-AshinBlue border-b-2 border-AshinBlue">
                    <FormattedMessage
                      id="collects.collects"
                      defaultMessage="Collects"
                    />
                  </h3>
                  {user.collects.map((item, index) => (
                    <li
                      key={index}
                      className={`p-2 mx-5 border-0 rounded mb-4 ${
                        isDatePassed(item.datetime)
                          ? "bg-gray-600"
                          : "bg-AshinBlue"
                      }`}
                    >
                      <div className="font-bold text-xl pb-2 mb-2 border-b-2 border-white flex items-center justify-between text-white">
                        <span>
                          <FormattedMessage
                            id="cad.collect"
                            defaultMessage="collect"
                          />{" "}
                          #{item.id}
                        </span>
                        <div>
                          <button
                            className="me-2"
                            onClick={() => handleRMClick(item.id)}
                          >
                            <Map size={30} className="hover:scale-110" />
                          </button>
                          {!isDatePassed(item.datetime) && (
                            <button
                              className="me-5"
                              onClick={() => handleDeleteClick(`c-${item.id}`)}
                            >
                              <Trash2 size={30} className="hover:scale-110" />
                            </button>
                          )}
                        </div>
                      </div>
                      <ShowRoadmapModal
                        open={selectedRMId === item.id}
                        onClose={() => setSelectedRMId(null)}
                        item={item}
                      />{" "}
                      <DeleteModal
                        open={slectedEventIdForDelete === `c-${item.id}`}
                        onClose={() => setSelectedEventIdForDelete(null)}
                        fetchUsers={() => deleteUserEvent(item.id, "collect")}
                      />{" "}
                      <p className="text-white">
                        <span className="font-semibold">
                          {" "}
                          <FormattedMessage
                            id="planning.departLocation"
                            defaultMessage="Depart Location :"
                          />
                        </span>{" "}
                        <span className="italic">
                          {" "}
                          {item.storage.warehouse.location.address}{" "}
                          {item.storage.warehouse.location.zip_code}
                        </span>
                      </p>
                      <p className="text-white">
                        <span className="font-semibold">
                          {" "}
                          <FormattedMessage
                            id="updateProfileModal.datetime"
                            defaultMessage="DateTime :"
                          />
                        </span>{" "}
                        <span className="italic"> {item.datetime}</span>
                      </p>
                      <p className="text-white">
                        <span className="font-semibold">
                          <FormattedMessage
                            id="updateProfileModal.group"
                            defaultMessage="group :"
                          />
                        </span>{" "}
                        <span className="italic">
                          <FormattedMessage
                            id="planning.collect"
                            defaultMessage="Collect"
                          />
                        </span>
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No collects found</p>
              )}
              {user.events ? (
                <ul className="flex flex-col text-xl">
                  <h3 className="my-2 mx-5 font-semibold text-xl text-AshinBlue border-b-2 border-AshinBlue">
                    <FormattedMessage
                      id="planning.Events"
                      defaultMessage="Events"
                    />
                  </h3>
                  {user.events.map((event, index) => (
                    <li
                      key={index}
                      className={`p-2 mx-5 border-0 rounded mb-4 ${
                        isDatePassed(event.datetime)
                          ? "bg-gray-600"
                          : "bg-AshinBlue"
                      }`}
                    >
                      <div className="font-bold text-xl pb-2 mb-2 border-b-2 border-white flex items-center justify-between text-white">
                        <span>{event.name}</span>
                        {!isDatePassed(event.datetime) && (
                          <button
                            className="me-5"
                            onClick={() => handleDeleteClick(`e-${event.id}`)}
                          >
                            <Trash2 size={30} className="hover:scale-110" />
                          </button>
                        )}
                      </div>
                      <DeleteModal
                        open={slectedEventIdForDelete === `e-${event.id}`}
                        onClose={() => setSelectedEventIdForDelete(null)}
                        fetchUsers={() => deleteUserEvent(event.id, "event")}
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
            </div>
          </section>
        </main>
        {selectedUserIdForPlanning && (
          <PlanningUserModal
            PlanningModalOpen={selectedUserIdForPlanning === userId}
            PlanningModalSetOpen={() => {
              setSelectedUserIdForPlanning(null);
              setIsPlanningModalOpen(false);
            }}
            user={user}
            expanded={expanded}
            fetchUser={fetchUser}
          />
        )}
      </div>
    </>
  );
};

export default Planning;
