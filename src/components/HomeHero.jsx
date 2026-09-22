import Link from "next/link";
import LoginBox from "./LoginBox";
import UpcomingEvents from "./UpcomingEvents";
import HackathonGrid from "./HackathonGrid";
import AllEvents from "./AllEvents";
import Footer from "./Footer";

const HomeHero = ({ events, challenges, loggedIn }) => {
    return (
        <>
        {loggedIn && (
            <Link
                href="/training/"
                className="mt-16 block w-full bg-cyan-300 px-4 py-3 text-center font-semibold text-slate-950 transition hover:bg-cyan-200"
            >
                Looking for your training? <span className="underline">Click here</span>
            </Link>
        )}
        <section className={`w-full bg-gradient-to-tr from-blue-900 to-purple-950 px-4 pb-20 ${loggedIn ? "pt-16" : "pt-36"}`}>
            <div className="mx-auto flex max-w-7xl items-center">
                <div className="flex flex-col justify-center">
                    <p className="mb-5 text-sm font-bold uppercase tracking-[0.2em] text-cyan-300">Civic Health Innovation Labs</p>
                    <h1 className="text-5xl font-bold text-white md:text-7xl">Data Action Accelerator</h1>
                    <p className="mt-5 max-w-2xl text-xl leading-relaxed text-slate-100">Building practical health and life sciences solutions with Liverpool City Region communities.</p>
                    <div className="mt-8 flex flex-wrap gap-4">
                        <a href="#upcoming-events" className="inline-flex rounded-lg bg-cyan-300 px-6 py-3 font-bold text-slate-950 transition hover:bg-cyan-200">
                            See our upcoming events
                        </a>
                        <a href="#training" className="inline-flex rounded-lg border border-white/30 px-6 py-3 font-bold text-white transition hover:bg-white/10">
                            See our training
                        </a>
                    </div>
                </div>
            </div>
        </section>
        <main id="upcoming-events" className="scroll-mt-20 bg-slate-50 px-4 py-20">
            <section className="mx-auto max-w-7xl">
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-700">What&apos;s on</p>
                <h2 className="mt-3 text-4xl font-bold text-slate-950">Upcoming events at CHIL</h2>
                <p className="mt-4 max-w-3xl text-lg text-slate-600">Join workshops, talks, and collaborative sessions that turn health data into meaningful local action.</p>
                <div className="mt-8"><UpcomingEvents initialEvents={events} /></div>
            </section>
        </main>
        <section id="training" className="scroll-mt-20 w-full bg-slate-900 px-4 py-20">
            <div className="mx-auto max-w-7xl">
                <div className="grid items-center gap-10 lg:grid-cols-2">
                    <div>
                        <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-300">Training gateway</p>
                        <h2 className="mt-3 text-4xl font-bold text-white">Continue your health data training</h2>
                        <p className="mt-4 max-w-xl text-lg leading-relaxed text-slate-200">
                            {loggedIn
                                ? "Head to your training area to access your courses, themes, and learning events."
                                : "Sign in to access your courses, themes, and learning events."}
                        </p>
                    </div>
                    <div className="justify-self-center lg:justify-self-end">
                        {loggedIn ? (
                            <Link
                                href="/training/"
                                className="inline-flex rounded-lg bg-cyan-300 px-6 py-3 font-bold text-slate-950 transition hover:bg-cyan-200"
                            >
                                Go to my training
                            </Link>
                        ) : (
                            <LoginBox />
                        )}
                    </div>
                </div>
            </div>
        </section>
        {events && events.length > 0 && (
            <main className="bg-white px-4 py-20">
                <section className="mx-auto max-w-7xl">
                    <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-700">All events</p>
                    <h2 className="mt-3 text-4xl font-bold text-slate-950">Every CHIL event</h2>
                    <p className="mt-4 max-w-3xl text-lg text-slate-600">The full calendar, including past events, so nothing is only reachable by clicking through the carousel above.</p>
                    <div className="mt-8"><AllEvents events={events} /></div>
                </section>
            </main>
        )}
        {challenges && challenges.length > 0 && (
            <main className="bg-slate-50 px-4 py-20">
                <section className="mx-auto max-w-7xl">
                    <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-700">Hackathon challenges</p>
                    <h2 className="mt-3 text-4xl font-bold text-slate-950">Pick a challenge to take on</h2>
                    <p className="mt-4 max-w-3xl text-lg text-slate-600">Ten health and life sciences problems drawn from Liverpool City Region priorities. Open to undergraduates and the public; no prior health experience needed.</p>
                    <div className="mt-8"><HackathonGrid challenges={challenges} /></div>
                    <Link href="/challenges" className="mt-8 inline-flex rounded-lg bg-slate-900 px-5 py-3 font-bold text-white transition hover:bg-slate-800">
                        See all challenges
                    </Link>
                </section>
            </main>
        )}
        <Footer />
        </>
    )
}

export default HomeHero;
