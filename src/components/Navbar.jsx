import { useContext } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { AuthContext } from "../context/AuthContext";
import { auth } from "../firebase_config";


const Navbar = () => {

    const { user, userMeta } = useContext(AuthContext);
    const router = useRouter();

    const handleLogOut = () => {
        auth?.signOut().then(() => router.push("/"));
    }

    return (
        <nav className="bg-slate-900 fixed top-0 w-full z-10 shadow-md">
            <div className="h-16 mx-auto container px-4 flex align-middle justify-between text-white">
                <div className="flex align-middle items-center gap-8">
                    <Link href="/" className="text-2xl font-bold self-center">
                        <h1 className="text-2xl font-bold self-center">HDS Training</h1>
                    </Link>
                </div>
                {user ? (
                    <div className="flex align-middle gap-8">
                        {userMeta && <p className="self-center block">Hi, {userMeta.nickname}</p>}
                        {userMeta && userMeta.admin && (
                            <Link href="/admin" className="self-center text-yellow-400 font-semibold hover:text-yellow-300">
                                Admin
                            </Link>
                        )}
                        <button className="self-center" onClick={handleLogOut}>Logout</button>
                    </div>
                ) : (
                    <div className="flex align-middle gap-8">
                        <Link href="/auth/login" className="self-center">
                            Login
                        </Link>
                        <Link href="/auth/register" className="self-center">
                            Register
                        </Link>
                    </div>
                )}
            </div>

        </nav>
    )
}

export default Navbar
