
import React from 'react';
import { Github, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-gray-600">
              © 2025 CityPulse South Africa. All rights reserved.
            </p>
          </div>

          <div className="flex items-center space-x-6">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-sa-blue transition-colors">
              <Github className="h-5 w-5" />
            </a>
            <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-sa-blue transition-colors">
              <Twitter className="h-5 w-5" />
            </a>
          </div>

          <div className="mt-4 md:mt-0">
            <ul className="flex items-center space-x-6 text-sm">
              <li>
                <Link to="/terms" className="text-gray-600 hover:text-sa-blue transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-600 hover:text-sa-blue transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 hover:text-sa-blue transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
