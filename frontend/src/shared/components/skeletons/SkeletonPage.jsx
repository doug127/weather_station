export const SkeletonPage = () => {
    return (
        <div className="flex items-center justify-center h-screen w-screen bg-white dark:bg-gray-200">
            <div role="status" className="w-3/4 max-w-lg animate-pulse space-y-4">
                <div className="h-6 bg-gray-200 rounded-full dark:bg-gray-700 w-1/2 mx-auto"></div>
                <div className="h-4 bg-gray-200 rounded-full dark:bg-gray-700 w-3/4 mx-auto"></div>
                <div className="h-4 bg-gray-200 rounded-full dark:bg-gray-700 w-full"></div>
                <div className="h-4 bg-gray-200 rounded-full dark:bg-gray-700 w-2/3 mx-auto"></div>
                <div className="h-4 bg-gray-200 rounded-full dark:bg-gray-700 w-1/2 mx-auto"></div>
                <div className="h-4 bg-gray-200 rounded-full dark:bg-gray-700 w-3/4 mx-auto"></div>
                <span className="sr-only">Loading...</span>
            </div>
        </div>
    );
}

export const SkeletonChart = () => {
    return (
        <div role="status" className="max-w-sm p-4 border border-gray-200 rounded-sm shadow-sm animate-pulse md:p-6 dark:border-gray-200">
            <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-32 mb-2.5"></div>
            <div className="w-48 h-2 mb-10 bg-gray-200 rounded-full dark:bg-gray-700"></div>
            <div className="flex items-baseline mt-4">
                <div className="w-full bg-gray-200 rounded-t-lg h-72 dark:bg-gray-700"></div>
                <div className="w-full h-56 ms-6 bg-gray-200 rounded-t-lg dark:bg-gray-700"></div>
                <div className="w-full bg-gray-200 rounded-t-lg h-72 ms-6 dark:bg-gray-700"></div>
                <div className="w-full h-64 ms-6 bg-gray-200 rounded-t-lg dark:bg-gray-700"></div>
                <div className="w-full bg-gray-200 rounded-t-lg h-80 ms-6 dark:bg-gray-700"></div>
                <div className="w-full bg-gray-200 rounded-t-lg h-72 ms-6 dark:bg-gray-700"></div>
                <div className="w-full bg-gray-200 rounded-t-lg h-80 ms-6 dark:bg-gray-700"></div>
            </div>
            <span className="sr-only">Loading...</span>
        </div>
    );
} 