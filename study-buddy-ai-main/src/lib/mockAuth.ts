// Mock Authentication System for Development
// This allows testing the UI without Firebase Authentication setup

export interface MockUser {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string | null;
}

// Store users in localStorage for dev purposes
const USERS_STORAGE_KEY = 'study-buddy-users';
const CURRENT_USER_KEY = 'study-buddy-current-user';

function getStoredUsers(): Record<string, MockUser & { password: string }> {
  try {
    return JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
}

function saveUsers(users: Record<string, MockUser & { password: string }>) {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

function getCurrentUser(): MockUser | null {
  try {
    const user = localStorage.getItem(CURRENT_USER_KEY);
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
}

function setCurrentUser(user: MockUser | null) {
  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(CURRENT_USER_KEY);
  }
}

export const mockAuthService = {
  // Mock signup
  signup: async (email: string, password: string, displayName: string): Promise<MockUser> => {
    const users = getStoredUsers();
    
    if (users[email]) {
      throw new Error('User already exists with this email');
    }

    if (password.length < 6) {
      throw new Error('Password should be at least 6 characters');
    }

    const newUser: MockUser & { password: string } = {
      uid: `user_${Date.now()}`,
      email,
      displayName,
      photoURL: null,
      password, // In real app, this would be hashed
    };

    users[email] = newUser;
    saveUsers(users);

    const { password: _, ...userWithoutPassword } = newUser;
    setCurrentUser(userWithoutPassword);

    return userWithoutPassword;
  },

  // Mock login
  login: async (email: string, password: string): Promise<MockUser> => {
    const users = getStoredUsers();
    const user = users[email];

    if (!user || user.password !== password) {
      throw new Error('Invalid email or password');
    }

    const { password: _, ...userWithoutPassword } = user;
    setCurrentUser(userWithoutPassword);

    return userWithoutPassword;
  },

  // Mock logout
  logout: async (): Promise<void> => {
    setCurrentUser(null);
  },

  // Get current user
  getCurrentUser: (): MockUser | null => {
    return getCurrentUser();
  },

  // Subscribe to auth changes
  onAuthStateChanged: (callback: (user: MockUser | null) => void): (() => void) => {
    // Call immediately with current user
    callback(getCurrentUser());

    // Return unsubscribe function
    return () => {};
  },
};

export default mockAuthService;
