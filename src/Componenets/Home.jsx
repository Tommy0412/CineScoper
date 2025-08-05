import PopularDropMenu from "./PopularDropMenu";
import TopRatedDropMenu from "./TopRatedDropMenu";
import PopularSlider from "./PopularSlider";
import TopRatedSlider from "./TopRatedSlider";

function Home() {
    const donationMessage = import.meta.env.VITE_DONATION_MESSAGE;
    const donationLink = import.meta.env.VITE_DONATION_LINK;
    const donationButtonText = import.meta.env.VITE_DONATION_BUTTON_TEXT;

    const showDonation = donationMessage && donationLink && donationButtonText;

    return (
        <div className="mx-28 my-5 md:mx-5 lg:mx-16">
            {showDonation && (
                <div className="mt-4 text-yellow-300 bg-black bg-opacity-80 p-4 rounded-md shadow-lg w-full max-w-xl text-center">
                    <span className="block mb-2 text-lg font-semibold">{donationMessage}</span>
                    <a 
                        href={donationLink} 
                        className="inline-block bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md transition duration-200" 
                        target="_blank" 
                        rel="noopener noreferrer"
                    >
                        {donationButtonText}
                    </a>
                </div>
            )}

            <div className="w-full">
                <div className="relative py-4 flex items-end justify-between text-white after:w-full after:h-[2px] after:bg-[#ffffff2f] after:absolute after:bottom-0 after:left-1/2 after:translate-x-[-50%]">
                    <h2 className="text-xl font-semibold"><i className="fa-solid fa-video mr-2"></i>Trending</h2>
                    <div className="flex items-center">
                        <PopularDropMenu />
                    </div>
                </div>
                <div>
                    <PopularSlider />
                </div>
            </div>

            <div className="w-full mb-5">
                <div className="relative py-4 flex items-end justify-between text-white after:w-full after:h-[2px] after:bg-[#ffffff2f] after:absolute after:bottom-0 after:left-1/2 after:translate-x-[-50%]">
                    <h2 className="text-xl font-semibold"><i className="fa-solid fa-arrow-trend-up mr-2"></i>Top Rated</h2>
                    <div className="flex items-center">
                        <TopRatedDropMenu />
                    </div>
                </div>
                <div>
                    <TopRatedSlider />
                </div>
            </div>
        </div>
    );
}

export default Home;