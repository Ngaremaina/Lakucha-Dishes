import PropTypes from 'prop-types';
import { Input, Typography } from "@material-tailwind/react";

export default function InputField({ id, name, onChange, placeholder, value, type, label, error,...rest }) {
    return (
        <div className="w-full mb-4">
            <Typography
                as="label"
                htmlFor="email"
                type="small"
                color="default"
                className="font-semibold"
            >
                {label}
            </Typography>
            <input
                type={type}
                name={name}
                id={id}
                className="bg-gray-700 text-black border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-8"
                placeholder={placeholder}
                onChange={onChange}
                {...rest}
                {...(type !== 'file' && { value: value || '' })}/>
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
    );
}

InputField.propTypes = {
    id: PropTypes.string,
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]), // Allow string and number types for value
    type: PropTypes.oneOf([
        'text',
        'number',
        'email',
        'password',
        'datetime-local',
        'date',
        'time',
        'url',
        'tel',
        'search',
        'color',
        'file',
        'radio'
    ]).isRequired,
    label: PropTypes.string,
    error: PropTypes.string
};
