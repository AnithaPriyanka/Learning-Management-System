import { styles } from "@/app/styles/style";
import React, { FC, useState } from "react";
import { AiOutlineDelete, AiOutlinePlusCircle } from "react-icons/ai";
import { BiSolidPencil } from "react-icons/bi";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { BsLink45Deg } from "react-icons/bs";
import toast from "react-hot-toast";
import { actionAsyncStorage } from "next/dist/client/components/action-async-storage-instance";

type Props = {
  active: number;
  setActive: (active: number) => void;
  courseContentData: any;
  setCourseContentData: (courseContentData: any) => void;
  handleSubmit: any;
};

const CourseContent: FC<Props> = ({
  active,
  setActive,
  courseContentData,
  setCourseContentData,
  handleSubmit: handleCourseSubmit,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(
    Array(courseContentData.length).fill(false)
  );
  const [activeSection, setActiveSection] = useState(1);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    handleCourseSubmit();
  };

  const handleCollapseToggle = (index: number) => {
    const updatedCollapsed = [...isCollapsed];
    updatedCollapsed[index] = !updatedCollapsed[index];
    setIsCollapsed(updatedCollapsed);
  };

  const handleRemoveLink = (index: number, linkIndex: number) => {
    const updatedData = [...courseContentData];
    updatedData[index].links.splice(linkIndex, 1);
    setCourseContentData(updatedData);
  };

  const handleRemoveItem = (index: number) => {
    if (index > 0) {
      const updatedData = [...courseContentData];
      updatedData.splice(index, 1);
      setCourseContentData(updatedData);
    }
  };

  const handleAddLink = (index: number) => {
    const updatedData = [...courseContentData];
    updatedData[index].links.push({ title: "", url: "" });
    setCourseContentData(updatedData);
  };

  const newContentHandler = (item: any) => {
    if (
      item.title === "" ||
      item.description === "" ||
      item.videoUrl === "" ||
      item.links[0].title === "" ||
      item.links[0].url === ""
    ) {
      toast.error("Please fill all the fields first!");
    } else {
      let newVideoSection = "";
      if (courseContentData.length > 0) {
        const lastVideoSection =
          courseContentData[courseContentData.length - 1].videoSection;

        //use the last videoSection if available else user input
        if (lastVideoSection) {
          newVideoSection = lastVideoSection;
        }
      }
      const newContent = {
        videoUrl: "",
        title: "",
        description: "",
        videoSection: newVideoSection,
        links: [{ title: "", url: "" }],
      };
      setCourseContentData([...courseContentData, newContent]);
    }
  };

  const addNewSection = () => {
    if (
      courseContentData[courseContentData.length - 1].title === "" ||
      courseContentData[courseContentData.length - 1].description === "" ||
      courseContentData[courseContentData.length - 1].videoUrl === "" ||
      courseContentData[courseContentData.length - 1].links[0].title === "" ||
      courseContentData[courseContentData.length - 1].links[0].url === ""
    ) {
      toast.error("Please fill all the fields first!");
    } else {
      setActiveSection(activeSection + 1);
      const newContent = {
        videoUrl: "",
        title: "",
        description: "",
        videoSection: `Untitled Section ${activeSection}`,
        links: [{ title: "", url: "" }],
      };
      setCourseContentData([...courseContentData, newContent]);
    }
  };
  const prevButton = () => {
    setActive(active - 1);
  };
  const handleOptions = () => {
    if (
      courseContentData[courseContentData.length - 1].title === "" ||
      courseContentData[courseContentData.length - 1].description === "" ||
      courseContentData[courseContentData.length - 1].videoUrl === "" ||
      courseContentData[courseContentData.length - 1].links[0].title === "" ||
      courseContentData[courseContentData.length - 1].links[0].url === ""
    ) {
      toast.error("Please fill in all fields");
    } else {
      setActive(active + 1);
      handleCourseSubmit();
    }
  };

  return (
    <div className="w-[80%] m-auto mt-24 p-3">
      <form onSubmit={handleSubmit}>
        {courseContentData?.map((item: any, index: number) => {
          const showSectionInput =
            index === 0 ||
            item.videoSection !== courseContentData[index - 1].videoSection;
          return (
            <div key={index}>
              <div
                className={`w-full bg-[#cdc8c817] p-4 ${
                  showSectionInput ? "mt-10" : "mb-10"
                }`}
              >
                {showSectionInput && (
                  <div className="flex w-full items-center">
                    <input
                      type="text"
                      className={`text-[20px] ${
                        item.videoSection === "untitled Section"
                          ? "w-[170px]"
                          : "w-max"
                      } font-Poppins cursor-pointer dark:text-white text-black bg-transparent outline-none`}
                      value={item.videoSection}
                      onChange={(e: any) => {
                        const updatedData = [...courseContentData];
                        updatedData[index].videoSection = e.target.value;
                        setCourseContentData(updatedData);
                      }}
                    />
                    <BiSolidPencil className="cursor-pointer dark:text-white text-black" />
                  </div>
                )}
                <div className="flex w-full items-center justify-between my-0">
                  {isCollapsed[index] ? (
                    item.title && (
                      <p className="font-Poppins dark:text-white text-black">
                        {index + 1}.{item.title}
                      </p>
                    )
                  ) : (
                    <></>
                  )}

                  <div className="flex items-center">
                    <AiOutlineDelete
                      className={`dark:text-white text-[20px] mr-2 text-black ${
                        index > 0 ? "cursor-pointer" : "cursor-no-drop"
                      }`}
                      onClick={() => handleRemoveItem(index)}
                    />
                    <MdOutlineKeyboardArrowDown
                      fontSize="large"
                      className="dark:text-white text-black cursor-pointer"
                      style={{
                        transform: isCollapsed[index]
                          ? "rotate(180deg)"
                          : "rotate(0deg)",
                      }}
                      onClick={() => handleCollapseToggle(index)}
                    />
                  </div>
                </div>
                {!isCollapsed[index] && (
                  <>
                    <div className="my-3">
                      <label className={styles.label}>Video Title</label>
                      <input
                        type="text"
                        placeholder="Project Plan.."
                        className={`${styles.input}`}
                        value={item.title}
                        onChange={(e: any) => {
                          const updatedData = [...courseContentData];
                          updatedData[index].title = e.target.value;
                          setCourseContentData(updatedData);
                        }}
                      />
                    </div>
                    <div className="my-3">
                      <label className={styles.label}>Video Url</label>
                      <input
                        type="text"
                        placeholder="sdder"
                        className={`${styles.input}`}
                        value={item.videoUrl}
                        onChange={(e: any) => {
                          const updatedData = [...courseContentData];
                          updatedData[index].videoUrl = e.target.value;
                          setCourseContentData(updatedData);
                        }}
                      />
                    </div>
                    <div className="my-3">
                      <label className={styles.label}>Video Length(in minutes)</label>
                      <input
                        type="number"
                        placeholder="20"
                        className={`${styles.input}`}
                        value={item.videoLength}
                        onChange={(e: any) => {
                          const updatedData = [...courseContentData];
                          updatedData[index].videoLength = e.target.value;
                          setCourseContentData(updatedData);
                        }}
                      />
                    </div>
                    <div className="my-3">
                      <label className={styles.label}>Video Description</label>
                      <textarea
                        rows={8}
                        cols={30}
                        placeholder="Project Description.."
                        className={`${styles.input} !h-min py-2`}
                        value={item.description}
                        onChange={(e: any) => {
                          const updatedData = [...courseContentData];
                          updatedData[index].description = e.target.value;
                          setCourseContentData(updatedData);
                        }}
                      />
                    </div>
                    {item?.links.map((link: any, linkIndex: number) => (
                      <div className="mb-3 block" key={linkIndex}>
                        <div className="w-full flex items-center justify-between">
                          <label className={styles.label}>
                            Link {linkIndex + 1}
                          </label>
                          <AiOutlineDelete
                            className={`cursor-pointer dark:text-white text-black`}
                            onClick={() => handleRemoveLink(index, linkIndex)}
                          />
                        </div>
                        <input
                          type="text"
                          placeholder="Link Title"
                          className={`${styles.input}`}
                          value={link.title}
                          onChange={(e: any) => {
                            const updatedData = [...courseContentData];
                            updatedData[index].links[linkIndex].title =
                              e.target.value;
                            setCourseContentData(updatedData);
                          }}
                        />
                        <input
                          type="text"
                          placeholder="Link URL"
                          className={`${styles.input} mt-6`}
                          value={link.url}
                          onChange={(e: any) => {
                            const updatedData = [...courseContentData];
                            updatedData[index].links[linkIndex].url =
                              e.target.value;
                            setCourseContentData(updatedData);
                          }}
                        />
                      </div>
                    ))}
                    <br />
                    {/* add link button */}
                    <div className="inline-block mb-4">
                      <p
                        className="flex items-center text-[18px] dark:text-white text-black cursor-pointer"
                        onClick={() => handleAddLink(index)}
                      >
                        <BsLink45Deg className="mr-2" /> Add Link
                      </p>
                    </div>
                  </>
                )}
                <br />
                {/* Add new content */}
                {index === courseContentData.length - 1 && (
                  <div>
                    <p
                      className="flex items-center text-[18px] dark:text-white text-black cursor-pointer"
                      onClick={(e: any) => newContentHandler(item)}
                    >
                      <AiOutlinePlusCircle className="mr-2" /> Add New Content
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
        <br />
        <div
          className="flex items-center text-[20px] dark:text-white text-black cursor-pointer"
          onClick={() => addNewSection()}
        >
          <AiOutlinePlusCircle className="mr-2" /> Add new Section
        </div>
      </form>
      <br />
      <div className="w-full flex items-center justify-between">
        <div
          className="w-full 800px:w-[100px] flex items-center justify-center h-[40px]  text-white dark:text-black  bg-yellow-600 dark:bg-yellow-200 rounded mt-8 cursor-pointer"
          onClick={prevButton}
        >
          Previous
        </div>
        <div
          className="w-full 800px:w-[100px] flex items-center justify-center h-[40px]  text-white dark:text-black  bg-yellow-600 dark:bg-yellow-200 text-center rounded mt-8 cursor-pointer"
          onClick={handleOptions}
        >
          Next
        </div>
      </div>
      <br />
      <br />
      <br />
    </div>
  );
};

export default CourseContent;
