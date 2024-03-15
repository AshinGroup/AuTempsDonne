import React from "react";
import { FormattedMessage } from "react-intl";
import { Trash2 } from "lucide-react";
import { Modal } from "../modals/modal";

export default function DeleteModal({ open, onClose, fetchUsers }) {
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
