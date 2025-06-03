import PropTypes from 'prop-types';

export default function FormTemplate({ handleSubmit, heading, children }) {
    return (
        <form className="text-black" onSubmit={handleSubmit} >
            <h1 className="text-xl mb-5 text-center uppercase font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                {heading}
            </h1>
            {children}
        </form>
               
    );
}

FormTemplate.propTypes = {
    handleSubmit: PropTypes.func,  // handleSubmit must be a function
    heading: PropTypes.string,     // heading must be a string
    children: PropTypes.node      // children can be any renderable elements
};