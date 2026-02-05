import RequestEntry from "../../../Components/RequestEntry"

export default function Dashobard() {
    


    return (
        <div className=" flex flex-cpl md:flex-row md:justify-evenly">
            <div className=" basis-7/12">
                <h1 className=" text-2xl font-bold">Pending Requests</h1>
                <RequestEntry CompanyName="Facebook" Date="Bla"></RequestEntry>
                <RequestEntry CompanyName="Facebook" Date="Bla"></RequestEntry>
            </div>
            <div className=" basis-4/12 h-screen ">
                <h1 className=" text-2xl font-bold">
                    I don't know
                </h1>
                <div className=" flex flex-col min-h-52 bg-gray-900 rounded-xl p-5">
                    Additional info....
                </div>
            </div>
        </div>
    )
}