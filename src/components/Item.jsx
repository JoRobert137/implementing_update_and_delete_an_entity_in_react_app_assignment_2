/* eslint-disable react/prop-types */
import React from 'react';

const Item = ({ item, onDelete }) => {
    const handleDelete = () => {
        onDelete(item.id);
    };

    return (
        <div>
            <span>{item.name}</span>
            <div>
                <button>Edit</button>
                <button onClick={handleDelete}>
                    Delete
                </button>
            </div>
        </div>
    );
};



export default Item;