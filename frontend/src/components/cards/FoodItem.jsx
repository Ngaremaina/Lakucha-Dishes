import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/Authentication";
import AddToCartButton from "../button/AddToCartButton";

const FoodItem = ({image, name, price, description}) => {
    const quantity = 1
    const total = quantity * price
    const { admin } = useContext(AuthContext)

    return(
        <div className="relative flex flex-col my-6 bg-white shadow-sm border border-slate-200 rounded-lg w-fit">
            <div className="relative p-2.5 h-96 overflow-hidden rounded-xl bg-clip-border">
                <Link  to={`/${name}`}>
                    <img
                        src={image}
                        alt={name}
                        className="h-full w-full object-cover rounded-md"
                    />
                </Link>
                
            </div>
            <div className="p-4">
                <div className="mb-2 flex items-center justify-between">
                <p className="text-slate-800 text-xl font-semibold">
                    {name}
                </p>
                <p className="text-cyan-600 text-xl font-semibold">
                    Kshs. {price}
                </p>
                </div>
                <p className="text-slate-600 leading-normal font-light">
                    {description.length > 35 ? `${description.substring(0, 35)}...` : description}
                </p>
                <AddToCartButton
                    name={name}
                    price={price}
                    description={description}
                    image={image}
                    quantity={1}
                    total={total}
                    adminId={admin.id}
                    />
            </div>
        </div>
    )
}

export default FoodItem