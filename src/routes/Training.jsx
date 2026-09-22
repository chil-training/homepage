import { useContext } from "react";
import Link from "next/link";
import { AuthContext } from "../context/AuthContext";
import TrainingApp from "../components/TrainingApp";

const Training = () => {
    const { user } = useContext(AuthContext);

    if (!user) {
        return (
            <div className="py-32 container mx-auto px-4">
                <p>Please <Link href="/auth/login" className="underline text-blue-700">log in</Link> to access your training.</p>
            </div>
        );
    }

    return <TrainingApp />;
};

export default Training;
