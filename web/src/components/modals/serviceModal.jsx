import React, { useState, useEffect } from "react";
import { useIntl, FormattedMessage } from "react-intl";
import { PlusSquare } from "lucide-react";
import handleFetch from "../handleFetch";
import { format } from "date-fns";
import { Modal } from "./modal";

export default function ServicesModal({
    service,
    modalOpen,
    setModalOpen,
    userId,
}) {
    const [responseMessage, setResponseMessage] = useState("");
    const [isErrorMessage, setIsErrorMessage] = useState(false);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const intl = useIntl();

    const env_path = process.env.REACT_APP_API_PATH

    const titlePlaceholder = intl.formatMessage({
        id: "serviceModal.title",
        defaultMessage: "Title of the Service",
    });

    const dateTimeFormat = intl.formatMessage({
        id: "serviceModal.date",
        defaultMessage: "dd/MM/yy HH:mm",
    });

    const locationPlaceholder = intl.formatMessage({
        id: "modal.location",
        defaultMessage: "Location",
    });

    const registryButton = isSubscribed ? (
        <FormattedMessage
            id="event.unsubscribeButton"
            defaultMessage="Unsubscribe"
        />
    ) : (
        <FormattedMessage
            id="event.registryButton"
            defaultMessage="Registry"
        />
    );

    // to subscribe
    const handleRegistry = async (eventId) => {
        try {
            if (isSubscribed) {
                handleUnsubscribe(eventId);
            } else {
                const response = await handleFetch(
                    `${env_path}/user/${userId}/event/${eventId}`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );

                setResponseMessage(<FormattedMessage id="serviceModal.successfullySubsribe" defaultMessage="You have successfully signed up for this service!" />);
                setIsSubscribed(true);
            }
        } catch (error) {
            console.error("An error occurred while signing up:", error);
            setResponseMessage("An error occurred while signing up.");
            setIsErrorMessage(true);
        }
    };

    // to unsubscribe
    const handleUnsubscribe = async (eventId) => {
        try {
            const response = await handleFetch(
                `${env_path}/user/${userId}/event/${eventId}`,
                {
                    method: "DELETE",
                }
            );

            setResponseMessage(<FormattedMessage id="serviceModal.successfullyUnsubscribe" defaultMessage="You have successfully unsubscribed from this service!" />);
            setIsSubscribed(false);
        } catch (error) {
            console.error("An error occurred while unsubscribing:", error);
            setResponseMessage("An error occurred while unsubscribing.");
            setIsErrorMessage(true);
        }
    };

    // get event list to user participate
    const fetchUserEvents = async (userId) => {
        const url = `${env_path}/user/${userId}`;

        try {
            const data = await handleFetch(url);
            return data.events;
        } catch (error) {
            console.error("Error fetching user events:", error);
            return [];
        }
    };

    const isUserSubscribedToEvent = async (userId, eventId) => {
        const userEvents = await fetchUserEvents(userId);
        return userEvents.some(event => event.id === eventId);
    };

    const checkSubscription = async () => {
        try {
            const isSubscribed = await isUserSubscribedToEvent(userId, service.id);
            setIsSubscribed(isSubscribed);
        } catch (error) {
            console.error("An error occurred while checking subscription:", error);
        }
    };

    useEffect(() => {
        setResponseMessage("");

        if (modalOpen) {
            checkSubscription();
        }
    }, [modalOpen]);

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
                    <p className="text-gray-800">{service.name}</p>

                    <p className="font-bold text-gray-500">
                        <FormattedMessage
                            id="modal.type"
                            defaultMessage="Type"
                        />
                        :
                    </p>
                    <p className="text-gray-800">{service.type.name}</p>

                    <p className="font-bold text-gray-500">
                        <FormattedMessage
                            id="modal.dateTime"
                            defaultMessage="Date & Time"
                        />
                        :
                    </p>
                    <p className="text-gray-800">
                        {format(new Date(service.datetime), dateTimeFormat)}
                    </p>

                    <p className="font-bold text-gray-500">{locationPlaceholder}:</p>
                    <p className="text-gray-800">{service.place}</p>

                    <p className="font-bold text-gray-500">
                        <FormattedMessage
                            id="modal.description"
                            defaultMessage="Description"
                        />
                        :
                    </p>
                    <p className="text-gray-800">{service.description}</p>

                    <button
                        className="bg-AshinBlue text-white px-4 py-2 rounded hover:opacity-90 transition"
                        onClick={() => handleRegistry(service.id)}
                    >
                        {registryButton}
                    </button>
                </div>
            </div>
        </Modal>
    );
}
