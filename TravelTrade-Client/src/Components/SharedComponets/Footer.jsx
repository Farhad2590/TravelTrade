import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-[#009ee2] text-white py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-2xl font-bold">TravelTrade</h3>
            <p className="mt-2 text-sm text-blue-200">
              Your trusted platform to connect with travelers and plan your journeys seamlessly.
            </p>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold">Quick Links</h3>
            <ul className="mt-2 space-y-2">
              <li><Link to="/find-travelers" className="hover:text-blue-300">Find Travelers</Link></li>
              <li><Link to="/post-travel-plans" className="hover:text-blue-300">Post Travel Plans</Link></li>
              <li><Link to="/how-it-works" className="hover:text-blue-300">How It Works</Link></li>
              <li><Link to="/contact" className="hover:text-blue-300">Contact Us</Link></li>
            </ul>
          </div>
          
          {/* Contact & Social Media */}
          <div>
            <h3 className="text-xl font-semibold">Get in Touch</h3>
            <div className="mt-2 space-y-2">
              <p className="flex items-center space-x-2">
                <Mail className="h-5 w-5 text-blue-300" />
                <span>support@traveltrade.com</span>
              </p>
              <p className="flex items-center space-x-2">
                <Phone className="h-5 w-5 text-blue-300" />
                <span>+1 234 567 890</span>
              </p>
            </div>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="hover:text-blue-300"><Facebook className="h-6 w-6" /></a>
              <a href="#" className="hover:text-blue-300"><Twitter className="h-6 w-6" /></a>
              <a href="#" className="hover:text-blue-300"><Instagram className="h-6 w-6" /></a>
              <a href="#" className="hover:text-blue-300"><Linkedin className="h-6 w-6" /></a>
            </div>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="border-t border-blue-400 mt-8 pt-4 text-center text-sm text-blue-200">
          &copy; {new Date().getFullYear()} TravelTrade. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
