import React from 'react';
import { useForm } from 'react-hook-form';

function MyForm() {
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();

    const onSubmit = data => {
        console.log(data);
    };

    return (
        <form onSubmit= { handleSubmit(onSubmit) } >
        <textarea
        {
            ...register('nbks', {
                required: 'This field is required',
                pattern: {
                    value: /^([A-Za-z0-9]{1,7})(,\s*[A-Za-z0-9]{1,7})*$/,
                    message: 'Please enter items separated by a comma (,). Each item should be a maximum of 7 characters long.'
                }
            })
        }
        />
        {
            errors.nbks && <p>{ errors.nbks.message } < /p>}

                < input type="submit" />
                </form>
  );
        }

    export default MyForm;
