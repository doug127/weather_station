export const Cards = () => {
    return(
        <div>
            <div className="grid lg:gap-20 md:gap-4 gap-1 p-4 grid-cols-[repeat(auto-fit,minmax(200px,1fr))]">

                <div className="bg-white w-72 rounded-md shadow-lg">
                    <div className="w-full flex justify-between border-b border-gray-200">
                        <div className="p-4"><i className="fa-solid fa-camera-retro text-2xl bg-gray-900 w-12 h-12 rounded-md flex justify-center items-center text-white"></i> </div>
                        <div className="px-5 p-2">
                            <p>Today's</p>
                            <h1 className="text-3xl font-bold">$56k</h1>
                        </div>
                    </div>
                        <div className="px-2 py-4">
                            <p><span className="font-bold text-green-500">+55% </span> tha last week</p>
                        </div>
                </div>

                <div className="bg-white w-72 rounded-md shadow-lg">
                    <div className="w-full flex justify-between border-b border-gray-200">
                        <div className="p-4"><i className="fa-solid fa-user-group text-2xl bg-gray-900 w-12 h-12 rounded-md flex justify-center items-center text-white"></i> </div>
                        <div className="px-5 p-2">
                            <p>Today's</p>
                            <h1 className="text-3xl font-bold">$56k</h1>
                        </div>
                    </div>
                        <div className="px-2 py-4">
                            <p><span className="font-bold text-green-500">+55% </span> tha last week</p>
                        </div>
                </div>

                <div className="bg-white w-72 rounded-md shadow-lg">
                    <div className="w-full flex justify-between border-b border-gray-200">
                        <div className="p-4"><i className="fa-solid fa-user-plus text-2xl bg-gray-900 w-12 h-12 rounded-md flex justify-center items-center text-white"></i> </div>
                        <div className="px-5 p-2">
                            <p>Today's</p>
                            <h1 className="text-3xl font-bold">$56k</h1>
                        </div>
                    </div>
                        <div className="px-2 py-4">
                            <p><span className="font-bold text-green-500">+55% </span> tha last week</p>
                        </div>
                </div>
            </div>
        </div>
    )
}