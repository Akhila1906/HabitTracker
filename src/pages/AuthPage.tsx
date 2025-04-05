// src/components/Auth.tsx
import { useState } from 'react';
import Profile from './Profile';

import {
  SignIn,
  SignUp,
  SignedIn,
  SignedOut,
  useAuth,
  SignInButton,
  SignOutButton,
  UserButton
} from '@clerk/clerk-react';
import { useNavigate, Link } from 'react-router-dom';

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const { isLoaded, userId } = useAuth();
  const navigate = useNavigate();

  if (!isLoaded) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <SignedOut>
          <div className="space-y-6">
            <div className="flex justify-center gap-4 mb-6">
              {/* <SignInButton/> */}
              <button
                onClick={() => setIsSignUp(false)}
                className={`px-4 py-2 rounded-md ${
                  isSignUp ?  'bg-gray-200' : 'bg-black text-white'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setIsSignUp(true)}
                className={`px-4 py-2 rounded-md ${
                  isSignUp ? 'bg-black text-white' : 'bg-gray-200'
                }`}
              >
                Sign Up
              </button>
            </div>
            {/* <SignUp></SignUp> */}
            {isSignUp ? (
              <SignUp/>
            ) : (
              <SignIn/>)}
          </div>
        </SignedOut>

        <SignedIn>
          {/* <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold">Welcome Back!</h2>
            <p>User ID: {userId}</p>
            <button
              onClick={() => navigate('/')}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              Go to Homepage
            </button>
            <div>
              <SignOutButton>
                <button className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">
                  Sign Out
                </button>
              </SignOutButton>
            </div>
          </div> */}
          <Profile />
        </SignedIn>
      </div>
    </div>
  );
};

export default Auth;