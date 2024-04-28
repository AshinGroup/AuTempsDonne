import React from 'react';
import logo from '../resources/atd_logo_typo.png';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white p-4">
      <div className="flex items-center">        
        <div className="ml-4 mr-80">
            <p>© 2024 - Au Temps Donné. Tous droits réservés.</p>
        </div>

        <div className="pl-32 mr-80">
          <img src={logo} alt="Logo" className="h-8" />
        </div>

        <div className="flex flex-col pl-64">
          <ul className="flex space-x-4">
            <li>
              <a href="/" className="hover:text-gray-400">Accueil</a>
            </li>
            <li>
              <a href="/" className="hover:text-gray-400">Contact</a>
            </li>
            <li>
              <a href="/" className="hover:text-gray-400">Donner</a>
            </li>
          </ul>
        </div>

        </div>
    </footer>
  );
};

export default Footer;
