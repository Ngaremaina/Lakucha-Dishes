import PropTypes from "prop-types";
import SideBar from "../components/sidebar/SideBar";
import Header from "../components/header/Header";

export default function Layout({children}){
     
    return (
        <div className="font-[sans-serif] h-screen overflow-hidden dark:bg-gray-900 dark:text-white">
        {/* Fixed header */}
        <div className="fixed top-0 left-0 right-0 z-50 h-[70px] bg-white dark:bg-gray-800">
          <Header />
        </div>
      
        {/* Content below header */}
        <div className="pt-[70px] flex h-screen">
          {/* Sidebar with fixed width */}
            <SideBar/>
          {/* Main content fills remaining space */}
          <div className="flex-1 overflow-x-hidden p-2 dark:bg-gray-900 lg:ml-[300px]">
            <section className="w-full">
                {children}
            </section>
          </div>
        </div>
      </div>
        
    )
}

Layout.propTypes = {
    children: PropTypes.node.isRequired, // Require children to be a node
  };