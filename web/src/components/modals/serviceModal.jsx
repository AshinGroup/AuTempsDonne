import React, { useState } from "react";
import { useIntl, FormattedMessage } from "react-intl";
import { PlusSquare } from "lucide-react";
import { format } from "date-fns";
import { Modal } from "./modal";

export default function ServicesModal({
    service,
    modalOpen,
    setModalOpen,
}) {
    const [responseMessage, setResponseMessage] = useState("");
    const [isErrorMessage, setIsErrorMessage] = useState(false);

    const intl = useIntl();

    const titlePlaceholder = intl.formatMessage({
        id: "serviceModal.titlePlaceholder",
        defaultMessage: "Title of the Service",
    });

    const dateTimeFormat = intl.formatMessage({
        id: "serviceModal.date",
        defaultMessage: "dd/MM/yy HH:mm",
    });

    const locationPlaceholder = intl.formatMessage({
        id: "serviceModal.locationPlaceholder",
        defaultMessage: "Location",
    });

    const signUpButton = intl.formatMessage({
        id: "serviceModal.registryButton",
        defaultMessage: "Registry",
    });

    const handleSignUp = async () => {
        try {
            // post
            // partie pour s'inscrire
            
            setResponseMessage("You have successfully signed up for this service!");
            setIsErrorMessage(false);
        } catch (error) {
            console.error("An error occurred while signing up:", error);
            setResponseMessage("An error occurred while signing up. Please try again.");
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
                    <p className="text-gray-800">{service.name}</p>

                    <p className="font-bold text-gray-500">
                        <FormattedMessage
                            id="serviceModal.type"
                            defaultMessage="Type"
                        />
                        :
                    </p>
                    <p className="text-gray-800">{service.type.name}</p>

                    <p className="font-bold text-gray-500">
                        <FormattedMessage
                            id="serviceModal.dateTime"
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
                            id="serviceModal.description"
                            defaultMessage="Description"
                        />
                        :
                    </p>
                    <p className="text-gray-800">{service.description}</p>

                    <button
                        onClick={handleSignUp}
                        className="bg-AshinBlue text-white px-4 py-2 rounded hover:opacity-90 transition"
                    >
                        {signUpButton}
                    </button>
                </div>
            </div>
        </Modal>
    );
}

/*
        -> update le front -> notamment location pas assez large

        -> implémenter le post pour s'inscrire a un service

        -> bouton pr s'inscrire et autre bouton pr se désinscrire

        -> search by 'type' ?

        -> vérification ds la modal + les langues

*/
