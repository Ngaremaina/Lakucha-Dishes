import { useAuth } from "../../context/Authentication";
import AddToCartButton from "../button/AddToCartButton";

const DetailsItem = ({ image, category, name, price, description }) => {
  const quantity = 1;
  const total = quantity * price;
  const {admin} = useAuth()

  return (
    <div className="container mx-auto my-8 px-4">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Image Section */}
        <div className="w-full lg:w-1/2 flex justify-center items-center">
          <img
            src={image}
            alt={name}
            className="w-full max-w-md h-auto object-cover rounded shadow-md"
          />
        </div>

        {/* Details Section */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center py-4">
          <h4 className="text-sm uppercase text-gray-500 mb-2">{category}</h4>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">{name}</h1>
          <h3 className="text-2xl font-semibold text-blue-600 mb-4">${price}</h3>
          <p className="text-gray-700 leading-relaxed mb-6">{description}</p>
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
    </div>
  );
};

export default DetailsItem;
