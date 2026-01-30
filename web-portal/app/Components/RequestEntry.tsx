export default function RequestEntry(props: any){

    return (
        <>
            {/* Desktop */}
            <div className=" hidden md:flex flex-row bg-white dark:bg-gray-900 p-5 mb-2 rounded-xl">
                <div className=" flex-3/6">
                    {props.CompanyName}
                </div>
                <div className=" flex-1/3">
                    {props.Date}
                </div>
            </div>

            {/* Mobile */}
            <div className=" flex-col md:hidden">

            </div>
        </>
    )
}