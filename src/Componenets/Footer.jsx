import { Link } from "react-router-dom";

function Footer() {

    const date = new Date();
    const getDate = date.getFullYear();

    const links = [
        {id: 1, name: 'Home', path: '/'},
        {id: 2, name: 'Movies', path: '/movies'},
        {id: 3, name: 'TV Shows', path: '/tv-show'},
        {id: 4, name: 'Anime', path: '/animation'},
    ];

    return (
        <div className="mt-auto flex flex-col justify-between bg-[#0c0c0c] text-gray w-full py-12 px-32 md:px-5">
            <div className="w-full flex flex-wrap justify-between pb-6">
            <div className="w-[40%] mb-2 md:w-full">
                <h2 className="text-xl font-medium text-white">{import.meta.env.VITE_SITE_NAME}</h2>
                <p className="text-md pr-5 my-2 leading-7">
                    Watch Movies & TV Shows online free!
                </p>
            </div>
            <div className="flex flex-col md:w-1/2 md:mb-4">
                <h2 className="text-xl font-medium text-white">Links</h2>
                {links.map((e)=>{
                    return (
                        <Link key={e.id} to={e.path} 
                            className='mt-2 font-normal relative'>
                                {e.name}
                        </Link>
                    )
                })}
            </div>
            <div className="flex flex-col md:w-1/2 md:mb-4">
                <h2 className="text-xl font-medium text-white">Links 2</h2>
                <Link to="#" className="my-2 text-md">Link 1</Link>
				<Link to="#" className="my-2 text-md">Link 2</Link>
            </div>
            <div className="flex flex-col md:w-full">
                <h2 className="text-xl font-medium text-white">Follow Us!</h2>
				<Link to={`https://t.me/${import.meta.env.VITE_TELEGRAM_ID}`}
				target="_blank" 
				rel="noreferrer" 
				className="text-md">
				<i className="fa-brands fa-telegram mr-2"></i>Telegram</Link>
            </div>
            </div>
            <div className="w-full pt-6 text-center border-t-[1px] border-gray-400">
                <p className="text-md"><span className="border-r-5 border-solid border-gray-600">{import.meta.env.VITE_SITE_NAME}</span> All copyrights © {getDate} belongs to their owners.</p>
            </div>
    </div>
    )
}

export default Footer;