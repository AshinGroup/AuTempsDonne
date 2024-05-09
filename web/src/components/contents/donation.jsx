import React from "react";
import atd_logo_typo from "../../resources/atd_logo_typo.png";
import { FormattedMessage } from "react-intl";
import Footer from "../footer1";

const Donation = () => {
  return (
    <>
      <section className="flex justify-center items-center h-screen bg-cover bg-no-repeat bg-center bg-[url('https://media.istockphoto.com/id/656898392/fr/photo/amis-amiti%C3%A9-fist-togetherness-concept.jpg?s=1024x1024&w=is&k=20&c=tCERIp7922ElulLsmSxuKq9i7Arpg1AUBsAfRjSdsWw=')]">
        <div className="flex flex-col w-4/6 items-center bg-white justify-center h-screen ">
          <img
            src={atd_logo_typo}
            alt="ATD Logo Typo"
            className="max-w-xl mb-5 mt-10"
          />
          <h1 className="text-4xl mb-6 font-bold text-AshinBlue underline decoration-4">
            <FormattedMessage
              id="donation.DonAutantDonne"
              defaultMessage="Donation: Give as much as you can!"
            />
          </h1>

          <p className="text-xl text-gray-400 text-center mx-1">
            <FormattedMessage
              id="donation.text1"
              defaultMessage="Au Temps Donné is a humanitarian association that relies on various donations."
            />
          </p>
          <p className="text-xl text-gray-400 text-center mx-1">
            <FormattedMessage
              id="donation.text2"
              defaultMessage="We need your help to continue assisting those in need."
            />
          </p>
          {/* PayPal Donate button form */}
          <form
            action="https://www.paypal.com/donate"
            method="post"
            target="_blank"
            className="mt-10"
          >
            <input
              type="hidden"
              name="hosted_button_id"
              value="ZYJDMM7WD4UFY"
            />
            <input
              type="image"
              src="https://www.paypalobjects.com/en_US/FR/i/btn/btn_donateCC_LG.gif"
              name="submit"
              title="PayPal - The safer, easier way to pay online!"
              alt="Donate with PayPal button"
              className="w-60"
            />
            <img src="https://www.paypal.com/en_FR/i/scr/pixel.gif" />
          </form>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Donation;
