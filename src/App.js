import "./App.css";
import Table from "./Table";
import { useState, useEffect } from "react";

function App() {
  const [clothingItems, setClothingItems] = useState([]);
  const [clothingName, setClothingName] = useState("");
  const [clothingCategory, setClothingCategory] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [selectedStores, setSelectedStores] = useState([]);

  const storeAddresses = [
    "улица Строителей 15",
    "Московский проспект 11к1", 
    "Ленина 26а"
  ];

  // Загрузка данных из localStorage при запуске
  useEffect(() => {
    const savedItems = localStorage.getItem("clothingItems");
    if (savedItems) {
      setClothingItems(JSON.parse(savedItems));
    }
  }, []);

  // Сохраняем данные в localStorage при каждом изменении
  useEffect(() => {
    localStorage.setItem("clothingItems", JSON.stringify(clothingItems));
  }, [clothingItems]);

  const handleDelete = (indexToRemove) => {
    setClothingItems((prevItems) =>
      prevItems.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleStoreToggle = (storeAddress) => {
    setSelectedStores(prev => 
      prev.includes(storeAddress)
        ? prev.filter(store => store !== storeAddress)
        : [...prev, storeAddress]
    );
  };

  const handleAdd = () => {
    if (clothingName.trim() === "" || 
        clothingCategory.trim() === "" || 
        price.trim() === "" || 
        stock.trim() === "" ||
        selectedStores.length === 0) return;

    const newItem = { 
      name: clothingName, 
      category: clothingCategory,
      price: parseFloat(price),
      stock: parseInt(stock),
      stores: [...selectedStores]
    };
    
    setClothingItems((prevItems) => [...prevItems, newItem]);
    setClothingName("");
    setClothingCategory("");
    setPrice("");
    setStock("");
    setSelectedStores([]);
  };

  return (
    <div className="App">
      <h2>Добавить товар одежды</h2>
      <input
        type="text"
        placeholder="Название одежды (например, футболка)"
        value={clothingName}
        onChange={(e) => setClothingName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Категория (мужская, женская, детская...)"
        value={clothingCategory}
        onChange={(e) => setClothingCategory(e.target.value)}
      />
      <input
        type="number"
        placeholder="Цена (руб)"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        min="0"
        step="0.01"
      />
      <input
        type="number"
        placeholder="Остаток на складе"
        value={stock}
        onChange={(e) => setStock(e.target.value)}
        min="0"
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

      <button onClick={handleAdd}>Добавить</button>

      <Table products={clothingItems} onDelete={handleDelete} />
    </div>
  );
}

export default App;