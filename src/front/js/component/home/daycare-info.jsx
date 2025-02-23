import React from "react"
import { Book, Bus, Heart, Palette, UtensilsCrossed } from "lucide-react"

const DaycareInfo = () => {
    const features = [
        { icon: <Heart className="tw-w-6 tw-h-6" />, text: "Licensed by the NYS Dept. of Health" },
        { icon: <Bus className="tw-w-6 tw-h-6" />, text: "School pick up & drop off available" },
        { icon: <UtensilsCrossed className="tw-w-6 tw-h-6" />, text: "Nutritious meals & snacks" },
        { icon: <Book className="tw-w-6 tw-h-6" />, text: "Learning activities & Storytelling" },
        { icon: <Palette className="tw-w-6 tw-h-6" />, text: "Arts & craft activities" },
    ]

    return (
        <div className="tw-bg-gradient-to-b
from-gray-50
via-sky-100
to-white ">
            {/* Hero Section */}
            {/* <div
        className="tw-relative tw-bg-cover tw-bg-center tw-py-20"
        style={{
          backgroundImage: `url(https://hebbkx1anhila5yf.public.blob.vercel-storage.com/LOGO.jpg-M8VajKjD5dEbSFGHgfESa2QuB2TQst.jpeg)`,
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          height: "300px",
        }}
      /> */}

            {/* Main Content */}
            <div className="tw-container tw-mx-auto tw-px-4 tw-py-6 ">
                <div className="tw-bg-white tw-rounded-2xl tw-shadow-xl tw-p-8 tw-max-w-4xl tw-mx-auto tw-shadow-[0_10px_20px_rgba(240,_46,_170,_0.7)]">
                    <div className="tw-flex tw-items-center tw-justify-between tw-mb-8 ">
                        <h1 className="tw-text-3xl md:tw-text-4xl tw-font-bold tw-text-purple-600">Laly's Family Group Daycare</h1>
                        <span className="tw-bg-pink-500 tw-text-white tw-px-4 tw-py-2 tw-rounded-full tw-text-sm tw-font-semibold">
                            Hablamos Español
                        </span>
                    </div>

                    <div className="tw-grid tw-gap-8 md:tw-grid-cols-2">
                        {/* Left Column - Key Features */}
                        <div className="tw-space-y-6">
                            <h2 className="tw-text-2xl tw-font-semibold tw-text-gray-800 tw-mb-4">Our Services</h2>
                            <ul className="tw-space-y-4">
                                {features.map((feature, index) => (
                                    <li key={index} className="tw-flex tw-items-center tw-gap-3">
                                        <div className="tw-text-purple-500">{feature.icon}</div>
                                        <span className="tw-text-gray-700">{feature.text}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Right Column - Additional Info */}
                        <div className="tw-bg-purple-50 tw-rounded-xl tw-p-6">
                            <h2 className="tw-text-2xl tw-font-semibold tw-text-gray-800 tw-mb-4">Program Details</h2>
                            <ul className="tw-space-y-3 tw-text-gray-700">
                                <li>• Children from 6 weeks old to 12yrs old</li>
                                <li>• Healthy & safe environment</li>
                                <li>• We accept ACS, HRA, ACD & private program</li>
                                <li>• Potty training available</li>
                            </ul>
                        </div>
                    </div>

                    {/* Call to Action */}
                    <div className="tw-mt-12 tw-text-center">
                        <button className="tw-bg-gradient-to-r tw-from-purple-600 tw-to-pink-500 tw-text-white tw-font-bold tw-py-3 tw-px-8 tw-rounded-full tw-shadow-lg hover:tw-shadow-xl tw-transform hover:tw-scale-105 tw-transition-all">
                            Contact Us Today
                        </button>
                        <p className="tw-mt-4 tw-text-gray-600">Join our caring and nurturing daycare family!</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DaycareInfo

