import "./App.css";
import { useState, useEffect } from "react";

function App() {
  const [user, setUser] = useState(null);
  const [clothingItems, setClothingItems] = useState([]);
  const [clothingName, setClothingName] = useState("");
  const [clothingCategory, setClothingCategory] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [selectedStores, setSelectedStores] = useState([]);
  const [discountCategory, setDiscountCategory] = useState("none");
  const [discountPercentage, setDiscountPercentage] = useState("");
  const [cart, setCart] = useState([]);
  const [activeTab, setActiveTab] = useState("products");
  const [deliveryOption, setDeliveryOption] = useState("pickup");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

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

  const deliveryPrice = 10;

  const users = {
    admin: { password: "admin123", role: "admin" },
    client: { password: "client123", role: "customer" }
  };

  // Загрузка данных из localStorage при запуске
  useEffect(() => {
    const savedItems = localStorage.getItem("clothingItems");
    const savedUser = localStorage.getItem("currentUser");
    const savedCart = localStorage.getItem("customerCart");
    
    if (savedItems) {
      setClothingItems(JSON.parse(savedItems));
    }
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Сохраняем данные в localStorage при каждом изменении
  useEffect(() => {
    localStorage.setItem("clothingItems", JSON.stringify(clothingItems));
  }, [clothingItems]);

  useEffect(() => {
    localStorage.setItem("customerCart", JSON.stringify(cart));
  }, [cart]);

  const handleLogin = (e) => {
    e.preventDefault();
    setLoginError("");

    if (users[loginUsername] && users[loginUsername].password === loginPassword) {
      const userData = {
        username: loginUsername,
        role: users[loginUsername].role
      };
      setUser(userData);
      localStorage.setItem("currentUser", JSON.stringify(userData));
      setLoginUsername("");
      setLoginPassword("");
    } else {
      setLoginError("Неверный логин или пароль");
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("currentUser");
    setActiveTab("products");
  };

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

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.name === product.name);
    if (existingItem) {
      setCart(cart.map(item => 
        item.name === product.name 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productName) => {
    setCart(cart.filter(item => item.name !== productName));
  };

  const updateQuantity = (productName, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productName);
      return;
    }
    setCart(cart.map(item => 
      item.name === productName 
        ? { ...item, quantity: newQuantity }
        : item
    ));
  };

  const getTotalPrice = () => {
    const subtotal = cart.reduce((total, item) => {
      const price = item.discountedPrice || item.price;
      return total + (price * item.quantity);
    }, 0);
    
    const deliveryCost = deliveryOption === "delivery" ? deliveryPrice : 0;
    return subtotal + deliveryCost;
  };

  const getSeasonalItems = () => {
    return clothingItems.filter(item => 
      item.discountCategory === "seasonal" && item.hasDiscount
    );
  };

  // Компонент входа
  const LoginForm = () => {
    return (
      <div className="login-container">
        <div className="login-form">
          <h2>Вход в систему</h2>
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>Логин:</label>
              <input
                type="text"
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                placeholder="Введите логин"
                required
              />
            </div>
            <div className="form-group">
              <label>Пароль:</label>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="Введите пароль"
                required
              />
            </div>
            {loginError && <div className="error-message">{loginError}</div>}
            
            <div className="login-info">
              <p><strong>Админ:</strong> логин: admin, пароль: admin123</p>
              <p><strong>Клиент:</strong> логин: client, пароль: client123</p>
            </div>

            <button type="submit" className="login-btn">Войти</button>
          </form>
        </div>
      </div>
    );
  };

  // Компонент таблицы товаров
  const ProductTable = () => {
    return (
      <div className="table-section">
        <h2>Список товаров ({clothingItems.length})</h2>
        <table className="product-table">
          <thead>
            <tr>
              <th>Название одежды</th>
              <th>Категория</th>
              <th>Цена (руб)</th>
              <th>Скидка</th>
              <th>Итоговая цена</th>
              <th>Остаток</th>
              <th>Магазины</th>
              {user?.role === "admin" && <th>Удалить</th>}
            </tr>
          </thead>
          <tbody>
            {clothingItems.map((product, index) => (
              <tr key={index}>
                <td>{product.name}</td>
                <td>{product.category}</td>
                <td>{product.price.toFixed(2)}</td>
                <td>
                  {product.hasDiscount ? (
                    <span className="discount-info">
                      {product.discountPercentage}% ({product.discountCategory})
                    </span>
                  ) : (
                    "—"
                  )}
                </td>
                <td className="final-price">
                  {product.hasDiscount ? (
                    <>
                      <span className="discounted">{product.discountedPrice.toFixed(2)}</span>
                    </>
                  ) : (
                    product.price.toFixed(2)
                  )}
                </td>
                <td>{product.stock}</td>
                <td>
                  {product.stores && product.stores.length > 0 ? (
                    <ul className="store-list">
                      {product.stores.map((store, i) => (
                        <li key={i}>{store}</li>
                      ))}
                    </ul>
                  ) : (
                    "—"
                  )}
                </td>
                {user?.role === "admin" && (
                  <td>
                    <button className="delete-btn" onClick={() => handleDelete(index)}>
                      Удалить
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // Компонент карточки товара
  const ProductCard = ({ product }) => {
    return (
      <div className="product-card">
        <h3>{product.name}</h3>
        <p className="product-category">{product.category}</p>
        <div className="product-price">
          {product.hasDiscount ? (
            <>
              <span className="old-price">{product.price.toFixed(2)} руб</span>
              <span className="discounted-price">
                {product.discountedPrice.toFixed(2)} руб
              </span>
              <span className="discount-badge">-{product.discountPercentage}%</span>
            </>
          ) : (
            <span>{product.price.toFixed(2)} руб</span>
          )}
        </div>
        <p className="product-stock">В наличии: {product.stock} шт.</p>
        <div className="product-stores">
          <strong>Магазины:</strong>
          <ul>
            {product.stores.map((store, i) => (
              <li key={i}>{store}</li>
            ))}
          </ul>
        </div>
        <button 
          onClick={() => addToCart(product)}
          className="add-to-cart-btn"
          disabled={product.stock === 0}
        >
          {product.stock === 0 ? "Нет в наличии" : "В корзину"}
        </button>
      </div>
    );
  };

  // Компонент корзины
  const CartSection = () => {
    return (
      <div className="cart-section">
        <h2>Корзина покупок</h2>
        {cart.length === 0 ? (
          <p>Корзина пуста</p>
        ) : (
          <>
            <div className="cart-items">
              {cart.map((item, index) => (
                <div key={index} className="cart-item">
                  <div className="item-info">
                    <h4>{item.name}</h4>
                    <p>{(item.discountedPrice || item.price).toFixed(2)} руб × {item.quantity}</p>
                  </div>
                  <div className="item-controls">
                    <button onClick={() => updateQuantity(item.name, item.quantity - 1)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.name, item.quantity + 1)}>+</button>
                    <button 
                      onClick={() => removeFromCart(item.name)}
                      className="remove-btn"
                    >
                      Удалить
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="checkout-section">
              <div className="delivery-options">
                <h4>Способ получения:</h4>
                <label>
                  <input
                    type="radio"
                    value="pickup"
                    checked={deliveryOption === "pickup"}
                    onChange={(e) => setDeliveryOption(e.target.value)}
                  />
                  Самовывоз (бесплатно)
                </label>
                <label>
                  <input
                    type="radio"
                    value="delivery"
                    checked={deliveryOption === "delivery"}
                    onChange={(e) => setDeliveryOption(e.target.value)}
                  />
                  Доставка на дом (+{deliveryPrice} руб)
                </label>
              </div>

              <div className="payment-options">
                <h4>Способ оплаты:</h4>
                <label>
                  <input
                    type="radio"
                    value="card"
                    checked={paymentMethod === "card"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  Картой
                </label>
                <label>
                  <input
                    type="radio"
                    value="cash"
                    checked={paymentMethod === "cash"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  Наличными
                </label>
              </div>

              <div className="total-section">
                <h3>Итого: {getTotalPrice().toFixed(2)} руб</h3>
                <button className="checkout-btn">Оформить заказ</button>
              </div>
            </div>
          </>
        )}
      </div>
    );
  };

  // Если пользователь не авторизован, показываем форму входа
  if (!user) {
    return <LoginForm />;
  }

  // Рендер в зависимости от роли пользователя
  return (
    <div className={`app-container ${user.role}-view`}>
      <header className="app-header">
        <h1>
          {user.role === "admin" ? "Панель администратора" : "Магазин одежды"}
        </h1>
        <div className="user-controls">
          <span>Добро пожаловать, {user.username}</span>
          <button onClick={handleLogout} className="logout-btn">Выйти</button>
        </div>
      </header>

      <div className="app-content">
        {user.role === "admin" ? (
          // Админ панель
          <>
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
            </div>

            <ProductTable />
          </>
        ) : (
          // Панель покупателя
          <>
            <div className="tabs">
              <button 
                className={activeTab === "products" ? "active" : ""}
                onClick={() => setActiveTab("products")}
              >
                Все товары
              </button>
              <button 
                className={activeTab === "seasonal" ? "active" : ""}
                onClick={() => setActiveTab("seasonal")}
              >
                Сезонные скидки
              </button>
              <button 
                className={activeTab === "cart" ? "active" : ""}
                onClick={() => setActiveTab("cart")}
              >
                Корзина ({cart.reduce((total, item) => total + item.quantity, 0)})
              </button>
            </div>

            {activeTab === "cart" ? (
              <CartSection />
            ) : (
              <div className="products-grid">
                {(activeTab === "seasonal" ? getSeasonalItems() : clothingItems).map((product, index) => (
                  <ProductCard key={index} product={product} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default App;