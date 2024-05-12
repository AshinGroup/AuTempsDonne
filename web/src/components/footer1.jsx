import React from 'react';
import logo from '../resources/atd_logo_typo.png';
import { FormattedMessage } from 'react-intl';
import { useLanguage } from '../translations/languageContext';

const Footer = () => {
  const { locale } = useLanguage();
  const isChinese = locale === 'cn';

  return (
    <footer className="bg-gray-800 text-white p-4">
      <div className="flex flex-col lg:flex-row items-center justify-between">
        <div className="flex items-center mb-4 lg:mb-0">
          <img src={logo} alt="Logo" className="h-8" />
        </div>

        <div className={`text-center ml-6 lg:text-left ${isChinese ? 'lg:pl-32' : 'lg:pl-40'}`}>
          <p>© 2024 - Au Temps Donné. <FormattedMessage id="footer.credits" defaultMessage="All rights reserved." /></p>
        </div>

        <div className="flex flex-col lg:flex-row lg:pl-64">
          <ul className="flex flex-wrap space-x-4 lg:space-x-8">
            <li>
              <a href="/homepage" className="hover:text-gray-400"><FormattedMessage id="footer.home" defaultMessage="Home" /></a>
            </li>
            <li>
              <a href="/support" className="hover:text-gray-400"><FormattedMessage id="footer.contact" defaultMessage="Contact" /></a>
            </li>
            <li>
              <a href="/donate" className="hover:text-gray-400"><FormattedMessage id="footer.donate" defaultMessage="Donate" /></a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
