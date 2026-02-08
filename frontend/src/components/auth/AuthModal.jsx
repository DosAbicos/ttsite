import React from 'react';
import { X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

const AuthModal = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, authMode, setAuthMode } = useAuth();

  if (!isAuthModalOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 z-50"
        onClick={() => setIsAuthModalOpen(false)}
      />

      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white z-50 rounded-lg shadow-xl">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">
              {authMode === 'login' ? 'Sign In' : 'Create Account'}
            </h2>
            <button 
              onClick={() => setIsAuthModalOpen(false)}
              className="p-1 hover:opacity-70"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {authMode === 'login' ? <LoginForm /> : <RegisterForm />}

          <div className="mt-6 text-center text-sm">
            {authMode === 'login' ? (
              <p>
                Don't have an account?{' '}
                <button 
                  onClick={() => setAuthMode('register')}
                  className="underline hover:no-underline"
                >
                  Create one
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <button 
                  onClick={() => setAuthMode('login')}
                  className="underline hover:no-underline"
                >
                  Sign in
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthModal;
