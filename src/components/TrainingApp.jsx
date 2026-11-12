import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../context/AuthContext";
import { db } from "../firebase_config";
import { getDocs, doc, collection } from "firebase/firestore";
import Course from "./Course";
import FirstTimeSetup from "./FirstTimeSetup";


const TrainingApp = () => {

    const [courses, setCourses] = useState(null);
    const [error, setError] = useState(null);
    const { user, userMeta } = useContext(AuthContext);

    const fetchCourses = async () => {
        try {
            const coursesSnap = await getDocs(collection(db, "courses"));

            // Every signed-up learner gets access to every course, so load each
            // course's themes and events rather than scoping to a single course.
            const allCourses = await Promise.all(coursesSnap.docs.map(async (courseDoc) => {
                const courseRef = doc(db, "courses", courseDoc.id);
                const [themesSnap, eventsSnap] = await Promise.all([
                    getDocs(collection(courseRef, "themes")),
                    getDocs(collection(courseRef, "events")),
                ]);

                return {
                    id: courseDoc.id,
                    ...courseDoc.data(),
                    themes: themesSnap.docs.map((themeDoc) => ({ id: themeDoc.id, ...themeDoc.data() })),
                    events: eventsSnap.docs.map((eventDoc) => ({ id: eventDoc.id, ...eventDoc.data() })),
                };
            }));

            setCourses(allCourses);
        } catch (fetchError) {
            console.error("Unable to load courses:", fetchError);
            setError("We couldn't load your training. Please refresh the page, or contact support if the problem continues.");
        }
    }

    useEffect(() => {
        if (userMeta && !userMeta.first_time) {
            fetchCourses();
        }
    }, [userMeta]);

    if (userMeta && userMeta.first_time) {
        return <FirstTimeSetup uid={user.uid} />;
    } else if (error) {
        return (
            <div className="py-32 container mx-auto px-4">
                <p className="text-red-600">{error}</p>
            </div>
        );
    } else if (userMeta && courses) {
        return (
            <div className="py-32 container mx-auto">
                {courses.length > 0 ? courses.map((course, index) => (
                    <div key={course.id} className={index > 0 ? "mt-24" : ""}>
                        <Course course={course} themes={course.themes} events={course.events} />
                    </div>
                )) : <p>No courses are available yet.</p>}
            </div>
        )
    } else {
        return <p>Loading...</p>;
    }
}

export default TrainingApp;
