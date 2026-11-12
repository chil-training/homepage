import { db } from "../firebase_config";
import { setDoc, doc } from "firebase/firestore";
import { useRouter } from "next/router";


const FirstTimeSetup = ({ uid }) => {

    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const nickname = formData.get("nickname").trim();
        const is_hcp_uk = formData.get("is_hcp_uk") === "on";
        const role = formData.get("role").trim();

        // Update the user document in Firestore with the additional info
        await setDoc(doc(db, "users", uid), {
            nickname,
            is_hcp_uk,
            role,
            first_time: false,
            admin: false,
        }, { merge: true }).then(() => {
            console.log("Document successfully updated!");
            router.reload();
        }).catch((error) => {
            console.error("Error updating document: ", error);
        });
    };

    return (
        <div className="flex items-center justify-center h-screen">
            <div className="p-8 bg-white rounded-2xl shadow-2xl">
                <h1 className="text-2xl font-bold">Welcome to the CHIL Training Platform!</h1>
                <p className="my-4">This is your first time here. Let&apos;s get you set up.</p>
                <form className="flex flex-col" onSubmit={handleSubmit}>
                    <label>What would you like us to call you?</label>
                    <input
                        name="nickname"
                        type="text"
                        placeholder="Nickname"
                        className="p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                        autoComplete="off"
                        required
                    />
                    <label htmlFor="role">Role</label>
                    <input
                        id="role"
                        name="role"
                        type="text"
                        placeholder="Role"
                        className="p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                        autoComplete="organization-title"
                    />
                    <div className="mb-4 flex items-center justify-between gap-2">
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
                                aria-describedby="hcp-info"
                                className="flex h-6 w-6 items-center justify-center rounded-full border border-gray-300 text-sm font-semibold text-gray-500 transition hover:border-blue-400 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            >
                                ?
                            </button>
                            <div
                                id="hcp-info"
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
                        Let&apos;s Go!
                    </button>
                </form>
            </div>
        </div>

    )
}

export default FirstTimeSetup
