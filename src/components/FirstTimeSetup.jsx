import { db } from "../firebase_config";
import { setDoc, doc } from "firebase/firestore";
import { useRouter } from "next/router";


const FirstTimeSetup = ({ uid }) => {

    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const nickname = e.target.nickname.value;
        const course_code = e.target.course_code.value;
        const interests = e.target.interests.value;
        const organisation = e.target.organisation.value;

        // Update the user document in Firestore with the additional info
        await setDoc(doc(db, "users", uid), {
            nickname,
            course_code,
            interests,
            organisation,
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
                    <label>What is your <span className="italic">course code?</span><span className="text-red-500"> *</span></label>
                    <input
                        name="course_code"
                        type="text"
                        placeholder="Course Code"
                        className="p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                        autoComplete="off"
                        required
                    />
                    <label>What are you interested in?</label>
                    <input
                        name="interests"
                        type="text"
                        placeholder="Interests"
                        className="p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                    />
                    <label>Where are you from?</label>
                    <input
                        name="organisation"
                        type="text"
                        placeholder="Organisation"
                        className="p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                    />
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
