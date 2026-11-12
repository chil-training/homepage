import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../context/AuthContext";
import { db } from "../firebase_config";
import { getDocs, collection } from "firebase/firestore";
import ThemesLayout from "../layouts/ThemesLayout";


const TrainingApp = () => {

    const [themes, setThemes] = useState(null);
    const [error, setError] = useState(null);
    const { userMeta } = useContext(AuthContext);

    const fetchThemes = async () => {
        try {
            const themesSnap = await getDocs(collection(db, "themes"));
            const allThemes = themesSnap.docs.map((themeDoc) => ({ id: themeDoc.id, ...themeDoc.data() }));

            allThemes.sort((a, b) => (a.index ?? 99) - (b.index ?? 99));
            setThemes(allThemes);
        } catch (fetchError) {
            console.error("Unable to load themes:", fetchError);
            setError("We couldn't load your training. Please refresh the page, or contact support if the problem continues.");
        }
    }

    useEffect(() => {
        if (userMeta) {
            fetchThemes();
        }
    }, [userMeta]);

    if (error) {
        return (
            <div className="py-32 container mx-auto px-4">
                <p className="text-red-600">{error}</p>
            </div>
        );
    } else if (userMeta && themes) {
        return (
            <div className="py-32 container mx-auto">
                {themes.length > 0
                    ? <ThemesLayout themes={themes} />
                    : <p>No themes are available yet.</p>}
            </div>
        )
    } else {
        return <p>Loading...</p>;
    }
}

export default TrainingApp;
