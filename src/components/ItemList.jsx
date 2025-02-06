/* eslint-disable react/prop-types */
import React from 'react';
import Item from "./Item";

const ItemList = ({ items, onDelete }) => {
    return (
        <div>
            {items.length === 0 ? (
                <p>No items available.</p>
            ) : (
                items.map((item) => (
                    <Item key={item.id} item={item} onDelete={onDelete} />
                ))
            )}
        </div>
    );
};

export default ItemList;