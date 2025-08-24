const Footer = () => {
  return (
    <footer className="w-full bg-white border-t shadow-sm px-6 py-3 flex justify-between items-center text-sm text-gray-600">
      <p>© {new Date().getFullYear()} AI Agent. All rights reserved.</p>
      <div className="flex space-x-4">
        <a href="#" className="hover:text-blue-600">
          Privacy Policy
        </a>
        <a href="#" className="hover:text-blue-600">
          Terms of Service
        </a>
        <a href="#" className="hover:text-blue-600">
          Contact
        </a>
      </div>
    </footer>
  );
};
 
export default Footer;