import React, { useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import { Trash2 } from "lucide-react";
import { Modal } from "../modals/modal";
import fetchBucket from "../wasabiBucket";

export default function ShowRoadmapModal({ open, onClose, item }) {
  const [htmlUrl, setHtmlUrl] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");

  useEffect(() => {
    const loadQrUrl = async () => {
      try {
        const url = await fetchBucket(item.roadmap, true);
        setHtmlUrl(url);
      } catch (error) {
        console.error("Failed to fetch HTML URL:", error);
        setHtmlUrl("");
      }
    };

    const loadPDFUrl = async () => {
      try {
        const url = await fetchBucket(item.pdf);
        setPdfUrl(url);
      } catch (error) {
        console.error("Failed to fetch PDF URL:", error);
        setPdfUrl("");
      }
    };

    loadQrUrl();
    loadPDFUrl();
  }, []);
  return (
    <Modal open={open} onClose={onClose}>
      <div className="text-center">
        {htmlUrl ? (
          <iframe
            id="roadmapIframe"
            src={htmlUrl}
            title="Roadmap HTML"
            width="500px"
            height="500px"
          />
        ) : (
          <p>Loading the iFrame ...</p>
        )}
        <div className="mx-auto my-4 w-48">
          <h3 className="text-lg font-back text-gray-800">
            <FormattedMessage id="showRM.Roadmap" defaultMessage="Roadmap" /> ID{" "}
            {item.id}
          </h3>
          <p className="text-sm text-gray-500">{item.datetime}</p>
        </div>
        <div className="flex flex-col gap-4">
          <button
            onClick={() => {
              window.open(pdfUrl, "_blank");
            }}
            className="w-full py-2 border border-AshinBlue bg-AshinBlue text-white rounded transition-all hover:scale-105"
          >
            <FormattedMessage
              id="showQR.downloadPDF"
              defaultMessage="Download PDF"
            />
          </button>
          <button
            onClick={onClose}
            className="w-full py-2 border border-red-500 rounded transition-all hover:text-red-500"
          >
            <FormattedMessage id="deleteModal.cancel" defaultMessage="Cancel" />
          </button>
        </div>
      </div>
    </Modal>
  );
}
