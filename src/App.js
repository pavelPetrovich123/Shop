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
  const [sizes, setSizes] = useState(["S", "M", "L", "XL", "XXL"]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [newSize, setNewSize] = useState("");
  const [availableSizesByStore, setAvailableSizesByStore] = useState({});
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [orderCompleted, setOrderCompleted] = useState(false);
  const [orderMessage, setOrderMessage] = useState("");
  const [productImages, setProductImages] = useState({});

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
    const savedSizes = localStorage.getItem("availableSizes");
    const savedImages = localStorage.getItem("productImages");
    const savedSizeList = localStorage.getItem("sizeList");
    
    if (savedItems) {
      setClothingItems(JSON.parse(savedItems));
    }
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
    if (savedSizes) {
      setAvailableSizesByStore(JSON.parse(savedSizes));
    }
    if (savedImages) {
      setProductImages(JSON.parse(savedImages));
    }
    if (savedSizeList) {
      setSizes(JSON.parse(savedSizeList));
    }
  }, []);

  // Сохраняем данные в localStorage при каждом изменении
  useEffect(() => {
    localStorage.setItem("clothingItems", JSON.stringify(clothingItems));
  }, [clothingItems]);

  useEffect(() => {
    localStorage.setItem("customerCart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("availableSizes", JSON.stringify(availableSizesByStore));
  }, [availableSizesByStore]);

  useEffect(() => {
    localStorage.setItem("productImages", JSON.stringify(productImages));
  }, [productImages]);

  useEffect(() => {
    localStorage.setItem("sizeList", JSON.stringify(sizes));
  }, [sizes]);

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
    setOrderCompleted(false);
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

  const handleSizeToggle = (size) => {
    setSelectedSizes(prev => 
      prev.includes(size)
        ? prev.filter(s => s !== size)
        : [...prev, size]
    );
  };

  const addNewSize = () => {
    if (newSize.trim() && !sizes.includes(newSize.trim())) {
      setSizes(prev => [...prev, newSize.trim()]);
      setNewSize("");
    }
  };

  const handleStoreSizesUpdate = (storeAddress, storeSizes) => {
    setAvailableSizesByStore(prev => ({
      ...prev,
      [storeAddress]: storeSizes
    }));
  };

  const calculateDiscountedPrice = (basePrice, category, percentage) => {
    if (category === "none" || !percentage) return basePrice;
    return basePrice * (1 - percentage / 100);
  };

  const handleImageUpload = (productName, imageFile) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setProductImages(prev => ({
        ...prev,
        [productName]: e.target.result
      }));
    };
    reader.readAsDataURL(imageFile);
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
      sizes: [...selectedSizes],
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
    setSelectedSizes([]);
    setDiscountCategory("none");
    setDiscountPercentage("");
  };

  const addToCart = (product, selectedSize = null) => {
    const productKey = selectedSize ? `${product.name}-${selectedSize}` : product.name;
    const existingItem = cart.find(item => item.key === productKey);
    
    if (existingItem) {
      setCart(cart.map(item => 
        item.key === productKey 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { 
        ...product, 
        quantity: 1, 
        key: productKey,
        selectedSize: selectedSize
      }]);
    }
  };

  const removeFromCart = (productKey) => {
    setCart(cart.filter(item => item.key !== productKey));
  };

  const updateQuantity = (productKey, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productKey);
      return;
    }
    setCart(cart.map(item => 
      item.key === productKey 
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

  const handleCheckout = () => {
    if (deliveryOption === "delivery" && !deliveryAddress.trim()) {
      alert("Пожалуйста, введите адрес доставки");
      return;
    }

    if (deliveryOption === "delivery") {
      setOrderMessage(`Курьер уже в пути по адресу: ${deliveryAddress}. Ожидайте доставку в течение 30 минут!`);
    } else {
      setOrderMessage("Заказ успешно оформлен! Готов к самовывозу через 15 минут.");
    }
    
    setOrderCompleted(true);
    setCart([]);
    localStorage.removeItem("customerCart");
  };

  // Компонент входа
  const LoginForm = () => {
    const [isInputFocused, setIsInputFocused] = useState(false);

    const handleInputFocus = () => {
      setIsInputFocused(true);
    };

    const handleInputBlur = () => {
      setTimeout(() => {
        setIsInputFocused(false);
      }, 200);
    };

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
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
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
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
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

  // Компонент управления размерами для админа
  const SizeManagement = () => {
    return (
      <div className="size-management-section">
        <h3>Управление размерными рядами</h3>
        
        <div className="add-size-section">
          <h4>Добавить новый размер</h4>
          <div className="size-input-group">
            <input
              type="text"
              value={newSize}
              onChange={(e) => setNewSize(e.target.value)}
              placeholder="Введите новый размер (например: XS)"
            />
            <button onClick={addNewSize} className="add-size-btn">Добавить размер</button>
          </div>
        </div>

        <div className="current-sizes">
          <h4>Текущие размеры:</h4>
          <div className="size-tags-container">
            {sizes.map(size => (
              <span key={size} className="size-tag">{size}</span>
            ))}
          </div>
        </div>

        <div className="store-sizes-management">
          <h4>Доступные размеры по магазинам</h4>
          {storeAddresses.map(store => (
            <div key={store} className="store-sizes">
              <h5>{store}</h5>
              <div className="size-checkboxes">
                {sizes.map(size => (
                  <label key={size} className="size-checkbox">
                    <input
                      type="checkbox"
                      checked={availableSizesByStore[store]?.includes(size) || false}
                      onChange={(e) => {
                        const currentSizes = availableSizesByStore[store] || [];
                        const newSizes = e.target.checked
                          ? [...currentSizes, size]
                          : currentSizes.filter(s => s !== size);
                        handleStoreSizesUpdate(store, newSizes);
                      }}
                    />
                    {size}
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Компонент загрузки фото для админа
  const ImageUploadSection = () => {
    const handleImageChange = (e, productName) => {
      const file = e.target.files[0];
      if (file) {
        handleImageUpload(productName, file);
      }
    };

    return (
      <div className="image-upload-section">
        <h3>Управление изображениями товаров</h3>
        {clothingItems.length === 0 ? (
          <p>Нет товаров для загрузки изображений</p>
        ) : (
          clothingItems.map((product, index) => (
            <div key={index} className="image-upload-item">
              <h4>{product.name}</h4>
              {productImages[product.name] && (
                <img 
                  src={productImages[product.name]} 
                  alt={product.name}
                  className="product-preview-image"
                />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageChange(e, product.name)}
                className="image-upload-input"
              />
            </div>
          ))
        )}
      </div>
    );
  };

  // Компонент таблицы товаров
  const ProductTable = () => {
    return (
      <div className="table-section">
        <h2>Список товаров ({clothingItems.length})</h2>
        {clothingItems.length === 0 ? (
          <p>Нет товаров для отображения</p>
        ) : (
          <table className="product-table">
            <thead>
              <tr>
                <th>Изображение</th>
                <th>Название одежды</th>
                <th>Категория</th>
                <th>Цена (руб)</th>
                <th>Скидка</th>
                <th>Итоговая цена</th>
                <th>Размеры</th>
                <th>Остаток</th>
                <th>Магазины</th>
                {user?.role === "admin" && <th>Удалить</th>}
              </tr>
            </thead>
            <tbody>
              {clothingItems.map((product, index) => (
                <tr key={index}>
                  <td>
                    {productImages[product.name] ? (
                      <img 
                        src={productImages[product.name]} 
                        alt={product.name}
                        className="table-product-image"
                      />
                    ) : (
                      "—"
                    )}
                  </td>
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
                  <td>
                    {product.sizes && product.sizes.length > 0 ? (
                      <div className="size-tags">
                        {product.sizes.map((size, i) => (
                          <span key={i} className="size-tag">{size}</span>
                        ))}
                      </div>
                    ) : (
                      "—"
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
        )}
      </div>
    );
  };

  // Компонент карточки товара
  const ProductCard = ({ product }) => {
    const [selectedSize, setSelectedSize] = useState("");

    const handleAddToCart = () => {
      if (product.sizes && product.sizes.length > 0 && !selectedSize) {
        alert("Пожалуйста, выберите размер");
        return;
      }
      addToCart(product, selectedSize);
      setSelectedSize("");
    };

    return (
      <div className="product-card">
        {productImages[product.name] && (
          <img 
            src={productImages[product.name]} 
            alt={product.name}
            className="product-card-image"
          />
        )}
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
        
        {product.sizes && product.sizes.length > 0 && (
          <div className="size-selection">
            <label>Размер:</label>
            <select 
              value={selectedSize} 
              onChange={(e) => setSelectedSize(e.target.value)}
            >
              <option value="">Выберите размер</option>
              {product.sizes.map(size => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
          </div>
        )}
        
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
          onClick={handleAddToCart}
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
    if (orderCompleted) {
      return (
        <div className="order-completed-section">
          <div className="success-message">
            <h2>✅ Заказ оформлен!</h2>
            <p>{orderMessage}</p>
            <button 
              onClick={() => {
                setOrderCompleted(false);
                setActiveTab("products");
                setDeliveryAddress("");
              }}
              className="continue-shopping-btn"
            >
              Продолжить покупки
            </button>
          </div>
        </div>
      );
    }

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
                    <h4>{item.name} {item.selectedSize && `(Размер: ${item.selectedSize})`}</h4>
                    <p>{(item.discountedPrice || item.price).toFixed(2)} руб × {item.quantity}</p>
                    <p className="item-total">
                      Итого: {((item.discountedPrice || item.price) * item.quantity).toFixed(2)} руб
                    </p>
                  </div>
                  <div className="item-controls">
                    <button onClick={() => updateQuantity(item.key, item.quantity - 1)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.key, item.quantity + 1)}>+</button>
                    <button 
                      onClick={() => removeFromCart(item.key)}
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

              {deliveryOption === "delivery" && (
                <div className="delivery-address">
                  <h4>Адрес доставки:</h4>
                  <input
                    type="text"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="Введите полный адрес доставки"
                    className="address-input"
                  />
                </div>
              )}

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
                <button 
                  className="checkout-btn"
                  onClick={handleCheckout}
                >
                  Оформить заказ
                </button>
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
            <div className="admin-tabs">
              <button 
                className={activeTab === "add" ? "active" : ""}
                onClick={() => setActiveTab("add")}
              >
                Добавить товар
              </button>
              <button 
                className={activeTab === "sizes" ? "active" : ""}
                onClick={() => setActiveTab("sizes")}
              >
                Управление размерами
              </button>
              <button 
                className={activeTab === "images" ? "active" : ""}
                onClick={() => setActiveTab("images")}
              >
                Изображения товаров
              </button>
              <button 
                className={activeTab === "products" ? "active" : ""}
                onClick={() => setActiveTab("products")}
              >
                Все товары
              </button>
            </div>

            {activeTab === "add" && (
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
                
                <div className="size-selection-admin">
                  <h3>Доступные размеры для товара:</h3>
                  <div className="size-checkboxes">
                    {sizes.map(size => (
                      <label key={size} className="size-checkbox">
                        <input
                          type="checkbox"
                          checked={selectedSizes.includes(size)}
                          onChange={() => handleSizeToggle(size)}
                        />
                        {size}
                      </label>
                    ))}
                  </div>
                </div>
                
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
            )}

            {activeTab === "sizes" && <SizeManagement />}
            {activeTab === "images" && <ImageUploadSection />}
            {activeTab === "products" && <ProductTable />}
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
                {(activeTab === "seasonal" ? getSeasonalItems() : clothingItems).length === 0 && (
                  <p className="no-products">Нет товаров для отображения</p>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default App;