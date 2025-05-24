import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { auth, groups as groupsApi, expenses as expensesApi } from '../services/api';
import { useToast } from '@chakra-ui/react';

const UserContext = createContext({
  user: null,
  groups: [],
  isLoading: false,
  login: async () => {},
  logout: () => {},
  updateProfile: async () => {},
  createGroup: async () => {},
  addExpense: async () => {},
  addMemberToGroup: async () => {},
  calculateBalances: async () => ({}),
  getGroupExpenses: async () => [],
  getTotalBalance: async () => ({ totalOwed: 0, totalOwe: 0, netBalance: 0 }),
  loadUserGroups: async () => {}
});

const STORAGE_KEY = 'splitwise_user_data';
const TOKEN_KEY = 'token';

export function UserProvider({ children }) {
  // Clear all localStorage data when the app starts
  useEffect(() => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
    setGroups([]);
  }, []);

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem(STORAGE_KEY);
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [groups, setGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const loadUserGroups = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await groupsApi.getAll();
      // Ensure response.groups exists, otherwise use empty array
      setGroups(response?.groups || []);
    } catch (error) {
      console.error('Error loading groups:', error);
      setGroups([]); // Set empty array on error
      toast({
        title: 'Error loading groups',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Load user's groups when user is logged in
  useEffect(() => {
    if (user) {
      loadUserGroups();
    }
  }, [user, loadUserGroups]);

  // Save user data to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
      setGroups([]); // Clear groups when user logs out
    }
  }, [user]);

  const login = async (credentials) => {
    try {
      const response = await auth.login(credentials);
      const { token, user: userData } = response;
      localStorage.setItem(TOKEN_KEY, token);
      setUser(userData);
      return userData;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setGroups([]);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(TOKEN_KEY);
  };

  const updateProfile = async (updatedData) => {
    try {
      const updatedUser = await auth.updateProfile(updatedData);
      setUser(updatedUser);
      return updatedUser;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  };

  const createGroup = async (newGroup) => {
    try {
      const createdGroup = await groupsApi.create(newGroup);
      setGroups(prev => [...prev, createdGroup]);
      return createdGroup;
    } catch (error) {
      console.error('Create group error:', error);
      throw error;
    }
  };

  const addExpense = async (groupId, expense) => {
    try {
      const newExpense = await expensesApi.create(groupId, expense);
      setGroups(prev => prev.map(group => {
        if (group.id === groupId) {
          return {
            ...group,
            expenses: [...group.expenses, newExpense]
          };
        }
        return group;
      }));
      return newExpense;
    } catch (error) {
      console.error('Add expense error:', error);
      throw error;
    }
  };

  const addMemberToGroup = async (groupId, memberData) => {
    try {
      const updatedGroup = await groupsApi.addMember(groupId, memberData);
      setGroups(prev => prev.map(group => 
        group.id === groupId ? updatedGroup : group
      ));
      return updatedGroup;
    } catch (error) {
      console.error('Add member error:', error);
      throw error;
    }
  };

  const calculateBalances = async (groupId) => {
    try {
      const group = groups.find(g => g?.id === groupId);
      if (!group || !group.members) return {};

      const expenses = await expensesApi.getByGroup(groupId);
      if (!expenses) return {};

      const balances = {};
      
      // Initialize balances for all members
      group.members.forEach(member => {
        if (member && member.id) {
          balances[member.id] = 0;
        }
      });

      // Calculate balances from expenses
      expenses.forEach(expense => {
        if (expense && expense.paidBy) {
          balances[expense.paidBy] = (balances[expense.paidBy] || 0) + expense.amount;
          
          if (expense.splitBetween) {
            expense.splitBetween.forEach(split => {
              if (split && split.userId) {
                balances[split.userId] = (balances[split.userId] || 0) - split.amount;
              }
            });
          }
        }
      });

      return balances;
    } catch (error) {
      console.error('Calculate balances error:', error);
      toast({
        title: 'Error calculating balances',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return {};
    }
  };

  const getGroupExpenses = async (groupId) => {
    try {
      const expenses = await expensesApi.getByGroup(groupId);
      return expenses;
    } catch (error) {
      console.error('Get group expenses error:', error);
      throw error;
    }
  };

  const getTotalBalance = async () => {
    try {
      let totalOwed = 0;
      let totalOwe = 0;

      // Calculate total balances across all groups
      await Promise.all(groups.map(async (group) => {
        const balances = await calculateBalances(group.id);
        const userBalance = balances[user?.id] || 0;
        
        if (userBalance > 0) {
          totalOwed += userBalance;
        } else {
          totalOwe += Math.abs(userBalance);
        }
      }));

      return {
        totalOwed,
        totalOwe,
        netBalance: totalOwed - totalOwe
      };
    } catch (error) {
      console.error('Get total balance error:', error);
      throw error;
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        groups,
        isLoading,
        login,
        logout,
        updateProfile,
        createGroup,
        addExpense,
        addMemberToGroup,
        calculateBalances,
        getGroupExpenses,
        getTotalBalance,
        loadUserGroups
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
} 