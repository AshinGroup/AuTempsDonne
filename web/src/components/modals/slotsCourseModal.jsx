import React, { useState } from "react";
import { FormattedMessage } from "react-intl";
import { Trash2, GraduationCap } from "lucide-react";
import { useForm } from "react-hook-form";
import { Modal } from "../modals/modal";
import DeleteModal from "../modals/deleteModal";

export default function SlotsCourseModal({
  SlotsModalOpen,
  SlotsModalSetOpen,
  course,
  fetchUsers,
}) {
  // Remove a user from the Course
  const deleteUserCourse = (courseId) => {
    // fetch(`http://127.0.0.1:5000/user/${courseId}`, {
    //   method: "DELETE",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    // }).then((response) => {
    //   if (!response.ok) {
    //     throw new Error("Network response was not ok");
    //   }
    // Refresh the users list and quit the modal
    fetchUsers();
    // });
  };

  return (
    <Modal open={SlotsModalOpen} onClose={SlotsModalSetOpen}>
      <div className="text-center">
        <p className="font-bold text-lg py-2 px-5 mt-3 mb-8 mx-24 border border-[4px] border-AshinBlue rounded">
          {course.title}
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
              {course.users.map((user, index) => (
                <tr key={index} className="border-b-2">
                  <td className="px-4 py-3">{user.email}</td>
                  <td className="px-4 py-3">
                    <button
                      className="text-red-600 hover:text-red-800 mr-2"
                      onClick={() => deleteUserCourse(course.id)}
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
