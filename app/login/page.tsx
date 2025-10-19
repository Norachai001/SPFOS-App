// /app/login/page.tsx
// คอมโพเนนต์สำหรับหน้าเข้าสู่ระบบ

import React from 'react';

interface LoginPageProps {
    onLogin: (type: 'student' | 'staff') => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8 space-y-6">
            <div className="text-center">
                <h2 className="text-3xl font-extrabold text-gray-900">ระบบจัดการสิทธิพิเศษนิสิต</h2>
                <p className="mt-2 text-sm text-gray-600">กรุณาเข้าสู่ระบบเพื่อดำเนินการต่อ</p>
            </div>
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div>
                    <label htmlFor="username" className="text-sm font-medium text-gray-700">รหัสนิสิต / บัญชีเจ้าหน้าที่</label>
                    <input id="username" name="username" type="text" required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="66010001 or staff001"
                    />
                </div>
                <div>
                    <label htmlFor="password" className="text-sm font-medium text-gray-700">รหัสผ่าน</label>
                    <input id="password" name="password" type="password" required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="••••••••"
                    />
                </div>

                <div className="flex items-center justify-end">
                    <a href="#" className="text-sm text-indigo-600 hover:text-indigo-500 font-medium">
                        ลืมรหัสผ่าน?
                    </a>
                </div>

                <div>
                    <button type="button" onClick={() => onLogin('student')}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        เข้าสู่ระบบ (นิสิต)
                    </button>
                     <button type="button" onClick={() => onLogin('staff')}
                        className="mt-2 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
                        เข้าสู่ระบบ (เจ้าหน้าที่)
                    </button>
                </div>
                 <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">หรือ</span>
                    </div>
                </div>
                <div>
                     <button type="button"
                        className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                        <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C42.022,35.022,44,30.038,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path></svg>
                        เข้าสู่ระบบผ่านบัญชีมหาวิทยาลัย
                    </button>
                </div>
            </form>
        </div>
    </div>
);

export default LoginPage;
