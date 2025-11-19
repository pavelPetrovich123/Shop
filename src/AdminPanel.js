import React, { useState, useEffect } from "react";
import Table from "./Table";
import "./AdminPanel.css";

const AdminPanel = ({ user, onLogout }) => {
  const [clothingItems, setClothingItems] = useState([]);
  const [clothingName, setClothingName] = useState("");
  const [clothingCategory, setClothingCategory] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [selectedStores, setSelectedStores] = useState([]);
  const [discountCategory, setDiscountCategory] = useState("none");
  const [discountPercentage, setDiscountPercentage] = useState("");

  const storeAddresses = [
    "улица Строителей 15",
    "Московский проспект 11к1", 
    "Ленина 26а"
  ];

  const discountCategories = [
    { value: "none", label: "Без скидки" },
    { value: "seasonal", label: "Сезонная скидка" },
    { value: "clearance", label: "Распродажа" },
    { value: "new", label: "Скидка на новинки" }
  ];

  useEffect(() => {
    const savedItems = localStorage.getItem("clothingItems");
    if (savedItems) {
      setClothingItems(JSON.parse(savedItems));
    }
  }, []);

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

  const calculateDiscountedPrice = (basePrice, category, percentage) => {
    if (category === "none" || !percentage) return basePrice;
    return basePrice * (1 - percentage / 100);
  };

  const handleAdd = () => {
    if (clothingName.trim() === "" || 
        clothingCategory.trim() === "" || 
        price.trim() === "" || 
        stock.trim() === "" ||
        selectedStores.length === 0) return;

    const basePrice = parseFloat(price);
    const discountPercent = discountCategory !== "none" ? parseFloat(discountPercentage) || 0 : 0;
    const finalPrice = calculateDiscountedPrice(basePrice, discountCategory, discountPercent);

    const newItem = { 
      name: clothingName, 
      category: clothingCategory,
      price: basePrice,
      discountedPrice: finalPrice,
      stock: parseInt(stock),
      stores: [...selectedStores],
      discountCategory: discountCategory,
      discountPercentage: discountPercent,
      hasDiscount: discountCategory !== "none" && discountPercent > 0
    };
    
    setClothingItems((prevItems) => [...prevItems, newItem]);
    setClothingName("");
    setClothingCategory("");
    setPrice("");
    setStock("");
    setSelectedStores([]);
    setDiscountCategory("none");
    setDiscountPercentage("");
  };

  return (
    <div className="admin-panel">
      <header className="admin-header">
        <h1>Панель администратора</h1>
        <div className="user-info">
          <span>Добро пожаловать, {user.username}</span>
          <button onClick={onLogout} className="logout-btn">Выйти</button>
        </div>
      </header>

      <div className="admin-content">
        <div className="product-form-section">
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
          
          <div className="discount-section">
            <h3>Настройки скидки</h3>
            <select 
              value={discountCategory} 
              onChange={(e) => setDiscountCategory(e.target.value)}
            >
              {discountCategories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
            
            {discountCategory !== "none" && (
              <input
                type="number"
                placeholder="Процент скидки"
                value={discountPercentage}
                onChange={(e) => setDiscountPercentage(e.target.value)}
                min="0"
                max="100"
                step="1"
              />
            )}
          </div>
          
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

          <button onClick={handleAdd}>Добавить товар</button>
        </