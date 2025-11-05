import React, { useState } from "react";
import "./styles.css";

const Form = ({ onAdd }) => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [selectedStores, setSelectedStores] = useState([]);

  const storeAddresses = [
    "улица Строителей 15",
    "Московский проспект 11к1", 
    "Ленина 26а"
  ];

  const handleStoreToggle = (storeAddress) => {
    setSelectedStores(prev => 
      prev.includes(storeAddress)
        ? prev.filter(store => store !== storeAddress)
        : [...prev, storeAddress]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name && category && price && stock && selectedStores.length > 0) {
      onAdd({ 
        name, 
        category, 
        price: parseFloat(price), 
        stock: parseInt(stock),
        stores: selectedStores 
      });
      setName("");
      setCategory("");
      setPrice("");
      setStock("");
      setSelectedStores([]);
    }
  };

  return (
    <form className="product-form" onSubmit={handleSubmit}>
      <h2>Добавить товар</h2>
      <input
        type="text"
        placeholder="Название продукта"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Категория"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Цена (руб)"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        min="0"
        step="0.01"
        required
      />
      <input
        type="number"
        placeholder="Остаток на складе"
        value={stock}
        onChange={(e) => setStock(e.target.value)}
        min="0"
        required
      />
      
      <div className="store-selection">
        <h3>Выберите магазины:</h3>
        {storeAddresses.map(store => (
          <label key={store} className="store-checkbox">
            <input
              type="checkbox"
              checked={selectedStores.includes(store)}
              onChange={() => handleStoreToggle(store)}
            />
            {store}
          </label>
        ))}
      </div>

      <button type="submit">Добавить</button>
    </form>
  );
};

export default Form;