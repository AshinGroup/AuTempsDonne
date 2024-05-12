import React, { useEffect, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { format } from "date-fns";
import handleFetch from "../handleFetch";
import ActivityModal from "../modals/activityModal";
const Activities = () => {
  const [activities, setActivities] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const userId = sessionStorage.getItem("user_id") || "";

  const intl = useIntl();

  const searchPlaceholder = intl.formatMessage({
    id: "event.searchPlaceholder",
    defaultMessage: "Search by title ...",
  });

  const fetchActivities = async () => {
    const env_path = process.env.REACT_APP_API_PATH;
    let url =
      searchInput !== ""
        ? `${env_path}/event/search/${searchInput}`
        : `${env_path}/event`;

    try {
      const data = await handleFetch(url);
      if (data) {
        const currentDateTime = new Date().getTime(); // Get current timestamp
        if (searchInput !== "") {
          setActivities(
            data.events.filter(
              (event) =>
                event.group === 1 &&
                new Date(event.datetime).getTime() > currentDateTime
            )
          );
        } else {
          setActivities(
            data.filter(
              (event) =>
                event.group === 1 &&
                new Date(event.datetime).getTime() > currentDateTime
            )
          );
        }
      }
    } catch (error) {
      console.error("Error fetching activities:", error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchInput(e.target.value);
    if (e.keyCode === 13) {
      fetchActivities();
    }
  };

  const handleClickSearch = (e) => {
    if (e.type === "click" || e.keyCode === 13) fetchActivities();
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  // ouvrir modal
  const openSignUpModal = (activity) => {
    setSelectedActivity(activity);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="h-screen p-8 pt-8 mx-6">
        <div className="flex mb-6 items-center">
          <h1 className="text-3xl font-bold flex-grow">
            <FormattedMessage
              id="activities.title"
              defaultMessage="Activities available"
            />
          </h1>
        </div>
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
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-4 w-1/5">
                  <FormattedMessage id="event.title" defaultMessage="Title" />
                </th>
                <th className="p-4 w-1/5">
                  <FormattedMessage id="event.type" defaultMessage="Type" />
                </th>
                <th className="p-4 w-1/5">
                  <FormattedMessage
                    id="event.dateTime"
                    defaultMessage="Date & Time"
                  />
                </th>
                <th className="p-4 w-2/5">
                  <FormattedMessage
                    id="event.location"
                    defaultMessage="Location"
                  />
                </th>
                <th className="p-4 w-1/5">
                  <FormattedMessage
                    id="event.actions"
                    defaultMessage="Actions"
                  />
                </th>
              </tr>
            </thead>
            <tbody>
              {activities.map((activity) => (
                <tr key={activity.id} className="border-b">
                  <td className="p-4">{activity.name}</td>
                  <td className="p-4">{activity.type.name}</td>
                  <td className="p-4">
                    {format(new Date(activity.datetime), "dd/MM/yy HH'H'mm")}
                  </td>
                  <td className="p-4">{activity.place}</td>
                  <td className="p-4">
                    <button
                      className="bg-gradient-to-tr from-AshinBlue-light to-AshinBlue-dark text-white px-4 py-2 rounded hover:opacity-90 transition self-end"
                      onClick={() => openSignUpModal(activity)}
                    >
                      +
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {selectedActivity && (
          <ActivityModal
            activity={selectedActivity}
            modalOpen={isModalOpen}
            setModalOpen={setIsModalOpen}
            userId={userId}
          />
        )}
      </div>
    </>
  );
};

export default Activities;
