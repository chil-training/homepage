import { useState, useEffect } from "react";
import Card from "../components/Card";
import EventCard from "../components/EventCard";
import CPDTrainingCard from "../components/CPDTrainingCard";
import Link from "next/link";

const DAALayout = ({ course, themes, events }) => {

    const [primary_theme, setPrimaryCourse] = useState(null);
    const [other_themes, setOtherThemes] = useState([]);

    useEffect(() => {
        if (!themes || themes.length === 0) {
            return;
        }

        // Find the primary theme (index 0)
        setPrimaryCourse(themes.find(theme => theme.index === 0));

        // Filter and sort other themes
        setOtherThemes(themes.filter(theme => theme.index !== 0).sort((a, b) => a.index - b.index));
    }, [themes]);

    if (!primary_theme || !other_themes || !themes) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                    <p className="text-gray-600 text-lg">Loading course content...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="px-4">
            {/* Course Header */}
            <div className="mb-12">
                <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-relaxed mb-4">
                    {course.title}
                </h1>
                <p className="mt-4 text-lg text-gray-600 leading-relaxed whitespace-pre-line">
                    {course.description}
                </p>
            </div>

            {/* Events Section */}
            {events && events.length > 0 && (
                <div className="mb-12">
                    <div className="flex items-center mb-6">
                        <h2 className="text-4xl font-bold text-gray-900">Upcoming Events</h2>
                        <span className="ml-3 px-3 py-1 bg-blue-100 text-blue-700 text-sm font-semibold rounded-full">
                            {events.length}
                        </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {events.map((event, index) => (
                            <Link key={index} href={`/event?eventId=${course.id}_${event.id}`}>
                                <EventCard item={event} />
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* Themes Section */}
            <div>
                <div className="flex items-center mb-6">
                    <h2 className="text-4xl font-bold text-gray-900">Themes</h2>
                    <span className="ml-3 px-3 py-1 bg-purple-100 text-purple-700 text-sm font-semibold rounded-full">
                        {themes.length}
                    </span>
                </div>

                {/* Primary Theme - Featured */}
                <div className="mb-6">
                    <Link
                        href={`/theme?themeId=${course.id}_${primary_theme.id}`}
                        className="block"
                    >
                        <div className="relative">
                            <Card item={primary_theme} />
                        </div>
                    </Link>
                </div>

                {/* Other Themes */}
                {other_themes.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
                        {other_themes.map((theme, index) => (
                            <Link
                                key={index}
                                href={`/theme?themeId=${course.id}_${theme.id}`}
                            >
                                <Card item={theme} />
                            </Link>
                        ))}
                    </div>
                )}
            </div>
            <CPDTrainingCard />

        </div>
    );
}

export default DAALayout
