import Link from "next/link";

const Footer = () => {
    const year = new Date().getFullYear();

    return (
        <footer className="bg-slate-950 px-4 py-12 text-slate-300">
            <div className="mx-auto flex max-w-7xl flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <p className="text-lg font-bold text-white">Civic Health Innovation Labs</p>
                    <p className="mt-2 max-w-sm text-sm leading-relaxed text-slate-400">
                        Building practical health and life sciences solutions with Liverpool City Region communities.
                    </p>
                </div>
                <nav className="flex flex-col gap-2 text-sm sm:flex-row sm:gap-8" aria-label="Footer">
                    <Link href="/events" className="hover:text-white">Events</Link>
                    <Link href="/challenges" className="hover:text-white">Challenges</Link>
                    <Link href="/auth/login" className="hover:text-white">Training login</Link>
                </nav>
            </div>
            <div className="mx-auto mt-10 max-w-7xl border-t border-white/10 pt-6 text-xs text-slate-500">
                © {year} Civic Health Innovation Labs. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;
