import React from "react";
import "./styles.css";

const Table = ({ products, onDelete }) => {
  return (
    <table className="product-table">
      <thead>
        <tr>
          <th>Название одежды</th>
          <th>Категория</th>
          <th>Цена (руб)</th>
          <th>Остаток</th>
          <th>Магазины</th>
          <th>Удалить</th>
        </tr>
      </thead>
      <tbody>
        {products.map((product, index) => (
          <tr key={index}>
            <td>{product.name}</td>
            <td>{product.category}</td>
            <td>{product.price.toFixed(2)}</td>
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
            <td>
              <button className="delete-btn" onClick={() => onDelete(index)}>
                Удалить
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;