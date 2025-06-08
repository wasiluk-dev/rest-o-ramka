import React, { useEffect, useState } from 'react';
import axios from 'axios';

type User = {
    id: number;
    name: string;
};

function App() {
    const [users, setUsers] = useState<User[]>([]);
    const [name, setName] = useState('');

    const API_URL = 'http://localhost:4000/api/users';

    // GET
    const fetchUsers = async () => {
        const res = await axios.get<User[]>(API_URL);
        setUsers(res.data);
    };

    // POST
    const addUser = async () => {
        if (!name.trim()) return;
        const res = await axios.post<User>(API_URL, { name });
        setUsers([...users, res.data]);
        setName('');
    };

    // DELETE
    const deleteUser = async (id: number) => {
        await axios.delete(`${API_URL}/${id}`);
        setUsers(users.filter((u) => u.id !== id));
    };

    // PUT
    const updateUser = async (id: number) => {
        const newName = prompt('Nowe imię:', 'Nowe Imię');
        if (newName) {
            const res = await axios.put(`${API_URL}/${id}`, { name: newName });
            setUsers(users.map((u) => (u.id === id ? res.data : u)));
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    type Product = { id: number, name: string, price: number };

    const fetchProducts = async () => {
        const response = await axios.get<Product[]>('http://localhost:4000/api/products');
        console.log(response.data);
    };
    fetchProducts();

    return (
        <div style={{ padding: 20 }}>
            <h1>Użytkownicy</h1>
            <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Imię"
            />
            <button onClick={addUser}>Dodaj</button>

            <ul>
                {users.map((user) => (
                    <li key={user.id}>
                        {user.name}{' '}
                        <button onClick={() => updateUser(user.id)}>✏️ Edytuj</button>{' '}
                        <button onClick={() => deleteUser(user.id)}>🗑️ Usuń</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;
