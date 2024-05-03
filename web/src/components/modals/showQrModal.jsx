import React from "react";
import { FormattedMessage } from "react-intl";
import { Trash2 } from "lucide-react";
import { Modal } from "../modals/modal";

export default function ShowQrModal({ open, onClose, item }) {
  return (
    <Modal open={open} onClose={onClose}>
      <div className="text-center w-64">
        <img src={item.qr_code} alt="QR Code" />
        <div className="mx-auto my-4 w-48">
          <h3 className="text-lg font-back text-gray-800">
            <FormattedMessage
              id="showQR.scheduledAt"
              defaultMessage="Scheduled to collect :"
            />
          </h3>
          <p className="text-sm text-gray-500">
            {item.collect ? item.collect.id : "N/A"}
          </p>
        </div>
        <div className="flex flex-col gap-4">
          <button
            onClick={() => {
              window.open(
                // item.pdf,
                "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
                "_blank"
              );
            }}
            className="w-full py-2 border border-red-500 bg-red-500 text-white rounded transition-all hover:scale-105"
          >
            <FormattedMessage
              id="showQR.downloadPDF"
              defaultMessage="Download PDF"
            />
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
