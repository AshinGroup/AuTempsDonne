import React, { useEffect } from "react";
import { FormattedMessage } from "react-intl";
import { Loader } from "lucide-react";
import { Modal } from "./modal";
import handleFetch from "../handleFetch";

export default function SlotsTicketsModal({
  SlotsModalOpen,
  SlotsModalSetOpen,
  tickets,
}) {
  return (
    <Modal open={SlotsModalOpen} onClose={SlotsModalSetOpen}>
      <div className="text-center">
        <p className="font-bold text-lg py-2 px-5 mt-3 mb-8 mx-24 border border-[4px] border-AshinBlue rounded">
          <FormattedMessage
            id="slotsTickets.MyTickets"
            defaultMessage="MyTickets"
          />{" "}
          ({tickets.length})
        </p>
        <div className="overflow-auto max-h-[400px]">
          <table className="w-full">
            <thead className="bg-gray-300">
              <tr>
                <th className="px-4 py-2">
                  <FormattedMessage id="tickets.id" defaultMessage="ID" />
                </th>
                <th className="ps-4 pe-8 py-2">
                  <FormattedMessage
                    id="tickets.subject"
                    defaultMessage="Subject"
                  />
                </th>
                <th className="ps-4 pe-8 py-2">
                  <FormattedMessage
                    id="tickets.inCharge"
                    defaultMessage="Admin in Charge"
                  />
                </th>
                <th className="ps-4 pe-8 py-2">
                  <FormattedMessage
                    id="tickets.status"
                    defaultMessage="Status"
                  />
                </th>
              </tr>
            </thead>
            <tbody>
              {tickets?.map((ticket, index) => (
                <tr key={index} className="border-b-2">
                  <td className="px-4 py-3">{ticket.id}</td>
                  <td className="ps-4 pe-8 py-3">{ticket.subject}</td>
                  <td
                    className={`ps-4 pe-8 py-3 ${
                      ticket.admin ? "" : "text-gray-400"
                    }`}
                  >
                    {ticket.admin ? (
                      ticket.admin?.email
                    ) : (
                      <FormattedMessage
                        id="tickets.notAssigned"
                        defaultMessage="Not Assigned"
                      />
                    )}
                  </td>
                  <td
                    className={`ps-4 pe-8 py-3 flex justify-center items-center ${
                      ticket.status
                        ? ticket.status == 1
                          ? "text-orange-400"
                          : "text-red-400"
                        : "text-green-500"
                    }`}
                  >
                    <Loader size="20" /> &nbsp;
                    {ticket.status ? (
                      ticket.status == 1 ? (
                        <FormattedMessage
                          id="tickets.inProgress"
                          defaultMessage="inProgress"
                        />
                      ) : (
                        <FormattedMessage
                          id="tickets.closed"
                          defaultMessage="Closed"
                        />
                      )
                    ) : (
                      <FormattedMessage id="tickets.new" defaultMessage="New" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-gray-400 font-semibold pt-5">
            <FormattedMessage
              id="tickets.contactAdmin"
              defaultMessage="Please contact an admin or the admin in charge if no response in 48
                        hours (just joking, we are dev, no one is here)"
            />
          </p>
        </div>
      </div>
    </Modal>
  );
}
