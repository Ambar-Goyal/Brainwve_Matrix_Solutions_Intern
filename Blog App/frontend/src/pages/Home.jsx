import axios from "axios";
import Footer from "../components/Footer";
import HomePosts from "../components/HomePosts";
import Navbar from "../components/Navbar";
import { IF, URL } from "../url";
import { useContext, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Loader from "../components/Loader";
import { UserContext } from "../context/UserContext";

const Home = () => {
  const { search } = useLocation();
  const [posts, setPosts] = useState([]);  // Ensure posts is always an array
  const [noResults, setNoResults] = useState(false);
  const [loader, setLoader] = useState(false);
  const { user } = useContext(UserContext);

  const fetchPosts = async () => {
    setLoader(true);
    try {
      const res = await axios.get(`${URL}/api/posts/${search}`);
      console.log("API Response:", res.data); // Debugging output

      // Ensure the response is an array before setting state
      setPosts(Array.isArray(res.data) ? res.data : []);
      setNoResults(res.data.length === 0);
    } catch (err) {
      console.error("Fetch error:", err);
      setPosts([]);  // Prevent undefined issues
      setNoResults(true);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [search]);

  return (
    <>
      <Navbar />
      <div className="px-8 md:px-[200px] min-h-[80vh]">
        {loader ? (
          <div className="h-[40vh] flex justify-center items-center">
            <Loader />
          </div>
        ) : !noResults ? (
          Array.isArray(posts) && posts.length > 0 ? (
            posts.map((post) => (
              <Link key={post._id} to={user ? `/posts/post/${post._id}` : "/login"}>
                <HomePosts post={post} />
              </Link>
            ))
          ) : (
            <h3 className="text-center font-bold mt-16">No posts available</h3>
          )
        ) : (
          <h3 className="text-center font-bold mt-16">No posts available</h3>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Home;
