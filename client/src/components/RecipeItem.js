import React from "react";
import { Link } from "react-router-dom";

const RecipeItem = ({ label, dishType, image, source }) => {

    return(
        <div>
            <Link to={`/recipes/${label}`}>
            <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700" style={{height:"530px", padding:"15px"}}>
                <img className="p-8 rounded-t-lg" src={image} alt={label} />
                <div className="px-5 pb-5">
                    <h5 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">{label}</h5>
                <div className="flex items-center mt-2.5 mb-5">
                    <span className="bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800 ml-3">{dishType}</span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-3xl font-bold text-gray-900 dark:text-white">{source}</span>
                </div>
                </div>
            </div>
            </Link>
        </div>
        

    )

}

export default RecipeItem