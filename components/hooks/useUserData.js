import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';



const useUserData = (columnFields) => {


    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchName, setSearchName] = useState('');
    const [searchEmail, setSearchEmail] = useState('');
    const [sortColumn, setSortColumn] = useState(columnFields[0].value);
    const [sortDirection, setSortDirection] = useState('asc');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const { data: fetchedUsers } = await axios.get('/api/v1/users');
                setUsers(fetchedUsers);
                setFilteredUsers(fetchedUsers);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
        fetchUsers();
    }, []);

    useEffect(() => {
        let filtered = users.filter(
            user =>
                user.name.toLowerCase().includes(searchName.toLowerCase()) &&
                user.email.toLowerCase().includes(searchEmail.toLowerCase())
        );

        if (sortColumn) {
            filtered.sort((a, b) => {
                const x = a[sortColumn];
                const y = b[sortColumn];
                if (x < y) return sortDirection === 'asc' ? -1 : 1;
                if (x > y) return sortDirection === 'asc' ? 1 : -1;
                return 0;
            });
        }

        setFilteredUsers(filtered);
    }, [users, searchName, searchEmail, sortColumn, sortDirection]);

    const handleOnSearch = useCallback((event) => {
        const { name, value } = event.target;
        if (name === 'name') {
            setSearchName(value);
        } else if (name === 'email') {
            setSearchEmail(value);
        } else {
            throw new Error('Unknown search element');
        }
    }, []);

    const handleSort = useCallback((column) => {
        if (sortColumn === column) {
            setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
        } else {
            setSortColumn(column);
            setSortDirection('asc');
        }
    }, [sortColumn]);

    return {
        filteredUsers,
        handleOnSearch,
        handleSort,
        sortColumn,
        sortDirection,
        searchName,
        searchEmail
    };
};

export default useUserData;