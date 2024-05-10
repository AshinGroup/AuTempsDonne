import React from "react";
import { FormattedMessage } from "react-intl";
import { Trash2 } from "lucide-react";
import { Modal } from "./modal";
import handleFetch from "../handleFetch";

export default function SlotsEventModal({
  SlotsModalOpen,
  SlotsModalSetOpen,
  event,
  fetchUsers,
}) {  
  const userId = sessionStorage.getItem("user_id") || "";
  const env_path = process.env.REACT_APP_API_PATH
  // Remove a user from the Course
  const deleteUserCourse = async (eventId) => {
    try {
      const response = await handleFetch(
        `${env_path}/user/${userId}/event/${eventId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Refresh the users list
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user from course:", error);
    }
  };

  return (
    <Modal open={SlotsModalOpen} onClose={SlotsModalSetOpen}>
      <div className="text-center">
        <p className="font-bold text-lg py-2 px-5 mt-3 mb-8 mx-24 border border-[4px] border-AshinBlue rounded">
          {event.name}
        </p>
        <div className="overflow-auto max-h-[400px]">
          <table className="w-full">
            <thead className="bg-gray-300">
              <tr>
                <th className="px-4 py-2">
                  <FormattedMessage id="users.email" defaultMessage="Emails" />
                </th>
                <th className="ps-4 pe-8 py-2">
                  <FormattedMessage
                    id="users.actions"
                    defaultMessage="Actions"
                  />
                </th>
              </tr>
            </thead>
            <tbody>
              {event.users.map((user, index) => (
                <tr key={index} className="border-b-2">
                  <td className="px-4 py-3">{user.email}</td>
                  <td className="px-4 py-3">
                    <button
                      className="text-red-600 hover:text-red-800 mr-2"
                      onClick={() => deleteUserCourse(event.id)}
                    >
                      {<Trash2 size={20} />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Modal>
  );
}
