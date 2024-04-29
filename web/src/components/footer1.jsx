import React from 'react';
import logo from '../resources/atd_logo_typo.png';
import { FormattedMessage } from 'react-intl';
import { useLanguage } from '../translations/languageContext';

const Footer = () => {
  const { locale } = useLanguage();
  const isChinese = locale === 'cn';

  return (
    <footer className="bg-gray-800 text-white p-4">
      <div className="flex items-center">
        <div className="ml-4 mr-80">
          <img src={logo} alt="Logo" className="h-8" />
        </div>
        
        <div className={`${isChinese ? 'pl-56' : 'pl-40'} ${isChinese ? 'mr-80' : 'mr-72'}`}>
          <p>© 2024 - Au Temps Donné. <FormattedMessage id="footer.credits" defaultMessage="All rights reserved." /></p>
        </div>

        <div className="flex flex-col pl-64">
          <ul className="flex space-x-4">
            <li>
              <a href="/" className="hover:text-gray-400"><FormattedMessage id="footer.home" defaultMessage="Home" /></a>
            </li>
            <li>
              <a href="/" className="hover:text-gray-400"><FormattedMessage id="footer.contact" defaultMessage="Contact" /></a>
            </li>
            <li>
              <a href="/" className="hover:text-gray-400"><FormattedMessage id="footer.donate" defaultMessage="Donate" /></a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
