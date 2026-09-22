import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../context/AuthContext";
import { db } from "../firebase_config";
import { getDoc, getDocs, doc, collection } from "firebase/firestore";
import Course from "./Course";
import FirstTimeSetup from "./FirstTimeSetup";


const TrainingApp = () => {

    const [courseData, setCourseData] = useState(null);
    const [themeData, setThemeData] = useState(null);
    const [eventData, setEventData] = useState(null);
    const { user, userMeta } = useContext(AuthContext);


    const fetchCourseData = async (course_code) => {
        // Step 1: Get course document
        const docRef = await doc(db, "courses", course_code);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            setCourseData({ id: docSnap.id, ...docSnap.data() });

            // Step 2: Get themes
            const themeRef = collection(docRef, "themes");
            const themeSnap = await getDocs(themeRef);

            if (!themeSnap.empty) {
                const themes = themeSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setThemeData(themes);
            }

            // Step 3: Get events 
            const eventRef = collection(docRef, "events");
            const eventSnap = await getDocs(eventRef);

            if (!eventSnap.empty) {
                const events = eventSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setEventData(events);
            }
        }
    }

    useEffect(() => {
        if (userMeta && userMeta.course_code) {
            fetchCourseData(userMeta.course_code);
        }
    }, [userMeta]);

    if (userMeta && !userMeta.first_time && courseData) {
        return (
            <div className="py-32 container mx-auto">
                <Course course={courseData} themes={themeData} events={eventData} />
            </div>
        )
    } else if (userMeta && userMeta.first_time) {
        return <FirstTimeSetup uid={user.uid} />;
    } else {
        return <p>Loading...</p>;
    }
}

export default TrainingApp
