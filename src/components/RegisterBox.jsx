import { useContext, useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase_config";
import { setDoc, doc, serverTimestamp } from "firebase/firestore";
import Link from "next/link";
import { useRouter } from "next/router";
import { AuthContext } from "../context/AuthContext";

export default function RegisterBox() {

    const router = useRouter();
    const { setUserMeta } = useContext(AuthContext);
    const [error, setError] = useState(null);

    const getRegisterErrorMessage = (authError) => {
        switch (authError.code) {
            case "auth/email-already-in-use":
                return "An account with this email already exists. Try logging in instead.";
            case "auth/invalid-email":
                return "Please enter a valid email address.";
            case "auth/weak-password":
                return "Your password must be at least 6 characters long.";
            case "auth/operation-not-allowed":
                return "Registration is currently unavailable. Please contact support.";
            case "auth/network-request-failed":
                return "Network error. Please check your connection and try again.";
            default:
                return "We couldn't create your account. Please try again.";
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        const formData = new FormData(e.currentTarget);
        const email = formData.get("email").trim();
        const password = formData.get("password");
        const nickname = formData.get("nickname").trim();
        const is_hcp_uk = formData.get("is_hcp_uk") === "on";
        const role = formData.get("role").trim();

        try {
            // Create user with email and password
            const userCred = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCred.user;

            // Write the complete profile up front so the user goes straight to
            // their training and never sees a separate first-time setup form.
            await setDoc(doc(db, "users", user.uid), {
                nickname,
                is_hcp_uk,
                role,
                signed_up_at: serverTimestamp(),
                admin: false,
            });

            // AuthContext's onAuthStateChanged listener may have already read
            // users/{uid} before this write landed, leaving userMeta null. Seed
            // it here so /training renders immediately.
            setUserMeta({
                nickname,
                is_hcp_uk,
                role,
                admin: false,
            });

            router.push("/training/");
        } catch (error) {
            console.error("Registration failed:", error);
            setError(getRegisterErrorMessage(error));
        }
    }


    return (
        <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
            <h1 className="font-extrabold text-2xl text-center mb-6">
                Register for the CHIL Training Platform
            </h1>
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="register-email">Email</label>
                    <input
                        id="register-email"
                        name="email"
                        type="email"
                        placeholder="Email"
                        className="p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                        autoComplete="email"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="register-password">Password</label>
                    <input
                        id="register-password"
                        name="password"
                        type="password"
                        placeholder="Password"
                        className="p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                        autoComplete="new-password"
                        minLength={6}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="register-nickname">What would you like us to call you?</label>
                    <input
                        id="register-nickname"
                        name="nickname"
                        type="text"
                        placeholder="Nickname"
                        className="p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                        autoComplete="off"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="role">Role</label>
                    <input
                        id="role"
                        name="role"
                        type="text"
                        placeholder="Role"
                        className="p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                        autoComplete="organization-title"
                    />
                </div>
                <div className="flex items-center justify-between gap-2">
                    <label className="flex items-center gap-2">
                        <input
                            name="is_hcp_uk"
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-400"
                        />
                        <span>I am a Health Care Professional based in the UK</span>
                    </label>
                    <div className="group relative shrink-0">
                        <button
                            type="button"
                            aria-label="Why we ask for this information"
                            aria-describedby="register-hcp-info"
                            className="flex h-6 w-6 items-center justify-center rounded-full border border-gray-300 text-sm font-semibold text-gray-500 transition hover:border-blue-400 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                            ?
                        </button>
                        <div
                            id="register-hcp-info"
                            role="tooltip"
                            className="pointer-events-none absolute right-0 top-full z-10 mt-2 w-64 rounded-lg bg-gray-900 px-3 py-2 text-xs font-normal leading-relaxed text-white opacity-0 shadow-xl transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100"
                        >
                            We collect this information to track who is using the platform, so we can better design content for the future.
                            <span className="absolute bottom-full right-2.5 border-4 border-transparent border-b-gray-900" />
                        </div>
                    </div>
                </div>
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
