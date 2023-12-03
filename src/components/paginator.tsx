import React from "react";

interface PaginatorProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Paginator: React.FC<PaginatorProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex justify-between items-center">
      <div className="flex flex-row justify-center items-center gap-[2px] fixed bottom-0 left-1/2 shadow-[rgba(96,165,250,0.3)_0px_9px_30px] transform -translate-x-1/2 py-4 backdrop-blur-md w-full text-center">
        <button
          className="first-page text-blue-500 hover:cursor-pointer hover:bg-blue-500 hover:text-white font-bold py-[3px] px-2 rounded ml-[10px]"
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
        >
          {" "}
          &lt;&lt;
        </button>
        <button
          className="previous-page text-blue-500 hover:cursor-pointer font-bold py-[5px] px-4 rounded ml-[10px]"
          onClick={() =>
            currentPage >= 0 ? onPageChange(currentPage - 1) : null
          }
          disabled={currentPage === 1}
        >
          Prev
        </button>
        <div className="flex flex-row gap-2 md:hidden">
          {pages.map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              disabled={currentPage === page}
              className={`border-grey-500 border-2 hover:border-blue-500 hover:bg-blue-500 hover:text-white text-blue-500 font-bold py-[4px] px-4 rounded  ${
                currentPage === page
                  ? "bg-blue-500 text-white border-blue-500"
                  : ""
              }`}
            >
              {page}
            </button>
          ))}
        </div>

        <div className="md:block hidden">
            <button
            disabled={true}
              className="border-grey-500 border-2 hover:border-blue-500 hover:bg-blue-500 hover:text-white text-blue-500 font-bold py-[4px] px-4 rounded bg-blue-500 text-white border-blue-500"
            >
              {currentPage}
            </button>
        </div>

        <button
          className="next-page text-blue-500 hover:cursor-pointer font-bold py-[5px] px-4 rounded "
          onClick={() => {
            console.log("totalPages : ", totalPages);
            if (currentPage <= totalPages - 1) {
              onPageChange(currentPage + 1);
            }
          }}
          disabled={currentPage === totalPages}
        >
          Next
        </button>

        <button
          className="last-page text-blue-500 hover:cursor-pointer hover:bg-blue-500 hover:text-white font-bold py-[6px] px-[10px] rounded "
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
        >
          &gt;&gt;
        </button>
      </div>
    </div>
  );
};

export default Paginator;