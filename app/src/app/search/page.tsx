import SingleBlog from "@/components/Blog/SingleBlog";
import blogData from "@/components/Blog/blogData";
import Breadcrumb from "@/components/Common/Breadcrumb";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Search | Free Next.js Template for Startup and SaaS",
  description: "Search across site content",
};

type SearchPageProps = {
  searchParams?: Promise<{
    q?: string;
  }>;
};

type Course = {
  id: number;
  title: string;
  category: string;
  url: string;
  description: string;
};

const courses: Course[] = [
  {
    id: 1,
    title: "HTML Course",
    category: "HTML",
    url: "https://www.w3schools.com/html/default.asp",
    description: "Basics of HTML structure, tags, and pages.",
  },
  {
    id: 2,
    title: "CSS Course",
    category: "CSS",
    url: "https://www.w3schools.com/css/default.asp",
    description: "Styling, layout, and responsive design basics.",
  },
  {
    id: 3,
    title: "JavaScript Course",
    category: "JavaScript",
    url: "https://www.w3schools.com/js/default.asp",
    description: "Core JavaScript concepts and DOM basics.",
  },
  {
    id: 4,
    title: "React Tutorial",
    category: "React",
    url: "https://www.w3schools.com/react/default.asp",
    description: "Components, props, state, and hooks intro.",
  },
  {
    id: 5,
    title: "SQL Tutorial",
    category: "SQL",
    url: "https://www.w3schools.com/sql/default.asp",
    description: "Queries, joins, and database basics.",
  },
];

const SearchPage = async ({ searchParams }: SearchPageProps) => {
  const sp = (await searchParams) ?? {};
  const queryRaw = sp.q || "";
  const query = queryRaw.toLowerCase();

  const filteredBlogs =
    query === ""
      ? blogData
      : blogData.filter((blog) => blog.title.toLowerCase().includes(query));

  const filteredCourses =
    query === ""
      ? courses
      : courses.filter((c) => {
          const text = (c.title + " " + c.category + " " + c.description).toLowerCase();
          return text.includes(query);
        });

  const noResults = filteredBlogs.length === 0 && filteredCourses.length === 0;

  return (
    <>
      <Breadcrumb pageName="Search" description="Search blogs and courses." />

      <section className="pt-[120px] pb-[120px]">
        <div className="container">
          <form method="GET" className="mb-10 flex flex-wrap items-center justify-center gap-3">
            <input
              type="text"
              name="q"
              defaultValue={queryRaw}
              placeholder="Search blogs or courses..."
              className="w-full max-w-md rounded-md border border-stroke bg-transparent px-4 py-2 text-base outline-none focus:border-primary"
            />
            <button type="submit" className="bg-primary text-white rounded-md px-4 py-2 text-sm">
              Search
            </button>
          </form>

          <div className="mb-10">
            <h2 className="mb-6 text-center text-2xl font-semibold">Blog Results</h2>
            <div className="-mx-4 flex flex-wrap justify-center">
              {filteredBlogs.map((blog) => (
                <div key={blog.id} className="w-full px-4 md:w-2/3 lg:w-1/2 xl:w-1/3">
                  <SingleBlog blog={blog} />
                </div>
              ))}
              {filteredBlogs.length === 0 && (
                <p className="mt-2 text-center text-body-color">No blog results.</p>
              )}
            </div>
          </div>

          <div>
            <h2 className="mb-6 text-center text-2xl font-semibold">Course Results</h2>
            <div className="-mx-4 flex flex-wrap justify-center">
              {filteredCourses.map((course) => (
                <div key={course.id} className="w-full px-4 md:w-2/3 lg:w-1/2 xl:w-1/3">
                  <div className="rounded-md border border-stroke p-6">
                    <h3 className="mb-2 text-lg font-semibold">{course.title}</h3>
                    <p className="mb-2 text-sm text-body-color">{course.category}</p>
                    <p className="mb-4 text-sm text-body-color">{course.description}</p>
                    <a
                      href={course.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-primary underline"
                    >
                      Open course
                    </a>
                  </div>
                </div>
              ))}

              {filteredCourses.length === 0 && (
                <p className="mt-2 text-center text-body-color">No course results.</p>
              )}
            </div>
          </div>

          {noResults && (
            <p className="mt-10 text-center text-body-color">No results found.</p>
          )}
        </div>
      </section>
    </>
  );
};

export default SearchPage;
