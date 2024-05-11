import React, { useState, useEffect } from "react";

const ReceiptQR = () => {
  // Get the params of the URL

  // ${env_path}/receiptQrCode?packages=[{'food_id': 1, 'weight': 2, 'demand_description': 'Coucou', 'expiration_date': '2022-12-12'}, {'food_id': 1, 'weight': 2, 'demand_description': 'Coucou', 'expiration_date': '2022-12-12'}]&storage_id=1&demand_id=1
  
  // const queryParameter = new URLSearchParams(window.location.search);
  // const packages = queryParameter.get("packages");

  const packages = "[{'food_id': 1, 'weight': 2, 'demand_id': 1, 'demand_description': 'Coucou', 'storage_id':1, 'expiration_date': '2022-12-12'}, {'food_id': 1, 'weight': 2, 'demand_id': 1, 'demand_description': 'Coucou', 'storage_id':1, 'expiration_date': '2022-12-12'}]";
  const packagesDecoded = decodeURIComponent(packages);
  const packagesReplaced = packagesDecoded.replace(/'/g, '"');
  const packagesJson = JSON.parse(packagesReplaced);

  // A rajouter dans le QR_CODE :  demand.id, demand.description, demand.collect.storage.id
  // Une fois ajouté, faut checker si y'a une demand collect, si y'a pas ca affiche "Ah désolé, il semnblerait que votre demande ne soit pas assignée"
  // Sinon, ca POST les packages et ca dit que ca a bien été validé (Avec un message de confirmation ?).



  return (
    <div className="flex">
      {packagesJson.length > 0 ? (
        <p>{ packagesJson.map((pack, index) => (
          <div key={index} className="p-4">
            <p>Weight: {pack.food_id} {pack.weight} {pack.expiration_date}, {pack.demand_id}, {pack.demand_description} {pack.storage_id}</p>
          </div>
        ))}</p>
      ) : (
        <p>rate</p>
      )}
    </div>
  );
};

export default ReceiptQR;
