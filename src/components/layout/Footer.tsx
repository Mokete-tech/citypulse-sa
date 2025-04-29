
import React from 'react';
import { Github, Twitter } from 'lucide-react';

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
            <a href="#" className="text-gray-600 hover:text-sa-blue transition-colors">
              <Github className="h-5 w-5" />
            </a>
            <a href="#" className="text-gray-600 hover:text-sa-blue transition-colors">
              <Twitter className="h-5 w-5" />
            </a>
          </div>
          
          <div className="mt-4 md:mt-0">
            <ul className="flex items-center space-x-6 text-sm">
              <li>
                <a href="#" className="text-gray-600 hover:text-sa-blue transition-colors">
                  Privacy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-sa-blue transition-colors">
                  Terms
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-sa-blue transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
