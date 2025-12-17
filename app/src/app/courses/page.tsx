import Breadcrumb from "@/components/Common/Breadcrumb";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Courses",
  description: "Web development courses and resources",
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

export default function CoursesPage() {
  return (
    <>
      <Breadcrumb pageName="Courses" description="Links to web development courses." />

      <section className="pt-[120px] pb-[120px]">
        <div className="container">
          <div className="-mx-4 flex flex-wrap justify-center">
            {courses.map((course) => (
              <div key={course.id} className="w-full px-4 md:w-2/3 lg:w-1/2 xl:w-1/3">
                <div className="rounded-md border border-stroke p-6">
                  <h3 className="mb-2 text-lg font-semibold">{course.title}</h3>
                  <p className="mb-2 text-xs text-body-color">{course.category}</p>
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
          </div>
        </div>
      </section>
    </>
  );
}