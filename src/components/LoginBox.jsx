import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase_config";
import Link from "next/link";
import { useRouter } from "next/router";

const LoginBox = () => {

    const router = useRouter();
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const email = e.target[0].value;
        const password = e.target[1].value;

        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                console.log("User logged in:", userCredential.user);
                router.push("/")
            }).catch((error) => {
                setError(error.message);
            });
    }

    return (
        <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
            <h1 className="font-extrabold text-2xl text-center mb-6">
                Login to CHIL Training Platform
            </h1>
            {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-center">{error}</div>}
            <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Email"
                    className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                    autoComplete="email"
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                    autoComplete="current-password"
                    required
                />
                <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold p-3 rounded-lg transition"
                >
                    Login
                </button>
            </form>
            <div className="mt-4 text-center text-sm text-gray-500">
                Don&apos;t have an account? <Link href="/auth/register" className="text-blue-600 hover:underline">Sign up</Link>
            </div>
            <div className="mt-4 text-center text-sm text-gray-500">
                Forgot your password? <a href="mailto:hds-training@liverpool.ac.uk" className="text-blue-600 hover:underline">Contact support</a>
            </div>
        </div>
    )
}

export default LoginBox
