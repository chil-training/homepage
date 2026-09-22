import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase_config";
import { setDoc, doc } from "firebase/firestore";
import Link from "next/link";
import { useRouter } from "next/router";

export default function RegisterBox() {

    const router = useRouter();
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const email = e.target[0].value;
        const password = e.target[1].value;

        try {
            // Create user with email and password
            const userCred = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCred.user;

            // Add the user to Firestore with metadata
            await setDoc(doc(db, "users", user.uid), {
                first_time: true,
            }).then(() => {
                router.push("/");
            })
        } catch (error) {
            setError(error.message);
        }

    }


    return (
        <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
            <h1 className="font-extrabold text-2xl text-center mb-6">
                Register for the CHIL Training Platform
            </h1>
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}
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
                    Register
                </button>
            </form>
            <div className="mt-4 text-center text-sm text-gray-500">
                Already have an account? <Link href="/auth/login" className="text-blue-600 hover:underline">Log in</Link>
            </div>
        </div>
    )
}
