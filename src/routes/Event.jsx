import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Markdown from "react-markdown";
import { AuthContext } from "../context/AuthContext";
import { db } from "../firebase_config";
import { getDoc, doc } from "firebase/firestore";
import CPDTrainingCard from "../components/CPDTrainingCard";

const Detail = ({ term, children }) => (
    <div>
        <dt className="text-xs font-semibold uppercase text-gray-500">{term}</dt>
        <dd className="mt-1 text-gray-800">{children}</dd>
    </div>
);

const Event = () => {

    const router = useRouter();
    const eventId = router.query.eventId;

    // Split slug into course_code and event_id
    const [course_code, event_id] = typeof eventId === "string" ? eventId.split("_") : [];

    const { user, userMeta } = useContext(AuthContext);
    const [eventData, setEventData] = useState(null);
    const [missing, setMissing] = useState(false);

    const fetchEventData = async (course_code, event_id) => {
        const docRef = doc(db, "courses", course_code, "events", event_id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            setEventData({ id: docSnap.id, ...docSnap.data() });
        } else {
            setMissing(true);
        }
    }

    useEffect(() => {
        if (userMeta && userMeta.course_code && course_code && event_id) {
            fetchEventData(course_code, event_id);
        }
    }, [userMeta, course_code, event_id]);

    if (!user) {
        return (
            <div className="py-32 container mx-auto px-4">
                <p>Please <Link href="/auth/login" className="underline text-blue-700">log in</Link> to view this content.</p>
            </div>
        )
    }

    if (missing) {
        return (
            <div className="py-32 container mx-auto px-4">
                <p>This event could not be found. <Link href="/" className="underline text-blue-700">Back to your course</Link>.</p>
            </div>
        )
    }

    if (!eventData) {
        return <div className="py-32 container mx-auto px-4"><p>Loading...</p></div>;
    }

    return (
        <div className="py-32 container mx-auto px-4">
            <Link href="/" className="text-sm font-semibold text-blue-700 hover:underline">← Back to your course</Link>
            <h1 className="mt-6 text-5xl font-bold text-gray-900">{eventData.title}</h1>
            {eventData.description && (
                <p className="mt-4 max-w-3xl text-lg text-gray-600 leading-relaxed whitespace-pre-line">{eventData.description}</p>
            )}

            <dl className="mt-8 grid gap-6 border-y border-gray-200 py-6 sm:grid-cols-3">
                {eventData.when && <Detail term="When">{eventData.when}</Detail>}
                {eventData.location && <Detail term="Where">{eventData.location}</Detail>}
                {eventData.audience && <Detail term="Who">{eventData.audience}</Detail>}
            </dl>

            {eventData.link && (
                <a
                    href={eventData.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-8 inline-flex rounded-lg bg-slate-900 px-6 py-3 font-semibold text-white transition hover:bg-slate-800"
                >
                    Register for this event
                </a>
            )}

            {eventData.markdown_content && (
                <div className="mt-10 w-full max-w-full prose prose-lg prose-slate prose-headings:font-bold prose-a:text-blue-600 prose-img:rounded-lg">
                    <Markdown>{eventData.markdown_content}</Markdown>
                </div>
            )}

            <CPDTrainingCard />
        </div>
    );
}

export default Event;
