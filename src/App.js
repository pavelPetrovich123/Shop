import logo from './logo.svg';
import './App.css';
import ProductAPI from "./api/service";
import Table from "./Table";
import { useState } from "react";

function App() {
  const [products, setProducts] = useState(ProductAPI.all());
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");

  const handleDelete = (indexToRemove) => {
    setProducts((prevProducts) =>
      prevProducts.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleAdd = () => {
    if (name.trim() === "" || category.trim() === "") return;

    const newProduct = { name, category };
    setProducts((prevProducts) => [...prevProducts, newProduct]);
    setName("");
    setCategory("");
  };

  return (
    <div className="App">
      <h2>Add Product</h2>
      <input
        type="text"
        placeholder="Product Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      />
      <button onClick={handleAdd}>Add</button>

      <Table products={products} onDelete={handleDelete} />
    </div>
  );
}
export default App;