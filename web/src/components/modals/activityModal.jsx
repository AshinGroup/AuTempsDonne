import React, { useState, useEffect } from "react";
import { useIntl, FormattedMessage } from "react-intl";
import { PlusSquare } from "lucide-react";
import handleFetch from "../handleFetch";
import { format } from "date-fns";
import { Modal } from "./modal";

export default function ActivityModal({
    activity,
    modalOpen,
    setModalOpen,
    userId,
}) {
    const [responseMessage, setResponseMessage] = useState("");
    const [isErrorMessage, setIsErrorMessage] = useState(false);

    const intl = useIntl();

    const titlePlaceholder = intl.formatMessage({
        id: "activityModal.title",
        defaultMessage: "Title of the Activity",
    });

    const dateTimeFormat = intl.formatMessage({
        id: "activityModal.date",
        defaultMessage: "dd/MM/yy HH:mm",
    });

    const locationPlaceholder = intl.formatMessage({
        id: "modal.location",
        defaultMessage: "Location",
    });

    const registryButton = intl.formatMessage({
        id: "modal.registryButton",
        defaultMessage: "Registry",
    });

    const handleRegistry = async (eventId) => {
        try {
            const response = await handleFetch(
                `http://127.0.0.1:5000/api/user/${userId}/event/${eventId}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            setResponseMessage("You have successfully signed up for this activity!");
        } catch (error) {
            console.error("An error occurred while signing up:", error);
            setResponseMessage("An error occurred while signing up.");
            setIsErrorMessage(true);
        }
    };

    return (
        <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
            <div className="text-center mt-5 w-full ">
                <PlusSquare size={40} className="mx-auto text-AshinBlue" />
                <p
                    className={` my-2 font-medium ${isErrorMessage ? "text-red-500" : "text-green-500"
                        }`}
                >
                    {responseMessage}
                </p>
                <div className="flex flex-col gap-4 w-96 mx-auto mt-4">
                    <p className="font-bold text-gray-500">{titlePlaceholder}:</p>
                    <p className="text-gray-800">{activity.name}</p>

                    <p className="font-bold text-gray-500">
                        <FormattedMessage
                            id="modal.type"
                            defaultMessage="Type"
                        />
                        :
                    </p>
                    <p className="text-gray-800">{activity.type.name}</p>

                    <p className="font-bold text-gray-500">
                        <FormattedMessage
                            id="modal.dateTime"
                            defaultMessage="Date & Time"
                        />
                        :
                    </p>
                    <p className="text-gray-800">
                        {format(new Date(activity.datetime), dateTimeFormat)}
                    </p>

                    <p className="font-bold text-gray-500">{locationPlaceholder}:</p>
                    <p className="text-gray-800">{activity.place}</p>

                    <p className="font-bold text-gray-500">
                        <FormattedMessage
                            id="modal.description"
                            defaultMessage="Description"
                        />
                        :
                    </p>
                    <p className="text-gray-800">{activity.description}</p>

                    <button
                        className="bg-AshinBlue text-white px-4 py-2 rounded hover:opacity-90 transition"
                        onClick={() => handleRegistry(activity.id)}
                    >
                        {registryButton}
                    </button>
                </div>
            </div>
        </Modal>
    );
}
