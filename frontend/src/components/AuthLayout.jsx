function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-200 via-purple-300 to-indigo-400 flex items-center justify-center p-8">

      <div className="w-full max-w-md rounded-3xl backdrop-blur-xl bg-white/20 shadow-2xl p-8">

        {children}

      </div>

    </div>
  );
}

export default AuthLayout;
