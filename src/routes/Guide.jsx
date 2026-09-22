import { useRouter } from "next/router";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../firebase_config";
import Link from "next/link";
import CPDTrainingCard from "../components/CPDTrainingCard";
import YouTube from "react-youtube";
import Markdown from "react-markdown";

const Guide = () => {

  const router = useRouter();
  const guideId = router.query.guideId;

  const { user, userMeta } = useContext(AuthContext);
  const [guideData, setGuideData] = useState(null);

  // Split slug into course_code, theme_id, and lesson_id
  const [course_code, theme_id, guide_id] = typeof guideId === "string" ? guideId.split("_") : [];

  const fetchThemeData = async (course_code, theme_id, guide_id) => {
    const docRef = doc(db, "courses", course_code, "themes", theme_id, "guides", guide_id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setGuideData({ id: docSnap.id, ...docSnap.data() });
    }
  }

  useEffect(() => {
    if (userMeta && userMeta.course_code && course_code && theme_id && guide_id) {
      fetchThemeData(course_code, theme_id, guide_id);
    }
  }, [userMeta, course_code, theme_id, guide_id]);


  return (
    <div>
      {user && guideData ?
        <div className="container mx-auto py-32">
          <h1 className="text-5xl font-bold mb-8">{guideData.title}</h1>
          <YouTube videoId={guideData.videoId} />
          <div className="mx-0 my-8 w-full max-w-full prose prose-lg prose-slate prose-headings:font-bold prose-a:text-blue-600 prose-img:rounded-lg">
            <Markdown>{guideData.markdown_content}</Markdown>
          </div>
          <CPDTrainingCard />
        </div>
        :
        <div className="py-32 container mx-auto px-4">
          <p>Please <Link href="/auth/login" className="underline text-blue-700">log in</Link> to view this content.</p>
        </div>

      }
    </div>
  )
}


export default Guide;
