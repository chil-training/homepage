import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { AuthContext } from "../context/AuthContext";
import { db } from "../firebase_config";
import { getDoc, getDocs, doc, collection } from "firebase/firestore";
import Link from "next/link";
import Card from "../components/Card";
import CPDTrainingCard from "../components/CPDTrainingCard";


const Theme = () => {

    const router = useRouter();
    const themeId = router.query.themeId;

    // Split slug into course_code, theme_id, and lesson_id 
    const [course_code, theme_id] = typeof themeId === "string" ? themeId.split("_") : [];

    const { user, userMeta } = useContext(AuthContext);
    const [guideData, setGuideData] = useState(null);
    const [themeData, setThemeData] = useState(null);


    const fetchThemeData = async (course_code, theme_id) => {
        // Step 1: Get course document
        const docRef = await doc(db, "courses", course_code, "themes", theme_id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            setThemeData({ id: docSnap.id, ...docSnap.data() });

            // Step 2: Get guides
            const guideRef = collection(docRef, "guides");
            const guideSnap = await getDocs(guideRef);

            if (!guideSnap.empty) {
                const guides = guideSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

                // Sort guides by index
                guides.sort((a, b) => a.index - b.index);
                setGuideData(guides);
            }

        }
    }

    useEffect(() => {
        if (userMeta && userMeta.course_code && course_code && theme_id) {
            fetchThemeData(course_code, theme_id);
        }
    }, [userMeta, course_code, theme_id]);


    if (!user) {
        return (
            <div className="py-32 container mx-auto">
                <p>Please <Link href="/auth/login" className="underline text-blue-700">log in</Link> to view this content.</p>
            </div>
        )
    } else if (!themeData) {
        // TODO: Loading spinner
        return (<></>)
    } else {
        return (
            <div className="text-left py-32 container mx-auto">
                <div className="mb-12">
                    <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-relaxed mb-4">
                        {themeData.title}
                    </h1>
                    <p className="mt-4 text-lg text-gray-600 leading-relaxed whitespace-pre-line">
                        {themeData.description}
                    </p>
                </div>
                <h2 className="text-4xl font-bold my-8">Guides</h2>
                {
                    guideData && guideData.length > 0 ? (
                        <div>
                            <ul className="list-disc list-inside grid grid-cols-1 md:grid-cols-3 gap-4">
                                {guideData.map((guide, index) => (
                                    <Link href={`/guide/${course_code}_${theme_id}_${guide.id}`} key={index}>
                                        <Card item={guide} />
                                    </Link>
                                ))}
                            </ul>
                        </div>
                    ) : <p>Loading...</p>
                }
                <CPDTrainingCard />
            </div>
        );
    }
}

export default Theme;
