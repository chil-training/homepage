import HomeHero from "../components/HomeHero";
import TrainingApp from "../components/TrainingApp";
import { AuthContext } from "../context/AuthContext";

import { useContext } from "react"

// `events` and `challenges` are read on the server by pages/index.jsx and only
// used by the signed-out marketing view.
const Dashboard = ({ events, challenges }) => {

    const { user } = useContext(AuthContext);

    return (
        <div>
            {user ? <TrainingApp /> : <HomeHero events={events} challenges={challenges} />}
        </div>
    )

}

export default Dashboard
