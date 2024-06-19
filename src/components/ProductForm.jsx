import { useState } from 'react';
import PropTypes from 'prop-types';
import { buildRequestOptions } from '../app/api';
import { useAtomValue } from "jotai";
import { userAtom } from "../app/atoms";

const ProductForm = ({ product, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: product ? product.name : '',
    description: product ? product.description : '',
    price: product ? product.price : '', // Laisse comme string ici
  });
  const { token } = useAtomValue(userAtom);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const endpoint = product ? 'update' : 'create';
    const dataToSubmit = {
      ...formData,
      price: Number(formData.price) // Convertir en number ici
    };
    const { url, options } = buildRequestOptions('products', endpoint, {
      id: product ? product.id : undefined,
      body: dataToSubmit,
      token: token,
    });

    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      onSubmit(data);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Name:</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Description:</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Price:</label>
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          required
        />
      </div>
      <button type="submit">{product ? 'Update' : 'Create'} Product</button>
    </form>
  );
};

ProductForm.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    description: PropTypes.string,
    price: PropTypes.number,
  }),
  onSubmit: PropTypes.func.isRequired,
};

export default ProductForm;